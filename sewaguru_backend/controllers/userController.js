import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { getSupabase, uploadBufferToSupabase } from './uploadToSuperbase.js';

const generateTokens = async (user) => {
    const accessToken = jwt.sign({
        id: user._id,
        role: user.role,
        firstName: user.firstName
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    });

    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
};

export const createAdmin = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: 'Email already registered' });

        const user = new User({
            email,
            password,
            firstName,
            lastName,
            phone,
            role: 'admin',
        });

        await user.save();
        res.status(201).json({ msg: 'Admin created successfully' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


export const register = async (req, res) => {
    try {
        const {
            email,
            password,
            firstName,
            lastName,
            phone,
            nic,
            location,
            address,
            serviceType,
            nicImgSrc,
            profilePicSrc,
            gsCertSrc,
            policeCertSrc,
            otherSrc,
            role
        } = req.body;

        // Prevent self-registration as admin
        if (role === 'admin') {
            return res.status(403).json({ msg: 'Unauthorized to register as admin' });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: 'Email already registered' });


        const user = new User({
            email,
            password,
            firstName,
            lastName,
            phone,
            ...(role === 'provider' && {
                nic,
                location,
                address,
                serviceType,
                nicImgSrc,
                profilePicSrc,
                gsCertSrc,
                policeCertSrc,
                otherSrc
            }),
            role
        });

        const savedUser = await user.save();

        if (savedUser.role === 'provider') {
            const { accessToken, refreshToken } = generateTokens(savedUser);
            savedUser.refreshToken = refreshToken;
            await savedUser.save();

            return res.status(201).json({
                msg: 'Provider registered and logged in successfully',
                accessToken,
                refreshToken
            });
        }

        res.status(201).json({ msg: 'Customer registered successfully, please log in.' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(400).json({ msg: 'Invalid credentials' });

        if (user.isDisabled)
            return res.status(403).json({ msg: 'Account is disabled' });

        const tokens = await generateTokens(user);
        res.json(tokens);
    } catch (err) {
        res.status(500).json({ msg: err.message });
        console.log(err);
    }
};


export const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ msg: 'No token provided' });

    try {
        // Verify the refresh token
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(payload.id);

        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ msg: 'Invalid refresh token' });
        }

        // Generate new tokens
        const tokens = await generateTokens(user);

        res.json(tokens);
    } catch (e) {
        res.status(403).json({ msg: 'Invalid or expired refresh token' });
        console.log(e);
    }
};

export const logout = async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id);
    if (user) {
        user.refreshToken = null;
        await user.save();
    }
    res.json({ msg: 'Logged out successfully' });
};

export const upgradeToProvider = async (req, res) => {
    const uploadedFiles = [];

    try {
        const { nic, location, address, serviceType } = req.body;
        const files = req.files;
        const user = req.user;

        // Set basic info
        user.role = 'provider';
        user.nic = nic;
        user.location = location;
        user.address = address;
        user.serviceType = serviceType;

        // Image uploads (store in temporary variables)
        const nicImgSrc = [];
        if (files?.nicImg?.length) {
            for (const file of files.nicImg) {
                const url = await uploadBufferToSupabase(file.buffer, user._id, 'nicImg');
                uploadedFiles.push(url);
                nicImgSrc.push(url);
            }
        }

        let profilePicSrc = user.profilePicSrc;
        if (files?.profileImg?.[0]) {
            profilePicSrc = await uploadBufferToSupabase(files.profileImg[0].buffer, user._id, 'profileImg');
            uploadedFiles.push(profilePicSrc);
        }

        let gsCertSrc = user.gsCertSrc;
        if (files?.gsCertImg?.[0]) {
            gsCertSrc = await uploadBufferToSupabase(files.gsCertImg[0].buffer, user._id, 'gsCertImg');
            uploadedFiles.push(gsCertSrc);
        }

        let policeCertSrc = user.policeCertSrc;
        if (files?.policeCertImg?.[0]) {
            policeCertSrc = await uploadBufferToSupabase(files.policeCertImg[0].buffer, user._id, 'policeCertImg');
            uploadedFiles.push(policeCertSrc);
        }

        const otherSrc = [];
        if (files?.otherImg?.length) {
            for (const file of files.otherImg) {
                const url = await uploadBufferToSupabase(file.buffer, user._id, 'otherImg');
                uploadedFiles.push(url);
                otherSrc.push(url);
            }
        }

        // Now assign URLs to user after successful uploads
        user.nicImgSrc = nicImgSrc;
        user.profilePicSrc = profilePicSrc;
        user.gsCertSrc = gsCertSrc;
        user.policeCertSrc = policeCertSrc;
        user.otherSrc = otherSrc;

        // Try saving
        await user.save();

        // Generate new tokens
        const { accessToken, refreshToken } = generateTokens(user);
        user.refreshToken = refreshToken;
        await user.save();

        return res.json({
            msg: 'Upgraded to provider successfully',
            accessToken,
            refreshToken
        });
    } catch (err) {
        // Clean up orphaned Supabase files
        if (uploadedFiles.length > 0) {
            const paths = uploadedFiles.map(url => {
                const [, path] = url.split(`/storage/v1/object/public/`);
                return path;
            });
            await getSupabase().storage.from('images').remove(paths);
        }

        if (err.name === 'ValidationError') {
            const userFriendlyMessages = {
                nic: 'NIC is required.',
                location: 'Location is required.',
                address: 'Address is required.',
                serviceType: 'Service type is required.',
                profilePicSrc: 'Profile picture is required.',
                gsCertSrc: 'Grama Sevaka certificate is required.',
                policeCertSrc: 'Police clearance certificate is required.'
            };

            const errors = Object.keys(err.errors).map(field => ({
                field,
                message: userFriendlyMessages[field] || 'Invalid input.'
            }));

            return res.status(400).json({ msg: 'Validation failed', errors });
        }


        return res.status(500).json({ msg: 'Something went wrong', error: err.message });
    }

};

export const getUserById = async (req, res) => {
    try {
        const userObj = req.user.toObject();
        userObj.id = userObj._id.toString();
        delete userObj._id;
        delete userObj.password;
        delete userObj.refreshToken;

        res.json(userObj);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

