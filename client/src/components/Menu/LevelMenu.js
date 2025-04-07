// client/src/components/Menu/LevelMenu.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/LevelMenu.css';

// Данные уровней кампании
const levelData = [
  {
    id: 1,
    name: 'Treachery',
    goal: { points: 300, turns: 5 },
    stats: { attempts: 0, silver: 0, turns: 0 }
  },
  {
    id: 2,
    name: 'Fraud',
    goal: { points: 400, turns: 6 },
    stats: { attempts: 0, silver: 0, turns: 0 }
  },
  {
    id: 3,
    name: 'Violence',
    goal: { points: 500, turns: 6 },
    stats: { attempts: 0, silver: 0, turns: 0 }
  },
  {
    id: 4,
    name: 'Heresy',
    goal: { points: 600, turns: 7 },
    stats: { attempts: 0, silver: 0, turns: 0 }
  },
  {
    id: 5,
    name: 'Wrath',
    goal: { points: 700, turns: 7 },
    stats: { attempts: 0, silver: 0, turns: 0 }
  },
  {
    id: 6,
    name: 'Greed',
    goal: { points: 800, turns: 8 },
    stats: { attempts: 0, silver: 0, turns: 0 }
  },
  {
    id: 7,
    name: 'Gluttony',
    goal: { points: 900, turns: 8 },
    stats: { attempts: 0, silver: 0, turns: 0 }
  },
  {
    id: 8,
    name: 'Lust',
    goal: { points: 1000, turns: 9 },
    stats: { attempts: 0, silver: 0, turns: 0 }
  },
  {
    id: 9,
    name: 'Limbo',
    goal: { points: 1100, turns: 9 },
    stats: { attempts: 0, silver: 0, turns: 0 }
  },
  {
    id: 10,
    name: 'Freedom',
    goal: { points: 1200, turns: 10 },
    stats: { attempts: 0, silver: 0, turns: 0 }
  }
];

const LevelMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    // Находим уровень по ID
    const levelId = parseInt(id, 10);
    const currentLevel = levelData.find(l => l.id === levelId);
    
    if (currentLevel) {
      setLevel(currentLevel);
      
      // Проверяем, пройден ли уровень
      const savedProgress = localStorage.getItem('campaign_progress');
      
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        const levelProgress = parsedProgress.find(p => p.id === levelId);
        
        if (levelProgress) {
          setIsCompleted(levelProgress.completed);
          
          // Загружаем статистику
          const savedStats = localStorage.getItem(`level_stats_${levelId}`);
          
          if (savedStats) {
            setStats(JSON.parse(savedStats));
          }
        }
      }
    } else {
      // Если уровень не найден, возвращаемся к меню кампании
      navigate('/campaign');
    }
  }, [id, navigate]);
  
  // Обработчики кнопок
  const handleBeginClick = () => {
    navigate(`/game/${id}`);
  };
  
  const handleLoreClick = () => {
    navigate(`/level/${id}/lore`);
  };
  
  const handleBackClick = () => {
    navigate('/campaign');
  };
  
  // Если уровень еще не загружен, показываем загрузку
  if (!level) {
    return (
      <div className="level-menu-container">
        <h1>Loading level...</h1>
      </div>
    );
  }

  return (
    <div className="level-menu-container">
      <h1 className="level-title">Level {level.id}: {level.name}</h1>
      
      <div className="level-goal">
        <p>Goal: Earn {level.goal.points} points in {level.goal.turns} turns.</p>
      </div>
      
      {isCompleted && stats && (
        <div className="level-stats">
          <h2>Your achievements:</h2>
          <p>Attempts: {stats.attempts}</p>
          <p>Silver earned: {stats.silver}</p>
          <p>Turns used: {stats.turns}</p>
        </div>
      )}
      
      <div className="level-buttons-table">
        <button className="level-button begin-button" onClick={handleBeginClick}>
          Begin
        </button>
        <button className="level-button lore-button" onClick={handleLoreClick}>
          Lore
        </button>
        <button className="level-button back-button" onClick={handleBackClick}>
          Back
        </button>
      </div>
    </div>
  );
};

export default LevelMenu;