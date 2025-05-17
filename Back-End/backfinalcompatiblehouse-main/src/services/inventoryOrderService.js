import { getInventoryOrders, addInventoryOrder } from '../models/inventoryOrderModel.js';

export const fetchInventoryOrders = async () => {
  return await getInventoryOrders();
};

export const createInventoryOrder = async (order) => {
  return await addInventoryOrder(order);
};