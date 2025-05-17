import { fetchInventoryOrders, createInventoryOrder } from '../services/inventoryOrderService.js';

export const getInventoryOrders = async (req, res) => {
  try {
    const orders = await fetchInventoryOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addInventoryOrder = async (req, res) => {
  try {
    const order = req.body;
    const result = await createInventoryOrder(order);
    res.status(201).json({ id: result.insertId, ...order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};