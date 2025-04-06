// client/src/components/Game/CombinationDisplay.js
import React, { useState } from 'react';
import { DICE_VALUE_NAMES, DICE_IMAGES } from '../../constants/dice';
import { DICE_CARD_COMBINATIONS, POINTS_PER_CARD, CARD_MULTIPLIERS } from '../../constants/combinations';
import { CARD_NAMES } from '../../constants/cards';
import '../../styles/CombinationDisplay.css';

const CombinationDisplay = ({ selectedDiceValue, selectedCards, turnScore }) => {
  const [showRules, setShowRules] = useState(false);
  
  // Получаем список карт, которые могут участвовать в комбинации
  const validCardTypes = selectedDiceValue ? DICE_CARD_COMBINATIONS[selectedDiceValue] : [];
  
  // Проверяем наличие карт с мультипликаторами
  const hasMultiplierCards = selectedCards.some(card => 
    Object.keys(CARD_MULTIPLIERS).includes(card.type)
  );
  
  // Функция для отображения правил комбинаций
  const toggleRules = () => {
    setShowRules(!showRules);
  };
  
  return (
    <div className="combination-display">
      <div className="combination-header">
        <h2>Combination</h2>
        <button className="rules-button" onClick={toggleRules}>
          {showRules ? 'Hide Rules' : 'Show Rules'}
        </button>
      </div>
      
      {showRules ? (
        <div className="rules-container">
          <h3>Rules:</h3>
          <p>Select cards that match the chosen dice value to earn points:</p>
          
          <div className="rules-list">
            {Object.entries(DICE_CARD_COMBINATIONS).map(([diceValue, cardTypes]) => (
              <div key={diceValue} className="rule-item">
                <div className="rule-dice">
                  <img 
                    src={DICE_IMAGES[diceValue]} 
                    alt={DICE_VALUE_NAMES[diceValue]} 
                    className="rule-dice-image"
                  />
                  <span>{DICE_VALUE_NAMES[diceValue]}</span>
                </div>
                <div className="rule-cards">
                  {cardTypes.map(cardType => (
                    <span key={cardType} className="rule-card-name">
                      {CARD_NAMES[cardType]}
                    </span>
                  ))}
                </div>
                <div className="rule-points">
                  {POINTS_PER_CARD[diceValue]} pts/card
                </div>
              </div>
            ))}
          </div>
          
          <h3>Multipliers:</h3>
          <ul className="multipliers-list">
            {Object.entries(CARD_MULTIPLIERS).map(([cardType, multiplier]) => (
              <li key={cardType}>
                <span className="multiplier-card-name">{CARD_NAMES[cardType]}</span>: 
                <span className="multiplier-value">
                  {multiplier > 1 ? '+' : ''}{((multiplier - 1) * 100).toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
          
          <p className="risk-info">
            <strong>Risk:</strong> Drawing additional cards may increase your score,
            but if a card doesn't match your combination, you lose all points for this turn!
          </p>
        </div>
      ) : (
        <div className="current-combination">
          {selectedDiceValue ? (
            <>
              <div className="selected-dice-display">
                <h3>Selected Die: {DICE_VALUE_NAMES[selectedDiceValue]}</h3>
                <img 
                  src={DICE_IMAGES[selectedDiceValue]} 
                  alt={DICE_VALUE_NAMES[selectedDiceValue]} 
                  className="selected-dice-image"
                />
              </div>
              
              <div className="valid-cards-display">
                <h3>Valid Cards:</h3>
                <div className="valid-cards-list">
                  {validCardTypes.map(cardType => (
                    <span key={cardType} className="valid-card-name">
                      {CARD_NAMES[cardType]}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="point-value-display">
                <h3>Points per Card:</h3>
                <div className="points-value">
                  {POINTS_PER_CARD[selectedDiceValue]} points
                </div>
              </div>
              
              {hasMultiplierCards && (
                <div className="multipliers-display">
                  <h3>Active Multipliers:</h3>
                  <ul className="active-multipliers">
                    {selectedCards.filter(card => 
                      Object.keys(CARD_MULTIPLIERS).includes(card.type)
                    ).map(card => (
                      <li key={card.id}>
                        <span className="multiplier-card-name">{card.name}</span>: 
                        <span className="multiplier-value">
                          {CARD_MULTIPLIERS[card.type] > 1 ? '+' : ''}
                          {((CARD_MULTIPLIERS[card.type] - 1) * 100).toFixed(0)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="turn-score-display">
                <h3>Current Turn Score:</h3>
                <div className="turn-score-value">
                  {turnScore} points
                </div>
              </div>
            </>
          ) : (
            <div className="no-dice-selected">
              <p>Select a dice to view possible combinations</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CombinationDisplay;