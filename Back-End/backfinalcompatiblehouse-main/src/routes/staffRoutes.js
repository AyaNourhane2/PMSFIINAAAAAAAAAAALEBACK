import express from 'express';
import * as staffController from '../controllers/staffController.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const staff = await staffController.getAllStaff();
    res.status(200).json(staff);
  } catch (error) {
    console.error('Erreur GET /api/staff:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération du personnel',
      error: error.message 
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nom, position, performance } = req.body;

    if (!nom || !position || performance === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tous les champs sont requis' 
      });
    }

    const staff = await staffController.createStaff({ 
      nom, 
      position, 
      performance: parseFloat(performance) 
    });
    
    res.status(201).json({ 
      success: true, 
      data: staff 
    });
  } catch (error) {
    console.error('Erreur POST /api/staff:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur lors de l\'ajout',
      error: error.message 
    });
  }
});

export default router;