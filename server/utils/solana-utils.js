// server/utils/solana-utils.js
const { PublicKey, Connection } = require('@solana/web3.js');
const nacl = require('tweetnacl');
const bs58 = require('bs58');
require('dotenv').config();

// Подключение к сети Solana
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  'confirmed'
);

// Проверка подписи кошелька
const verifyWalletSignature = async (walletAddress, signature, message) => {
  try {
    // Проверяем, что адрес кошелька валиден
    const publicKey = new PublicKey(walletAddress);
    
    // Декодируем подпись из base58
    const signatureBytes = bs58.decode(signature);
    
    // Проверяем подпись
    const messageBytes = new TextEncoder().encode(message);
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey.toBytes()
    );
    
    return isValid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

// Создание и минтинг NFT
const mintNFT = async (walletAddress, metadata) => {
  try {
    // Здесь будет код для создания и минтинга NFT
    // Это будет реальная интеграция с блокчейном Solana
    
    // Пока возвращаем моковые данные
    return {
      success: true,
      mintAddress: 'mock_mint_address_' + Date.now(),
      txHash: 'mock_tx_hash_' + Date.now()
    };
  } catch (error) {
    console.error('NFT minting error:', error);
    throw error;
  }
};

// Получение баланса кошелька
const getWalletBalance = async (walletAddress) => {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / 10 ** 9; // Конвертация из ламапортов в SOL
  } catch (error) {
    console.error('Get wallet balance error:', error);
    throw error;
  }
};

module.exports = {
  connection,
  verifyWalletSignature,
  mintNFT,
  getWalletBalance
};