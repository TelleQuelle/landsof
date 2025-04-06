// client/src/components/Game/LoseScreen.js
import React from 'react';
import '../../styles/LoseScreen.css';

const LoseScreen = ({ levelInfo, score, gameStats, onRetry, onBack }) => {
  // Вычисляем, насколько игрок был близок к победе
  const percentageCompleted = Math.min(100, (score / levelInfo.goal.points) * 100);
  
  // Генерируем сообщение в зависимости от прогресса
  const getMessage = () => {
    if (percentageCompleted >= 90) {
      return "So close to victory! Just a bit more effort and you'll conquer this level.";
    } else if (percentageCompleted >= 70) {
      return "A valiant effort! The Abyss tests your resolve, but you're getting stronger.";
    } else if (percentageCompleted >= 50) {
      return "The challenge proved formidable, but your skills are improving. Try again!";
    } else if (percentageCompleted >= 30) {
      return "The denizens of this circle are cunning. Learn their tricks and return stronger.";
    } else {
      return "The path to freedom is fraught with peril. Gather your courage and try again!";
    }
  };

  return (
    <div className="lose-screen">
      <h1 className="defeat-title">Defeat</h1>
      
      <div className="defeat-message">
        <p>{getMessage()}</p>
      </div>
      
      <div className="stats-summary">
        <h2>Your Results</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Your Score:</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Goal:</span>
            <span className="stat-value">{levelInfo.goal.points}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Turns Used:</span>
            <span className="stat-value">{gameStats.turns}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Combinations:</span>
            <span className="stat-value">{gameStats.combinations}</span>
          </div>
        </div>
      </div>
      
      <div className="progress-section">
        <h2>Progress to Victory</h2>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${percentageCompleted}%` }}
            />
          </div>
          <div className="progress-percentage">
            {percentageCompleted.toFixed(1)}%
          </div>
        </div>
        <p className="progress-description">
          You needed {levelInfo.goal.points - score} more points to succeed.
        </p>
      </div>
      
      <div className="tips-section">
        <h2>Tips for Success</h2>
        <ul className="tips-list">
          <li>Focus on creating combinations with the highest point values.</li>
          <li>Remember that King, Bard, and Peasant cards affect your score multipliers.</li>
          <li>Consider drawing additional cards when your current combination has low value.</li>
          <li>Plan ahead for future turns - sometimes it's better to secure points than risk losing them.</li>
        </ul>
      </div>
      
      <div className="navigation-buttons">
        <button 
          className="retry-button"
          onClick={onRetry}
        >
          Try Again
        </button>
        
        <button 
          className="back-button"
          onClick={onBack}
        >
          Back to Level Menu
        </button>
      </div>
    </div>
  );
};

export default LoseScreen;