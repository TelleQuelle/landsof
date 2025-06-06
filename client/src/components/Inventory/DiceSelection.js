// client/src/components/Inventory/DiceSelection.js
import React from 'react';
import '../../styles/DiceSelection.css';

const DiceSelection = ({
  baseDice,
  specialDice,
  selectedDice,
  ownedItems,
  onSelectDice,
  onRemoveDice,
  onViewDetails
}) => {
  // Проверка, принадлежит ли предмет пользователю
  const isItemOwned = (itemId) => {
    if (typeof itemId === 'string') {
      // Для базовых кубиков и полученных из кампании (как "memento_mori")
      return itemId === 'base_dice' || Object.keys(specialDice).includes(itemId);
    }
    
    // Для кубиков, купленных в магазине
    return ownedItems.includes(itemId);
  };
  
  // Подсчет количества кубиков определенного типа в выбранных
  const countDiceByType = (diceId) => {
    return selectedDice.filter(id => id === diceId).length;
  };
  
  // Получение информации о кубике по ID
  const getDiceInfo = (diceId) => {
    if (diceId === 'base_dice') {
      return baseDice;
    }
    
    return specialDice[diceId];
  };

  return (
    <div className="dice-selection">
      <div className="selected-dice-container">
        <h2>Selected Dice (Max 5)</h2>
        <p className="dice-description">
          You can select up to 5 dice. Each turn, 2 dice will be randomly chosen from your selection.
        </p>
        
        <div className="selected-dice-list">
          {selectedDice.length > 0 ? (
            selectedDice.map((diceId, index) => {
              const dice = getDiceInfo(diceId);
              
              return (
                <div key={index} className="selected-dice-item">
                  <img 
                    src={dice.image}
                    alt={dice.name}
                    className="dice-image"
                  />
                  <div className="dice-info">
                    <div className="dice-name">{dice.name}</div>
                    
                    {dice.effect && (
                      <div className="dice-effect-badge">
                        Special
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className="remove-dice-button"
                    onClick={() => onRemoveDice(index)}
                    disabled={selectedDice.length <= 2}
                  >
                    Remove
                  </button>
                </div>
              );
            })
          ) : (
            <div className="no-dice-message">
              <p>No dice selected. Add at least 2 dice to play.</p>
            </div>
          )}
          
          {selectedDice.length < 5 && (
            <div className="dice-slots-remaining">
              {5 - selectedDice.length} slot{5 - selectedDice.length !== 1 ? 's' : ''} remaining
            </div>
          )}
        </div>
      </div>
      
      <div className="available-dice-container">
        <h2>Available Dice</h2>
        
        <div className="dice-categories">
          {/* Базовые кубики */}
          <div className="dice-category">
            <h3>Basic Dice</h3>
            <div className="dice-grid">
              <div className="dice-item">
                <img 
                  src={baseDice.image}
                  alt={baseDice.name}
                  className="dice-image"
                />
                <div className="dice-info">
                  <div className="dice-name">{baseDice.name}</div>
                  <div className="dice-description">{baseDice.description}</div>
                  
                  {countDiceByType('base_dice') > 0 && (
                    <div className="dice-count">
                      Currently selected: {countDiceByType('base_dice')}
                    </div>
                  )}
                </div>
                
                <button 
                  className={`add-dice-button ${selectedDice.length >= 5 ? 'disabled' : ''}`}
                  onClick={() => selectedDice.length < 5 && onSelectDice('base_dice')}
                  disabled={selectedDice.length >= 5}
                >
                  Add to Selection
                </button>
              </div>
            </div>
          </div>
          
          {/* Специальные кубики */}
          <div className="dice-category">
            <h3>Special Dice</h3>
            <div className="dice-grid">
              {Object.entries(specialDice).filter(([key, _]) => isItemOwned(key)).map(([key, dice]) => (
                <div 
                  key={key}
                  className="dice-item special"
                >
                  <img 
                    src={dice.image}
                    alt={dice.name}
                    className="dice-image"
                  />
                  <div className="dice-info">
                    <div className="dice-name">{dice.name}</div>
                    <div className="dice-description">{dice.description}</div>
                    
                    {countDiceByType(key) > 0 && (
                      <div className="dice-count">
                        Currently selected: {countDiceByType(key)}
                      </div>
                    )}
                  </div>
                  
                  <div className="dice-effect-badge">
                    Special
                  </div>
                  
                  <button 
                    className="view-details-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(dice);
                    }}
                  >
                    Details
                  </button>
                  
                  <button 
                    className={`add-dice-button ${selectedDice.length >= 5 ? 'disabled' : ''}`}
                    onClick={() => selectedDice.length < 5 && onSelectDice(key)}
                    disabled={selectedDice.length >= 5}
                  >
                    Add to Selection
                  </button>
                </div>
              ))}
              
              {Object.entries(specialDice).filter(([key, _]) => isItemOwned(key)).length === 0 && (
                <div className="no-dice-message">
                  <p>No special dice available. Complete campaign levels or purchase from the shop.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiceSelection;