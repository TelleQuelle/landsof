// server/routes/referral-routes.js
const express = require('express');
const { authenticateJWT } = require('../middleware/auth-middleware');
const { 
  generateReferralCode, 
  getReferralInfo, 
  applyReferralCode 
} = require('../controllers/referral-controller');

const router = express.Router();

/**
 * @route POST /api/referral/generate-code
 * @desc Генерация реферального кода
 * @access Private
 */
router.post('/generate-code', authenticateJWT, generateReferralCode);

/**
 * @route GET /api/referral/info
 * @desc Получение информации о реферальной программе
 * @access Private
 */
router.get('/info', authenticateJWT, getReferralInfo);

/**
 * @route POST /api/referral/apply
 * @desc Применение реферального кода
 * @access Private
 */
router.post('/apply', authenticateJWT, applyReferralCode);

module.exports = router;