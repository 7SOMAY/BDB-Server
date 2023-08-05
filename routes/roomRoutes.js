import express from 'express';
import {createRoom, getRooms} from '../controllers/roomController.js';

const router = express.Router();

// Get all rooms
router.route('/rooms').get(getRooms);

// Create a room
router.route('/createroom').post(createRoom);

// Add appliance to a room

export default router;