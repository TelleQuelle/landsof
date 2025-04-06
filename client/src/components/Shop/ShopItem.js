// client/src/components/Shop/ShopItem.js
import React from 'react';
import '../../styles/ShopItem.css';

// Цвета для разных редкостей предметов
const RARITY_COLORS = {
  Common: '#8d8d8d',
  Uncommon: '#4dbd74',
  Rare: '#2b96cc',
  Epic: '#a335ee',
  Legendary: '#ff8c00',
  Partner: '#ffd700'
};

const ShopItem = ({ item, owned, onSelect }) => {
  // Определяем цвет рамки по редкости предмета
  const rarityColor = RARITY_COLORS[item.rarity] || RARITY_COLORS.Common;
  
  return (
    <div 
      className={`shop-item ${owned ? 'owned' : ''}`}
      onClick={onSelect}
      style={{ borderColor: rarityColor }}
    >
      <div className="item-image-container">
        <img 
          src={item.image} 
          alt={item.name} 
          className="item-image"
        />
        {owned && (
          <div className="owned-badge">
            Owned
          </div>
        )}
      </div>
      
      <div className="item-info">
        <h3 className="item-name" style={{ color: rarityColor }}>{item.name}</h3>
        <div className="item-rarity" style={{ color: rarityColor }}>
          {item.rarity}
        </div>
        
        {!owned && (
          <div className="item-price">
            <img src="/images/ui/silver-coin.png" alt="Silver" className="price-icon" />
            <span className="price-amount">{item.price}</span>
          </div>
        )}
      </div>
      
      {item.effect && (
        <div className="item-effect-badge">
          Special
        </div>
      )}
    </div>
  );
};

export default ShopItem;