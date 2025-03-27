import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import verifyJWT from './middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

//Connection Stiring
mongoose.connect(process.env.MONGO).then(
    ()=>{
        console.log("Connected to MongoDB");
    }
).catch(
    ()=>{
        console.log("Error connecting to MongoDB");
    }
)

//use the body parser middleware
//BodyParser is used to simplify the process of parsing the body of an HTTP request
app.use(bodyParser.json());
//middleware function to verify the JWT
app.use(verifyJWT)


//importing the studentRouter
app.use("/api/user", userRouter)

 
//define the port number
app.listen(5001,
    ()=>{
    console.log("Server is running on port 5001");
})