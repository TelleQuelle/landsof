// server/middleware/auth-middleware.js
const { verifyWalletSignature } = require('../utils/solana-utils');
const { User } = require('../models');
const { ADMIN_ADDRESSES } = require('../config');

// Middleware для аутентификации по подписи кошелька
const authenticateJWT = async (req, res, next) => {
  try {
    const { walletAddress, signature, message } = req.headers;
    
    if (!walletAddress || !signature || !message) {
      return res.status(401).json({
        error: true,
        message: 'Authentication required'
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
    
    // Находим пользователя по адресу кошелька
    const user = await User.findOne({
      where: { walletAddress }
    });
    
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'User not found'
      });
    }
    
    // Добавляем пользователя в объект запроса
    req.user = user;
    
    // Продолжаем выполнение запроса
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      error: true,
      message: 'Authentication failed'
    });
  }
};

// Middleware для проверки прав администратора
const authenticateAdmin = async (req, res, next) => {
  try {
    // Сначала проводим стандартную аутентификацию
    await authenticateJWT(req, res, () => {
      // Проверяем, является ли пользователь администратором
      if (!req.user.isAdmin) {
        return res.status(403).json({
          error: true,
          message: 'Admin access required'
        });
      }
      
      // Продолжаем выполнение запроса
      next();
    });
  } catch (error) {
    console.error('Admin authentication middleware error:', error);
    return res.status(500).json({
      error: true,
      message: 'Authentication failed'
    });
  }
};

module.exports = {
  authenticateJWT,
  authenticateAdmin
};