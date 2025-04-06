// client/src/components/Menu/CampaignMenu.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CampaignMenu.css';

// Данные уровней кампании
const campaignLevels = [
  { id: 1, name: 'Treachery', unlocked: true, completed: false },
  { id: 2, name: 'Fraud', unlocked: false, completed: false },
  { id: 3, name: 'Violence', unlocked: false, completed: false },
  { id: 4, name: 'Heresy', unlocked: false, completed: false },
  { id: 5, name: 'Wrath', unlocked: false, completed: false },
  { id: 6, name: 'Greed', unlocked: false, completed: false },
  { id: 7, name: 'Gluttony', unlocked: false, completed: false },
  { id: 8, name: 'Lust', unlocked: false, completed: false },
  { id: 9, name: 'Limbo', unlocked: false, completed: false },
  { id: 10, name: 'Freedom', unlocked: false, completed: false }
];

const CampaignMenu = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState(campaignLevels);
  
  // Загрузка прогресса из локального хранилища или API
  useEffect(() => {
    const loadProgress = () => {
      // В будущем здесь будет запрос к API
      // Пока используем локальное хранилище
      const savedProgress = localStorage.getItem('campaign_progress');
      
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        
        // Обновляем статус уровней
        const updatedLevels = levels.map(level => {
          const levelProgress = parsedProgress.find(p => p.id === level.id);
          
          if (levelProgress) {
            return {
              ...level,
              unlocked: levelProgress.unlocked,
              completed: levelProgress.completed
            };
          }
          
          return level;
        });
        
        setLevels(updatedLevels);
      } else {
        // Если прогресса нет, открываем только первый уровень
        const initialLevels = levels.map((level, index) => ({
          ...level,
          unlocked: index === 0
        }));
        
        setLevels(initialLevels);
        localStorage.setItem('campaign_progress', JSON.stringify(initialLevels));
      }
    };
    
    loadProgress();
  }, []);
  
  // Обработчик выбора уровня
  const handleLevelSelect = (level) => {
    if (level.unlocked) {
      navigate(`/level/${level.id}`);
    }
  };
  
  // Обработчик кнопки "назад"
  const handleBackClick = () => {
    navigate('/play');
  };
  
  // Функция для отображения рун вместо названия для заблокированных уровней
  const getDisplayName = (level) => {
    if (level.unlocked) {
      return level.name;
    }
    
    // Рандомные руны для заблокированных уровней
    return 'ᚴᛈᚧᚢᛂᛆᚻ';
  };
  
  // Функция для определения статуса уровня
  const getLevelStatus = (level) => {
    if (level.completed) return 'Completed';
    if (level.unlocked) return 'Unlocked';
    return 'Locked';
  };

  return (
    <div className="campaign-menu-container">
      <h1 className="campaign-title">Campaign ⚔️</h1>
      <p className="campaign-subtitle">Select your trial, brave soul...</p>
      
      <div className="campaign-levels">
        {levels.map((level) => (
          <div
            key={level.id}
            className={`campaign-level ${level.unlocked ? 'unlocked' : 'locked'} ${level.completed ? 'completed' : ''}`}
            onClick={() => handleLevelSelect(level)}
          >
            <div className="level-number">{level.id}</div>
            <div className="level-name">{getDisplayName(level)}</div>
            <div className="level-status">{getLevelStatus(level)}</div>
          </div>
        ))}
      </div>
      
      <button className="back-button" onClick={handleBackClick}>Back</button>
    </div>
  );
};

export default CampaignMenu;