// client/src/components/Game/GameStats.js
import React from 'react';
import '../../styles/GameStats.css';

const GameStats = ({ turn, maxTurns, score, turnScore, goalScore }) => {
  // Вычисляем текущий общий счет с учетом очков текущего хода
  const currentTotal = score + turnScore;
  
  // Вычисляем, сколько процентов от цели набрано
  const progressPercentage = Math.min(100, (currentTotal / goalScore) * 100);
  
  // Вычисляем, сколько очков осталось до цели
  const remainingPoints = Math.max(0, goalScore - currentTotal);
  
  // Вычисляем, сколько очков в среднем нужно набирать за оставшиеся ходы
  const remainingTurns = maxTurns - turn + 1; // +1 потому что текущий ход еще не завершен
  const pointsPerRemainingTurn = remainingTurns > 0 
    ? Math.ceil(remainingPoints / remainingTurns) 
    : 0;

  return (
    <div className="game-stats">
      <h2>Game Statistics</h2>
      
      <div className="stats-container">
        <div className="stat-group">
          <div className="stat-item">
            <span className="stat-label">Turn:</span>
            <span className="stat-value">{turn} / {maxTurns}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Current Turn:</span>
            <span className="stat-value">{turnScore}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{currentTotal} / {goalScore}</span>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-label">
            Progress to Victory
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="progress-percentage">
            {progressPercentage.toFixed(1)}%
          </div>
        </div>
        
        <div className="remaining-stats">
          <div className="stat-item">
            <span className="stat-label">Points Needed:</span>
            <span className="stat-value">{remainingPoints}</span>
          </div>
          
          <div className="stat-item">
            <span className="stat-label">Turns Remaining:</span>
            <span className="stat-value">{remainingTurns}</span>
          </div>
          
          {remainingTurns > 0 && (
            <div className="stat-item">
              <span className="stat-label">Points Per Turn Needed:</span>
              <span className="stat-value">{pointsPerRemainingTurn}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameStats;