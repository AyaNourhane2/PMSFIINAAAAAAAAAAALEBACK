import { pool } from '../config/db.js';

export const getMessages = async () => {
  const [rows] = await pool.query('SELECT * FROM messages');
  return rows;
};

export const getMessagesByUser = async (user) => {
  const [rows] = await pool.query(
    'SELECT * FROM messages WHERE sender = ? OR recipient = ? ORDER BY timestamp ASC',
    [user, user]
  );
  return rows;
};

export const addMessage = async (message) => {
  const [result] = await pool.query(
    'INSERT INTO messages (sender, recipient, content, timestamp) VALUES (?, ?, ?, ?)',
    [message.sender, message.recipient, message.content, message.timestamp]
  );
  return result;
};

export const updateMessage = async (id, content) => {
  const [result] = await pool.query(
    'UPDATE messages SET content = ? WHERE id = ?',
    [content, id]
  );
  return result;
};

export const deleteMessage = async (id) => {
  const [result] = await pool.query('DELETE FROM messages WHERE id = ?', [id]);
  return result;
};