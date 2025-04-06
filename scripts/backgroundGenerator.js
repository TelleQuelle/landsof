#!/usr/bin/env node

/**
 * Генератор фонов в стиле dark fantasy
 * 
 * Использование:
 * node backgroundGenerator.js --output=path/to/output --count=10 --types=castle,forest,dungeon
 */

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const theme = require('./darkFantasyTheme');
const { createNewCanvas, saveCanvasToPNG, generateUniqueFilename } = require('./exportUtils');
const path = require('path');

// Парсим аргументы командной строки
const argv = yargs(hideBin(process.argv))
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'Путь для сохранения фонов',
    default: path.join(process.cwd(), 'client', 'public', 'images', 'backgrounds')
  })
  .option('count', {
    alias: 'c',
    type: 'number',
    description: 'Количество фонов для генерации',
    default: 10
  })
  .option('size', {
    alias: 's',
    type: 'string',
    description: 'Размер фонов (menu, card, level, lore, ui)',
    default: 'menu'
  })
  .option('types', {
    alias: 't',
    type: 'string',
    description: 'Типы фонов через запятую (castle, mystical, forest, dungeon, ruins, skyDark, lava, cursedLand)',
    default: 'castle,mystical,forest,dungeon,ruins,skyDark,lava,cursedLand'
  })
  .option('prefix', {
    alias: 'p',
    type: 'string',
    description: 'Префикс для имен файлов',
    default: 'bg'
  })
  .help()
  .argv;

// Преобразуем строку типов в массив
const types = argv.types.split(',').map(type => type.trim());

// Получаем размеры для фонов
const sizeOption = argv.size in theme.sizes ? argv.size : 'menu';
const { width, height } = theme.sizes[sizeOption];

/**
 * Генерирует градиентный фон
 * @param {CanvasRenderingContext2D} ctx Контекст канваса
 * @param {Array} colors Массив цветов для градиента
 * @param {number} width Ширина канваса
 * @param {number} height Высота канваса
 */
function drawGradientBackground(ctx, colors, width, height) {
  // Выбираем тип градиента (линейный, радиальный, или с несколькими точками)
  const gradientType = Math.floor(Math.random() * 3);
  
  let gradient;
  
  if (gradientType === 0) {
    // Линейный градиент (сверху вниз или по диагонали)
    const angle = Math.random() * Math.PI;
    const startX = width / 2 - Math.cos(angle) * width;
    const startY = height / 2 - Math.sin(angle) * height;
    const endX = width / 2 + Math.cos(angle) * width;
    const endY = height / 2 + Math.sin(angle) * height;
    
    gradient = ctx.createLinearGradient(startX, startY, endX, endY);
  } else if (gradientType === 1) {
    // Радиальный градиент от центра или от смещенной точки
    const centerX = width * (0.3 + Math.random() * 0.4);
    const centerY = height * (0.3 + Math.random() * 0.4);
    const radius = Math.max(width, height) * (0.6 + Math.random() * 0.4);
    
    gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
  } else {
    // Двойной радиальный градиент для более сложного эффекта
    const x1 = width * Math.random();
    const y1 = height * Math.random();
    const r1 = Math.max(width, height) * 0.6 * Math.random();
    
    const x2 = width * Math.random();
    const y2 = height * Math.random();
    const r2 = Math.max(width, height) * 0.6 * Math.random();
    
    gradient = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
    
    // Добавляем цвета к первому градиенту
    for (let i = 0; i < colors.length; i++) {
      gradient.addColorStop(i / (colors.length - 1), colors[i]);
    }
    
    // Рисуем первый градиент
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Создаем второй градиент с другой прозрачностью
    gradient = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
    // Используем те же цвета, но с меньшей прозрачностью
    colors = colors.map(color => {
      // Преобразуем hex в rgba с рандомной прозрачностью
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const a = 0.3 + Math.random() * 0.4; // 30-70% прозрачность
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    });
  }
  
  // Добавляем цвета к градиенту
  for (let i = 0; i < colors.length; i++) {
    gradient.addColorStop(i / (colors.length - 1), colors[i]);
  }
  
  // Рисуем градиент
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Добавляет текстуру шума на фон
 * @param {CanvasRenderingContext2D} ctx Контекст канваса
 * @param {string} color Цвет шума
 * @param {number} width Ширина канваса
 * @param {number} height Высота канваса
 * @param {number} size Размер частиц шума
 * @param {number} opacity Прозрачность шума
 */
function addNoiseTexture(ctx, color, width, height, size = 1, opacity = 0.1) {
  // Сохраняем текущее состояние контекста
  ctx.save();
  
  // Устанавливаем прозрачность
  ctx.globalAlpha = opacity;
  
  // Получаем данные изображения
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Парсим цвет
  let r, g, b;
  // Проверяем, в каком формате пришел цвет (hex или rgb)
  if (color.startsWith('#')) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else if (color.startsWith('rgb')) {
    const matches = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    r = parseInt(matches[1]);
    g = parseInt(matches[2]);
    b = parseInt(matches[3]);
  } else {
    // По умолчанию серый
    r = g = b = 128;
  }
  
  // Добавляем шум
  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      // Случайным образом решаем, добавлять ли шум в этой точке
      if (Math.random() > 0.5) continue;
      
      // Вычисляем индекс в массиве данных изображения
      const index = (y * width + x) * 4;
      
      // Случайное отклонение для создания "зернистости"
      const noise = Math.random() * 50 - 25;
      
      // Применяем шум к цветам пикселя
      data[index] = Math.min(255, Math.max(0, r + noise));
      data[index + 1] = Math.min(255, Math.max(0, g + noise));
      data[index + 2] = Math.min(255, Math.max(0, b + noise));
      // Альфа-канал не меняем
    }
  }
  
  // Записываем измененные данные обратно в изображение
  ctx.putImageData(imageData, 0, 0);
  
  // Восстанавливаем состояние контекста
  ctx.restore();
}

