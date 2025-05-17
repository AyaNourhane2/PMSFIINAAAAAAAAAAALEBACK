import express from 'express';
import { getInventoryOrders, addInventoryOrder } from '../controllers/inventoryOrderController.js';

const router = express.Router();

router.get('/', getInventoryOrders);
router.post('/', addInventoryOrder);

export default router;