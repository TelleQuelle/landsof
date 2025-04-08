// server/controllers/user-controller.js
const { User, UserProgress, UserInventory, ShopItem, LevelStat } = require('../models');
const { sequelize } = require('../db/db-connection');
const { addReferralBonus } = require('./referral-controller');

// Получение профиля пользователя
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    
    // Получаем пользователя со всеми связанными данными
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
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
    console.error('Get user profile error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get user profile'
    });
  }
};

// Обновление профиля пользователя
const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { username } = req.body;
    
    if (username && (username.length < 3 || username.length > 30)) {
      return res.status(400).json({
        error: true,
        message: 'Username must be between 3 and 30 characters'
      });
    }
    
    // Обновляем профиль пользователя
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Обновляем только разрешенные поля
    if (username) {
      user.username = username;
    }
    
    await user.save();
    
    return res.status(200).json({
      error: false,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to update user profile'
    });
  }
};

// Получение прогресса пользователя
const getUserProgress = async (req, res) => {
  try {
    const { id } = req.user;
    
    // Получаем прогресс пользователя
    const progress = await UserProgress.findOne({
      where: { userId: id },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    if (!progress) {
      return res.status(404).json({
        error: true,
        message: 'User progress not found'
      });
    }
    
    // Получаем статистику уровней
    const levelStats = await LevelStat.findAll({
      where: { userId: id },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    return res.status(200).json({
      error: false,
      progress,
      levelStats
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get user progress'
    });
  }
};

// Обновление прогресса пользователя
const updateUserProgress = async (req, res) => {
  try {
    const { id } = req.user;
    const { 
      campaignProgress, 
      campaignCompleted, 
      selectedDice, 
      selectedCards, 
      tutorialCompleted,
      levelStats 
    } = req.body;
    
    // Выполняем транзакцию
    const result = await sequelize.transaction(async (t) => {
      // Обновляем прогресс пользователя
      const progress = await UserProgress.findOne({
        where: { userId: id },
        transaction: t
      });
      
      if (!progress) {
        throw new Error('User progress not found');
      }
      
      // Обновляем только разрешенные поля
      if (campaignProgress !== undefined) progress.campaignProgress = campaignProgress;
      if (campaignCompleted !== undefined) progress.campaignCompleted = campaignCompleted;
      if (selectedDice !== undefined) progress.selectedDice = selectedDice;
      if (selectedCards !== undefined) progress.selectedCards = selectedCards;
      if (tutorialCompleted !== undefined) progress.tutorialCompleted = tutorialCompleted;
      
      await progress.save({ transaction: t });
      
      // Обновляем статистику уровней, если она предоставлена
      if (levelStats && Array.isArray(levelStats)) {
        for (const stat of levelStats) {
          if (!stat.levelId) continue;
          
          // Ищем существующую статистику для этого уровня
          let levelStat = await LevelStat.findOne({
            where: { userId: id, levelId: stat.levelId },
            transaction: t
          });
          
          // Если статистика не найдена, создаем новую
          if (!levelStat) {
            levelStat = await LevelStat.create({
              userId: id,
              levelId: stat.levelId,
              attempts: 0,
              completions: 0,
              bestScore: 0,
              totalSilverEarned: 0,
              transaction: t
            });
          }
          
          // Обновляем поля статистики
          if (stat.attempts !== undefined) levelStat.attempts += stat.attempts;
          if (stat.completions !== undefined) levelStat.completions += stat.completions;
          if (stat.score !== undefined && stat.score > levelStat.bestScore) {
            levelStat.bestScore = stat.score;
          }
          if (stat.turns !== undefined && 
             (levelStat.bestTurns === null || stat.turns < levelStat.bestTurns)) {
            levelStat.bestTurns = stat.turns;
          }
          if (stat.silverEarned !== undefined) {
            levelStat.totalSilverEarned += stat.silverEarned;
          }
          if (stat.completions > 0 && !levelStat.firstCompletedAt) {
            levelStat.firstCompletedAt = new Date();
          }
          
          levelStat.lastPlayedAt = new Date();
          
          await levelStat.save({ transaction: t });
        }
      }
      
      return progress;
    });
    
    // Отправляем обновленный прогресс
    return res.status(200).json({
      error: false,
      message: 'Progress updated successfully',
      progress: result
    });
  } catch (error) {
    console.error('Update user progress error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to update user progress'
    });
  }
};

// Получение инвентаря пользователя
const getUserInventory = async (req, res) => {
  try {
    const { id } = req.user;
    
    // Получаем инвентарь пользователя с информацией о предметах
    const inventory = await UserInventory.findAll({
      where: { userId: id },
      include: [
        {
          model: ShopItem,
          as: 'item',
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        }
      ],
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    return res.status(200).json({
      error: false,
      inventory
    });
  } catch (error) {
    console.error('Get user inventory error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get user inventory'
    });
  }
};

// Добавление серебра пользователю
const addSilver = async (req, res) => {
  try {
    const { id } = req.user;
    const { amount, source } = req.body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        error: true,
        message: 'Invalid amount of silver'
      });
    }
    
    // Обновляем количество серебра у пользователя
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    user.silver += amount;
    await user.save();
    
    // Логируем операцию (в будущем)
    // await SilverTransaction.create({
    //   userId: id,
    //   amount,
    //   source,
    //   balance: user.silver
    // });

    // Начисляем реферальный бонус, если у пользователя есть реферрер
    await addReferralBonus(id, amount, source || 'game_reward');
    
    return res.status(200).json({
      error: false,
      message: 'Silver added successfully',
      silver: user.silver
    });
  } catch (error) {
    console.error('Add silver error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to add silver'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserProgress,
  updateUserProgress,
  getUserInventory,
  addSilver
};