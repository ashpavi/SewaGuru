import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const generateTokens = async (user) => {
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
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

        await user.save();

        res.status(201).json({ msg: 'User created successfully' });
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
    } catch {
        res.status(403).json({ msg: 'Invalid or expired refresh token' });
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
    try {
        const {
            nic, location, address,
            serviceType,
            nicImgSrc,
            gsCertSrc, policeCertSrc,
            otherSrc
        } = req.body;

        const user = req.user;

        user.role = 'provider';
        user.nic = nic;
        user.location = location;
        user.address = address;
        user.serviceType = serviceType;
        user.nicImgSrc = nicImgSrc;
        user.gsCertSrc = gsCertSrc;
        user.policeCertSrc = policeCertSrc;
        user.otherSrc = otherSrc;
        await user.save();

        res.json({ msg: 'Upgraded to provider successfully' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.keys(err.errors).map(field => ({
                field,
                message: err.errors[field].message
            }));
            return res.status(400).json({ msg: 'Validation failed', errors });
        }

        res.status(500).json({ msg: 'Something went wrong', error: err.message });
    }
};

