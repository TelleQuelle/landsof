// client/src/constants/cards.js

// Базовые карты персонажей
export const CARD_TYPES = {
    KNIGHT: 'knight',
    WITCH: 'witch',
    PRINCESS: 'princess',
    KING: 'king',
    DWARF: 'dwarf',
    SKELETON_MAGE: 'skeleton_mage',
    SKELETON_WARRIOR: 'skeleton_warrior',
    VIKING: 'viking',
    DEMON: 'demon',
    HUNTER: 'hunter',
    THIEF: 'thief',
    DRUID: 'druid',
    BARD: 'bard',
    MONK: 'monk',
    EXECUTIONER: 'executioner',
    WEREWOLF: 'werewolf',
    ALCHEMIST: 'alchemist',
    CULTIST: 'cultist',
    PLAGUE_DOCTOR: 'plague_doctor',
    PEASANT: 'peasant'
  };
  
  // Локализованные названия карт для отображения
  export const CARD_NAMES = {
    [CARD_TYPES.KNIGHT]: 'Knight',
    [CARD_TYPES.WITCH]: 'Witch',
    [CARD_TYPES.PRINCESS]: 'Princess',
    [CARD_TYPES.KING]: 'King',
    [CARD_TYPES.DWARF]: 'Dwarf',
    [CARD_TYPES.SKELETON_MAGE]: 'Skeleton Mage',
    [CARD_TYPES.SKELETON_WARRIOR]: 'Skeleton Warrior',
    [CARD_TYPES.VIKING]: 'Viking',
    [CARD_TYPES.DEMON]: 'Demon',
    [CARD_TYPES.HUNTER]: 'Hunter',
    [CARD_TYPES.THIEF]: 'Thief',
    [CARD_TYPES.DRUID]: 'Druid',
    [CARD_TYPES.BARD]: 'Bard',
    [CARD_TYPES.MONK]: 'Monk',
    [CARD_TYPES.EXECUTIONER]: 'Executioner',
    [CARD_TYPES.WEREWOLF]: 'Werewolf',
    [CARD_TYPES.ALCHEMIST]: 'Alchemist',
    [CARD_TYPES.CULTIST]: 'Cultist',
    [CARD_TYPES.PLAGUE_DOCTOR]: 'Plague Doctor',
    [CARD_TYPES.PEASANT]: 'Peasant'
  };
  
  // Базовая колода из 20 карт
  export const BASE_DECK = [
    {
      id: 1,
      type: CARD_TYPES.KNIGHT,
      name: CARD_NAMES[CARD_TYPES.KNIGHT],
      image: '/assets/images/cards/knight.png'
    },
    {
      id: 2,
      type: CARD_TYPES.WITCH,
      name: CARD_NAMES[CARD_TYPES.WITCH],
      image: '/assets/images/cards/witch.png'
    },
    {
      id: 3,
      type: CARD_TYPES.PRINCESS,
      name: CARD_NAMES[CARD_TYPES.PRINCESS],
      image: '/assets/images/cards/princess.png'
    },
    {
      id: 4,
      type: CARD_TYPES.KING,
      name: CARD_NAMES[CARD_TYPES.KING],
      image: '/assets/images/cards/king.png'
    },
    {
      id: 5,
      type: CARD_TYPES.DWARF,
      name: CARD_NAMES[CARD_TYPES.DWARF],
      image: '/assets/images/cards/dwarf.png'
    },
    {
      id: 6,
      type: CARD_TYPES.SKELETON_MAGE,
      name: CARD_NAMES[CARD_TYPES.SKELETON_MAGE],
      image: '/assets/images/cards/skeleton_mage.png'
    },
    {
      id: 7,
      type: CARD_TYPES.SKELETON_WARRIOR,
      name: CARD_NAMES[CARD_TYPES.SKELETON_WARRIOR],
      image: '/assets/images/cards/skeleton_warrior.png'
    },
    {
      id: 8,
      type: CARD_TYPES.VIKING,
      name: CARD_NAMES[CARD_TYPES.VIKING],
      image: '/assets/images/cards/viking.png'
    },
    {
      id: 9,
      type: CARD_TYPES.DEMON,
      name: CARD_NAMES[CARD_TYPES.DEMON],
      image: '/assets/images/cards/demon.png'
    },
    {
      id: 10,
      type: CARD_TYPES.HUNTER,
      name: CARD_NAMES[CARD_TYPES.HUNTER],
      image: '/assets/images/cards/hunter.png'
    },
    {
      id: 11,
      type: CARD_TYPES.THIEF,
      name: CARD_NAMES[CARD_TYPES.THIEF],
      image: '/images/cards/thief.png'
    },
    {
      id: 12,
      type: CARD_TYPES.DRUID,
      name: CARD_NAMES[CARD_TYPES.DRUID],
      image: '/images/cards/druid.png'
    },
    {
      id: 13,
      type: CARD_TYPES.BARD,
      name: CARD_NAMES[CARD_TYPES.BARD],
      image: '/images/cards/bard.png'
    },
    {
      id: 14,
      type: CARD_TYPES.MONK,
      name: CARD_NAMES[CARD_TYPES.MONK],
      image: '/images/cards/monk.png'
    },
    {
      id: 15,
      type: CARD_TYPES.EXECUTIONER,
      name: CARD_NAMES[CARD_TYPES.EXECUTIONER],
      image: '/images/cards/executioner.png'
    },
    {
      id: 16,
      type: CARD_TYPES.WEREWOLF,
      name: CARD_NAMES[CARD_TYPES.WEREWOLF],
      image: '/images/cards/werewolf.png'
    },
    {
      id: 17,
      type: CARD_TYPES.ALCHEMIST,
      name: CARD_NAMES[CARD_TYPES.ALCHEMIST],
      image: '/images/cards/alchemist.png'
    },
    {
      id: 18,
      type: CARD_TYPES.CULTIST,
      name: CARD_NAMES[CARD_TYPES.CULTIST],
      image: '/images/cards/cultist.png'
    },
    {
      id: 19,
      type: CARD_TYPES.PLAGUE_DOCTOR,
      name: CARD_NAMES[CARD_TYPES.PLAGUE_DOCTOR],
      image: '/images/cards/plague_doctor.png'
    },
    {
      id: 20,
      type: CARD_TYPES.PEASANT,
      name: CARD_NAMES[CARD_TYPES.PEASANT],
      image: '/images/cards/peasant.png'
    }
  ];
  
  // Типы эффектов для особых карт
  export const SPECIAL_CARD_EFFECTS = {
    INCREASED_POINTS: 'increased_points', // в полтора раза больше очков за комбинацию с этой картой
    UNIVERSAL: 'universal', // карта составляет комбинацию с любым кубиком
    EXTRA_TURN: 'extra_turn', // дополнительный ход при успешном использовании в комбинации
    SILVER_MULTIPLIER: 'silver_multiplier' // 1.25x множитель серебра за игру
  };