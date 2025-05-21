import User from "../models/user.js";
import Booking from "../models/bookings.js";
import { sendBookingConfirmationEmail } from '../utils/emailSender.js';

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

        // Ensure customerId and providerId are present in the incoming data
        const customerId = bookingData.customerId;
        const providerId = bookingData.providerId;

        if (!customerId || !providerId) {
            return res.status(400).json({ msg: 'Customer ID and Provider ID are required.' });
        }

        // Fetch customer details to get email and name for the email confirmation
        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found.' });
        }

        // Fetch provider details to get their name for the email confirmation
        const provider = await User.findById(providerId);
        if (!provider) {
            return res.status(404).json({ msg: 'Provider not found.' });
        }

        // Augment bookingData with customerName, customerEmail, and providerName
        // These fields are needed for the email, and good to have on the booking record
        const augmentedBookingData = {
            ...bookingData,
            customerName: customer.firstName ? `${customer.firstName} ${customer.lastName}` : customer.email,
            customerEmail: customer.email,
            // providerName will be stored in the booking record as well
            providerName: provider.firstName ? `${provider.firstName} ${provider.lastName}` : provider.email,
            // If you want customerContact and customerAddress in the email,
            // they must either be sent from frontend or fetched from the User model
            // For now, let's assume they come from bookingData or are added to the User model.
            // If they are on the User model, you'd fetch them like:
            customerContact: customer.contactNumber || bookingData.customerContact || 'N/A', // Assuming 'contactNumber' on User, or from bookingData
            customerAddress: customer.address || bookingData.customerAddress || 'N/A', // Assuming 'address' on User, or from bookingData
        };

        const newBooking = new Booking(augmentedBookingData);
        const savedBooking = await newBooking.save(); // Booking is saved to DB

        // --- NOW, SEND THE EMAIL AFTER SUCCESSFUL SAVE ---
        if (customer.email) {
            await sendBookingConfirmationEmail(customer.email, {
                customerName: augmentedBookingData.customerName,
                serviceType: savedBooking.serviceType,
                subService: savedBooking.subService,
                providerName: augmentedBookingData.providerName, // Use the fetched provider's name
                bookingDate: savedBooking.bookingDate,
                status: savedBooking.status,
                customerAddress: augmentedBookingData.customerAddress, // Use augmented data
                customerContact: augmentedBookingData.customerContact // Use augmented data
            });
        }
        // ------------------------------------------

        res.status(201).json({ msg: 'Booking created successfully', booking: savedBooking });

    } catch (err) {
        console.error('Error creating booking:', err);
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
        const userId = req.params.userId;
        console.log("Backend User ID:", userId);

        const bookings = await Booking.find({ customerId: userId })
                                      .populate({
                                          path: 'providerId', // The field in Booking that references the User model
                                          model: 'User',      // Explicitly tell Mongoose to populate from the 'User' model
                                          select: 'firstName lastName' // Select the name fields from the User document
                                      })
                                      .exec(); // Execute the query

        // Map the bookings to include a combined providerName
        const formattedBookings = bookings.map(booking => {
            let providerName = 'Unknown Provider'; // Default value

            // Check if providerId was successfully populated and contains name fields
            if (booking.providerId && typeof booking.providerId === 'object' && booking.providerId.firstName && booking.providerId.lastName) {
                providerName = `${booking.providerId.firstName} ${booking.providerId.lastName}`;
            }

            // Return a new object with the desired structure, including providerName
            return {
                _id: booking._id,
                customerId: booking.customerId,
                providerId: booking.providerId ? booking.providerId._id : null, // Keep the ID if needed
                providerName: providerName, // Add the derived providerName
                serviceType: booking.serviceType,
                subService: booking.subService,
                bookingDate: booking.bookingDate, // This is a Date object, you might format it on the frontend
                location: booking.location,
                urgency: booking.urgency,
                complexity: booking.complexity,
                description: booking.description,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                paymentMethod: booking.paymentMethod,
                imagesUploaded: booking.imagesUploaded,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            };
        });

        res.status(200).json(formattedBookings); // Send the formatted bookings

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
export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params; // Booking ID from the URL parameter
        const customerId = req.user._id; // ID of the logged-in user (customer)

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({ msg: 'Booking not found' });
        }

        // Ensure that only the customer who created the booking can delete it
        if (booking.customerId.toString() !== customerId.toString()) {
            return res.status(403).json({ msg: 'Unauthorized to delete this booking' });
        }

        // You might want to add additional logic here:
        // - Prevent deletion if the booking status is 'accepted' or 'completed'
        // - Optionally, mark as 'cancelled' instead of completely deleting for audit trails
        // For now, we'll proceed with direct deletion as requested.
        if (booking.status === 'accepted' || booking.status === 'completed') {
             return res.status(400).json({ msg: 'Cannot delete accepted or completed bookings. Please contact support to cancel.' });
        }

        await Booking.findByIdAndDelete(id);

        res.status(200).json({ msg: 'Booking deleted successfully' });
    } catch (err) {
        console.error("Error deleting booking:", err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

export const getProviderUpcomingBookings = async (req, res) => {
    try {
        const providerId = req.user._id; // Get providerId from authenticated user
        const now = new Date(); // Current date and time

        const upcomingBookings = await Booking.find({
            providerId: providerId,
            status: { $in: ['pending', 'accepted'] }, // Only show pending/accepted ones as upcoming
            bookingDate: { $gte: new Date(now.setHours(0, 0, 0, 0)) } // Bookings from start of today onwards
        })
        .sort({ bookingDate: 1 }) // Sort only by date since there's no bookingTime field
        .limit(5) // Limit to display only a few on the dashboard
        .populate('customerId', 'firstName lastName phone address'); // <--- CRITICAL CHANGE HERE: Using 'phone' from User model

        // Format the bookings to include customerName, customerContact, customerAddress
        const formattedUpcomingBookings = upcomingBookings.map(booking => {
            const customerName = booking.customerId ? `${booking.customerId.firstName} ${booking.customerId.lastName}` : 'Unknown Customer';
            const customerContact = booking.customerId ? booking.customerId.phone || 'N/A' : 'N/A'; // Use 'phone' from User model
            const customerAddress = booking.customerId ? booking.customerId.address || 'N/A' : 'N/A'; // Use 'address' from User model

            return {
                _id: booking._id,
                serviceType: booking.serviceType,
                subService: booking.subService,
                bookingDate: booking.bookingDate,
                // bookingTime: booking.bookingTime, // REMOVE THIS as it's not in your Booking schema
                status: booking.status,
                customerName: customerName,
                customerContact: customerContact, // Mapped from User.phone
                customerAddress: customerAddress, // Mapped from User.address
                location: booking.location,
                description: booking.description
                // Add any other fields from the booking model you want to send
            };
        });

        res.status(200).json(formattedUpcomingBookings);
    } catch (error) {
        console.error('Error fetching provider upcoming bookings:', error);
        res.status(500).json({ message: 'Failed to fetch upcoming bookings.', error: error.message });
    }
};

export const getProviderBookingSummary = async (req, res) => {
    try {
        const providerId = req.user._id; // Provider ID from authenticated user

        // Count all requests assigned to this provider
        const totalRequests = await Booking.countDocuments({ providerId: providerId });

        // Count jobs with 'completed' status
        const completedJobs = await Booking.countDocuments({
            providerId: providerId,
            status: 'completed'
        });

        res.status(200).json({ totalRequests, completedJobs });
    } catch (error) {
        console.error('Error fetching provider booking summary:', error);
        res.status(500).json({ message: 'Failed to fetch summary data.', error: error.message });
    }
};
