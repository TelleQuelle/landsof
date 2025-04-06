// server/middleware/upload-middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

// Определяем хранилище для загрузки файлов
let storage;

if (config.storage.type === 'local') {
  // Создаем директорию для загрузок, если она не существует
  const uploadsDir = config.storage.basePath;
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Локальное хранилище
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Определяем папку в зависимости от типа файла
      let destFolder = uploadsDir;
      
      if (file.fieldname === 'mainImage') {
        destFolder = path.join(uploadsDir, 'items');
      } else if (file.fieldname === 'diceImages') {
        destFolder = path.join(uploadsDir, 'dice');
      } else if (file.fieldname === 'partnerLogo') {
        destFolder = path.join(uploadsDir, 'partners');
      }
      
      // Создаем директорию, если она не существует
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }
      
      cb(null, destFolder);
    },
    filename: (req, file, cb) => {
      // Генерируем уникальное имя файла
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      cb(null, fileName);
    }
  });
} else if (config.storage.type === 's3') {
  // В будущем можно добавить поддержку S3
  // Для этого потребуется установить пакет multer-s3
  // и настроить хранилище соответствующим образом
  throw new Error('S3 storage not implemented yet');
}

// Фильтр для проверки типа файла
const fileFilter = (req, file, cb) => {
  // Принимаем только PNG изображения
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only PNG images are allowed'), false);
  }
};

// Настройка multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Обработчик ошибок multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Ошибка multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: true,
        message: 'File too large (max 5MB)'
      });
    }
    
    return res.status(400).json({
      error: true,
      message: err.message
    });
  } else if (err) {
    // Другая ошибка
    return res.status(400).json({
      error: true,
      message: err.message
    });
  }
  
  next();
};

module.exports = {
  upload,
  handleMulterError
};