// client/src/components/Inventory/InventoryItemList.js
import React from 'react';
import '../../styles/InventoryItemList.css';
import { knightCard, witchCard } from '../../assets';

// Цвета для разных редкостей предметов
const RARITY_COLORS = {
  Common: '#8d8d8d',
  Uncommon: '#4dbd74',
  Rare: '#2b96cc',
  Epic: '#a335ee',
  Legendary: '#ff8c00',
  Partner: '#ffd700'
};

const InventoryItemList = ({ 
  items, 
  selectedItemId, 
  ownedItems, 
  onSelectItem, 
  onViewDetails,
  title
}) => {
  // Проверка, принадлежит ли предмет пользователю
  const isItemOwned = (itemId) => {
    return ownedItems.includes(itemId);
  };
  
  // Функция для получения имени класса для предмета
  const getItemClassName = (item) => {
    let className = 'inventory-item';
    
    if (item.id === selectedItemId) {
      className += ' selected';
    }
    
    if (item.id && !isItemOwned(item.id)) {
      className += ' locked';
    }
    
    return className;
  };

  return (
    <div className="inventory-item-list">
      {title && <h3 className="inventory-list-title">{title}</h3>}
      
      <div className="inventory-items">
        {items.map((item) => {
          // Для базовых предметов (без id) или принадлежащих пользователю
          const isAvailable = !item.id || isItemOwned(item.id);
          
          // Определяем цвет рамки по редкости предмета
          const rarityColor = item.rarity ? RARITY_COLORS[item.rarity] : RARITY_COLORS.Common;
          
          return (
            <div 
              key={item.id || item.type}
              className={getItemClassName(item)}
              onClick={() => isAvailable && onSelectItem(item)}
              style={{ borderColor: item.id === selectedItemId ? rarityColor : undefined }}
            >
              <div className="item-image-container">
                <img 
                  src={item.type === 'knight' ? knightCard : witchCard} 
                  alt={item.name} 
                  className="item-image"
                />
                
                {item.id === selectedItemId && (
                  <div className="selected-badge">
                    Selected
                  </div>
                )}
                
                {item.id && !isItemOwned(item.id) && (
                  <div className="locked-overlay">
                    <span>Not Owned</span>
                  </div>
                )}
              </div>
              
              <div className="item-info">
                <h4 className="item-name">{item.name}</h4>
                
                {item.rarity && (
                  <div className="item-rarity" style={{ color: rarityColor }}>
                    {item.rarity}
                  </div>
                )}
                
                {item.effect && (
                  <div className="item-effect-badge">
                    Special
                  </div>
                )}
              </div>
              
              {isAvailable && (
                <button 
                  className="view-details-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(item);
                  }}
                >
                  Details
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryItemList;