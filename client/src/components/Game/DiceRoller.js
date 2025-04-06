// client/src/components/Game/DiceRoller.js
import React, { useState, useEffect } from 'react';
import { DICE_VALUE_NAMES, DICE_IMAGES } from '../../constants/dice';
import '../../styles/DiceRoller.css';

const DiceRoller = ({ dice, selectedIndex, onSelectDice, gameState }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentRotation, setCurrentRotation] = useState([0, 0]);
  
  // Эффект для анимации броска кубиков
  useEffect(() => {
    if (gameState === 'rolling' && dice.length === 2) {
      setIsRolling(true);
      
      // Генерируем случайные углы поворота для анимации
      const randomRotations = [
        Math.floor(Math.random() * 360) + 720, // Минимум 2 полных оборота
        Math.floor(Math.random() * 360) + 720
      ];
      
      setCurrentRotation(randomRotations);
      
      // Завершаем анимацию через 1.5 секунды
      const timer = setTimeout(() => {
        setIsRolling(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState, dice]);
  
  // Отключаем выбор кубика во время анимации
  const handleSelectDice = (index) => {
    if (!isRolling && gameState === 'rolling') {
      onSelectDice(index);
    }
  };
  
  return (
    <div className="dice-roller">
      <h2>Roll the Dice</h2>
      
      <div className="dice-container">
        {dice.length === 2 ? (
          <>
            <div 
              className={`dice ${isRolling ? 'rolling' : ''} ${selectedIndex === 0 ? 'selected' : ''}`}
              onClick={() => handleSelectDice(0)}
              style={{ transform: isRolling ? `rotate(${currentRotation[0]}deg)` : 'none' }}
            >
              {!isRolling && (
                <div className="dice-value">
                  <img 
                    src={DICE_IMAGES[dice[0]]} 
                    alt={DICE_VALUE_NAMES[dice[0]]} 
                    className="dice-image"
                  />
                  <span className="dice-name">{DICE_VALUE_NAMES[dice[0]]}</span>
                </div>
              )}
            </div>
            
            <div 
              className={`dice ${isRolling ? 'rolling' : ''} ${selectedIndex === 1 ? 'selected' : ''}`}
              onClick={() => handleSelectDice(1)}
              style={{ transform: isRolling ? `rotate(${currentRotation[1]}deg)` : 'none' }}
            >
              {!isRolling && (
                <div className="dice-value">
                  <img 
                    src={DICE_IMAGES[dice[1]]} 
                    alt={DICE_VALUE_NAMES[dice[1]]} 
                    className="dice-image"
                  />
                  <span className="dice-name">{DICE_VALUE_NAMES[dice[1]]}</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="dice-placeholder">
            <span>Preparing dice...</span>
          </div>
        )}
      </div>
      
      {gameState === 'rolling' && !isRolling && (
        <div className="dice-instructions">
          <p>Select one of the dice to create combinations</p>
        </div>
      )}
      
      {selectedIndex !== null && (
        <div className="selected-dice-info">
          <p>Selected: {DICE_VALUE_NAMES[dice[selectedIndex]]}</p>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;