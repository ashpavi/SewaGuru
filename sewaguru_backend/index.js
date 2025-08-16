// index.js (minimal production setup)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";

// Models
import conversation from "./models/conversation.js";
import message from "./models/message.js";

// Routers
import paymentRoutes from "./paymentRoutes.js";
import bookingRouter from "./routes/bookingRouter.js";
import conversationRouter from "./routes/conversationRouter.js";
import feedbackRouter from "./routes/feedbackRouter.js";
import subscriptionRouter from "./routes/subscriptionRouter.js";
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js";

// -------------------- App & Server --------------------
const app = express();
const server = http.createServer(app);

// Allow only your known frontends (no trailing slash)
const allowedOrigins = [
  "http://localhost:5173",
  "https://sewa-guru.vercel.app",
];

// Socket.IO with same CORS as REST
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// Expose io to routes if you need it
app.set("io", io);

// -------------------- Middleware --------------------
app.set("trust proxy", 1); // good if you ever use cookies behind a proxy

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// preflight for all routes (helps with PUT/DELETE, custom headers)
app.options("*", cors());

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// -------------------- Database --------------------
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// -------------------- Routers --------------------
app.use("/api/user", userRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/subscriptions", subscriptionRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/payment", paymentRoutes);
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", messageRouter);

// -------------------- Socket.IO --------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("send_message", async ({ conversationId, senderId, text }) => {
    try {
      const messageData = await message.create({ conversationId, senderId, text });

      await conversation.findByIdAndUpdate(conversationId, {
        lastUpdated: new Date(),
      });

      const populatedMessage = await messageData.populate(
        "senderId",
        "firstName lastName role"
      );

      io.to(conversationId).emit("receive_message", populatedMessage);
    } catch (err) {
      console.error("send_message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// -------------------- Safety --------------------
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
