// client/src/components/Game/CardDrawer.js
import React from 'react';
import { isCardValidForDiceValue } from '../../constants/combinations';
import { CARD_NAMES } from '../../constants/cards';
import { silverCoin } from '../../assets';
import '../../styles/CardDrawer.css';

const CardDrawer = ({ 
  availableCards, 
  selectedCards, 
  onSelectCard, 
  onUnselectCard, 
  selectedDiceValue,
  gameState
}) => {
  // Проверка, является ли карта допустимой для выбранного значения кубика
  const isCardValid = (card) => {
    if (!selectedDiceValue) return false;
    return isCardValidForDiceValue(card.type, selectedDiceValue);
  };
  
  return (
    <div className="card-drawer">
      <div className="card-section">
        <h2>Available Cards</h2>
        <div className="cards-container available-cards">
          {availableCards.map((card) => (
            <div 
              key={card.id}
              className={`card ${isCardValid(card) && gameState === 'selecting' ? 'valid' : ''} ${!selectedDiceValue ? 'disabled' : ''}`}
              onClick={() => gameState === 'selecting' && onSelectCard(card)}
            >
              <img 
                src={card.image || silverCoin} 
                alt={CARD_NAMES[card.type]} 
                className="card-image"
              />
              <div className="card-name">{card.name}</div>
              
              {selectedDiceValue && gameState === 'selecting' && (
                <div className={`card-status ${isCardValid(card) ? 'valid' : 'invalid'}`}>
                  {isCardValid(card) ? 'Valid' : 'Invalid'}
                </div>
              )}
            </div>
          ))}
          
          {availableCards.length === 0 && (
            <div className="no-cards-message">
              <p>No available cards</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="card-section">
        <h2>Selected Cards</h2>
        <div className="cards-container selected-cards">
          {selectedCards.map((card) => (
            <div 
              key={card.id}
              className="card selected"
              onClick={() => gameState === 'selecting' && onUnselectCard(card)}
            >
              <img 
                src={card.image || silverCoin} 
                alt={CARD_NAMES[card.type]} 
                className="card-image"
              />
              <div className="card-name">{card.name}</div>
              
              {gameState === 'selecting' && (
                <div className="card-remove">Click to remove</div>
              )}
            </div>
          ))}
          
          {selectedCards.length === 0 && (
            <div className="no-cards-message">
              <p>No selected cards</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDrawer;