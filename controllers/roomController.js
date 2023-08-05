import { Room } from "../models/Room.js";
import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

export const getRooms = catchAsyncError(async (req, res, next) => {
    const rooms = await Room.find();
    res.status(200).json({
        status: "success",
        rooms,
    });
});

export const createRoom = catchAsyncError(async (req, res, next) => {
    const { name, createdBy } = req.body;

    if(!name || !createdBy)
        return next(new ErrorHandler("Name and User are required", 400));

    await Room.create({
        name,
        createdBy,
    });

    res.status(201).json({
        status: "success",
        message: "Room created successfully",
    });
});