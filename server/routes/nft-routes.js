// server/routes/nft-routes.js
const express = require('express');
const { authenticateJWT } = require('../middleware/auth-middleware');
const { 
  mintNFT, 
  getUserNFTs, 
  getNFTMetadata 
} = require('../controllers/nft-controller');

const router = express.Router();

/**
 * @route POST /api/nft/mint
 * @desc Mint NFT
 * @access Private
 */
router.post('/mint', authenticateJWT, mintNFT);

/**
 * @route GET /api/nft/user
 * @desc Получение NFT пользователя
 * @access Private
 */
router.get('/user', authenticateJWT, getUserNFTs);

/**
 * @route GET /api/nft/metadata/:address
 * @desc Получение метаданных NFT
 * @access Public
 */
router.get('/metadata/:address', getNFTMetadata);

module.exports = router;