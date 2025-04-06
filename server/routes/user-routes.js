// server/routes/user-routes.js
const express = require('express');
const { authenticateJWT } = require('../middleware/auth-middleware');
const { 
  getUserProfile, 
  updateUserProfile, 
  getUserProgress, 
  updateUserProgress, 
  getUserInventory,
  addSilver
} = require('../controllers/user-controller');

const router = express.Router();

/**
 * @route GET /api/users/profile
 * @desc Получение профиля пользователя
 * @access Private
 */
router.get('/profile', authenticateJWT, getUserProfile);

/**
 * @route PUT /api/users/profile
 * @desc Обновление профиля пользователя
 * @access Private
 */
router.put('/profile', authenticateJWT, updateUserProfile);

/**
 * @route GET /api/users/progress
 * @desc Получение прогресса пользователя
 * @access Private
 */
router.get('/progress', authenticateJWT, getUserProgress);

/**
 * @route PUT /api/users/progress
 * @desc Обновление прогресса пользователя
 * @access Private
 */
router.put('/progress', authenticateJWT, updateUserProgress);

/**
 * @route GET /api/users/inventory
 * @desc Получение инвентаря пользователя
 * @access Private
 */
router.get('/inventory', authenticateJWT, getUserInventory);

/**
 * @route POST /api/users/silver
 * @desc Добавление серебра пользователю
 * @access Private
 */
router.post('/silver', authenticateJWT, addSilver);

module.exports = router;