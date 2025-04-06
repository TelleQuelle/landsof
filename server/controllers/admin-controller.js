// server/controllers/admin-controller.js
const { 
    ShopItem, 
    User, 
    UserProgress, 
    UserInventory, 
    LevelStat, 
    NFT 
  } = require('../models');
  const { sequelize } = require('../db/db-connection');
  const fs = require('fs');
  const path = require('path');
  const config = require('../config');
  
  // Создание нового предмета
  const createItem = async (req, res) => {
    try {
      const {
        type,
        name,
        description,
        price,
        rarity,
        cardType,
        effect,
        isPartner,
        partnerName,
        partnerDescription,
        partnerTwitter,
        partnerDiscord
      } = req.body;
      
      // Проверяем обязательные поля
      if (!type || !name || !description || !price || !rarity) {
        return res.status(400).json({
          error: true,
          message: 'Missing required fields'
        });
      }
      
      // Проверяем тип предмета
      const validTypes = ['card_skin', 'dice_skin', 'special_card', 'special_dice'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          error: true,
          message: 'Invalid item type'
        });
      }
      
      // Для карт проверяем тип карты
      if ((type === 'card_skin' || type === 'special_card') && !cardType) {
        return res.status(400).json({
          error: true,
          message: 'Card type is required for card items'
        });
      }
      
      // Для специальных предметов проверяем эффект
      if ((type === 'special_card' || type === 'special_dice') && !effect) {
        return res.status(400).json({
          error: true,
          message: 'Effect is required for special items'
        });
      }
      
      // Проверяем наличие загруженных файлов
      if (!req.files || !req.files.mainImage) {
        return res.status(400).json({
          error: true,
          message: 'Main image is required'
        });
      }
      
      // Для кубиков проверяем наличие изображений для всех граней
      if (type.includes('dice') && (!req.files.diceImages || req.files.diceImages.length !== 6)) {
        return res.status(400).json({
          error: true,
          message: 'Six dice face images are required for dice items'
        });
      }
      
      // Для партнерских предметов проверяем дополнительные поля
      if (isPartner === 'true') {
        if (!partnerName || !partnerDescription) {
          return res.status(400).json({
            error: true,
            message: 'Partner name and description are required for partner items'
          });
        }
        
        if (!req.files.partnerLogo) {
          return res.status(400).json({
            error: true,
            message: 'Partner logo is required for partner items'
          });
        }
      }
      
      // Генерируем пути к файлам
      const mainImagePath = req.files.mainImage[0].path;
      const mainImageUrl = mainImagePath.replace(config.storage.basePath, '').replace(/\\/g, '/');
      
      // Для кубиков обрабатываем изображения граней
      let diceImagesUrls = [];
      if (type.includes('dice') && req.files.diceImages) {
        diceImagesUrls = req.files.diceImages.map(file => 
          file.path.replace(config.storage.basePath, '').replace(/\\/g, '/')
        );
      }
      
      // Для партнерских предметов обрабатываем логотип
      let partnerLogoUrl = null;
      if (isPartner === 'true' && req.files.partnerLogo) {
        partnerLogoUrl = req.files.partnerLogo[0].path.replace(config.storage.basePath, '').replace(/\\/g, '/');
      }
      
      // Создаем партнерскую информацию, если это партнерский предмет
      let partnerInfo = null;
      if (isPartner === 'true') {
        partnerInfo = {
          name: partnerName,
          description: partnerDescription,
          twitter: partnerTwitter || null,
          discord: partnerDiscord || null,
          logo: partnerLogoUrl
        };
      }
      
      // Создаем предмет в базе данных
      const item = await ShopItem.create({
        type,
        name,
        description,
        price: parseInt(price),
        rarity,
        cardType: cardType || null,
        effect: effect || null,
        mainImage: mainImageUrl,
        diceImages: diceImagesUrls.length > 0 ? diceImagesUrls : null,
        isPartner: isPartner === 'true',
        partnerInfo
      });
      
      return res.status(201).json({
        error: false,
        message: 'Item created successfully',
        item
      });
    } catch (error) {
      console.error('Create item error:', error);
      
      // Удаляем загруженные файлы, если есть ошибка
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      return res.status(500).json({
        error: true,
        message: 'Failed to create item'
      });
    }
  };
  
  // Обновление предмета
  const updateItem = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        rarity,
        effect
      } = req.body;
      
      // Получаем предмет из базы данных
      const item = await ShopItem.findByPk(id);
      
      if (!item) {
        return res.status(404).json({
          error: true,
          message: 'Item not found'
        });
      }
      
      // Обновляем поля предмета
      if (name) item.name = name;
      if (description) item.description = description;
      if (price) item.price = parseInt(price);
      if (rarity) item.rarity = rarity;
      if (effect) item.effect = effect;
      
      // Обновляем изображения, если они были загружены
      if (req.files && req.files.mainImage) {
        // Удаляем старое изображение
        const oldImagePath = path.join(config.storage.basePath, item.mainImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
        
        // Обновляем путь к новому изображению
        const mainImagePath = req.files.mainImage[0].path;
        item.mainImage = mainImagePath.replace(config.storage.basePath, '').replace(/\\/g, '/');
      }
      
      // Для кубиков обновляем изображения граней
      if (item.type.includes('dice') && req.files && req.files.diceImages && req.files.diceImages.length === 6) {
        // Удаляем старые изображения
        if (item.diceImages && Array.isArray(item.diceImages)) {
          item.diceImages.forEach(imagePath => {
            const fullPath = path.join(config.storage.basePath, imagePath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          });
        }
        
        // Обновляем пути к новым изображениям
        item.diceImages = req.files.diceImages.map(file => 
          file.path.replace(config.storage.basePath, '').replace(/\\/g, '/')
        );
      }
      
      // Для партнерских предметов обновляем логотип
      if (item.isPartner && req.files && req.files.partnerLogo) {
        // Удаляем старый логотип
        if (item.partnerInfo && item.partnerInfo.logo) {
          const oldLogoPath = path.join(config.storage.basePath, item.partnerInfo.logo);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        }
        
        // Обновляем путь к новому логотипу
        const partnerLogoPath = req.files.partnerLogo[0].path;
        const partnerLogoUrl = partnerLogoPath.replace(config.storage.basePath, '').replace(/\\/g, '/');
        
        // Обновляем партнерскую информацию
        if (!item.partnerInfo) {
          item.partnerInfo = {};
        }
        
        item.partnerInfo.logo = partnerLogoUrl;
      }
      
      // Сохраняем обновленный предмет
      await item.save();
      
      return res.status(200).json({
        error: false,
        message: 'Item updated successfully',
        item
      });
    } catch (error) {
      console.error('Update item error:', error);
      
      // Удаляем загруженные файлы, если есть ошибка
      if (req.files) {
        Object.values(req.files).flat().forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }
      
      return res.status(500).json({
        error: true,
        message: 'Failed to update item'
      });
    }
  };
  
  // Удаление предмета
  const deleteItem = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Получаем предмет из базы данных
      const item = await ShopItem.findByPk(id);
      
      if (!item) {
        return res.status(404).json({
          error: true,
          message: 'Item not found'
        });
      }
      
      // Проверяем, есть ли предмет у пользователей
      const inventoryItems = await UserInventory.findAll({
        where: { itemId: id }
      });
      
      if (inventoryItems.length > 0) {
        return res.status(400).json({
          error: true,
          message: 'Cannot delete item that is owned by users'
        });
      }
      
      // Удаляем изображения
      if (item.mainImage) {
        const mainImagePath = path.join(config.storage.basePath, item.mainImage);
        if (fs.existsSync(mainImagePath)) {
          fs.unlinkSync(mainImagePath);
        }
      }
      
      // Для кубиков удаляем изображения граней
      if (item.diceImages && Array.isArray(item.diceImages)) {
        item.diceImages.forEach(imagePath => {
          const fullPath = path.join(config.storage.basePath, imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
      
      // Для партнерских предметов удаляем логотип
      if (item.isPartner && item.partnerInfo && item.partnerInfo.logo) {
        const logoPath = path.join(config.storage.basePath, item.partnerInfo.logo);
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);
        }
      }
      
      // Удаляем предмет из базы данных
      await item.destroy();
      
      return res.status(200).json({
        error: false,
        message: 'Item deleted successfully'
      });
    } catch (error) {
      console.error('Delete item error:', error);
      return res.status(500).json({
        error: true,
        message: 'Failed to delete item'
      });
    }
  };
  
  // Получение статистики игры
  const getGameStatistics = async (req, res) => {
    try {
      // Общее количество пользователей
      const totalUsers = await User.count();
      
      // Активные пользователи (за последние 7 дней)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const activePlayers = await User.count({
        where: {
          lastLoginAt: {
            [sequelize.Op.gte]: sevenDaysAgo
          }
        }
      });
      
      // Прогресс кампании
      const campaignProgress = {};
      
      for (let i = 1; i <= 10; i++) {
        // Количество попыток для каждого уровня
        const attempts = await LevelStat.sum('attempts', {
          where: { levelId: i }
        }) || 0;
        
        // Количество завершений для каждого уровня
        const completions = await LevelStat.sum('completions', {
          where: { levelId: i }
        }) || 0;
        
        campaignProgress[`level${i}`] = {
          attempts,
          completed: completions
        };
      }
      
      // Общее количество игр
      const totalGames = await LevelStat.sum('attempts');
      
      // Самые популярные предметы
      const popularItems = await UserInventory.findAll({
        attributes: [
          'itemId',
          [sequelize.fn('COUNT', sequelize.col('itemId')), 'purchases']
        ],
        include: [
          {
            model: ShopItem,
            as: 'item',
            attributes: ['name', 'type']
          }
        ],
        group: ['itemId', 'item.id'],
        order: [[sequelize.literal('purchases'), 'DESC']],
        limit: 10
      });
      
      // Преобразуем результаты в более удобный формат
      const mostPopularItems = popularItems.map(item => ({
        id: item.itemId,
        name: item.item.name,
        type: item.item.type,
        purchases: parseInt(item.get('purchases'))
      }));
      
      // Общее количество заработанного серебра
      const totalSilverEarned = await LevelStat.sum('totalSilverEarned') || 0;
      
      // Среднее время игры (пока заглушка, может быть реализовано в будущем)
      const averagePlaytime = 28; // минут
      
      // Общее количество потраченного серебра
      const totalSilverSpent = await UserInventory.sum('purchasePrice') || 0;
      
      // Количество созданных NFT
      const nftsMinted = await NFT.count({
        where: {
          mintStatus: 'minted'
        }
      });
      
      // Статистика распределения кошельков (заглушка, в будущем может быть реализовано)
      const walletDistribution = {
        phantom: Math.round(totalUsers * 0.75), // 75% пользователей используют Phantom
        solflare: Math.round(totalUsers * 0.25) // 25% пользователей используют Solflare
      };
      
      return res.status(200).json({
        error: false,
        statistics: {
          totalUsers,
          activePlayers,
          averagePlaytime,
          totalGames,
          campaignProgress,
          mostPopularItems,
          totalSilverEarned,
          totalSilverSpent,
          nftsMinted,
          walletDistribution
        }
      });
    } catch (error) {
      console.error('Get game statistics error:', error);
      return res.status(500).json({
        error: true,
        message: 'Failed to get game statistics'
      });
    }
  };
  
  // Получение списка пользователей
  const getUsersList = async (req, res) => {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;
      
      // Создаем параметры запроса
      const options = {
        attributes: ['id', 'username', 'walletAddress', 'silver', 'lastLoginAt', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      };
      
      // Если есть поисковый запрос, добавляем условие
      if (search) {
        options.where = {
          [sequelize.Op.or]: [
            {
              username: {
                [sequelize.Op.iLike]: `%${search}%`
              }
            },
            {
              walletAddress: {
                [sequelize.Op.iLike]: `%${search}%`
              }
            }
          ]
        };
      }
      
      // Получаем пользователей
      const users = await User.findAndCountAll(options);
      
      return res.status(200).json({
        error: false,
        users: users.rows,
        total: users.count,
        page: parseInt(page),
        totalPages: Math.ceil(users.count / parseInt(limit))
      });
    } catch (error) {
      console.error('Get users list error:', error);
      return res.status(500).json({
        error: true,
        message: 'Failed to get users list'
      });
    }
  };
  
  // Получение подробной информации о пользователе
  const getUserDetails = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Получаем пользователя со всеми связанными данными
      const user = await User.findByPk(id, {
        include: [
          {
            model: UserProgress,
            as: 'progress',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          },
          {
            model: LevelStat,
            as: 'levelStats',
            attributes: { exclude: ['createdAt', 'updatedAt'] }
          },
          {
            model: UserInventory,
            as: 'inventory',
            include: [
              {
                model: ShopItem,
                as: 'item',
                attributes: ['id', 'name', 'type', 'rarity']
              }
            ],
            attributes: ['id', 'obtainedAt', 'purchasePrice', 'isEquipped']
          },
          {
            model: NFT,
            as: 'nfts',
            attributes: ['id', 'type', 'name', 'mintAddress', 'mintedAt', 'mintStatus']
          }
        ],
        attributes: { exclude: ['updatedAt'] }
      });
      
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'User not found'
        });
      }
      
      return res.status(200).json({
        error: false,
        user
      });
    } catch (error) {
      console.error('Get user details error:', error);
      return res.status(500).json({
        error: true,
        message: 'Failed to get user details'
      });
    }
  };
  
  // Редактирование данных пользователя
  const editUserData = async (req, res) => {
    try {
      const { id } = req.params;
      const { username, silver, isAdmin } = req.body;
      
      // Получаем пользователя
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({
          error: true,
          message: 'User not found'
        });
      }
      
      // Обновляем поля пользователя
      if (username !== undefined) {
        if (username.length < 3 || username.length > 30) {
          return res.status(400).json({
            error: true,
            message: 'Username must be between 3 and 30 characters'
          });
        }
        
        user.username = username;
      }
      
      if (silver !== undefined) {
        const silverAmount = parseInt(silver);
        if (isNaN(silverAmount) || silverAmount < 0) {
          return res.status(400).json({
            error: true,
            message: 'Silver amount must be a non-negative number'
          });
        }
        
        user.silver = silverAmount;
      }
      
      if (isAdmin !== undefined) {
        user.isAdmin = isAdmin === 'true' || isAdmin === true;
      }
      
      // Сохраняем обновленного пользователя
      await user.save();
      
      return res.status(200).json({
        error: false,
        message: 'User data updated successfully',
        user
      });
    } catch (error) {
      console.error('Edit user data error:', error);
      return res.status(500).json({
        error: true,
        message: 'Failed to edit user data'
      });
    }
  };
  
  module.exports = {
    createItem,
    updateItem,
    deleteItem,
    getGameStatistics,
    getUsersList,
    getUserDetails,
    editUserData
  };