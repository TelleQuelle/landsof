// server/models/level-stat.js
const { Model, DataTypes } = require('sequelize');

class LevelStat extends Model {
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
      levelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 10 // У нас 10 уровней кампании
        }
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      completions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      bestScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      bestTurns: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      totalSilverEarned: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      lastPlayedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      firstCompletedAt: {
        type: DataTypes.DATE,
        allowNull: true
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
      modelName: 'levelStat',
      tableName: 'level_stats',
      timestamps: true,
      indexes: [
        {
          fields: ['userId']
        },
        {
          fields: ['levelId']
        },
        {
          unique: true,
          fields: ['userId', 'levelId']
        }
      ]
    });
  }
}

module.exports = LevelStat;