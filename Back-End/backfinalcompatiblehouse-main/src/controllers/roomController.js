import { fetchRooms, createRoom } from '../services/roomService.js';

export const getRooms = async (req, res) => {
  try {
    const rooms = await fetchRooms();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addRoom = async (req, res) => {
  try {
    const room = req.body;
    const result = await createRoom(room);
    res.status(201).json({ id: result.insertId, ...room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};