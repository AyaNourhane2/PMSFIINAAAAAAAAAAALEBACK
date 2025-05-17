// services/paymentService.js
import { getPayments, addPayment } from '../models/paymentModel.js';

export const fetchPayments = async () => {
  return await getPayments();
};

export const createPayment = async (payment) => {
  return await addPayment(payment);
};