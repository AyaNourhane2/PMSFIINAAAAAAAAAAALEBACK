// src/services/CleaningService.js
import CleaningModel from '../models/CleaningModel.js';

class CleaningService {
  static async getInventory() {
    return await CleaningModel.getAllInventoryItems();
  }

  static async updateInventory(id, quantity) {
    return await CleaningModel.updateInventoryItem(id, quantity);
  }

  static async createOrder(productId, productName, quantity) {
    return await CleaningModel.createOrder(productId, productName, quantity);
  }

  static async getOrders() {
    return await CleaningModel.getAllOrders();
  }
}

export default CleaningService;