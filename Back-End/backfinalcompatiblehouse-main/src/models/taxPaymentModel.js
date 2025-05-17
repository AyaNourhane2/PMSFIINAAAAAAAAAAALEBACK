// models/taxPaymentModel.js
import { pool } from '../config/db.js';

export const getTaxPayments = async () => {
  const [rows] = await pool.query('SELECT * FROM tax_payments');
  return rows;
};

export const addTaxPayment = async (tax) => {
  const [result] = await pool.query(
    'INSERT INTO tax_payments (type, amount, date, status) VALUES (?, ?, ?, ?)',
    [tax.type, tax.amount, tax.date, tax.status]
  );
  return result;
};

export const updateTaxStatus = async (id, status) => {
  const [result] = await pool.query(
    'UPDATE tax_payments SET status = ? WHERE id = ?',
    [status, id]
  );
  return result;
};