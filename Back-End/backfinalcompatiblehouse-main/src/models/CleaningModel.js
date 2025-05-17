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
        quantity <= min_quantity as needsRestock,
        photo_url as photoUrl
      FROM cleaning_inventory
      ORDER BY needsRestock DESC, item ASC
    `);
    return rows;
  }

  static async updateInventoryItem(id, quantity) {
    const [result] = await pool.query(
      'UPDATE cleaning_inventory SET quantity = ? WHERE id = ?',
      [quantity, id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Produit non trouvé');
    }
    const [updatedItem] = await pool.query(
      'SELECT id, item, quantity, min_quantity as minQuantity, category, photo_url as photoUrl FROM cleaning_inventory WHERE id = ?',
      [id]
    );
    return updatedItem[0];
  }

  static async createOrder(productId, productName, quantity) {
    if (quantity <= 0) {
      throw new Error('La quantité doit être positive');
    }
    const [result] = await pool.query(
      'INSERT INTO cleaning_orders (product_id, product_name, quantity, order_date, status) VALUES (?, ?, ?, CURDATE(), ?)',
      [productId, productName, quantity, 'pending']
    );
    return { 
      id: result.insertId,
      product: productName,
      quantity,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
  }

  static async getAllOrders() {
    const [rows] = await pool.query(`
      SELECT 
        id,
        product_name as product,
        quantity,
        DATE_FORMAT(order_date, '%Y-%m-%d') as date,
        status
      FROM cleaning_orders
      ORDER BY order_date DESC
      LIMIT 50
    `);
    return rows;
  }

  static async addProduct({ item, quantity, minQuantity, category, photoUrl }) {
    const [result] = await pool.query(
      'INSERT INTO cleaning_inventory (item, quantity, min_quantity, category, photo_url) VALUES (?, ?, ?, ?, ?)',
      [item, quantity, minQuantity, category, photoUrl || null]
    );
    const [newProduct] = await pool.query(
      'SELECT id, item, quantity, min_quantity as minQuantity, category, photo_url as photoUrl FROM cleaning_inventory WHERE id = ?',
      [result.insertId]
    );
    return newProduct[0];
  }
}

export default CleaningModel;