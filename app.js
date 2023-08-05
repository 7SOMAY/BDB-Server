import express from 'express';
import ErrorMiddleware from "./middlewares/Error.js";
import cookieParser from 'cookie-parser';

import {config} from "dotenv";
config({
    path: ".env",
});

const app = express();


// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());



// Import Routes
import room from './routes/roomRoutes.js';
import user from './routes/userRoutes.js';

app.use("/api/v1/",room);
app.use("/api/v1/",user);

export default app;

app.use(ErrorMiddleware);