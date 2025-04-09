// client/src/components/Shop/ItemDetails.js
import React, { useState } from 'react';
import '../../styles/ItemDetails.css';

// Цвета для разных редкостей предметов
const RARITY_COLORS = {
  Common: '#8d8d8d',
  Uncommon: '#4dbd74',
  Rare: '#2b96cc',
  Epic: '#a335ee',
  Legendary: '#ff8c00',
  Partner: '#ffd700'
};

// Описания эффектов для специальных предметов
const EFFECT_DESCRIPTIONS = {
  extra_turn: 'Grants an extra turn when used in a successful combination.',
  score_multiplier: 'Applies a 1.25x multiplier to your turn score when used in a combination.',
  increased_points: 'This card provides 1.5x the normal points when used in a combination.',
  universal: 'This card can be used with any dice value to form a valid combination.',
  silver_multiplier: 'Provides a 1.25x multiplier to silver rewards once per level.',
  emotional_vices: 'This dice favors emotional vices: Lust (25%), Discord (25%), and Carelessness (25%).',
  material_vices: 'This dice favors material vices: Greed (25%), Power (25%), and Peace (25%).',
  social_vices: 'This dice favors social vices: Power (25%), Lust (25%), and Carelessness (25%).',
  destructive_vices: 'This dice favors destructive vices: Discord (25%), Greed (25%), and Peace (25%).'
};

const ItemDetails = ({ item, owned, silver, onBuy, onClose }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Определяем цвет рамки по редкости предмета
  const rarityColor = RARITY_COLORS[item.rarity] || RARITY_COLORS.Common;
  
  // Функция для отображения типа предмета
  const getItemTypeDisplay = () => {
    switch (item.type) {
      case 'card_skin':
        return `Card Skin (${item.cardType.charAt(0).toUpperCase() + item.cardType.slice(1)})`;
      case 'dice_skin':
        return 'Dice Skin';
      case 'special_card':
        return `Special Card (${item.cardType.charAt(0).toUpperCase() + item.cardType.slice(1)})`;
      case 'special_dice':
        return 'Special Dice';
      default:
        return item.type;
    }
  };
  
  // Обработчик нажатия кнопки покупки
  const handleBuyClick = () => {
    if (owned) return;
    
    if (silver < item.price) {
      // Недостаточно серебра
      return;
    }
    
    setShowConfirmation(true);
  };
  
  // Обработчик подтверждения покупки
  const handleConfirmBuy = () => {
    onBuy();
    setShowConfirmation(false);
  };
  
  // Обработчик отмены покупки
  const handleCancelBuy = () => {
    setShowConfirmation(false);
  };
  
  // Открытие внешних ссылок (для партнерских предметов)
  const openExternalLink = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="item-details-overlay">
      <div className="item-details" style={{ borderColor: rarityColor }}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="item-header">
          <h2 className="item-name" style={{ color: rarityColor }}>{ item.name}</h2>
          <div className="item-badges">
            <span className="item-type">{getItemTypeDisplay()}</span>
            <span className="item-rarity" style={{ backgroundColor: rarityColor }}>{item.rarity}</span>
          </div>
        </div>
        
        <div className="item-content">
          <div className={`item-image-large ${(item.type === 'dice_skin' || item.type === 'special_dice') ? 'dice-image' : 'card-image'}`}>
            <img src={item.image} alt={item.name} />
          </div>
          
          <div className="item-info-detailed">
            <p className="item-description">{item.description}</p>
            
            {item.effect && (
              <div className="item-effect">
                <h3>Special Effect:</h3>
                <p>{EFFECT_DESCRIPTIONS[item.effect]}</p>
              </div>
            )}
            
            {/* Для партнерских предметов */}
            {item.isPartner && item.partnerInfo && (
              <div className="partner-info">
                <h3>Partner:</h3>
                <div className="partner-details">
                  {item.partnerInfo.logo && (
                    <img src={item.partnerInfo.logo} alt={item.partnerInfo.name} className="partner-logo" />
                  )}
                  <div className="partner-text">
                    <h4>{item.partnerInfo.name}</h4>
                    <p>{item.partnerInfo.description}</p>
                  </div>
                </div>
                
                {/* Социальные сети партнера */}
                {(item.partnerInfo.twitter || item.partnerInfo.discord) && (
                  <div className="partner-socials">
                    {item.partnerInfo.twitter && (
                      <button 
                        className="social-button twitter"
                        onClick={() => openExternalLink(item.partnerInfo.twitter)}
                      >
                        <img src="/images/ui/twitter-icon.png" alt="Twitter" />
                      </button>
                    )}
                    {item.partnerInfo.discord && (
                      <button 
                        className="social-button discord"
                        onClick={() => openExternalLink(item.partnerInfo.discord)}
                      >
                        <img src="/images/ui/discord-icon.png" alt="Discord" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="item-actions">
          {owned ? (
            <div className="owned-message">You own this item</div>
          ) : (
            <div className="buy-section">
              <div className="item-price-large">
                <img src="/images/ui/silver-coin.png" alt="Silver" className="price-icon" />
                <span className="price-amount">{item.price}</span>
              </div>
              
              <button 
                className={`buy-button ${silver < item.price ? 'disabled' : ''}`}
                onClick={handleBuyClick}
                disabled={silver < item.price}
              >
                {silver < item.price ? 'Not Enough Silver' : 'Buy Item'}
              </button>
              
              {silver < item.price && (
                <div className="price-warning">
                  You need {item.price - silver} more silver
                </div>
              )}
            </div>
          )}
        </div>
        
        {showConfirmation && (
          <div className="confirmation-dialog">
            <h3>Confirm Purchase</h3>
            <p>Do you want to buy {item.name} for {item.price} silver?</p>
            <div className="confirmation-buttons">
              <button 
                className="confirm-button"
                onClick={handleConfirmBuy}
              >
                Yes, Buy It
              </button>
              <button 
                className="cancel-button"
                onClick={handleCancelBuy}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;