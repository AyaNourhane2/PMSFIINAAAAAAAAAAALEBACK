// controllers/taxPaymentController.js
import { fetchTaxPayments, createTaxPayment, changeTaxStatus } from '../services/taxPaymentService.js';

export const getTaxPayments = async (req, res) => {
  try {
    const taxPayments = await fetchTaxPayments();
    res.status(200).json(taxPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTaxPayment = async (req, res) => {
  try {
    console.log('Données reçues:', req.body); // Ajoutez ce log
    const tax = req.body;
    const result = await createTaxPayment(tax);
    console.log('Résultat insertion:', result); // Log du résultat
    res.status(201).json({ id: result.insertId, ...tax });
  } catch (error) {
    console.error('Erreur SQL:', error); // Log détaillé des erreurs
    res.status(500).json({ error: error.message });
  }
};
export const updateTaxStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await changeTaxStatus(id, status);
    res.status(200).json({ message: 'Statut mis à jour' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};