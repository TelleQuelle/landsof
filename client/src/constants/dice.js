// client/src/constants/dice.js

import {
  carelessnessDice,
  greedDice,
  discordDice,
  lustDice,
  powerDice,
  peaceDice,
  basicDice
} from '../assets';

// Значения на кубиках
export const DICE_VALUES = {
    CARELESSNESS: 'carelessness', // Беззаботность (бокал вина)
    GREED: 'greed', // Жадность (золотые слитки)
    DISCORD: 'discord', // Раздор (капля крови)
    LUST: 'lust', // Похоть (сердце)
    POWER: 'power', // Власть (корона)
    PEACE: 'peace' // Покой (дом)
  };
  
  // Локализованные названия значений кубиков
  export const DICE_VALUE_NAMES = {
    [DICE_VALUES.CARELESSNESS]: 'Carelessness',
    [DICE_VALUES.GREED]: 'Greed',
    [DICE_VALUES.DISCORD]: 'Discord',
    [DICE_VALUES.LUST]: 'Lust',
    [DICE_VALUES.POWER]: 'Power',
    [DICE_VALUES.PEACE]: 'Peace'
  };
  
  // Изображения для каждого значения кубика
  export const DICE_IMAGES = {
    [DICE_VALUES.CARELESSNESS]: carelessnessDice, // Бокал вина
    [DICE_VALUES.GREED]: greedDice, // Золотые слитки
    [DICE_VALUES.DISCORD]: discordDice, // Капля крови
    [DICE_VALUES.LUST]: lustDice, // Сердце
    [DICE_VALUES.POWER]: powerDice, // Корона
    [DICE_VALUES.PEACE]: peaceDice // Дом
  };
  
  // Базовые кубики с равномерным распределением
  export const BASE_DICE = {
    id: 'base_dice',
    name: 'Basic Dice',
    description: 'A standard six-sided dice with sins and virtues.',
    image: basicDice,
    values: [
      DICE_VALUES.CARELESSNESS,
      DICE_VALUES.GREED,
      DICE_VALUES.DISCORD,
      DICE_VALUES.LUST,
      DICE_VALUES.POWER,
      DICE_VALUES.PEACE
    ],
    // Равномерная вероятность (каждое значение с вероятностью 1/6)
    probabilities: {
      [DICE_VALUES.CARELESSNESS]: 1/6,
      [DICE_VALUES.GREED]: 1/6,
      [DICE_VALUES.DISCORD]: 1/6,
      [DICE_VALUES.LUST]: 1/6,
      [DICE_VALUES.POWER]: 1/6,
      [DICE_VALUES.PEACE]: 1/6
    }
  };
  
  // Типы эффектов для особых кубиков
  export const SPECIAL_DICE_EFFECTS = {
    EMOTIONAL_VICES: 'emotional_vices', // Увеличен шанс выпадения эмоциональных пороков (Похоть, Раздор, Беззаботность)
    MATERIAL_VICES: 'material_vices', // Увеличен шанс выпадения материальных пороков (Жадность, Власть, Покой)
    SOCIAL_VICES: 'social_vices', // Увеличен шанс выпадения социальных пороков (Власть, Похоть, Беззаботность)
    DESTRUCTIVE_VICES: 'destructive_vices', // Увеличен шанс выпадения деструктивных пороков (Раздор, Жадность, Покой)
    SCORE_MULTIPLIER: 'score_multiplier', // 1.25x мультипликатор к очкам за раунд
    EXTRA_TURN: 'extra_turn' // Дополнительный ход при успешном использовании в комбинации
  };
  
  // Особые кубики с их эффектами и вероятностями
  export const SPECIAL_DICE = {
    // Пример особого кубика с эффектом эмоциональных пороков
    emotional_dice: {
      id: 'emotional_dice',
      name: 'Dice of Emotions',
      description: 'This dice favors emotional vices: Lust, Discord, and Carelessness.',
      image: '/images/dice/emotional_dice.png',
      effect: SPECIAL_DICE_EFFECTS.EMOTIONAL_VICES,
      values: [
        DICE_VALUES.CARELESSNESS,
        DICE_VALUES.GREED,
        DICE_VALUES.DISCORD,
        DICE_VALUES.LUST,
        DICE_VALUES.POWER,
        DICE_VALUES.PEACE
      ],
      // Измененная вероятность (повышенная для эмоциональных пороков)
      probabilities: {
        [DICE_VALUES.CARELESSNESS]: 0.25, // 25%
        [DICE_VALUES.GREED]: 0.083, // 8.3%
        [DICE_VALUES.DISCORD]: 0.25, // 25%
        [DICE_VALUES.LUST]: 0.25, // 25%
        [DICE_VALUES.POWER]: 0.083, // 8.3%
        [DICE_VALUES.PEACE]: 0.083 // 8.3%
      }
    },
    
    // Особый кубик "Memento Mori" (награда за 5-й уровень)
    memento_mori: {
      id: 'memento_mori',
      name: 'Memento Mori',
      description: 'A dice that reminds of mortality. Grants 1.25x score multiplier when used in a combination.',
      image: '/images/dice/memento_mori.png',
      effect: SPECIAL_DICE_EFFECTS.SCORE_MULTIPLIER,
      values: [
        DICE_VALUES.CARELESSNESS,
        DICE_VALUES.GREED,
        DICE_VALUES.DISCORD,
        DICE_VALUES.LUST,
        DICE_VALUES.POWER,
        DICE_VALUES.PEACE
      ],
      // Равномерная вероятность
      probabilities: {
        [DICE_VALUES.CARELESSNESS]: 1/6,
        [DICE_VALUES.GREED]: 1/6,
        [DICE_VALUES.DISCORD]: 1/6,
        [DICE_VALUES.LUST]: 1/6,
        [DICE_VALUES.POWER]: 1/6,
        [DICE_VALUES.PEACE]: 1/6
      }
    }
  };