/**
 * Добавляет виньетку по краям изображения
 * @param {CanvasRenderingContext2D} ctx Контекст канваса
 * @param {number} width Ширина канваса
 * @param {number} height Высота канваса
 * @param {number} power Сила виньетки (0-1)
 */
function addVignette(ctx, width, height, power = 0.5) {
  // Создаем радиальный градиент от центра к краям
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 0,
    width / 2, height / 2, Math.sqrt(width * width + height * height) / 2
  );
  
  // Добавляем прозрачный центр и черные края
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, `rgba(0, 0, 0, ${power})`);
  
  // Сохраняем текущее состояние контекста
  ctx.save();
  
  // Применяем градиент
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Восстанавливаем состояние контекста
  ctx.restore();
}

/**
 * Добавляет эффект трещин на фон
 * @param {CanvasRenderingContext2D} ctx Контекст канваса
 * @param {string} color Цвет трещин
 * @param {number} width Ширина канваса
 * @param {number} height Высота канваса
 * @param {number} count Количество трещин
 * @param {number} lineWidth Ширина линий
 * @param {number} opacity Прозрачность трещин
 */
function addCracks(ctx, color, width, height, count = 10, lineWidth = 1, opacity = 0.3) {
  // Сохраняем текущее состояние контекста
  ctx.save();
  
  // Устанавливаем параметры линий
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = opacity;
  
  // Создаем трещины
  for (let i = 0; i < count; i++) {
    // Случайная начальная точка
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    
    // Количество сегментов в трещине
    const segments = 3 + Math.floor(Math.random() * 7);
    
    // Начинаем путь
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    // Текущие координаты
    let currentX = startX;
    let currentY = startY;
    
    // Добавляем сегменты трещины
    for (let j = 0; j < segments; j++) {
      // Случайное направление и длина
      const angle = Math.random() * Math.PI * 2;
      const length = 20 + Math.random() * 100;
      
      // Вычисляем новую точку
      currentX += Math.cos(angle) * length;
      currentY += Math.sin(angle) * length;
      
      // Добавляем линию
      ctx.lineTo(currentX, currentY);
      
      // Случайным образом добавляем ответвления
      if (Math.random() > 0.7) {
        const branchAngle = angle + (Math.random() * Math.PI / 2 - Math.PI / 4);
        const branchLength = length * 0.4 + Math.random() * length * 0.3;
        
        // Сохраняем текущую точку
        const tempX = currentX;
        const tempY = currentY;
        
        // Рисуем ответвление
        currentX += Math.cos(branchAngle) * branchLength;
        currentY += Math.sin(branchAngle) * branchLength;
        ctx.lineTo(currentX, currentY);
        
        // Возвращаемся к основной трещине
        currentX = tempX;
        currentY = tempY;
        ctx.moveTo(currentX, currentY);
      }
    }
    
    // Рисуем трещину
    ctx.stroke();
  }
  
  // Восстанавливаем состояние контекста
  ctx.restore();
}

