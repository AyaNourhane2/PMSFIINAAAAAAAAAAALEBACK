// models/paymentModel.js
import { pool } from '../config/db.js';

export const getPayments = async () => {
  const [rows] = await pool.query('SELECT * FROM payments');
  return rows;
};

export const addPayment = async (payment) => {
  const [result] = await pool.query(
    'INSERT INTO payments (client_name, total_amount, payment_method, payment_date) VALUES (?, ?, ?, ?)',
    [payment.clientName, payment.totalAmount, payment.paymentMethod, payment.paymentDate]
  );
  return result;
};