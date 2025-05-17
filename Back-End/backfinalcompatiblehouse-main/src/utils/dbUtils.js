import { pool } from '../config/db.js';

const tableDefinitions = {
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      mobile VARCHAR(20),
      user_type ENUM('super_admin','admin','manager','staff','guest') NOT NULL DEFAULT 'guest',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      last_login DATETIME,
      failed_login_attempts INT DEFAULT 0,
      password_reset_token VARCHAR(255),
      password_reset_expires DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_user_type (user_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  user_management: `
    CREATE TABLE IF NOT EXISTS user_management (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      user_type ENUM('super_admin','admin','manager','user','guest') NOT NULL DEFAULT 'user',
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      last_login DATETIME,
      failed_login_attempts INT DEFAULT 0,
      password_reset_token VARCHAR(255),
      password_reset_expires DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_user_type (user_type),
      INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  cleaning_inventory: `
    CREATE TABLE IF NOT EXISTS cleaning_inventory (
      id INT AUTO_INCREMENT PRIMARY KEY,
      item VARCHAR(100) NOT NULL,
      quantity INT NOT NULL,
      min_quantity INT NOT NULL,
      category VARCHAR(50) NOT NULL,
      photo_url VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  cleaning_orders: `
    CREATE TABLE IF NOT EXISTS cleaning_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      product_name VARCHAR(100) NOT NULL, -- Added to match query expectation
      quantity INT NOT NULL,
      order_date DATE NOT NULL,
      status ENUM('pending', 'processing', 'delivered') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES cleaning_inventory(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  rooms: `
    CREATE TABLE IF NOT EXISTS rooms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      room_number VARCHAR(10) NOT NULL UNIQUE,
      room_type VARCHAR(50) NOT NULL,
      status ENUM('available','occupied','maintenance','reserved') NOT NULL DEFAULT 'available',
      price_per_night DECIMAL(10,2) NOT NULL,
      capacity INT NOT NULL,
      amenities TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_room_type (room_type),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  housekeeping_tasks: `
    CREATE TABLE IF NOT EXISTS housekeeping_tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      room_id INT NOT NULL,
      status ENUM('clean','dirty','in_progress','inspected') NOT NULL DEFAULT 'clean',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  special_requests: `
    CREATE TABLE IF NOT EXISTS special_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      room_id INT NOT NULL,
      request_type VARCHAR(50) NOT NULL,
      description TEXT,
      status ENUM('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (room_id) REFERENCES rooms(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  staff: `
    CREATE TABLE IF NOT EXISTS staff (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      position VARCHAR(50) NOT NULL,
      performance DECIMAL(3,1)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  payments: `
    CREATE TABLE IF NOT EXISTS payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      client_name VARCHAR(100) NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      payment_date DATE NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  tax_payments: `
    CREATE TABLE IF NOT EXISTS tax_payments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      date DATE NOT NULL,
      status ENUM('payé', 'en attente') NOT NULL DEFAULT 'en attente'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  messages: `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender VARCHAR(50) NOT NULL,
      recipient VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  inventory_orders: `
    CREATE TABLE IF NOT EXISTS inventory_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product VARCHAR(100) NOT NULL,
      quantity INT NOT NULL,
      order_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  audit_logs: `
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      action VARCHAR(50) NOT NULL,
      table_name VARCHAR(50) NOT NULL,
      record_id INT,
      old_values JSON,
      new_values JSON,
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  reservations: `
    CREATE TABLE IF NOT EXISTS reservations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      reservation_number VARCHAR(50) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      room_id INT NOT NULL,
      check_in_date DATE NOT NULL,
      check_out_date DATE NOT NULL,
      guest_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      country VARCHAR(50),
      phone_number VARCHAR(20),
      address TEXT,
      document_type ENUM('passport','nationalId') NOT NULL,
      document_number VARCHAR(50) NOT NULL,
      special_requests JSON,
      additional_services JSON,
      payment_method ENUM('card','transfer','check') NOT NULL,
      payment_status ENUM('paid','pending','failed') NOT NULL DEFAULT 'pending',
      total_amount DECIMAL(10,2) NOT NULL,
      status ENUM('confirmed','pending','cancelled') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (room_id) REFERENCES rooms(id),
      INDEX idx_reservation_number (reservation_number)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `,
  administrative_tasks: `
    CREATE TABLE IF NOT EXISTS administrative_tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      priority ENUM('high','medium','low') NOT NULL DEFAULT 'medium',
      status ENUM('pending','completed') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `
};

const createTable = async (tableName, query) => {
  const conn = await pool.getConnection();
  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query(`DROP TABLE IF EXISTS ${tableName}`);
    await conn.query(query);
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log(`✅ Table ${tableName} créée`);
  } catch (error) {
    console.error(`❌ Erreur création table ${tableName}:`, error);
    throw error;
  } finally {
    conn.release();
  }
};

const seedInitialData = async () => {
  const conn = await pool.getConnection();
  try {
    const [adminRows] = await conn.query('SELECT id FROM users WHERE user_type = "super_admin" LIMIT 1');
    if (adminRows.length === 0) {
      const hashedPassword = '$2a$10$N9qo8uLOickgx2ZMRZoMy.MZHbjS2X6AJR6dRWRo7KTCCa7Pq3L8a';
      await conn.query(
        `INSERT INTO users 
        (username, email, password, first_name, last_name, user_type) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        ['admin', 'admin@example.com', hashedPassword, 'System', 'Admin', 'super_admin']
      );
      console.log('👑 Compte admin créé');
    }

    const [userRows] = await conn.query('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count <= 1) {
      const users = [
        { username: 'john_doe', email: 'john@example.com', first_name: 'John', last_name: 'Doe', user_type: 'staff' },
        { username: 'jane_smith', email: 'jane@example.com', first_name: 'Jane', last_name: 'Smith', user_type: 'staff' },
        { username: 'alice_brown', email: 'alice@example.com', first_name: 'Alice', last_name: 'Brown', user_type: 'staff' }
      ];
      const hashedPassword = '$2a$10$N9qo8uLOickgx2ZMRZoMy.MZHbjS2X6AJR6dRWRo7KTCCa7Pq3L8a';
      for (const user of users) {
        await conn.query(
          `INSERT INTO users 
          (username, email, password, first_name, last_name, user_type) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [user.username, user.email, hashedPassword, user.first_name, user.last_name, user.user_type]
        );
      }
      console.log('👥 Utilisateurs de test créés');
    }

    const [roomRows] = await conn.query('SELECT COUNT(*) as count FROM rooms');
    if (roomRows[0].count === 0) {
      const rooms = Array.from({ length: 9 }, (_, i) => ({
        room_number: `${1001 + i}`,
        room_type: 'Standard',
        price_per_night: 100.00,
        capacity: 2
      }));
      for (const room of rooms) {
        await conn.query(
          `INSERT INTO rooms 
          (room_number, room_type, status, price_per_night, capacity) 
          VALUES (?, ?, 'available', ?, ?)`,
          [room.room_number, room.room_type, room.price_per_night, room.capacity]
        );
      }
      console.log('🏠 Chambres 1001-1009 créées');
    }

    const [staffRows] = await conn.query('SELECT COUNT(*) as count FROM staff');
    if (staffRows[0].count === 0) {
      const staff = [
        { nom: 'John Doe', position: 'Housekeeper', performance: 8.5 },
        { nom: 'Jane Smith', position: 'Supervisor', performance: 9.0 },
        { nom: 'Alice Brown', position: 'Cleaner', performance: 7.5 }
      ];
      for (const employee of staff) {
        await conn.query(
          `INSERT INTO staff 
          (nom, position, performance) 
          VALUES (?, ?, ?)`,
          [employee.nom, employee.position, employee.performance]
        );
      }
      console.log('👷 Personnel de test créé');
    }

    const [taskRows] = await conn.query('SELECT COUNT(*) as count FROM housekeeping_tasks');
    if (taskRows[0].count === 0) {
      const tasks = [
        { room_id: 1, status: 'clean' },
        { room_id: 2, status: 'dirty' },
        { room_id: 3, status: 'in_progress' },
        { room_id: 4, status: 'inspected' }
      ];
      for (const task of tasks) {
        await conn.query(
          `INSERT INTO housekeeping_tasks 
          (room_id, status) 
          VALUES (?, ?)`,
          [task.room_id, task.status]
        );
      }
      console.log('🧹 Tâches de ménage créées');
    }

    const [orderRows] = await conn.query('SELECT COUNT(*) as count FROM inventory_orders');
    if (orderRows[0].count === 0) {
      const orders = [
        { product: 'Shampoo', quantity: 10, order_date: '2024-01-01' },
        { product: 'Towels', quantity: 20, order_date: '2024-01-02' },
        { product: 'Soap', quantity: 15, order_date: '2024-01-03' }
      ];
      for (const order of orders) {
        await conn.query(
          `INSERT INTO inventory_orders 
          (product, quantity, order_date) 
          VALUES (?, ?, ?)`,
          [order.product, order.quantity, order.order_date]
        );
      }
      console.log('🛒 Commandes d\'inventaire créées');
    }

    const [messageRows] = await conn.query('SELECT COUNT(*) as count FROM messages');
    if (messageRows[0].count === 0) {
      const messages = [
        { sender: 'User', recipient: 'Réceptionniste', content: 'Bonjour, besoin de plus de serviettes.', timestamp: '2024-01-01 09:00:00' },
        { sender: 'Réceptionniste', recipient: 'User', content: 'Nous en envoyons immédiatement.', timestamp: '2024-01-01 09:05:00' }
      ];
      for (const message of messages) {
        await conn.query(
          `INSERT INTO messages 
          (sender, recipient, content, timestamp) 
          VALUES (?, ?, ?, ?)`,
          [message.sender, message.recipient, message.content, message.timestamp]
        );
      }
      console.log('💬 Messages créés');
    }

    const [inventoryRows] = await conn.query('SELECT COUNT(*) as count FROM cleaning_inventory');
    if (inventoryRows[0].count === 0) {
      const cleaningInventory = [
        { item: 'Serviettes', quantity: 50, min_quantity: 30, category: 'Textile' },
        { item: 'Détergent', quantity: 10, min_quantity: 15, category: 'Produits nettoyage' },
        { item: 'Gants jetables', quantity: 20, min_quantity: 50, category: 'Protection' },
        { item: 'Sac poubelle', quantity: 100, min_quantity: 200, category: 'Fournitures' },
        { item: 'Shampoing moquette', quantity: 5, min_quantity: 10, category: 'Produits nettoyage' },
        { item: 'Désinfectant', quantity: 8, min_quantity: 20, category: 'Produits nettoyage' },
        { item: 'Eponges', quantity: 25, min_quantity: 40, category: 'Outils' },
        { item: 'Balai', quantity: 15, min_quantity: 10, category: 'Outils' },
        { item: 'Serpillère', quantity: 12, min_quantity: 10, category: 'Outils' },
        { item: 'Savon mains', quantity: 30, min_quantity: 50, category: 'Hygiène' }
      ];
      for (const item of cleaningInventory) {
        await conn.query(
          `INSERT INTO cleaning_inventory 
          (item, quantity, min_quantity, category) 
          VALUES (?, ?, ?, ?)`,
          [item.item, item.quantity, item.min_quantity, item.category]
        );
      }
      console.log('🧼 Inventaire de nettoyage initialisé');
    }

    const [cleaningOrderRows] = await conn.query('SELECT COUNT(*) as count FROM cleaning_orders');
    if (cleaningOrderRows[0].count === 0) {
      const cleaningOrders = [
        { product_id: 1, product_name: 'Serviettes', quantity: 15, order_date: '2023-05-15', status: 'delivered' },
        { product_id: 3, product_name: 'Gants jetables', quantity: 50, order_date: '2023-05-18', status: 'processing' },
        { product_id: 5, product_name: 'Shampoing moquette', quantity: 10, order_date: '2023-05-20', status: 'delivered' }
      ];
      for (const order of cleaningOrders) {
        await conn.query(
          `INSERT INTO cleaning_orders 
          (product_id, product_name, quantity, order_date, status) 
          VALUES (?, ?, ?, ?, ?)`,
          [order.product_id, order.product_name, order.quantity, order.order_date, order.status]
        );
      }
      console.log('📦 Commandes de nettoyage initialisées');
    }
  } catch (error) {
    console.error('Erreur initialisation données:', error);
    throw error;
  } finally {
    conn.release();
  }
};

export const initializeDatabase = async () => {
  try {
    console.log('🚀 Début initialisation DB...');
    
    await createTable('users', tableDefinitions.users);
    await createTable('rooms', tableDefinitions.rooms);
    await createTable('housekeeping_tasks', tableDefinitions.housekeeping_tasks);
    await createTable('special_requests', tableDefinitions.special_requests);
    await createTable('staff', tableDefinitions.staff);
    await createTable('payments', tableDefinitions.payments);
    await createTable('tax_payments', tableDefinitions.tax_payments);
    await createTable('messages', tableDefinitions.messages);
    await createTable('inventory_orders', tableDefinitions.inventory_orders);
    await createTable('audit_logs', tableDefinitions.audit_logs);
    await createTable('cleaning_inventory', tableDefinitions.cleaning_inventory);
    await createTable('cleaning_orders', tableDefinitions.cleaning_orders);

    await seedInitialData();
    
    console.log('🎉 Base de données initialisée!');
    return true;
  } catch (error) {
    console.error('💥 Erreur initialisation DB:', error);
    throw error;
  }
};

export const checkDatabaseConnection = async () => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Erreur connexion DB:', error);
    return false;
  }
};

export default {
  initializeDatabase,
  checkDatabaseConnection
};