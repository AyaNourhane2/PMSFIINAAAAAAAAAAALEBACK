import { pool } from '../config/db.js';

export const getInventoryOrders = async () => {
  const [rows] = await pool.query('SELECT id, product, quantity, order_date AS date FROM inventory_orders');
  return rows;
};

export const addInventoryOrder = async (order) => {
  const [result] = await pool.query(
    'INSERT INTO inventory_orders (product, quantity, order_date) VALUES (?, ?, ?)',
    [order.product, order.quantity, order.date || new Date().toISOString().split('T')[0]]
  );
  return result;
};