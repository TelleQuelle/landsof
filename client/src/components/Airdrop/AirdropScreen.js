// client/src/components/Airdrop/AirdropScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../../context/WalletContext';
import { getShortAddress } from '../../utils/web3';
import { silverCoin } from '../../assets';
import '../../styles/AirdropScreen.css';

const AirdropScreen = () => {
  const navigate = useNavigate();
  const { walletAddress, silver } = useWalletContext();
  const [ownedItems, setOwnedItems] = useState([]);
  const [stats, setStats] = useState({
    totalSilver: 0,
    campaignProgress: 0,
    itemsOwned: 0
  });
  
  // Загрузка данных при монтировании компонента
  useEffect(() => {
    // Загрузка списка приобретенных предметов
    const loadOwnedItems = () => {
      const savedOwnedItems = localStorage.getItem('owned_items');
      
      if (savedOwnedItems) {
        setOwnedItems(JSON.parse(savedOwnedItems));
      }
    };
    
    // Загрузка статистики
    const loadStats = () => {
      // Общее количество серебра (из контекста)
      const totalSilver = silver;
      
      // Прогресс кампании
      const calculateCampaignProgress = () => {
        const savedProgress = localStorage.getItem('campaign_progress');
        
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress);
          // Подсчитываем количество пройденных уровней и делим на общее количество (10)
          const completedLevels = parsedProgress.filter(level => level.completed).length;
          return Math.round((completedLevels / 10) * 100);
        }
        
        return 0;
      };
      
      setStats({
        totalSilver,
        campaignProgress: calculateCampaignProgress(),
        itemsOwned: ownedItems.length
      });
    };
    
    loadOwnedItems();
    loadStats();
  }, [silver, ownedItems.length]);
  
  // Обработчик кнопки "назад"
  const handleBackClick = () => {
    navigate('/main');
  };

  return (
    <div className="airdrop-screen">
      <h1 className="airdrop-title">Airdrop</h1>
      
      <div className="airdrop-banner">
        <img 
          src="/images/ui/airdrop-banner.png" 
          alt="Airdrop Banner" 
          className="airdrop-banner-image"
        />
      </div>
      
      <div className="airdrop-info">
        <div className="wallet-info">
          <h2>Your Wallet</h2>
          <p className="wallet-address">{getShortAddress(walletAddress)}</p>
        </div>
        
        <div className="stats-container">
          <div className="stat-item">
            <h3>Silver Balance</h3>
            <div className="stat-value">
              <img src={silverCoin} alt="Silver" className="silver-icon" />
              <span>{stats.totalSilver}</span>
            </div>
          </div>
          
          <div className="stat-item">
            <h3>Campaign Progress</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${stats.campaignProgress}%` }}
              />
              <span className="progress-text">{stats.campaignProgress}%</span>
            </div>
          </div>
          
          <div className="stat-item">
            <h3>Items Owned</h3>
            <div className="stat-value">{stats.itemsOwned}</div>
          </div>
        </div>
      </div>
      
      <div className="airdrop-status">
        <div className="status-icon">
          <img src="/images/ui/coming-soon-icon.png" alt="Coming Soon" />
        </div>
        <h2 className="status-title">$SILVER Token Airdrop Coming Soon</h2>
        <p className="status-message">
          Complete campaign levels, collect items, and earn silver to increase your airdrop allocation.
          Early players will be rewarded for their support!
        </p>
      </div>
      
      <div className="airdrop-details">
        <h2>Airdrop Details</h2>
        <div className="details-content">
          <div className="detail-item">
            <h3>Eligibility</h3>
            <p>
              All players who connect their Solana wallet and play the game before the airdrop
              snapshot date will be eligible to receive $SILVER tokens.
            </p>
          </div>
          
          <div className="detail-item">
            <h3>Allocation Factors</h3>
            <ul>
              <li>Campaign progress and completed levels</li>
              <li>In-game silver balance</li>
              <li>Items owned in your inventory</li>
              <li>Special achievements and NFTs</li>
              <li>Early player bonus</li>
            </ul>
          </div>
          
          <div className="detail-item">
            <h3>Token Utility</h3>
            <p>
              $SILVER tokens will provide governance rights, exclusive content access,
              special item discounts, and more benefits to be announced.
            </p>
          </div>
        </div>
      </div>
      
      <div className="airdrop-countdown">
        <h2>Stay Tuned</h2>
        <p>
          Follow our social media channels for airdrop announcements and updates.
          The snapshot date will be revealed soon!
        </p>
        <div className="social-buttons">
          <a href="https://discord.gg/tdMWdrwCSD" target="_blank" rel="noopener noreferrer" className="social-button discord">
            <img src="/images/ui/discord-icon.png" alt="Discord" />
            Discord
          </a>
          <a href="https://x.com/Nanti_NFT" target="_blank" rel="noopener noreferrer" className="social-button twitter">
            <img src="/images/ui/twitter-icon.png" alt="Twitter" />
            Twitter
          </a>
        </div>
      </div>
      
      <button className="back-button" onClick={handleBackClick}>
        Back to Main Menu
      </button>
    </div>
  );
};

export default AirdropScreen;