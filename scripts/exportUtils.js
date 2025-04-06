/**
 * Утилиты для экспорта Canvas в PNG файлы
 */
const fs = require('fs-extra');
const path = require('path');
const { createCanvas } = require('canvas');

/**
 * Создает Canvas с указанными размерами
 * @param {number} width Ширина канваса в пикселях
 * @param {number} height Высота канваса в пикселях
 * @returns {Object} Объект с canvas и context
 */
function createNewCanvas(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

/**
 * Сохраняет Canvas как PNG файл
 * @param {Canvas} canvas Canvas для сохранения
 * @param {string} outputPath Путь для сохранения файла
 * @param {string} filename Имя файла (без расширения)
 * @returns {Promise<string>} Путь к сохраненному файлу
 */
async function saveCanvasToPNG(canvas, outputPath, filename) {
  // Создаем директорию, если она не существует
  await fs.ensureDir(outputPath);
  
  // Полный путь для сохранения
  const fullPath = path.join(outputPath, `${filename}.png`);
  
  // Создаем поток для записи
  const out = fs.createWriteStream(fullPath);
  
  // Создаем поток данных из canvas
  const stream = canvas.createPNGStream();
  
  // Возвращаем Promise, который разрешится, когда файл будет записан
  return new Promise((resolve, reject) => {
    stream.pipe(out);
    out.on('finish', () => resolve(fullPath));
    out.on('error', reject);
  });
}

/**
 * Генерирует уникальное имя файла для фона
 * @param {string} prefix Префикс для имени файла
 * @param {string} type Тип фона (castle, forest, etc.)
 * @returns {string} Уникальное имя файла
 */
function generateUniqueFilename(prefix, type) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}_${type}_${timestamp}_${random}`;
}

module.exports = {
  createNewCanvas,
  saveCanvasToPNG,
  generateUniqueFilename
};