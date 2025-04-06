// client/src/components/Game/GameControls.js
import React, { useState } from 'react';
import '../../styles/GameControls.css';

const GameControls = ({ 
  gameState, 
  canDrawCard, 
  onDrawCard, 
  onEndTurn, 
  onExitGame 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Обработчик нажатия кнопки "Выйти из игры"
  const handleExitClick = () => {
    setShowConfirm(true);
  };
  
  // Обработчик подтверждения выхода
  const handleConfirmExit = () => {
    onExitGame();
  };
  
  // Обработчик отмены выхода
  const handleCancelExit = () => {
    setShowConfirm(false);
  };
  
  return (
    <div className="game-controls">
      <h2>Controls</h2>
      
      <div className="controls-container">
        {gameState === 'selecting' && (
          <>
            <button 
              className={`control-button draw-button ${!canDrawCard ? 'disabled' : ''}`}
              onClick={canDrawCard ? onDrawCard : undefined}
              disabled={!canDrawCard}
            >
              Draw Additional Card
            </button>
            
            <button 
              className="control-button end-turn-button"
              onClick={onEndTurn}
            >
              End Turn
            </button>
          </>
        )}
        
        {gameState === 'rolling' && (
          <div className="control-info">
            <p>Select one of the dice to continue</p>
          </div>
        )}
        
        {gameState === 'turnend' && (
          <div className="control-info">
            <p>Turn ended! Invalid card selected.</p>
            <p>Preparing next turn...</p>
          </div>
        )}
        
        <button 
          className="control-button exit-button"
          onClick={handleExitClick}
        >
          Exit Game
        </button>
        
        {showConfirm && (
          <div className="confirm-dialog">
            <p>Are you sure you want to exit? Progress will be lost.</p>
            <div className="confirm-buttons">
              <button 
                className="confirm-button confirm-yes"
                onClick={handleConfirmExit}
              >
                Yes, Exit
              </button>
              <button 
                className="confirm-button confirm-no"
                onClick={handleCancelExit}
              >
                No, Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameControls;