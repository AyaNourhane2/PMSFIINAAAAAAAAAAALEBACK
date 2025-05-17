import { pool } from '../config/db.js';

export const getHousekeepingTasks = async () => {
  const [rows] = await pool.query(`
    SELECT ht.id, r.room_number AS room, ht.status
    FROM housekeeping_tasks ht
    JOIN rooms r ON ht.room_id = r.id
  `);
  return rows;
};

export const addHousekeepingTask = async (task) => {
  const [roomResult] = await pool.query('SELECT id FROM rooms WHERE room_number = ?', [task.room]);
  if (!roomResult.length) throw new Error('Room not found');
  const roomId = roomResult[0].id;
  const [result] = await pool.query(
    'INSERT INTO housekeeping_tasks (room_id, status) VALUES (?, ?)',
    [roomId, task.status]
  );
  return result;
};

export const updateHousekeepingTaskStatus = async (id, status) => {
  const [result] = await pool.query(
    'UPDATE housekeeping_tasks SET status = ? WHERE id = ?',
    [status, id]
  );
  if (result.affectedRows === 0) throw new Error('Task not found');
  return result;
};