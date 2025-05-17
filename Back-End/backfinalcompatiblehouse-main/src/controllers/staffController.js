import { pool } from '../config/db.js';

export const getAllStaff = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        nom, 
        position, 
        performance 
      FROM staff
      ORDER BY nom ASC
    `);
    return rows;
  } catch (error) {
    console.error('Erreur dans getAllStaff:', error);
    throw error;
  }
};

export const createStaff = async ({ nom, position, performance }) => {
  try {
    // Validate inputs
    if (!nom || !position || performance === undefined) {
      throw new Error('Tous les champs sont requis');
    }
    if (performance < 0 || performance > 10) {
      throw new Error('La performance doit être entre 0 et 10');
    }

    // Insert staff
    const [result] = await pool.query(
      'INSERT INTO staff (nom, position, performance) VALUES (?, ?, ?)',
      [nom, position, parseFloat(performance)]
    );

    // Fetch created staff
    const [newStaff] = await pool.query(
      'SELECT id, nom, position, performance FROM staff WHERE id = ?',
      [result.insertId]
    );

    return newStaff[0];
  } catch (error) {
    console.error('Erreur dans createStaff:', error);
    throw error;
  }
};