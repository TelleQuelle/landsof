// server/models/shop-item.js
const { Model, DataTypes } = require('sequelize');

class ShopItem extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: DataTypes.ENUM('card_skin', 'dice_skin', 'special_card', 'special_dice'),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      rarity: {
        type: DataTypes.ENUM('Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Partner'),
        allowNull: false,
        defaultValue: 'Common'
      },
      cardType: {
        type: DataTypes.STRING,
        allowNull: true // Только для карт
      },
      effect: {
        type: DataTypes.STRING,
        allowNull: true // Только для специальных предметов
      },
      mainImage: {
        type: DataTypes.STRING, // Путь к файлу или URL
        allowNull: false
      },
      diceImages: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Массив путей или URL для граней кубика
        allowNull: true // Только для кубиков
      },
      isPartner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      partnerInfo: {
        type: DataTypes.JSONB,
        allowNull: true // Только для партнерских предметов
        // { name, description, twitter, discord, logo }
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      modelName: 'shopItem',
      tableName: 'shop_items',
      timestamps: true
    });
  }
}

module.exports = ShopItem;