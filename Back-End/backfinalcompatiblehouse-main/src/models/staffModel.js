import { pool } from '../config/db.js';

export const getStaff = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id, 
      name, 
      position AS status, 
      performance 
    FROM staff
    ORDER BY name ASC
  `);
  return rows;
};

export const addStaff = async (employee) => {
  const [result] = await pool.query(
    'INSERT INTO staff (name, position, performance) VALUES (?, ?, ?)',
    [employee.name, employee.status, employee.performance]
  );
  
  // Retourner les données créées
  const [newStaff] = await pool.query('SELECT * FROM staff WHERE id = ?', [result.insertId]);
  return newStaff[0];
};