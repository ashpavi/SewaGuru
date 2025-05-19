import User from "../models/user.js";
import Booking from "../models/bookings.js";

export const findProviders = async (req, res) => {
    try {
        const { serviceType, location } = req.query;

        const providers = await User.find({
            role: 'provider',
            serviceType: serviceType,
            location: location
        }).select('firstName lastName profilePicSrc location serviceType address rating');

        res.json(providers);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

export const createBooking = async (req, res) => {
    try {
        const bookingData = req.body;

        const newBooking = new Booking(bookingData);
        await newBooking.save();

        res.status(201).json({ msg: 'Booking created successfully', booking: newBooking });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const providerId = req.user._id; // Get the ID of the logged-in provider

        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ msg: 'Booking not found' });

        // Ensure the logged-in provider is the recipient of this booking
        if (booking.providerId.toString() !== providerId.toString()) {
            return res.status(403).json({ msg: 'Unauthorized to update this booking' });
        }

        booking.status = status;
        await booking.save();

        res.json({ msg: 'Booking status updated', booking });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        res.json(booking);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

export const getBookingsByUser = async (req, res) => {
    try {
        const userId = req.params.userId; // You are correctly getting the user ID from the URL
        console.log("Backend User ID:", userId);
        const bookings = await Booking.find({ customerId: userId }); // Change 'userId' to 'customerId'
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error getting bookings by user:', error);
        res.status(500).json({ message: 'Failed to get bookings by user.', error: error.message });
    }
};
export const getProviderBookings = async (req, res) => {
    const providerId = req.user._id; // Assuming provider's ID is in the authenticated user object
    try {
        const bookings = await Booking.find({ providerId: providerId })
            .populate('customerId', 'firstName lastName'); // Populate customer details
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

