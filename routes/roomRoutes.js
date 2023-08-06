import express from 'express';
import {
    createRoom,
    getRoomAppliances,
    getRooms,
    addAppliance,
    updateRoom,
    deleteRoom,
    updateAppliance,
    deleteAppliance,
    updateApplianceStatus,
} from '../controllers/roomController.js';
import {authorizeAdmin, isAuthenticated} from "../middlewares/auth.js";

const router = express.Router();

// Get all rooms
router.route('/room/all').get(isAuthenticated, getRooms);

// Create a room
router.route('/room/create').post(isAuthenticated, authorizeAdmin, createRoom);

// Update a room
router.route('/room/:id').put(isAuthenticated, updateRoom);

// Delete a room
router.route('/room/:id').delete(isAuthenticated, authorizeAdmin, deleteRoom);




// Get all appliances in a room
router.route('/room/:id').get(isAuthenticated, getRoomAppliances);

// Add appliance to a room
router.route('/room/:id').post(isAuthenticated, addAppliance);

// Update appliance in a room
router.route('/room/:id/:applianceId').put(isAuthenticated, updateAppliance);

// Update Status of appliance in a room
router.route('/room/:id/:applianceId/status').put(isAuthenticated, updateApplianceStatus);

// Delete appliance in a room
router.route('/room/:id/:applianceId').delete(isAuthenticated, deleteAppliance);



export default router;