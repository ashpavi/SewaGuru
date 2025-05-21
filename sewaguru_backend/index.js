import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
dotenv.config();



import conversation from './models/conversation.js';
import paymentRoutes from './paymentRoutes.js';
import bookingRouter from './routes/bookingRouter.js';
import conversationRouter from './routes/conversationRouter.js';
import feedbackRouter from './routes/feedbackRouter.js';
import subscriptionRouter from './routes/subscriptionRouter.js';
import userRouter from './routes/userRouter.js';
import messageRouter from './routes/messageRouter.js';
import message from './models/message.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' },
});

app.set('io', io); // Set the io instance in the app

app.use(cors({
    origin: 'http://localhost:5173', // frontend address
    credentials: true                // allow cookies if needed
}));


//BodyParser is used to simplify the process of parsing the body of an HTTP request
app.use(bodyParser.json());

//Connection Stiring
mongoose.connect(process.env.MONGO).then(
    () => {
        console.log("Connected to MongoDB");
    }
).catch(
    (err) => {
        console.log("Error connecting to MongoDB: " + err);
    }
)


//---importing the Routers-------------------
app.use("/api/user", userRouter)
app.use("/api/bookings", bookingRouter)
app.use("/api/subscriptions", subscriptionRouter)
app.use("/api/feedback", feedbackRouter)
app.use("/api/payment", paymentRoutes);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);

// -------------------------------------------


// Declare port
const PORT = process.env.PORT || 5001;

//define the port number
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// inside server.js
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_conversation', (conversationId) => {
        socket.join(conversationId);
    });

    socket.on('send_message', async (data) => {
        const { conversationId, senderId, text } = data;

        try {
            // Save the message
            const messageData = await message.create({ conversationId, senderId, text });

            // Update conversation's lastUpdated timestamp
            await conversation.findByIdAndUpdate(conversationId, {
                lastUpdated: new Date(),
            });

            // Populate sender name before emitting
            const populatedMessage = await messageData.populate('senderId', 'name');

            // Emit to room
            io.to(conversationId).emit('receive_message', populatedMessage);
        } catch (err) {
            console.error('Error in send_message socket handler:', err);
        }
    });


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
