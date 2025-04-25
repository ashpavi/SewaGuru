import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        default: "Not Given"
    },
    role: {
        type: String,
        required: true,
        enum: ['customer', 'provider', 'admin'],
        default: 'customer'
    },
    isDisabled: {
        type: Boolean,
        required: true,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true, versionKey: false });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};



export default mongoose.model("User", userSchema);