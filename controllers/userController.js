import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import {User} from "../models/User.js";
import {sendToken} from "../utils/sendToken.js";
import {sendEmail} from "../utils/sendEmail.js";
import crypto from "crypto";

export const register = catchAsyncError(async (req, res, next) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    let user = await User.findOne({email});
    if (user) {
        return next(new ErrorHandler("User already exists", 409));
    }
    user = await User.create({
        name,
        email,
        password,
    });
    sendToken(res, user, "User registered successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const user = await User.findOne({email}).select("+password");
    if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) return next(new ErrorHandler("Incorrect Email or Password", 401));


    sendToken(res, user, `Welcome back, ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        secure: true,   // only works on https (Don't use it in development)
        httpOnly: true,
        sameSite: "none",
    }).json({
        success: true,
        message: "Logged out successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        user,
    });
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if(!oldPassword || !newPassword) return next(new ErrorHandler("Please enter all fields", 400));

    const isPasswordMatched = await user.comparePassword(oldPassword);
    if(!isPasswordMatched) return next(new ErrorHandler("Incorrect Old Password", 401));

    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});

export const updateProfile = catchAsyncError(async (req, res) => {
    const {name , email} = req.body;

    const user = await User.findById(req.user._id);

    if(name) user.name = name;
    if(email) user.email = email;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
    });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user) return next(new ErrorHandler("User not found", 404));

    const resetToken = await user.getResetPasswordToken();

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

    await sendEmail(user.email,"BDB Gang Reset Password",message);


    res.status(200).json({
        success: true,
        message: `Reset password link sent to your email ${user.email}`,
    });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
    const {token} = req.params;
    const {password} = req.body;

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        ResetPasswordToken : resetPasswordToken,
        ResetPasswordExpire: {
            $gt: Date.now(),
        },
    });

    if(!user) return next(new ErrorHandler("Password reset token is invalid or has been expired", 400));

    user.password = password;
    user.ResetPasswordToken = undefined;
    user.ResetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});


export const addAppliance = catchAsyncError(async (req, res) => {



    res.status(200).json({
        success: true,
        message: "Appliance added successfully",
    });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    if(!users) return next(new ErrorHandler("No users found", 404));

    res.status(200).json({
        success: true,
        users,
    });
});

export const updateRole = catchAsyncError(async (req, res, next) => {
    const users = await User.findById(req.params.id);

    if(!users) return next(new ErrorHandler("No users found", 404));

    if(users.role === "user") users.role = "admin";
    else users.role = "user";

    await users.save();

    res.status(200).json({
        success: true,
        message: "Role updated successfully",
    });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) return next(new ErrorHandler("No users found", 404));

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});

export const deleteMyAccount = catchAsyncError(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).cookie("token",null,{
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "Account deleted successfully",
    });
});