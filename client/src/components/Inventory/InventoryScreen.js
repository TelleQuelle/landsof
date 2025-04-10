// client/src/components/Inventory/InventoryScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_DECK } from '../../constants/cards';
import { BASE_DICE, SPECIAL_DICE } from '../../constants/dice';
import InventoryItemList from './InventoryItemList';
import DeckBuilder from './DeckBuilder';
import DiceSelection from './DiceSelection';
import ItemDetails from '../Shop/ItemDetails';
import '../../styles/InventoryScreen.css';
import { inventoryBackground } from '../../assets';

// Пример данных инвентаря (в будущем будут загружаться из API)
const mockInventoryData = {
  // Предметы из магазина
  shopItems: [1, 3, 5], // ID предметов из магазина
  
  // Выбранные кубики (не более 5)
  selectedDice: ['base_dice', 'base_dice'],
  
  // Выбранные скины и особые карты
  selectedCards: {
    king: {
      skin: 1, // ID скина из магазина
      special: null // ID особой карты из магазина
    },
    witch: {
      skin: 5,
      special: null
    },
    // По умолчанию для всех остальных карт используется базовый скин
  }
};

// Типы вкладок в инвентаре
const TAB_TYPES = {
  DECK: 'deck',
  DICE: 'dice'
};

const InventoryScreen = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(TAB_TYPES.DECK);
  const [inventoryData, setInventoryData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [shopItems, setShopItems] = useState([]);
  
  // Загрузка данных инвентаря
  useEffect(() => {
    // В будущем здесь будет запрос к API
    // Пока используем моковые данные
    setInventoryData(mockInventoryData);
    
    // Загружаем список предметов из магазина
    // В будущем этот список будет также приходить с сервера
    const fetchShopItems = () => {
      // Имитация запроса к API
      // TODO: заменить на реальный запрос
      setTimeout(() => {
        // Пример данных магазина
        const mockShopItems = [
          {
            id: 1,
            type: 'card_skin',
            name: 'Royal King',
            description: 'A majestic version of the King card.',
            price: 50,
            image: '/images/shop/king_skin.png',
            rarity: 'Common',
            cardType: 'king'
          },
          {
            id: 3,
            type: 'special_card',
            name: 'Oracle King',
            description: 'A special King card that grants an extra turn when used in a combination.',
            price: 150,
            image: '/images/shop/oracle_king.png',
            rarity: 'Rare',
            cardType: 'king',
            effect: 'extra_turn'
          },
          {
            id: 5,
            type: 'card_skin',
            name: 'Shadow Witch',
            description: 'A mysterious version of the Witch card.',
            price: 50,
            image: '/images/shop/witch_skin.png',
            rarity: 'Common',
            cardType: 'witch'
          }
        ];
        
        setShopItems(mockShopItems);
      }, 500);
    };
    
    fetchShopItems();
  }, []);
  
  // Обработчик изменения вкладки
  const handleTabChange = (tabType) => {
    setActiveTab(tabType);
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
  
  // Обработчик выбора карты
  const handleCardSelect = (cardType, item, isSpecial) => {
    if (!inventoryData) return;
    
    const updatedInventory = { ...inventoryData };
    
    // Если карта не существует в выбранных, создаем новую запись
    if (!updatedInventory.selectedCards[cardType]) {
      updatedInventory.selectedCards[cardType] = {
        skin: null,
        special: null
      };
    }
    
    // Если item равен null, сбрасываем оба варианта
    if (item === null) {
      updatedInventory.selectedCards[cardType] = {
        skin: null,
        special: null
      };
    } else {
      // Обновляем выбранный вариант и сбрасываем другой
      if (isSpecial) {
        updatedInventory.selectedCards[cardType] = {
          skin: null,
          special: item.id
        };
      } else {
        updatedInventory.selectedCards[cardType] = {
          skin: item.id,
          special: null
        };
      }
    }
    
    setInventoryData(updatedInventory);
    localStorage.setItem('inventory_data', JSON.stringify(updatedInventory));
  };
  
  // Обработчик выбора кубика
  const handleDiceSelect = (diceId) => {
    if (!inventoryData) return;
    
    const updatedInventory = { ...inventoryData };
    
    // Максимальное количество кубиков - 5
    if (updatedInventory.selectedDice.length < 5) {
      updatedInventory.selectedDice.push(diceId);
      
      setInventoryData(updatedInventory);
      localStorage.setItem('inventory_data', JSON.stringify(updatedInventory));
    }
  };
  
  // Обработчик удаления кубика
  const handleDiceRemove = (index) => {
    if (!inventoryData) return;
    
    const updatedInventory = { ...inventoryData };
    
    // Удаляем кубик только если останется минимум 2
    if (updatedInventory.selectedDice.length > 2) {
      updatedInventory.selectedDice.splice(index, 1);
      
      setInventoryData(updatedInventory);
      localStorage.setItem('inventory_data', JSON.stringify(updatedInventory));
    }
  };
  
  // Обработчик кнопки "назад"
  const handleBackClick = () => {
    navigate('/main');
  };

  // Если данные еще не загружены, показываем загрузку
  if (!inventoryData || shopItems.length === 0) {
    return (
      <div className="inventory-screen">
        <h1>Loading inventory...</h1>
      </div>
    );
  }

  return (
    <div className="inventory-screen" style={{ backgroundImage: `url(${inventoryBackground})` }}>
      <h1 className="inventory-title">Inventory</h1>
      
      <div className="inventory-tabs">
        <button 
          className={`inventory-tab ${activeTab === TAB_TYPES.DECK ? 'active' : ''}`}
          onClick={() => handleTabChange(TAB_TYPES.DECK)}
        >
          Card Deck
        </button>
        <button 
          className={`inventory-tab ${activeTab === TAB_TYPES.DICE ? 'active' : ''}`}
          onClick={() => handleTabChange(TAB_TYPES.DICE)}
        >
          Dice Selection
        </button>
      </div>
      
      <div className="inventory-content">
        {activeTab === TAB_TYPES.DECK ? (
          <DeckBuilder
            baseCards={BASE_DECK}
            shopItems={shopItems}
            selectedCards={inventoryData.selectedCards}
            ownedItems={inventoryData.shopItems}
            onSelectCard={handleCardSelect}
            onViewDetails={handleItemSelect}
          />
        ) : (
          <DiceSelection
            baseDice={BASE_DICE}
            specialDice={SPECIAL_DICE}
            selectedDice={inventoryData.selectedDice}
            ownedItems={inventoryData.shopItems}
            onSelectDice={handleDiceSelect}
            onRemoveDice={handleDiceRemove}
            onViewDetails={handleItemSelect}
          />
        )}
      </div>
      
      {showItemDetails && selectedItem && (
        <ItemDetails
          item={selectedItem}
          owned={true}
          onClose={handleCloseDetails}
        />
      )}
      
      <button className="back-button" onClick={handleBackClick}>
        Back to Main Menu
      </button>
    </div>
  );
};

export default InventoryScreen;