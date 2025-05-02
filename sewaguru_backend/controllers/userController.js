import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { getSupabase, uploadBufferToSupabase } from '../utils/uploadToSuperbase.js';

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
    const uploadedFiles = [];

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
            role
        } = req.body;

        const files = req.files;

        // Prevent self-registration as admin
        if (role === 'admin') {
            return res.status(403).json({ msg: 'Unauthorized to register as admin' });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: 'Email already registered' });

        // Upload and assign provider-related files
        let nicImgSrc = [];
        if (files?.nicImages?.length) {
            user.nicImgSrc = [];
            for (let i = 0; i < files.nicImages.length; i++) {
                const file = files.nicImages[i];
                const url = await uploadBufferToSupabase(file.buffer, user._id, `nicImg_${i}`);
                uploadedFiles.push(url);
                user.nicImgSrc.push(url);
            }
        }

        let profilePicSrc, gsCertSrc, policeCertSrc;

        if (files?.profileImage?.[0]) {
            profilePicSrc = await uploadBufferToSupabase(files.profileImage[0].buffer, email, 'profileImg');
            uploadedFiles.push(profilePicSrc);
        }

        if (files?.gsCerts?.[0]) {
            gsCertSrc = await uploadBufferToSupabase(files.gsCerts[0].buffer, email, 'gsCertImg');
            uploadedFiles.push(gsCertSrc);
        }

        if (files?.policeCerts?.[0]) {
            policeCertSrc = await uploadBufferToSupabase(files.policeCerts[0].buffer, email, 'policeCertImg');
            uploadedFiles.push(policeCertSrc);
        }

        const otherSrc = [];
        if (files?.extraCerts?.length) {
            user.otherSrc = [];
            for (let i = 0; i < files.extraCerts.length; i++) {
                const file = files.extraCerts[i];
                const url = await uploadBufferToSupabase(file.buffer, user._id, `otherImg_${i}`, ['image/', 'application/pdf']);
                uploadedFiles.push(url);
                user.otherSrc.push(url);
            }
        }

        const user = new User({
            email,
            password,
            firstName,
            lastName,
            phone,
            role,
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
            })
        });

        if (role === 'provider') {
            const { accessToken, refreshToken } = generateTokens(user);
            user.refreshToken = refreshToken;
        }

        const savedUser = await user.save();

        res.status(201).json({ msg: 'Registered successfully, please log in.' });

    } catch (err) {
        // Clean up any uploaded files on failure
        if (uploadedFiles.length > 0) {
            const paths = uploadedFiles.map(url => {
                const [, path] = url.split(`/storage/v1/object/public/`);
                return path;
            });
            await getSupabase().storage.from('images').remove(paths);
        }

        if (err.name === 'ValidationError') {
            const messages = {
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
                message: messages[field] || 'Invalid input.'
            }));

            return res.status(400).json({ msg: 'Validation failed', errors });
        }

        res.status(500).json({ msg: 'Something went wrong', error: err.message });
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

        const {accessToken, refreshToken} = await generateTokens(user);
        user.refreshToken = refreshToken;
        user.save()

        res.json({ accessToken, refreshToken });


        console.log("User logged in:", { id: user.id, name: user.firstName + " " + user.lastName, email: user.email, role: user.role });



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
        const {accessToken,refreshToken} = await generateTokens(user);
        user.refreshToken=refreshToken;
        user.save()

        res.json({accessToken,refreshToken});
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
        if (files?.nicImages?.length) {
            user.nicImgSrc = [];
            for (let i = 0; i < files.nicImages.length; i++) {
                const file = files.nicImages[i];
                const url = await uploadBufferToSupabase(file.buffer, user._id, `nicImg_${i}`);
                uploadedFiles.push(url);
                user.nicImgSrc.push(url);
            }
        }

        let profilePicSrc = user.profilePicSrc;
        if (files?.profileImage?.[0]) {
            profilePicSrc = await uploadBufferToSupabase(files.profileImage[0].buffer, user.email, 'profileImg');
            uploadedFiles.push(profilePicSrc);
        }

        let gsCertSrc = user.gsCertSrc;
        if (files?.gsCerts?.[0]) {
            gsCertSrc = await uploadBufferToSupabase(files.gsCerts[0].buffer, user.email, 'gsCertImg');
            uploadedFiles.push(gsCertSrc);
        }

        let policeCertSrc = user.policeCertSrc;
        if (files?.policeCerts?.[0]) {
            policeCertSrc = await uploadBufferToSupabase(files.policeCerts[0].buffer, user.email, 'policeCertImg');
            uploadedFiles.push(policeCertSrc);
        }

        const otherSrc = [];
        if (files?.extraCerts?.length) {
            user.otherSrc = [];
            for (let i = 0; i < files.extraCerts.length; i++) {
                const file = files.extraCerts[i];
                const url = await uploadBufferToSupabase(file.buffer, user._id, `otherImg_${i}`, ['image/', 'application/pdf']);
                uploadedFiles.push(url);
                user.otherSrc.push(url);
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


export const getLoggedInUser = async (req, res) => {
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


export const updateUser = async (req, res) => {
    const uploadedFiles = [];
    try {
        const userId = req.user._id;
        const updateData = req.body;
        const files = req.files;

        // Block restricted fields
        const disallowedFields = ['_id', 'email', 'password', 'role', 'refreshToken'];
        for (const field of disallowedFields) {
            if (field in updateData) {
                return res.status(400).json({ msg: `Field '${field}' cannot be updated.` });
            }
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Handle image uploads if present
        if (files?.profileImage?.[0]) {
            const url = await uploadBufferToSupabase(files.profileImage[0].buffer, user._id, 'profileImg');
            uploadedFiles.push(url);
            user.profilePicSrc = url;
        }

        if (files?.nicImages?.length) {
            user.nicImgSrc = [];
            for (let i = 0; i < files.nicImages.length; i++) {
                const file = files.nicImages[i];
                const url = await uploadBufferToSupabase(file.buffer, user._id, `nicImg_${i}`);
                uploadedFiles.push(url);
                user.nicImgSrc.push(url);
            }
        }

        if (files?.gsCerts?.[0]) {
            const url = await uploadBufferToSupabase(files.gsCerts[0].buffer, user._id, 'gsCertImg');
            uploadedFiles.push(url);
            user.gsCertSrc = url;
        }

        if (files?.policeCerts?.[0]) {
            const url = await uploadBufferToSupabase(files.policeCerts[0].buffer, user._id, 'policeCertImg');
            uploadedFiles.push(url);
            user.policeCertSrc = url;
        }

        if (files?.extraCerts?.length) {
            user.otherSrc = [];
            for (let i = 0; i < files.extraCerts.length; i++) {
                const file = files.extraCerts[i];
                const url = await uploadBufferToSupabase(file.buffer, user._id, `otherImg_${i}`, ['image/', 'application/pdf']);
                uploadedFiles.push(url);
                user.otherSrc.push(url);
            }
        }

        // Update valid fields
        Object.assign(user, updateData);

        await user.save();

        const userObj = user.toObject();
        userObj.id = userObj._id.toString();
        delete userObj._id;
        delete userObj.password;
        delete userObj.refreshToken;

        res.json({ msg: 'User updated successfully', user: userObj });

    } catch (err) {
        // Cleanup orphaned files if validation or save fails
        if (uploadedFiles.length) {
            const paths = uploadedFiles.map(url => {
                const [, path] = url.split(`/storage/v1/object/public/`);
                return path;
            });
            await getSupabase().storage.from('images').remove(paths);
        }

        if (err.name === 'ValidationError') {
            const errors = Object.keys(err.errors).map(field => ({
                field,
                message: err.errors[field].message
            }));
            return res.status(400).json({ msg: 'Validation failed', errors });
        }

        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};
