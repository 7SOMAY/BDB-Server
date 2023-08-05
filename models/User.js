import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Username is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: validator.isEmail,    // validate email using validator

    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,      // while accessing the user, password will not be shown
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    ResetPasswordToken: String,
    ResetPasswordExpire: String,
});

schema.pre("save", async function (next){
    if(!this.isModified("password")) next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// schema.methods.remove = async function (){
//     await this.model("User").findByIdAndDelete(this._id);
// }

schema.methods.getJwtToken = function () {
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
}

schema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

schema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.ResetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.ResetPasswordExpire = Date.now() + 15 * 60 * 1000;         // 15 minutes

    return resetToken;
}
export const User = mongoose.model("User", schema);