import mongoose from "mongoose";

const schema = new mongoose.Schema({
        name: {
            type: String,
            required: [true , "Room name is required"],
        },
        appliances: [{
            name: {
                type: String,
                required: [true , "Name is required"],
            },
            status: {
                type: String,
                required: [true, "Status is required"],
                enum: ["on", "off"],
                default: "off",
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
            timer: {
                type: Number,
                default: 0,
            },
            updatedBy: {
                // type: mongoose.Schema.Types.ObjectId,
                // ref: "User",
                type: String,
                required: [true , "Name is required"],
            }
        }],
        createdBy: {
            type: String,
            required: [true , "Name is required"],
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "User",
        }
});

export const Room = mongoose.model("Room", schema);