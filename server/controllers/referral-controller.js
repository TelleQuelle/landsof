// server/controllers/referral-controller.js
const { User, Referral, ReferralBonus } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../db/db-connection');

// Генерация уникального реферального кода для пользователя
const generateReferralCode = async (req, res) => {
  try {
    const { id } = req.user;
    
    // Получаем пользователя
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Если у пользователя уже есть реферальный код, возвращаем его
    if (user.referralCode) {
      return res.status(200).json({
        error: false,
        referralCode: user.referralCode
      });
    }
    
    // Генерируем уникальный код (первые 8 символов UUID v4)
    const referralCode = uuidv4().split('-')[0];
    
    // Обновляем пользователя
    user.referralCode = referralCode;
    await user.save();
    
    return res.status(200).json({
      error: false,
      referralCode
    });
  } catch (error) {
    console.error('Generate referral code error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to generate referral code'
    });
  }
};

// Получение информации о реферальной программе пользователя
const getReferralInfo = async (req, res) => {
  try {
    const { id } = req.user;
    
    // Получаем пользователя с его реферальным кодом
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Если у пользователя нет реферального кода, генерируем его
    if (!user.referralCode) {
      const referralCode = uuidv4().split('-')[0];
      user.referralCode = referralCode;
      await user.save();
    }
    
    // Получаем список пользователей, приглашенных текущим пользователем
    const referrals = await Referral.findAll({
      where: { referrerId: id },
      include: [
        {
          model: User,
          as: 'referredUser',
          attributes: ['id', 'username', 'createdAt']
        },
        {
          model: ReferralBonus,
          as: 'bonuses',
          attributes: ['amount', 'source', 'createdAt']
        }
      ]
    });
    
    // Получаем информацию о том, кто пригласил пользователя
    const referrer = await Referral.findOne({
      where: { referredId: id },
      include: [
        {
          model: User,
          as: 'referrerUser',
          attributes: ['id', 'username']
        }
      ]
    });
    
    // Формируем статистику
    const referralStats = {
      referralCode: user.referralCode,
      referralLink: `${req.protocol}://${req.get('host')}/join?ref=${user.referralCode}`,
      totalReferrals: referrals.length,
      totalBonus: user.totalReferralBonus,
      referralsList: referrals.map(ref => ({
        username: ref.referredUser.username,
        joinedAt: ref.referredUser.createdAt,
        totalBonus: ref.totalBonus,
        recentBonuses: ref.bonuses.slice(0, 5).map(bonus => ({
          amount: bonus.amount,
          source: bonus.source,
          date: bonus.createdAt
        }))
      })),
      referrer: referrer ? {
        username: referrer.referrerUser.username
      } : null
    };
    
    return res.status(200).json({
      error: false,
      referralStats
    });
  } catch (error) {
    console.error('Get referral info error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to get referral information'
    });
  }
};

// Применение реферального кода при регистрации
const applyReferralCode = async (req, res) => {
  try {
    const { id } = req.user;
    const { referralCode } = req.body;
    
    if (!referralCode) {
      return res.status(400).json({
        error: true,
        message: 'Referral code is required'
      });
    }
    
    // Находим пользователя, которому принадлежит код
    const referrer = await User.findOne({
      where: { referralCode }
    });
    
    if (!referrer) {
      return res.status(404).json({
        error: true,
        message: 'Invalid referral code'
      });
    }
    
    // Проверяем, что реферрер не пытается пригласить сам себя
    if (referrer.id === id) {
      return res.status(400).json({
        error: true,
        message: 'You cannot refer yourself'
      });
    }
    
    // Проверяем, что пользователь еще не имеет реферрера
    const existingReferral = await Referral.findOne({
      where: { referredId: id }
    });
    
    if (existingReferral) {
      return res.status(400).json({
        error: true,
        message: 'You already have a referrer'
      });
    }
    
    // Создаем новую реферальную связь
    await Referral.create({
      referrerId: referrer.id,
      referredId: id
    });
    
    return res.status(200).json({
      error: false,
      message: 'Referral code applied successfully',
      referrer: {
        username: referrer.username
      }
    });
  } catch (error) {
    console.error('Apply referral code error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to apply referral code'
    });
  }
};

// Функция для начисления реферального бонуса
// Используется в других контроллерах
const addReferralBonus = async (userId, amount, source) => {
  try {
    // Начинаем транзакцию
    const result = await sequelize.transaction(async (t) => {
      // Находим реферальную связь
      const referral = await Referral.findOne({
        where: { referredId: userId },
        include: [
          {
            model: User,
            as: 'referrerUser'
          }
        ],
        transaction: t
      });
      
      // Если реферальной связи нет, просто возвращаем null
      if (!referral) {
        return null;
      }
      
      // Рассчитываем бонус (20% от заработанного серебра)
      const bonusAmount = Math.floor(amount * 0.2);
      
      // Создаем запись о бонусе
      const bonus = await ReferralBonus.create({
        referralId: referral.id,
        amount: bonusAmount,
        source
      }, { transaction: t });
      
      // Обновляем общий бонус в реферальной связи
      referral.totalBonus += bonusAmount;
      await referral.save({ transaction: t });
      
      // Начисляем бонус реферреру
      const referrer = referral.referrerUser;
      referrer.silver += bonusAmount;
      referrer.totalReferralBonus += bonusAmount;
      await referrer.save({ transaction: t });
      
      return {
        bonus,
        referrer
      };
    });
    
    return result;
  } catch (error) {
    console.error('Add referral bonus error:', error);
    return null;
  }
};

module.exports = {
  generateReferralCode,
  getReferralInfo,
  applyReferralCode,
  addReferralBonus
};