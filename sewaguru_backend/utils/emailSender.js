import nodemailer from 'nodemailer';
import dotenv from 'dotenv'; // Add this line if you don't have it already
dotenv.config(); // Add this line if you don't have it already



const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    family: 4,
    requireTLS: true,
    tls: {
        rejectUnauthorized: false
    },
  
});

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: to,
            subject: subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to: ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        if (error.response) {
            console.error('Email service response:', error.response);
        }
        throw new Error('Failed to send email confirmation.');
    }
};

export const sendBookingConfirmationEmail = async (customerEmail, bookingDetails) => {
    const subject = 'Your Booking Confirmation - Service Confirmed!';
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4CAF50;">Booking Confirmed!</h2>
            <p>Dear ${bookingDetails.customerName || 'Customer'},</p>
            <p>Your booking for <strong>${bookingDetails.serviceType || 'a service'}</strong> has been successfully confirmed.</p>
            <p>Here are your booking details:</p>
            <ul>
                <li><strong>Service:</strong> ${bookingDetails.serviceType || 'N/A'} ${bookingDetails.subService ? ` - ${bookingDetails.subService}` : ''}</li>
                <li><strong>Provider:</strong> ${bookingDetails.providerName || 'N/A'}</li>
                <li><strong>Date:</strong> ${bookingDetails.bookingDate ? new Date(bookingDetails.bookingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</li>
                <li><strong>Status:</strong> <span style="font-weight: bold; color: ${bookingDetails.status === 'accepted' ? '#4CAF50' : '#FFC107'};">${bookingDetails.status ? bookingDetails.status.charAt(0).toUpperCase() + bookingDetails.status.slice(1) : 'N/A'}</span></li>
                <li><strong>Address:</strong> ${bookingDetails.customerAddress || 'N/A'}</li>
                <li><strong>Contact:</strong> ${bookingDetails.customerContact || 'N/A'}</li>
            </ul>
            <p>We look forward to serving you!</p>
            <p>Best regards,<br>Your Service Team</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.8em; color: #777;">This is an automated email, please do not reply.</p>
        </div>
    `;
    await sendEmail(customerEmail, subject, htmlContent);
};

export const sendSubscriptionConfirmationEmail = async (customerEmail, subscriptionDetails) => {
    const subject = 'Your Subscription is Active - Welcome!';
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2196F3;">Subscription Activated!</h2>
            <p>Dear ${subscriptionDetails.customerName || 'Customer'},</p>
            <p>Your <strong>${subscriptionDetails.planType || 'a plan'}</strong> subscription has been successfully activated.</p>
            <p>Here are your subscription details:</p>
            <ul>
                <li><strong>Plan:</strong> ${subscriptionDetails.planType || 'N/A'}</li>
                <li><strong>Start Date:</strong> ${subscriptionDetails.startDate ? new Date(subscriptionDetails.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</li>
                <li><strong>Next Billing Date:</strong> ${subscriptionDetails.endDate ? new Date(subscriptionDetails.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</li>
                <li><strong>Payment Status:</strong> <span style="font-weight: bold; color: ${subscriptionDetails.paymentStatus === 'active' ? '#4CAF50' : '#FFC107'};">${subscriptionDetails.paymentStatus ? subscriptionDetails.paymentStatus.charAt(0).toUpperCase() + subscriptionDetails.paymentStatus.slice(1) : 'N/A'}</span></li>
                <li><strong>Contact:</strong> ${subscriptionDetails.customerContact || 'N/A'}</li>
                <li><strong>Address:</strong> ${subscriptionDetails.customerAddress || 'N/A'}</li>
            </ul>
            <p>Thank you for subscribing to our services!</p>
            <p>Best regards,<br>Your Service Team</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 0.8em; color: #777;">This is an automated email, please do not reply.</p>
        </div>
    `;
    await sendEmail(customerEmail, subject, htmlContent);
};