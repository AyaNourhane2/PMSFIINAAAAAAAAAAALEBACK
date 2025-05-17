import express from 'express';
import { getRooms, addRoom } from '../controllers/roomController.js';

const router = express.Router();

router.get('/', getRooms);
router.post('/', addRoom);

export default router;