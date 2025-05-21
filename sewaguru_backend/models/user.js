import bcrypt from 'bcrypt';
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address"
        ]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['customer', 'provider', 'admin'],
        default: 'customer'
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
        default: "0721555245"
    },
    nic: {
        type: String,
        required: function () {
            return this.role === 'provider';
        }
    },
    location: {
        type: String,
        required: function () {
            return this.role === 'provider';
        }
    },
    address: {
        type: String,
        required: function () {
            return this.role === 'provider';
        }
    },
    isVerified: {
        type: Boolean,
        default: function () {
            return this.role !== 'provider';
        }
    },
    isDisabled: {
        type: Boolean,
        default: function () {
            return this.role === 'provider';
        }
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        required: function () {
            return this.role === 'provider';
        }
    },
    numberOfRatings: {
        type: Number,
        default: 0,
        required: function () {
            return this.role === 'provider';
        }
    },
    serviceType: {
        type: String,
        enum: [
            'home_service_repairs',
            'cleaning_pest_control',
            'appliance_repair_installation',
            'home_security_solutions',
            'moving_transport',
            'tree_garden_services'
        ],
        required: function () {
            return this.role === 'provider';
        }
    },
    nicImgSrc: {
        type: [String],
        required: function () {
            return this.role === 'provider';
        }
    },
    profilePicSrc: {
        type: String,
        required: function () {
            return this.role === 'provider';
        }
    },
    gsCertSrc: {
        type: String,
        required: function () {
            return this.role === 'provider';
        }
    },
    policeCertSrc: {
        type: String,
        required: function () {
            return this.role === 'provider';
        }
    },
    otherSrc: { type: [String] },
    refreshToken: { type: String },

    stripeCustomerId: {
        type: String,
        required: false, // It's not required until a user makes a Stripe payment
        unique: true,
        sparse: true // Allows multiple null values, but enforces uniqueness for non-null values
    }
}, { timestamps: true, versionKey: false });

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Update rating method
userSchema.methods.updateRating = async function (newRating) {
    if (this.role !== 'provider') return;
    this.rating = ((this.rating * this.numberOfRatings) + newRating) / (this.numberOfRatings + 1);
    this.numberOfRatings += 1;
    await this.save();
};


export default mongoose.model("User", userSchema);