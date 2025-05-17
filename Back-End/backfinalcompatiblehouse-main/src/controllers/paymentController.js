// controllers/paymentController.js
import { pool } from '../config/db.js'; // Assurez-vous que ce chemin est correct
import { createPayment } from '../services/paymentService.js';

export const getPayments = async (req, res) => {
  try {
    const payments = await fetchPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addPayment = async (req, res) => {
  try {
    console.log('Données reçues:', req.body); // Log avant traitement
    const { clientName, totalAmount, paymentMethod } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO payments 
       (client_name, total_amount, payment_method, payment_date) 
       VALUES (?, ?, ?, ?)`,
      [clientName, totalAmount, paymentMethod, new Date().toISOString().split('T')[0]]
    );
    
    console.log('Résultat insertion:', result); // Log du résultat
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    console.error('Erreur SQL:', error); // Log détaillé des erreurs
    res.status(500).json({ error: error.message });
  }
};