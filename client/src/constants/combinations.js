// client/src/constants/combinations.js
import { DICE_VALUES } from './dice';
import { CARD_TYPES } from './cards';

// Комбинации карт для каждого значения кубика
export const DICE_CARD_COMBINATIONS = {
  [DICE_VALUES.CARELESSNESS]: [
    CARD_TYPES.PRINCESS,
    CARD_TYPES.BARD,
    CARD_TYPES.THIEF,
    CARD_TYPES.KING,
    CARD_TYPES.PEASANT,
    CARD_TYPES.SKELETON_WARRIOR
  ],
  [DICE_VALUES.GREED]: [
    CARD_TYPES.DWARF,
    CARD_TYPES.THIEF,
    CARD_TYPES.ALCHEMIST,
    CARD_TYPES.DEMON,
    CARD_TYPES.KING,
    CARD_TYPES.PEASANT,
    CARD_TYPES.EXECUTIONER
  ],
  [DICE_VALUES.DISCORD]: [
    CARD_TYPES.KNIGHT,
    CARD_TYPES.VIKING,
    CARD_TYPES.DEMON,
    CARD_TYPES.EXECUTIONER,
    CARD_TYPES.WEREWOLF,
    CARD_TYPES.KING,
    CARD_TYPES.PEASANT,
    CARD_TYPES.SKELETON_MAGE
  ],
  [DICE_VALUES.LUST]: [
    CARD_TYPES.PRINCESS,
    CARD_TYPES.WITCH,
    CARD_TYPES.BARD,
    CARD_TYPES.DEMON,
    CARD_TYPES.HUNTER,
    CARD_TYPES.KING,
    CARD_TYPES.PEASANT
  ],
  [DICE_VALUES.POWER]: [
    CARD_TYPES.KING,
    CARD_TYPES.KNIGHT,
    CARD_TYPES.WITCH,
    CARD_TYPES.MONK,
    CARD_TYPES.CULTIST,
    CARD_TYPES.PEASANT,
    CARD_TYPES.ALCHEMIST
  ],
  [DICE_VALUES.PEACE]: [
    CARD_TYPES.PEASANT,
    CARD_TYPES.MONK,
    CARD_TYPES.DRUID,
    CARD_TYPES.PLAGUE_DOCTOR,
    CARD_TYPES.DWARF,
    CARD_TYPES.KING,
    CARD_TYPES.HUNTER
  ]
};

// Количество очков за каждую карту в комбинации
export const POINTS_PER_CARD = {
  [DICE_VALUES.CARELESSNESS]: 75,
  [DICE_VALUES.GREED]: 100,
  [DICE_VALUES.DISCORD]: 125,
  [DICE_VALUES.LUST]: 100,
  [DICE_VALUES.POWER]: 100,
  [DICE_VALUES.PEACE]: 100
};

// Мультипликаторы для карт
export const CARD_MULTIPLIERS = {
  [CARD_TYPES.KING]: 1.25, // Увеличивает очки на 25%
  [CARD_TYPES.BARD]: 1.1, // Увеличивает очки на 10%
  [CARD_TYPES.PEASANT]: 0.9 // Уменьшает очки на 10%
};

// Функция для проверки, подходит ли карта для комбинации с выбранным значением кубика
export const isCardValidForDiceValue = (cardType, diceValue) => {
  return DICE_CARD_COMBINATIONS[diceValue]?.includes(cardType) || false;
};

// Функция для вычисления очков за комбинацию
export const calculateCombinationPoints = (selectedCards, diceValue) => {
  if (!selectedCards || !diceValue) return 0;
  
  // Проверяем, что все выбранные карты подходят для комбинации
  const validCards = selectedCards.filter(card => 
    isCardValidForDiceValue(card.type, diceValue)
  );
  
  // Если нет подходящих карт, возвращаем 0
  if (validCards.length === 0) return 0;
  
  // Базовые очки за комбинацию (количество карт * очки за каждую карту)
  const basePoints = validCards.length * POINTS_PER_CARD[diceValue];
  
  // Применяем мультипликаторы для особых карт
  let multiplier = 1.0;
  
  // Проверяем наличие карт с мультипликаторами
  for (const card of validCards) {
    if (CARD_MULTIPLIERS[card.type]) {
      multiplier *= CARD_MULTIPLIERS[card.type];
    }
  }
  
  // Итоговые очки с учетом мультипликатора
  return Math.round(basePoints * multiplier);
};