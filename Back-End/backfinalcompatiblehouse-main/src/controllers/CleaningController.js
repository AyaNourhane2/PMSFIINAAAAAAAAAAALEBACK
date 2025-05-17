// src/controllers/CleaningController.js
import CleaningService from '../services/CleaningService.js';

class CleaningController {
  static async getInventory(req, res) {
    try {
      const inventory = await CleaningService.getInventory();
      res.status(200).json(inventory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateInventory(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const updatedItem = await CleaningService.updateInventory(id, quantity);
      res.status(200).json(updatedItem);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async createOrder(req, res) {
    try {
      const { productId, productName, quantity } = req.body;
      const newOrder = await CleaningService.createOrder(productId, productName, quantity);
      res.status(201).json(newOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getOrders(req, res) {
    try {
      const orders = await CleaningService.getOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default CleaningController;