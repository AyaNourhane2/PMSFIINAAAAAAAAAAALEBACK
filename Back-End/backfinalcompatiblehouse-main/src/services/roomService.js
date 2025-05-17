import { getRooms, addRoom } from '../models/roomModel.js';

export const fetchRooms = async () => {
  return await getRooms();
};

export const createRoom = async (room) => {
  return await addRoom(room);
};