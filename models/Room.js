import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Room name is required"],
    },
    appliances: [{
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        status: {
            type: String,
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
        startTime: {
            type: Number,
            default: 0,
        },
        endTime: {
            type: Number,
            default: 0,
        },
        updatedBy: {
            type: String,
            required: [false],
            default: "admin",
        },
        createdBy: {
            type: String,
            required: [true, "Name is required"],
        },
        duration: [{
            date: {
                type: Date,
                default: Date.now,
            },
            time: {
                type: String,
                default: "0",
            }
        }]
    }],
    createdBy: {
        type: String,
        required: [false],
        default: "admin",
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "User",
    }
});


export const Room = mongoose.model("Room", schema);