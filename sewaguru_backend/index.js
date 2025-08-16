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

// --- CORS: allow prod + localhost -----------------------------------------
const allowedOrigins = [
  'https://sewa-guru.vercel.app',
  'http://localhost:5173'
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // curl/server-to-server
    return allowedOrigins.includes(origin)
      ? cb(null, true)
      : cb(new Error('Not allowed by CORS: ' + origin));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true, // only true if you actually use cookies/auth cross-site
};

// Apply CORS **before** anything else that handles requests
app.use(cors(corsOptions));
// Make sure preflight OPTIONS are handled
app.options('*', cors(corsOptions));

// Body parsing
app.use(bodyParser.json());
// (or just: app.use(express.json());)

// --------------------------------------------------------------------------

const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET','POST'],
    credentials: true,
  },
});

app.set('io', io);

// DB
mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB: ' + err));

// Routes
app.use('/api/user', userRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/payment', paymentRoutes);
app.use('/api/conversations', conversationRouter);
app.use('/api/messages', messageRouter);

// Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
  });

  socket.on('send_message', async ({ conversationId, senderId, text }) => {
    try {
      const messageData = await message.create({ conversationId, senderId, text });
      await conversation.findByIdAndUpdate(conversationId, { lastUpdated: new Date() });
      const populatedMessage = await messageData.populate('senderId', 'firstName lastName role');
      io.to(conversationId).emit('receive_message', populatedMessage);
    } catch (err) {
      console.error('Error in send_message socket handler:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
