// server/routes/shop-routes.js
const express = require('express');
const { authenticateJWT } = require('../middleware/auth-middleware');
const { 
  getAllItems, 
  getItemById, 
  purchaseItem 
} = require('../controllers/shop-controller');

const router = express.Router();

/**
 * @route GET /api/shop/items
 * @desc Получение всех предметов из магазина
 * @access Public
 */
router.get('/items', getAllItems);

/**
 * @route GET /api/shop/items/:id
 * @desc Получение предмета по ID
 * @access Public
 */
router.get('/items/:id', getItemById);

/**
 * @route POST /api/shop/purchase
 * @desc Покупка предмета в магазине
 * @access Private
 */
router.post('/purchase', authenticateJWT, purchaseItem);

module.exports = router;