/**
 * Добавляет эффект светящихся частиц на фон
 * @param {CanvasRenderingContext2D} ctx Контекст канваса
 * @param {string} color Цвет частиц
 * @param {number} width Ширина канваса
 * @param {number} height Высота канваса
 * @param {number} count Количество частиц
 * @param {number} maxSize Максимальный размер частиц
 */
function addGlowingParticles(ctx, color, width, height, count = 50, maxSize = 3) {
  // Сохраняем текущее состояние контекста
  ctx.save();
  
  // Для каждой частицы
  for (let i = 0; i < count; i++) {
    // Случайная позиция
    const x = Math.random() * width;
    const y = Math.random() * height;
    
    // Случайный размер
    const size = 0.5 + Math.random() * maxSize;
    
    // Случайная прозрачность
    const alpha = 0.1 + Math.random() * 0.6;
    
    // Преобразуем hex в rgba для добавления прозрачности
    let r, g, b;
    if (color.startsWith('#')) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else {
      r = g = b = 255; // По умолчанию белый
    }
    
    // Создаем градиент для создания эффекта свечения
    const gradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, size * 3
    );
    
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    
    ctx.fillStyle = gradient;
    
    // Рисуем частицу
    ctx.beginPath();
    ctx.arc(x, y, size * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Восстанавливаем состояние контекста
  ctx.restore();
}

/**
 * Добавляет эффект древних рун или символов на фон
 * @param {CanvasRenderingContext2D} ctx Контекст канваса
 * @param {string} color Цвет символов
 * @param {number} width Ширина канваса
 * @param {number} height Высота канваса
 * @param {number} count Количество символов
 * @param {number} opacity Прозрачность символов
 */
function addMysticalSymbols(ctx, color, width, height, count = 15, opacity = 0.2) {
  // Набор символов (руны, мистические символы)
  const symbols = [
    'ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛟ', 'ᛞ',
    '☉', '☽', '☿', '♀', '♁', '♂', '♃', '♄', '♅', '♆', '♇',
    '✧', '✦', '✴', '✵', '✶', '✷', '✸', '✹', '✺', '✻', '✼', '✽', '✾', '✿',
    '♠', '♥', '♦', '♣',
    '⚔', '⚒', '⚓', '⚖', '⚗', '⚘', '⚙', '⚚', '⚛', '⚜',
    '⠁', '⠂', '⠃', '⠄', '⠅', '⠆', '⠇', '⠈', '⠉', '⠊', '⠋', '⠌', '⠍', '⠎', '⠏',
    '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'
  ];
  
  // Сохраняем текущее состояние контекста
  ctx.save();
  
  // Устанавливаем цвет и прозрачность
  ctx.fillStyle = color;
  ctx.globalAlpha = opacity;
  
  // Добавляем символы
  for (let i = 0; i < count; i++) {
    // Случайная позиция
    const x = Math.random() * width;
    const y = Math.random() * height;
    
    // Случайный размер
    const size = 20 + Math.random() * 60;
    
    // Случайный поворот
    const rotation = Math.random() * Math.PI * 2;
    
    // Случайный символ
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Применяем трансформации
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    // Устанавливаем шрифт
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Рисуем символ
    ctx.fillText(symbol, 0, 0);
    
    // Сбрасываем трансформации
    ctx.rotate(-rotation);
    ctx.translate(-x, -y);
  }
  
  // Восстанавливаем состояние контекста
  ctx.restore();
}

/**
 * Создает фон в стиле dark fantasy
 * @param {string} type Тип фона (castle, mystical, forest, dungeon, ruins, skyDark, lava, cursedLand)
 * @param {number} width Ширина фона
 * @param {number} height Высота фона
 * @returns {Canvas} Canvas с созданным фоном
 */
function generateBackground(type, width, height) {
  // Создаем новый Canvas
  const { canvas, ctx } = createNewCanvas(width, height);
  
  // Получаем палитру цветов для выбранного типа
  const palette = theme.palettes[type];
  
  // Выбираем цвета для градиента
  const primaryColor = theme.getRandomItem(palette.primary);
  const secondaryColor = theme.getRandomItem(palette.secondary);
  const accentColor = theme.getRandomItem(palette.accent);
  const textureColor = theme.getRandomItem(palette.texture);
  
  // Создаем массив цветов для градиента
  // Используем 2-4 цвета для создания более интересного градиента
  const colorCount = 2 + Math.floor(Math.random() * 3);
  const gradientColors = [primaryColor];
  
  if (colorCount >= 3) {
    gradientColors.push(textureColor);
  }
  
  gradientColors.push(secondaryColor);
  
  if (colorCount >= 4 && Math.random() > 0.5) {
    // В 50% случаев добавляем акцентный цвет в середину градиента
    gradientColors.splice(Math.floor(gradientColors.length / 2), 0, accentColor);
  } else if (colorCount >= 4) {
    // В остальных случаях добавляем его в конец
    gradientColors.push(accentColor);
  }
  
  // Рисуем градиентный фон
  drawGradientBackground(ctx, gradientColors, width, height);
  
  // Добавляем текстуру шума
  const noiseSize = theme.getRandomItem(theme.patterns.noise.size);
  const noiseOpacity = theme.getRandomItem(theme.patterns.noise.opacity);
  addNoiseTexture(ctx, textureColor, width, height, noiseSize, noiseOpacity);
  
  // Добавляем виньетку
  const vignettePower = theme.getRandomItem(theme.patterns.vignette.power);
  const vignetteOpacity = theme.getRandomItem(theme.patterns.vignette.opacity);
  addVignette(ctx, width, height, vignetteOpacity * vignettePower);
  
  // С некоторой вероятностью добавляем различные эффекты
  
  // Добавляем трещины (40% шанс)
  if (Math.random() < 0.4) {
    const crackCount = theme.getRandomItem(theme.patterns.cracks.count);
    const crackWidth = theme.getRandomItem(theme.patterns.cracks.width);
    const crackOpacity = theme.getRandomItem(theme.patterns.cracks.opacity);
    addCracks(ctx, secondaryColor, width, height, crackCount, crackWidth, crackOpacity);
  }
  
  // Добавляем светящиеся частицы (30% шанс)
  if (Math.random() < 0.3) {
    const particleCount = theme.getRandomItem(theme.patterns.particles.count);
    const particleSize = theme.getRandomItem(theme.patterns.particles.size);
    const particleOpacity = theme.getRandomItem(theme.patterns.particles.opacity);
    addGlowingParticles(ctx, theme.getRandomItem(theme.effects.glow.colors), width, height, particleCount, particleSize, particleOpacity);
  }
  
  // Добавляем мистические символы (20% шанс)
  if (Math.random() < 0.2) {
    addMysticalSymbols(ctx, accentColor, width, height, 10 + Math.floor(Math.random() * 20), 0.1 + Math.random() * 0.3);
  }
  
  return canvas;
}

/**
 * Основная функция для генерации фонов
 */
async function main() {
  console.log(`Generating ${argv.count} dark fantasy backgrounds...`);
  console.log(`Output directory: ${argv.output}`);
  console.log(`Size: ${width}x${height} (${argv.size})`);
  console.log(`Types: ${types.join(', ')}`);
  
  let generatedCount = 0;
  
  for (let i = 0; i < argv.count; i++) {
    // Выбираем случайный тип фона из указанных
    const type = theme.getRandomItem(types);
    
    // Генерируем фон
    const canvas = generateBackground(type, width, height);
    
    // Создаем имя файла
    const filename = generateUniqueFilename(argv.prefix, type);
    
    // Сохраняем фон как PNG
    try {
      const savedPath = await saveCanvasToPNG(canvas, argv.output, filename);
      console.log(`[${++generatedCount}/${argv.count}] Generated: ${savedPath}`);
    } catch (error) {
      console.error(`Error saving file: ${error.message}`);
    }
  }
  
  console.log(`Done! Generated ${generatedCount} backgrounds.`);
}

// Запускаем генератор
main().catch(error => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});