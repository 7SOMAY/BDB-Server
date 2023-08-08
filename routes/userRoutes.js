import express from 'express';
import {
    login,
    register,
    logout,
    getMyProfile,
    updatePassword,
    updateProfile,
    forgetPassword,
    resetPassword,
    getAllUsers,
    updateRole,
    deleteUser,
    deleteMyAccount
} from "../controllers/userController.js";
import {authorizeAdmin, isAuthenticated} from "../middlewares/auth.js";

const router = express.Router();

// Register User
router.route("/register").post(register);

// Login User
router.route("/login").post(login);

// Logout User
router.route("/logout").get(logout);

// Get My Profile
router.route("/home").get(isAuthenticated, getMyProfile);

// Update Password
router.route("/updatepassword").put(isAuthenticated, updatePassword);

// Update Profile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

// Forgot Password
router.route("/forgetpassword").post(forgetPassword);

// Reset Password
router.route("/resetpassword/:token").post(resetPassword);

// Admin Routes
router.route("/admin/users").get(isAuthenticated, getAllUsers);

// Update Role
router.route("/admin/user/:id").put(isAuthenticated, authorizeAdmin, updateRole);

// Delete User
router.route("/admin/user/:id").delete(isAuthenticated, authorizeAdmin, deleteUser);

// Delete My Account
router.route("/me").delete(isAuthenticated, deleteMyAccount);


export default router;