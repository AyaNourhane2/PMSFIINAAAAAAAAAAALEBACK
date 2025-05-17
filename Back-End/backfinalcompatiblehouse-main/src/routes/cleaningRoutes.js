// routes/cleaningRoutes.js
import express from 'express';
import CleaningController from '../controllers/CleaningController.js';

const router = express.Router();

// Inventory routes
router.get('/inventory', CleaningController.getInventory);
router.put('/inventory/:id', CleaningController.updateInventory);
router.post('/inventory', CleaningController.addProduct);

// Order routes
router.post('/orders', CleaningController.createOrder);
router.get('/orders', CleaningController.getOrders);

export default router;