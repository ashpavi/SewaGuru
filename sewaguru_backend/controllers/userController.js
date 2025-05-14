import axios from 'axios';
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
            for (let i = 0; i < files.nicImages.length; i++) {
                const file = files.nicImages[i];
                const url = await uploadBufferToSupabase(file.buffer, email, `nicImg_${i}`);
                uploadedFiles.push(url);
                nicImgSrc.push(url);
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
            for (let i = 0; i < files.extraCerts.length; i++) {
                const file = files.extraCerts[i];
                const url = await uploadBufferToSupabase(file.buffer, email, `otherImg_${i}`, ['image/', 'application/pdf']);
                uploadedFiles.push(url);
                otherSrc.push(url);
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



        const savedUser = await user.save();

        res.status(201).json({ msg: 'Registered successfully, please log in.' });

    } catch (err) {
        console.log(err);
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

export async function googleLogin(req, res) {
    const googleToken = req.body.accessToken;

    try {
        const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: "Bearer " + googleToken
            }
        });

        const googleUserInfo = googleResponse.data;
        let user = await User.findOne({ email: googleUserInfo.email });

        if (!user) {
            const newUser = new User({
                email: googleUserInfo.email,
                firstName: googleUserInfo.given_name,
                lastName: googleUserInfo.family_name,
                // role: "customer",
                // profilePicSrc: googleUserInfo.picture,
                password: googleToken
            });

            const savedUser = await newUser.save();
            const { accessToken, refreshToken } = await generateTokens(savedUser);
            savedUser.refreshToken = refreshToken;
            await savedUser.save();

            res.json({ accessToken, refreshToken });
        } else {
            const { accessToken, refreshToken } = await generateTokens(user);
            user.refreshToken = refreshToken;
            await user.save();

            res.json({ accessToken, refreshToken });
        }

    } catch (error) {
        console.error("Error during Google login:", error);
        res.status(500).json({ message: 'Google login Failed', error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
            return res.status(400).json({ msg: 'Invalid credentials' });

        if (!user.isVerified)
            return res.status(403).json({ msg: 'Account pending verification' });

        if (user.isDisabled)
            return res.status(403).json({ msg: 'Account is disabled' });

        const { accessToken, refreshToken } = await generateTokens(user);
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
        const { accessToken, refreshToken } = await generateTokens(user);
        user.refreshToken = refreshToken;
        user.save()

        res.json({ accessToken, refreshToken });
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

        user.role = 'provider';
        user.nic = nic;
        user.location = location;
        user.address = address;
        user.serviceType = serviceType;

        // Images
        if (files?.nicImages?.length) {
            user.nicImgSrc = [];
            for (let i = 0; i < files.nicImages.length; i++) {
                const file = files.nicImages[i];
                const url = await uploadBufferToSupabase(file.buffer, user.email, `nicImg_${i}`);
                uploadedFiles.push(url);
                user.nicImgSrc.push(url);
            }
        }

        if (files?.profileImage?.[0]) {
            const url = await uploadBufferToSupabase(files.profileImage[0].buffer, user.email, 'profileImg');
            uploadedFiles.push(url);
            user.profilePicSrc = url;
        }

        if (files?.gsCerts?.[0]) {
            const url = await uploadBufferToSupabase(files.gsCerts[0].buffer, user.email, 'gsCertImg');
            uploadedFiles.push(url);
            user.gsCertSrc = url;
        }

        if (files?.policeCerts?.[0]) {
            const url = await uploadBufferToSupabase(files.policeCerts[0].buffer, user.email, 'policeCertImg');
            uploadedFiles.push(url);
            user.policeCertSrc = url;
        }

        if (files?.extraCerts?.length) {
            user.otherSrc = [];
            for (let i = 0; i < files.extraCerts.length; i++) {
                const file = files.extraCerts[i];
                const url = await uploadBufferToSupabase(file.buffer, user.email, `otherImg_${i}`, ['image/', 'application/pdf']);
                uploadedFiles.push(url);
                user.otherSrc.push(url);
            }
        }

        // Save and regenerate tokens
        await user.save();

        const freshUser = await User.findById(user._id);
        const { accessToken, refreshToken } = await generateTokens(freshUser);
        freshUser.refreshToken = refreshToken;
        await freshUser.save();

        return res.json({
            msg: 'Upgraded to provider successfully',
            accessToken,
            refreshToken
        });
    } catch (err) {
        if (uploadedFiles.length > 0) {
            const paths = uploadedFiles.map(url => {
                const [, path] = url.split(`/storage/v1/object/public/`);
                return path;
            });
            await getSupabase().storage.from('images').remove(paths);
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
        // Update valid fields
        Object.assign(user, updateData);

        // Handle image uploads if present
        if (files?.profileImage?.[0]) {
            const url = await uploadBufferToSupabase(files.profileImage[0].buffer, user.email, 'profileImg');
            uploadedFiles.push(url);
            user.profilePicSrc = url;
        }

        if (files?.nicImages?.length) {
            user.nicImgSrc = [];
            for (let i = 0; i < files.nicImages.length; i++) {
                const file = files.nicImages[i];
                const url = await uploadBufferToSupabase(file.buffer, user.email, `nicImg_${i}`);
                uploadedFiles.push(url);
                user.nicImgSrc.push(url);
            }
        }

        if (files?.gsCerts?.[0]) {
            const url = await uploadBufferToSupabase(files.gsCerts[0].buffer, user.email, 'gsCertImg');
            uploadedFiles.push(url);
            user.gsCertSrc = url;
        }

        if (files?.policeCerts?.[0]) {
            const url = await uploadBufferToSupabase(files.policeCerts[0].buffer, user.email, 'policeCertImg');
            uploadedFiles.push(url);
            user.policeCertSrc = url;
        }

        if (files?.extraCerts?.length) {
            user.otherSrc = [];
            for (let i = 0; i < files.extraCerts.length; i++) {
                const file = files.extraCerts[i];
                const url = await uploadBufferToSupabase(file.buffer, user.email, `otherImg_${i}`, ['image/', 'application/pdf']);
                uploadedFiles.push(url);
                user.otherSrc.push(url);
            }
        }



        await user.save();

        const userObj = user.toObject();
        userObj.id = userObj._id.toString();
        delete userObj._id;
        delete userObj.password;
        delete userObj.refreshToken;

        res.json({ msg: 'User updated successfully', user: userObj });

    } catch (err) {
        console.log(err)
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


export const getAll = async (req, res) => {
    try {
        const { role } = req.params;
        const users = await User.find({ role: role }).select('-password -refreshToken -role');

        // Modify each user to change _id to id
        const usersWithId = users.map(user => ({
            ...user.toObject(),
            id: user._id,
        }));

        // Remove the _id field from each customer object
        const response = usersWithId.map(({ _id, ...rest }) => rest);

        res.json(response);

    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: 'Server error', error: err.message });
    }
}


export const toggleUserStatus = async (req, res) => {
    try {
        const { userId, status } = req.params;
        const { enable } = req.body;

        if (typeof enable !== 'boolean') {
            return res.status(400).json({ msg: "[enable] must be a boolean value." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (status === 'verify')
            user.isVerified = enable;
        user.isDisabled = !enable;

        await user.save();

        res.json({ msg: `User has been ${status === 'disable' ? (enable ? 'disabled' : 'enabled') : (enable ? 'verified' : 'unverified')} successfully.` });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};