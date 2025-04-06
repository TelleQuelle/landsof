// server/controllers/nft-controller.js
const { NFT, User, UserProgress } = require('../models');
const { mintNFTOnSolana } = require('../utils/solana-utils');
const config = require('../config');

// Mint NFT
const mintNFT = async (req, res) => {
  try {
    const { id } = req.user;
    const { type, signature, message } = req.body;
    
    if (!type || !signature || !message) {
      return res.status(400).json({
        error: true,
        message: 'Type, signature, and message are required'
      });
    }
    
    // Проверяем, что пользователь имеет право на минтинг NFT
    // Для NFT типа 'freedom_scroll' пользователь должен завершить всю кампанию
    if (type === 'freedom_scroll') {
      const progress = await UserProgress.findOne({
        where: { userId: id }
      });
      
      if (!progress || !progress.campaignCompleted) {
        return res.status(403).json({
          error: true,
          message: 'Campaign must be completed to mint Freedom Scroll NFT'
        });
      }
      
      // Проверяем, что у пользователя еще нет такого NFT
      const existingNFT = await NFT.findOne({
        where: {
          userId: id,
          type: 'freedom_scroll'
        }
      });
      
      if (existingNFT) {
        return res.status(400).json({
          error: true,
          message: 'You already have a Freedom Scroll NFT'
        });
      }
    } else {
      return res.status(400).json({
        error: true,
        message: 'Invalid NFT type'
      });
    }
    
    // Получаем пользователя для получения адреса кошелька
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Создаем NFT в базе данных со статусом 'pending'
    const nft = await NFT.create({
      userId: id,
      type,
      name: type === 'freedom_scroll' ? 'Freedom Scroll' : 'Unknown NFT',
      description: type === 'freedom_scroll' 
        ? 'This NFT certifies that you have escaped the Abyss of Despair by completing all levels of the campaign.'
        : 'Unknown NFT',
      image: '/images/nft/freedom_scroll.png',
      metadata: {
        username: user.username,
        walletAddress: user.walletAddress,
        createdAt: new Date()
      },
      mintStatus: 'pending'
    });
    
    // Минтинг NFT на блокчейне Solana
    // В реальном приложении здесь будет интеграция с блокчейном
    try {
      // Вызываем функцию для минтинга NFT
      const mintResult = await mintNFTOnSolana(user.walletAddress, {
        name: nft.name,
        description: nft.description,
        image: `${config.baseUrl}${nft.image}`,
        attributes: [
          {
            trait_type: 'Type',
            value: nft.type
          },
          {
            trait_type: 'Creator',
            value: user.username
          }
        ],
        properties: {
          creators: [
            {
              address: user.walletAddress,
              share: 100
            }
          ]
        }
      });
      
      // Обновляем статус NFT после успешного минтинга
      nft.mintAddress = mintResult.mintAddress;
      nft.txHash = mintResult.txHash;
      nft.mintedAt = new Date();
      nft.mintStatus = 'minted';
      await nft.save();
      
      return res.status(200).json({
        error: false,
        message: 'NFT minted successfully',
        nft: {
          id: nft.id,
          type: nft.type,
          name: nft.name,
          description: nft.description,
          image: nft.image,
          mintAddress: nft.mintAddress,
          mintedAt: nft.mintedAt,
          mintStatus: nft.mintStatus,
          txHash: nft.txHash
        }
      });
    } catch (mintError) {
      // Обновляем статус NFT в случае ошибки
      nft.mintStatus = 'failed';
      await nft.save();
      
      console.error('NFT minting error:', mintError);
      
      return res.status(500).json({
        error: true,
        message: 'Failed to mint NFT',
        details: mintError.message
      });
    }
  } catch (error) {
    console.error('Mint NFT error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to mint NFT'
    });
  }
};

// Получение NFT пользователя
const getUserNFTs = async (req, res) => {
  try {
    const { id } = req.user;
    
    // Получаем все NFT пользователя
    const nfts = await NFT.findAll({
      where: { userId: id },
      attributes: { exclude: ['updatedAt'] },
      order: [['createdAt', 'DESC']]
    });
    
    return res.status(200).json({
      error: false,
      nfts
    });
  } catch (error) {
    console.error('Get user NFTs error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get user NFTs'
    });
  }
};

// Получение метаданных NFT
const getNFTMetadata = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        error: true,
        message: 'NFT address is required'
      });
    }
    
    // Получаем NFT по адресу
    const nft = await NFT.findOne({
      where: { mintAddress: address },
      include: [
        {
          model: User,
          attributes: ['username', 'walletAddress']
        }
      ]
    });
    
    if (!nft) {
      return res.status(404).json({
        error: true,
        message: 'NFT not found'
      });
    }
    
    // Формируем метаданные
    const metadata = {
      name: nft.name,
      description: nft.description,
      image: `${config.baseUrl}${nft.image}`,
      external_url: `${config.baseUrl}/nft/${nft.mintAddress}`,
      attributes: [
        {
          trait_type: 'Type',
          value: nft.type
        },
        {
          trait_type: 'Creator',
          value: nft.User.username
        },
        {
          trait_type: 'Creation Date',
          value: nft.mintedAt ? new Date(nft.mintedAt).toISOString().split('T')[0] : 'Unknown'
        }
      ]
    };
    
    // Добавляем дополнительные метаданные, если они есть
    if (nft.metadata) {
      // Добавляем атрибуты из метаданных NFT
      if (nft.metadata.attributes && Array.isArray(nft.metadata.attributes)) {
        metadata.attributes = [...metadata.attributes, ...nft.metadata.attributes];
      }
      
      // Добавляем любые другие свойства
      for (const [key, value] of Object.entries(nft.metadata)) {
        if (key !== 'attributes' && !metadata[key]) {
          metadata[key] = value;
        }
      }
    }
    
    return res.status(200).json(metadata);
  } catch (error) {
    console.error('Get NFT metadata error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get NFT metadata'
    });
  }
};

module.exports = {
  mintNFT,
  getUserNFTs,
  getNFTMetadata
};