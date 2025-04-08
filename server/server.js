// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./db/db-connection');
const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user-routes');
const shopRoutes = require('./routes/shop-routes');
const adminRoutes = require('./routes/admin-routes');
const nftRoutes = require('./routes/nft-routes');
const referralRoutes = require('./routes/referral-routes');
const { initializeModels } = require('./models');
require('dotenv').config();

// Создаем экземпляр приложения
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы для клиентского приложения в продакшене
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// API маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/nft', nftRoutes);
app.use('/api/referral', referralRoutes);

// Обработка маршрутов React в продакшене
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Инициализация моделей и подключение к базе данных
(async () => {
  try {
    // Инициализируем модели
    initializeModels(sequelize);
    
    // Синхронизируем модели с базой данных
    // В продакшене рекомендуется использовать миграции вместо sync
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized');
    }
    
    // Запускаем сервер
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;