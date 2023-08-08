import express from 'express';
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {config} from "dotenv";

config({
    path: "./vars/.env",
});

const app = express();


// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    // --------------AFTER DEPLOYMENT---------------
    origin: "https://home-automator.vercel.app",

    // -----------------DEVELOPMENT-----------------
    // origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));


// Import Routes
import room from './routes/roomRoutes.js';
import user from './routes/userRoutes.js';

// Using Routes
app.use("/api/v1/", room);
app.use("/api/v1/", user);

export default app;

app.use("/", (req, res) => {
    res.send("Hi, I am a server");
});
app.use(ErrorMiddleware);