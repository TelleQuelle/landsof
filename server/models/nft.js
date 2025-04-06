// server/models/nft.js
const { Model, DataTypes } = require('sequelize');

class NFT extends Model {
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
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
      image: {
        type: DataTypes.STRING, // URL или путь к изображению
        allowNull: false
      },
      mintAddress: {
        type: DataTypes.STRING,
        allowNull: true // Будет заполнено после минтинга
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      mintedAt: {
        type: DataTypes.DATE,
        allowNull: true // Будет заполнено после минтинга
      },
      mintStatus: {
        type: DataTypes.ENUM('pending', 'minted', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      txHash: {
        type: DataTypes.STRING,
        allowNull: true // Хеш транзакции минтинга
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
      modelName: 'nft',
      tableName: 'nfts',
      timestamps: true,
      indexes: [
        {
          fields: ['userId']
        },
        {
          unique: true,
          fields: ['mintAddress'],
          where: {
            mintAddress: {
              [sequelize.Sequelize.Op.ne]: null
            }
          }
        }
      ]
    });
  }
}

module.exports = NFT;