// server/controllers/shop-controller.js
const { ShopItem, User, UserInventory } = require('../models');
const { sequelize } = require('../db/db-connection');

// Получение всех предметов из магазина
const getAllItems = async (req, res) => {
  try {
    // Получаем все предметы из магазина
    const items = await ShopItem.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    return res.status(200).json({
      error: false,
      items
    });
  } catch (error) {
    console.error('Get all shop items error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get shop items'
    });
  }
};

// Получение предмета по ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Получаем предмет по ID
    const item = await ShopItem.findByPk(id, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    if (!item) {
      return res.status(404).json({
        error: true,
        message: 'Item not found'
      });
    }
    
    return res.status(200).json({
      error: false,
      item
    });
  } catch (error) {
    console.error('Get shop item error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get shop item'
    });
  }
};

// Покупка предмета в магазине
const purchaseItem = async (req, res) => {
  try {
    const { id } = req.user;
    const { itemId } = req.body;
    
    if (!itemId) {
      return res.status(400).json({
        error: true,
        message: 'Item ID is required'
      });
    }
    
    // Выполняем транзакцию
    const result = await sequelize.transaction(async (t) => {
      // Получаем предмет
      const item = await ShopItem.findByPk(itemId, { transaction: t });
      
      if (!item) {
        throw new Error('Item not found');
      }
      
      // Получаем пользователя
      const user = await User.findByPk(id, { transaction: t });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Проверяем, достаточно ли у пользователя серебра
      if (user.silver < item.price) {
        throw new Error('Not enough silver');
      }
      
      // Проверяем, есть ли уже у пользователя этот предмет
      const existingItem = await UserInventory.findOne({
        where: {
          userId: id,
          itemId
        },
        transaction: t
      });
      
      if (existingItem) {
        throw new Error('Item already owned');
      }
      
      // Списываем серебро
      user.silver -= item.price;
      await user.save({ transaction: t });
      
      // Добавляем предмет в инвентарь
      const inventoryItem = await UserInventory.create({
        userId: id,
        itemId,
        purchasePrice: item.price,
        obtainedAt: new Date()
      }, { transaction: t });
      
      return {
        user,
        item,
        inventoryItem
      };
    });
    
    return res.status(200).json({
      error: false,
      message: 'Item purchased successfully',
      silver: result.user.silver,
      item: result.item
    });
  } catch (error) {
    console.error('Purchase item error:', error);
    
    // Обрабатываем разные типы ошибок
    if (error.message === 'Item not found') {
      return res.status(404).json({
        error: true,
        message: 'Item not found'
      });
    } else if (error.message === 'Not enough silver') {
      return res.status(400).json({
        error: true,
        message: 'Not enough silver'
      });
    } else if (error.message === 'Item already owned') {
      return res.status(400).json({
        error: true,
        message: 'You already own this item'
      });
    }
    
    return res.status(500).json({
      error: true,
      message: 'Failed to purchase item'
    });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  purchaseItem
};