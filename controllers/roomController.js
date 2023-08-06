import { Room } from "../models/Room.js";
import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

export const getRooms = catchAsyncError(async (req, res) => {
    const rooms = await Room.find();

    console.log(rooms);

    res.status(200).json({
        status: "success",
        rooms,
    });
});

export const createRoom = catchAsyncError(async (req, res, next) => {
    const { name } = req.body;

    if(!name) return next(new ErrorHandler("Name and User are required", 400));

    const room = await Room.findOne({ name });

    if(room) return next(new ErrorHandler("Room already exists", 409));

    await Room.create({
        name,
    });

    res.status(201).json({
        status: "success",
        message: "Room created successfully",
    });
});

export const updateRoom = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    const room = await Room.findById(id);

    if(!room) return next(new ErrorHandler("Room not found", 404));

    room.name = name;

    await room.save();

    res.status(200).json({
        status: "success",
        message: "Room updated successfully",
    });
});

export const deleteRoom = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const room = await Room.findById(id);

    if(!room) return next(new ErrorHandler("Room not found", 404));

    await Room.findByIdAndDelete(id);

    res.status(200).json({
        status: "success",
        message: "Room deleted successfully",
    });
});




export const getRoomAppliances = catchAsyncError(async (req, res, next) => {
    const room = await Room.findById(req.params.id);

    if(!room) return next(new ErrorHandler("Room not found", 404));

    res.status(200).json({
        status: "success",
        appliances: room.appliances,
    });

});

export const addAppliance = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { name, createdBy } = req.body;

    const room = await Room.findById(id);

    if(!room || !createdBy) return next(new ErrorHandler("Room not found", 404));

    if (!name) return next(new ErrorHandler("Name is required", 400));
    if (!createdBy) return next(new ErrorHandler("User is required", 400));

    if (room.appliances.find((appliance) => appliance.name === name)) return next(new ErrorHandler("Appliance already exists", 409));

    room.appliances.push({
        name,
        createdBy,
    });

    await room.save();

    res.status(201).json({
        status: "success",
        message: "Appliance added successfully",
    });
});

export const updateAppliance = catchAsyncError(async (req, res, next) => {
    const { id, applianceId } = req.params;
    const { name } = req.body;

    const room = await Room.findById(id);

    if(!room) return next(new ErrorHandler("Room not found", 404));

    const appliance = room.appliances.find((appliance) => appliance._id.toString() === applianceId);

    if(!appliance) return next(new ErrorHandler("Appliance not found", 404));

    appliance.name = name;

    await room.save();

    res.status(200).json({
        status: "success",
        message: "Appliance updated successfully",
    });
});

export const updateApplianceStatus = catchAsyncError(async (req, res, next) => {
    const { id, applianceId } = req.params;
    const { status } = req.body;

    const room = await Room.findById(id);

    if(!room) return next(new ErrorHandler("Room not found", 404));

    const appliance = room.appliances.find((appliance) => appliance._id.toString() === applianceId);

    if(!appliance) return next(new ErrorHandler("Appliance not found", 404));

    if(appliance.status === "on") {
        appliance.endTime = new Date();
        appliance.duration.push({
            date: appliance.endTime,
            time: `${(appliance.endTime - appliance.startTime) / 1000} seconds`,
        })
    }
    else {
        appliance.startTime = new Date();
    }

    appliance.status = status;

    await room.save();

    res.status(200).json({
        status: "success",
        message: "Appliance status updated successfully",
    });
});
export const deleteAppliance = catchAsyncError(async (req, res, next) => {
    const { id, applianceId } = req.params;

    const room = await Room.findById(id);

    if (!room) return next(new ErrorHandler("Room not found", 404));

    // Find the index of the appliance in the appliances array
    const applianceIndex = room.appliances.findIndex(appliance => appliance._id.toString() === applianceId);

    if (applianceIndex === -1) return next(new ErrorHandler("Appliance not found", 404));

    // Remove the appliance from the array using splice
    room.appliances.splice(applianceIndex, 1);

    // Save the updated room document
    await room.save();

    res.status(200).json({
        status: "success",
        message: "Appliance deleted successfully",
    });
});
