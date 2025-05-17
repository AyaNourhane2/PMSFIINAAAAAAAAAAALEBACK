// services/taxPaymentService.js
import { getTaxPayments, addTaxPayment, updateTaxStatus } from '../models/taxPaymentModel.js';

export const fetchTaxPayments = async () => {
  return await getTaxPayments();
};

export const createTaxPayment = async (tax) => {
  return await addTaxPayment(tax);
};

export const changeTaxStatus = async (id, status) => {
  return await updateTaxStatus(id, status);
};