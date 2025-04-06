// server/config.js
require('dotenv').config();

// Адреса администраторов (Solana публичные ключи)
const ADMIN_ADDRESSES = [
  // Замените на реальные публичные ключи администраторов
  'HVMaVhxKX6dLP1yLnkzH3ikRgDG1vqn2zP9PcXuYvZZH'
];

// Конфигурация для различных сред (разработка, продакшен)
const config = {
  development: {
    port: process.env.PORT || 3001,
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      name: process.env.DB_NAME || 'nanti_dev',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres'
    },
    solana: {
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      network: 'devnet'
    },
    storage: {
      type: 'local', // 'local' или 's3'
      basePath: process.env.STORAGE_PATH || './uploads'
    },
    security: {
      signatureExpiryMinutes: 5 // Срок действия подписи в минутах
    }
  },
  production: {
    port: process.env.PORT || 8080,
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    solana: {
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      network: 'mainnet-beta'
    },
    storage: {
      type: 's3',
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION || 'us-east-1',
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY
    },
    security: {
      signatureExpiryMinutes: 5
    }
  }
};

// Определяем текущую среду
const env = process.env.NODE_ENV || 'development';

// Экспортируем конфигурацию и список администраторов
module.exports = {
  ...config[env],
  ADMIN_ADDRESSES
};