// client/src/components/Shop/ShopScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../../context/WalletContext';
import ShopItem from './ShopItem';
import ItemDetails from './ItemDetails';
import '../../styles/ShopScreen.css';
import { silverCoin } from '../../assets';

// Типы предметов в магазине
const ITEM_TYPES = {
  CARD_SKIN: 'card_skin',
  DICE_SKIN: 'dice_skin',
  SPECIAL_CARD: 'special_card',
  SPECIAL_DICE: 'special_dice'
};

// Пример данных магазина (в будущем будут загружаться из API)
const shopItems = [
  {
    id: 1,
    type: ITEM_TYPES.CARD_SKIN,
    name: 'Royal King',
    description: 'A majestic version of the King card.',
    price: 50,
    image: '/images/shop/king_skin.png',
    rarity: 'Common',
    cardType: 'king'
  },
  {
    id: 2,
    type: ITEM_TYPES.DICE_SKIN,
    name: 'Blood Dice',
    description: 'A dice with blood-red symbols.',
    price: 75,
    image: '/images/shop/blood_dice.png',
    rarity: 'Uncommon'
  },
  {
    id: 3,
    type: ITEM_TYPES.SPECIAL_CARD,
    name: 'Oracle King',
    description: 'A special King card that grants an extra turn when used in a combination.',
    price: 150,
    image: '/images/shop/oracle_king.png',
    rarity: 'Rare',
    cardType: 'king',
    effect: 'extra_turn'
  },
  {
    id: 4,
    type: ITEM_TYPES.SPECIAL_DICE,
    name: 'Fortune Dice',
    description: 'A special dice that gives a 1.25x score multiplier when used in a combination.',
    price: 200,
    image: '/images/shop/fortune_dice.png',
    rarity: 'Epic',
    effect: 'score_multiplier'
  },
  {
    id: 5,
    type: ITEM_TYPES.CARD_SKIN,
    name: 'Shadow Witch',
    description: 'A mysterious version of the Witch card.',
    price: 50,
    image: '/images/shop/witch_skin.png',
    rarity: 'Common',
    cardType: 'witch'
  },
  {
    id: 6,
    type: ITEM_TYPES.SPECIAL_CARD,
    name: 'Golden Dwarf',
    description: 'A special Dwarf card that gives 1.5x points when used in a combination.',
    price: 100,
    image: '/images/shop/golden_dwarf.png',
    rarity: 'Rare',
    cardType: 'dwarf',
    effect: 'increased_points'
  },
  {
    id: 7,
    type: ITEM_TYPES.SPECIAL_DICE,
    name: 'Emotional Dice',
    description: 'A special dice that favors emotional vices: Lust, Discord, and Carelessness.',
    price: 150,
    image: '/images/shop/emotional_dice.png',
    rarity: 'Rare',
    effect: 'emotional_vices'
  },
  {
    id: 8,
    type: ITEM_TYPES.SPECIAL_CARD,
    name: 'Joker Bard',
    description: 'A special Bard card that can be used with any dice value.',
    price: 175,
    image: '/images/shop/joker_bard.png',
    rarity: 'Epic',
    cardType: 'bard',
    effect: 'universal'
  }
];

const ShopScreen = () => {
  const navigate = useNavigate();
  const { silver, updateSilver } = useWalletContext();
  const [activeTab, setActiveTab] = useState(ITEM_TYPES.CARD_SKIN);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [ownedItems, setOwnedItems] = useState([]);
  
  // Фильтруем предметы по активному табу
  useEffect(() => {
    const items = shopItems.filter(item => item.type === activeTab);
    setFilteredItems(items);
  }, [activeTab]);
  
  // Загружаем список приобретенных предметов
  useEffect(() => {
    const loadOwnedItems = () => {
      const savedOwnedItems = localStorage.getItem('owned_items');
      
      if (savedOwnedItems) {
        setOwnedItems(JSON.parse(savedOwnedItems));
      }
    };
    
    loadOwnedItems();
  }, []);
  
  // Обработчик изменения вкладки
  const handleTabChange = (tabType) => {
    setActiveTab(tabType);
    setSelectedItem(null);
    setShowItemDetails(false);
  };
  
  // Обработчик выбора предмета
  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };
  
  // Обработчик закрытия детального просмотра
  const handleCloseDetails = () => {
    setShowItemDetails(false);
  };
  
  // Обработчик покупки предмета
  const handleBuyItem = (item) => {
    // Проверяем, достаточно ли серебра
    if (silver < item.price) {
      return;
    }
    
    // Обновляем количество серебра
    updateSilver(-item.price);
    
    // Добавляем предмет в список приобретенных
    const updatedOwnedItems = [...ownedItems, item.id];
    setOwnedItems(updatedOwnedItems);
    localStorage.setItem('owned_items', JSON.stringify(updatedOwnedItems));
    
    // Закрываем детальный просмотр
    setShowItemDetails(false);
  };
  
  // Проверка, приобретен ли предмет
  const isItemOwned = (itemId) => {
    return ownedItems.includes(itemId);
  };
  
  // Обработчик кнопки "назад"
  const handleBackClick = () => {
    navigate('/main');
  };

  return (
    <div className="shop-screen">
      <h1 className="shop-title">Shop</h1>
      
      <div className="silver-balance">
        <img src={silverCoin} alt="Silver" className="silver-icon" />
        <span className="silver-amount">{silver}</span>
      </div>
      
      <div className="shop-tabs">
        <button 
          className={`shop-tab ${activeTab === ITEM_TYPES.CARD_SKIN ? 'active' : ''}`}
          onClick={() => handleTabChange(ITEM_TYPES.CARD_SKIN)}
        >
          Card Skins
        </button>
        <button 
          className={`shop-tab ${activeTab === ITEM_TYPES.DICE_SKIN ? 'active' : ''}`}
          onClick={() => handleTabChange(ITEM_TYPES.DICE_SKIN)}
        >
          Dice Skins
        </button>
        <button 
          className={`shop-tab ${activeTab === ITEM_TYPES.SPECIAL_CARD ? 'active' : ''}`}
          onClick={() => handleTabChange(ITEM_TYPES.SPECIAL_CARD)}
        >
          Special Cards
        </button>
        <button 
          className={`shop-tab ${activeTab === ITEM_TYPES.SPECIAL_DICE ? 'active' : ''}`}
          onClick={() => handleTabChange(ITEM_TYPES.SPECIAL_DICE)}
        >
          Special Dice
        </button>
      </div>
      
      <div className="shop-items">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <ShopItem
              key={item.id}
              item={item}
              owned={isItemOwned(item.id)}
              onSelect={() => handleItemSelect(item)}
            />
          ))
        ) : (
          <div className="no-items-message">
            <p>No items available in this category.</p>
          </div>
        )}
      </div>
      
      {showItemDetails && selectedItem && (
        <ItemDetails
          item={selectedItem}
          owned={isItemOwned(selectedItem.id)}
          silver={silver}
          onBuy={() => handleBuyItem(selectedItem)}
          onClose={handleCloseDetails}
        />
      )}
      
      <button className="back-button" onClick={handleBackClick}>
        Back to Main Menu
      </button>
    </div>
  );
};

export default ShopScreen;