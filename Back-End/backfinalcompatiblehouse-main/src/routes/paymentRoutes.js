import express from 'express';
import { getPayments, addPayment } from '../controllers/paymentController.js';

const router = express.Router();
router.get('/', getPayments);
router.post('/', addPayment);

export default router;