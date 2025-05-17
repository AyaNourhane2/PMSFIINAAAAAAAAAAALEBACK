// src/models/CleaningModel.js
import { pool } from '../config/db.js';

class CleaningModel {
  static async getAllInventoryItems() {
    const [rows] = await pool.query(`
      SELECT 
        id, 
        item, 
        quantity, 
        min_quantity as minQuantity,
        category,
        quantity <= min_quantity as needsRestock
      FROM cleaning_inventory
    `);
    return rows;
  }

  static async updateInventoryItem(id, quantity) {
    await pool.query(
      'UPDATE cleaning_inventory SET quantity = ? WHERE id = ?',
      [quantity, id]
    );
    return { id, quantity };
  }

  static async createOrder(productId, productName, quantity) {
    const [result] = await pool.query(
      'INSERT INTO cleaning_orders (product_id, product_name, quantity, order_date) VALUES (?, ?, ?, CURDATE())',
      [productId, productName, quantity]
    );
    return { 
      id: result.insertId,
      product: productName,
      quantity,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
  }

  static async getAllOrders() {
    const [rows] = await pool.query(`
      SELECT 
        o.id,
        o.product_name as product,
        o.quantity,
        DATE_FORMAT(o.order_date, '%Y-%m-%d') as date,
        o.status
      FROM cleaning_orders o
      ORDER BY o.order_date DESC
    `);
    return rows;
  }
}

export default CleaningModel;