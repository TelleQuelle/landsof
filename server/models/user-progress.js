// server/models/user-progress.js
const { Model, DataTypes } = require('sequelize');

class UserProgress extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      campaignProgress: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [
          { id: 1, unlocked: true, completed: false },
          { id: 2, unlocked: false, completed: false },
          { id: 3, unlocked: false, completed: false },
          { id: 4, unlocked: false, completed: false },
          { id: 5, unlocked: false, completed: false },
          { id: 6, unlocked: false, completed: false },
          { id: 7, unlocked: false, completed: false },
          { id: 8, unlocked: false, completed: false },
          { id: 9, unlocked: false, completed: false },
          { id: 10, unlocked: false, completed: false }
        ]
      },
      campaignCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      selectedDice: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: ['base_dice', 'base_dice']
      },
      selectedCards: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {} // Будет заполняться в формате { cardType: { skin: skinId, special: specialId } }
      },
      tutorialCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      totalGamesPlayed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalWins: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalLosses: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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
      modelName: 'userProgress',
      tableName: 'user_progress',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['userId']
        }
      ]
    });
  }
}

module.exports = UserProgress;