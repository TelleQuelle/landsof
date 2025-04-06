// client/src/components/Menu/GameMenu.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/GameMenu.css';

const GameMenu = () => {
  const navigate = useNavigate();
  const [isCampaignCompleted, setIsCampaignCompleted] = useState(false);
  
  // Проверяем, завершена ли кампания
  useEffect(() => {
    // Здесь позже будет запрос к API или проверка локального хранилища
    // Для начала просто ставим false, чтобы закрыть приключения
    const checkCampaignStatus = () => {
      const campaignStatus = localStorage.getItem('campaign_completed');
      setIsCampaignCompleted(campaignStatus === 'true');
    };
    
    checkCampaignStatus();
  }, []);
  
  // Обработчики кнопок
  const handleCampaignClick = () => {
    navigate('/campaign');
  };
  
  const handleAdventureClick = () => {
    if (isCampaignCompleted) {
      navigate('/adventure');
    }
    // Если кампания не завершена, ничего не делаем - кнопка неактивна
  };
  
  const handleBackClick = () => {
    navigate('/main');
  };

  return (
    <div className="game-menu-container">
      <h1 className="game-menu-title">What's your path?</h1>
      
      <div className="game-options">
        <div className="game-option campaign" onClick={handleCampaignClick}>
          <div className="game-option-image">
            <img src="/images/ui/campaign-image.png" alt="Campaign" />
          </div>
          <div className="game-option-title">Campaign</div>
        </div>
        
        <div className={`game-option adventure ${!isCampaignCompleted ? 'locked' : ''}`} onClick={handleAdventureClick}>
          <div className="game-option-image">
            <img src="/images/ui/adventure-image.png" alt="Adventure" />
            {!isCampaignCompleted && (
              <div className="locked-overlay">
                <span>Complete the campaign first</span>
              </div>
            )}
          </div>
          <div className="game-option-title">Adventure</div>
        </div>
      </div>
      
      <button className="back-button" onClick={handleBackClick}>Back</button>
    </div>
  );
};

export default GameMenu;