import { pool } from '../config/db.js';

export const getRooms = async () => {
  const [rows] = await pool.query('SELECT id, room_number AS room FROM rooms');
  return rows;
};

export const addRoom = async (room) => {
  const [result] = await pool.query(
    'INSERT INTO rooms (room_number) VALUES (?)',
    [room.room]
  );
  return result;
};