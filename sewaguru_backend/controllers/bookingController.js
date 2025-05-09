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
  
      const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
      if (!booking) return res.status(404).json({ msg: 'Booking not found' });
  
      res.json({ msg: 'Booking status updated', booking });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  };