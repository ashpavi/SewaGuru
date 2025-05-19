import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
dotenv.config();


import userRouter from './routes/userRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import subscriptionRouter from './routes/subscriptionRouter.js';
import feedbackRouter from './routes/feedbackRouter.js';
import paymentRoutes from './paymentRoutes.js';


const app = express();

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


// -------------------------------------------


// Declare port
const PORT = process.env.PORT || 5001;

//define the port number
app.listen(PORT,
    () => {
        console.log(`Server is running on port: ${PORT}`);
    })