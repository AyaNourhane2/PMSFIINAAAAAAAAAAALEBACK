// src/services/CleaningService.js
import CleaningModel from '../models/CleaningModel.js';

class CleaningService {
  static async getInventory() {
    const inventory = await CleaningModel.getAllInventoryItems();
    return inventory.map(item => ({
      ...item,
      needsRestock: item.quantity <= item.minQuantity,
    }));
  }

  static async updateInventory(id, quantity) {
    if (quantity < 0) {
      throw new Error('La quantité ne peut pas être négative');
    }
    return await CleaningModel.updateInventoryItem(id, quantity);
  }

  static async createOrder(productId, productName, quantity) {
    if (!productId || !productName || !quantity) {
      throw new Error('Tous les champs sont requis');
    }
    return await CleaningModel.createOrder(productId, productName, quantity);
  }

  static async getOrders() {
    return await CleaningModel.getAllOrders();
  }

  static async addProduct({ item, quantity, minQuantity, category, photoUrl }) {
    if (!item || quantity < 0 || minQuantity < 0 || !category) {
      throw new Error('Tous les champs sont requis et doivent être valides');
    }
    return await CleaningModel.addProduct({ item, quantity, minQuantity, category, photoUrl });
  }
}

export default CleaningService;