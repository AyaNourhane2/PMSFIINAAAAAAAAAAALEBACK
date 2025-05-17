import express from 'express';
import { getTaxPayments, addTaxPayment, updateTaxStatus } from '../controllers/taxPaymentController.js';

const router = express.Router();

router.get('/', getTaxPayments);
router.post('/', addTaxPayment);
router.put('/:id', updateTaxStatus);

export default router;