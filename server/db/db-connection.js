// server/db/db-connection.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Получаем параметры подключения из переменных окружения
const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  NODE_ENV
} = process.env;

// Создаем экземпляр Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    ssl: NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false // Для подключения к PG через SSL
    } : false
  },
  pool: {
    max: 5, // Максимальное количество соединений в пуле
    min: 0, // Минимальное количество соединений в пуле
    acquire: 30000, // Максимальное время в мс для получения соединения из пула
    idle: 10000 // Максимальное время в мс, в течение которого соединение может быть неактивным до освобождения
  }
});

// Тестирование подключения
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Экспортируем экземпляр Sequelize и функцию тестирования
module.exports = {
  sequelize,
  testConnection
};