// src/models/userModel.js
import { pool } from '../config/db.js';

class UserModel {
  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async create(userData) {
    const { username, email, password, user_type } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, user_type) VALUES (?, ?, ?, ?)',
      [username, email, password, user_type]
    );
    return { id: result.insertId, username, email, user_type };
  }
}

// Exportez à la fois la classe et les méthodes individuelles
export default UserModel;
export const findUserByEmail = UserModel.findByEmail;
export const createUser = UserModel.create;