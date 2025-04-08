// server/controllers/auth-controller.js
const { User, UserProgress } = require('../models');
const { verifyWalletSignature } = require('../utils/solana-utils');
const { ADMIN_ADDRESSES } = require('../config');

// Верификация подписи кошелька и аутентификация пользователя
const authenticateWallet = async (req, res) => {
  try {
    const { walletAddress, signature, message, referralCode } = req.body;
    
    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        error: true,
        message: 'Wallet address, signature, and message are required'
      });
    }
    
    // Верифицируем подпись кошелька
    const isValid = await verifyWalletSignature(walletAddress, signature, message);
    
    if (!isValid) {
      return res.status(401).json({
        error: true,
        message: 'Invalid signature'
      });
    }
    
    // Проверяем, существует ли пользователь с таким адресом кошелька
    let user = await User.findOne({
      where: { walletAddress },
      include: [{ model: UserProgress, as: 'progress' }]
    });
    
    // Если пользователь не существует, создаем нового
    if (!user) {
      // Проверяем, является ли адрес кошелька адресом администратора
      const isAdmin = ADMIN_ADDRESSES.includes(walletAddress);
      
      // Создаем пользователя
      user = await User.create({
        walletAddress,
        username: `Player_${Math.floor(Math.random() * 10000)}`, // Временное имя
        isAdmin,
        lastLoginAt: new Date(),
        silver: 0,
        referralCode: null,
        totalReferralBonus: 0
      });
      
      // Создаем прогресс пользователя
      await UserProgress.create({
        userId: user.id
      });
      
      // Если указан реферальный код, применяем его
      if (referralCode) {
        // Находим пользователя, которому принадлежит код
        const referrer = await User.findOne({
          where: { referralCode }
        });
        
        if (referrer && referrer.id !== user.id) {
          // Создаем новую реферальную связь
          await Referral.create({
            referrerId: referrer.id,
            referredId: user.id
          });
        }
      }
      
      // Получаем созданного пользователя с прогрессом
      user = await User.findOne({
        where: { id: user.id },
        include: [{ model: UserProgress, as: 'progress' }]
      });
    } else {
      // Обновляем время последнего входа
      await user.update({ lastLoginAt: new Date() });
    }
    
    // Возвращаем данные пользователя
    return res.status(200).json({
      error: false,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        silver: user.silver,
        isAdmin: user.isAdmin,
        lastLoginAt: user.lastLoginAt,
        progress: user.progress,
        referralCode: user.referralCode,
        totalReferralBonus: user.totalReferralBonus
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      error: true,
      message: 'Authentication failed'
    });
  }
};

// Обновление имени пользователя
const updateUsername = async (req, res) => {
  try {
    const { walletAddress, username } = req.body;
    
    if (!walletAddress || !username) {
      return res.status(400).json({
        error: true,
        message: 'Wallet address and username are required'
      });
    }
    
    // Проверяем валидность имени пользователя
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        error: true,
        message: 'Username must be between 3 and 30 characters'
      });
    }
    
    // Находим пользователя по адресу кошелька
    const user = await User.findOne({
      where: { walletAddress }
    });
    
    if (!user) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Обновляем имя пользователя
    await user.update({ username });
    
    return res.status(200).json({
      error: false,
      message: 'Username updated successfully',
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Update username error:', error);
    return res.status(500).json({
      error: true,
      message: 'Failed to update username'
    });
  }
};

module.exports = {
  authenticateWallet,
  updateUsername
};