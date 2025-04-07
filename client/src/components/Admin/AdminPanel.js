// client/src/components/Admin/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ItemCreator from './ItemCreator';
import GameStatistics from './GameStatistics';
import '../../styles/AdminPanel.css';
import { adminBackground } from '../../assets';

// Вкладки админ-панели
const ADMIN_TABS = {
  ITEM_CREATOR: 'item_creator',
  STATISTICS: 'statistics'
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(ADMIN_TABS.ITEM_CREATOR);
  const [gameStats, setGameStats] = useState(null);
  
  // Загрузка статистики игры
  useEffect(() => {
    const fetchStatistics = () => {
      // В будущем здесь будет запрос к API
      // Пока используем моковые данные
      setTimeout(() => {
        // Пример данных статистики
        const mockStats = {
          totalUsers: 120,
          activePlayers: 56,
          averagePlaytime: 28, // минут
          totalGames: 324,
          campaignProgress: {
            level1: { completed: 98, attempts: 142 },
            level2: { completed: 76, attempts: 123 },
            level3: { completed: 65, attempts: 102 },
            level4: { completed: 54, attempts: 89 },
            level5: { completed: 45, attempts: 81 },
            level6: { completed: 38, attempts: 68 },
            level7: { completed: 30, attempts: 58 },
            level8: { completed: 25, attempts: 49 },
            level9: { completed: 18, attempts: 37 },
            level10: { completed: 12, attempts: 28 }
          },
          mostPopularItems: [
            { id: 3, type: 'special_card', name: 'Oracle King', purchases: 24 },
            { id: 7, type: 'special_dice', name: 'Emotional Dice', purchases: 18 },
            { id: 4, type: 'special_dice', name: 'Fortune Dice', purchases: 15 }
          ],
          totalSilverEarned: 18250,
          totalSilverSpent: 12840,
          nftsMinted: 9,
          walletDistribution: {
            phantom: 92,
            solflare: 28
          }
        };
        
        setGameStats(mockStats);
      }, 500);
    };
    
    fetchStatistics();
  }, []);
  
  // Обработчик изменения вкладки
  const handleTabChange = (tabType) => {
    setActiveTab(tabType);
  };
  
  // Обработчик кнопки "назад"
  const handleBackClick = () => {
    navigate('/main');
  };

  return (
    <div className="admin-panel" style={{ backgroundImage: `url(${adminBackground})` }}>
      <h1 className="admin-title">Admin Panel</h1>
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === ADMIN_TABS.ITEM_CREATOR ? 'active' : ''}`}
          onClick={() => handleTabChange(ADMIN_TABS.ITEM_CREATOR)}
        >
          Item Creator
        </button>
        <button 
          className={`admin-tab ${activeTab === ADMIN_TABS.STATISTICS ? 'active' : ''}`}
          onClick={() => handleTabChange(ADMIN_TABS.STATISTICS)}
        >
          Game Statistics
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === ADMIN_TABS.ITEM_CREATOR ? (
          <ItemCreator />
        ) : (
          <GameStatistics stats={gameStats} />
        )}
      </div>
      
      <button className="back-button" onClick={handleBackClick}>
        Back to Main Menu
      </button>
    </div>
  );
};

export default AdminPanel;