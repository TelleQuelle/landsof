// server/models/index.js
const User = require('./user');
const UserProgress = require('./user-progress');
const ShopItem = require('./shop-item');
const UserInventory = require('./user-inventory');
const LevelStat = require('./level-stat');
const NFT = require('./nft');

// Функция для инициализации моделей и их ассоциаций
const initializeModels = (sequelize) => {
  // Инициализация моделей
  User.init(sequelize);
  UserProgress.init(sequelize);
  ShopItem.init(sequelize);
  UserInventory.init(sequelize);
  LevelStat.init(sequelize);
  NFT.init(sequelize);
  
  // Определение ассоциаций между моделями
  
  // Пользователь имеет один прогресс
  User.hasOne(UserProgress, {
    foreignKey: 'userId',
    as: 'progress'
  });
  UserProgress.belongsTo(User, {
    foreignKey: 'userId'
  });
  
  // Пользователь имеет много предметов в инвентаре
  User.hasMany(UserInventory, {
    foreignKey: 'userId',
    as: 'inventory'
  });
  UserInventory.belongsTo(User, {
    foreignKey: 'userId'
  });
  
  // Предмет магазина имеет много записей в инвентаре пользователей
  ShopItem.hasMany(UserInventory, {
    foreignKey: 'itemId'
  });
  UserInventory.belongsTo(ShopItem, {
    foreignKey: 'itemId',
    as: 'item'
  });
  
  // Пользователь имеет много статистик уровней
  User.hasMany(LevelStat, {
    foreignKey: 'userId',
    as: 'levelStats'
  });
  LevelStat.belongsTo(User, {
    foreignKey: 'userId'
  });
  
  // Пользователь имеет много NFT
  User.hasMany(NFT, {
    foreignKey: 'userId',
    as: 'nfts'
  });
  NFT.belongsTo(User, {
    foreignKey: 'userId'
  });
};

module.exports = {
  User,
  UserProgress,
  ShopItem,
  UserInventory,
  LevelStat,
  NFT,
  initializeModels
};