// server/routes/admin-routes.js
const express = require('express');
const { authenticateAdmin } = require('../middleware/auth-middleware');
const { 
  createItem, 
  updateItem, 
  deleteItem, 
  getGameStatistics,
  getUsersList,
  getUserDetails,
  editUserData
} = require('../controllers/admin-controller');
const { upload } = require('../middleware/upload-middleware');

const router = express.Router();

/**
 * @route POST /api/admin/items
 * @desc Создание нового предмета
 * @access Admin
 */
router.post('/items', authenticateAdmin, upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'diceImages', maxCount: 6 },
  { name: 'partnerLogo', maxCount: 1 }
]), createItem);

/**
 * @route PUT /api/admin/items/:id
 * @desc Обновление предмета
 * @access Admin
 */
router.put('/items/:id', authenticateAdmin, upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'diceImages', maxCount: 6 },
  { name: 'partnerLogo', maxCount: 1 }
]), updateItem);

/**
 * @route DELETE /api/admin/items/:id
 * @desc Удаление предмета
 * @access Admin
 */
router.delete('/items/:id', authenticateAdmin, deleteItem);

/**
 * @route GET /api/admin/stats
 * @desc Получение статистики игры
 * @access Admin
 */
router.get('/stats', authenticateAdmin, getGameStatistics);

/**
 * @route GET /api/admin/users
 * @desc Получение списка пользователей
 * @access Admin
 */
router.get('/users', authenticateAdmin, getUsersList);

/**
 * @route GET /api/admin/users/:id
 * @desc Получение подробной информации о пользователе
 * @access Admin
 */
router.get('/users/:id', authenticateAdmin, getUserDetails);

/**
 * @route PUT /api/admin/users/:id
 * @desc Редактирование данных пользователя
 * @access Admin
 */
router.put('/users/:id', authenticateAdmin, editUserData);

module.exports = router;