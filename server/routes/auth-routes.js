// server/routes/auth-routes.js
const express = require('express');
const { authenticateWallet, updateUsername } = require('../controllers/auth-controller');
const { authenticateJWT } = require('../middleware/auth-middleware');

const router = express.Router();

/**
 * @route POST /api/auth/wallet
 * @desc Аутентификация пользователя через кошелек Solana
 * @access Public
 */
router.post('/wallet', authenticateWallet);

/**
 * @route PUT /api/auth/username
 * @desc Обновление имени пользователя
 * @access Private
 */
router.put('/username', authenticateJWT, updateUsername);

module.exports = router;