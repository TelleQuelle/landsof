// server/models/referral-bonus.js
const { Model, DataTypes } = require('sequelize');

class ReferralBonus extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      referralId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'referrals',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'level_completion'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      modelName: 'referralBonus',
      tableName: 'referral_bonuses',
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          fields: ['referralId']
        }
      ]
    });
  }
}

module.exports = ReferralBonus;