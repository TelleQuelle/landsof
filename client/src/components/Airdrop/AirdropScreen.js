// client/src/components/Airdrop/AirdropScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../../context/WalletContext';
import { getShortAddress } from '../../utils/web3';
import { airdropBackground, silverCoin, discordIcon, twitterIcon, comingSoonIcon, copyIcon } from '../../assets';
import '../../styles/AirdropScreen.css';

const AirdropScreen = () => {
  const navigate = useNavigate();
  const { walletAddress, silver, referralCode, totalReferralBonus, updateReferralCode } = useWalletContext();
  const [ownedItems, setOwnedItems] = useState([]);
  const [stats, setStats] = useState({
    totalSilver: 0,
    campaignProgress: 0,
    itemsOwned: 0
  });
  const [referralStats, setReferralStats] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [copyTimeout, setCopyTimeout] = useState(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  
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
    
    // Загрузка информации о реферальной программе
    const loadReferralInfo = async () => {
      try {
        // Здесь должен быть запрос к API для получения информации о реферальной программе
        // В будущем заменить на реальный запрос

        const response = await fetch('/api/referral/info', {
          headers: {
            'walletAddress': walletAddress,
            'signature': localStorage.getItem('signature'),
            'message': localStorage.getItem('message')
          }
        });
        
        const data = await response.json();
        
        if (!data.error) {
          setReferralStats(data.referralStats);
          if (!referralCode && data.referralStats.referralCode) {
            updateReferralCode(data.referralStats.referralCode);
          }
        } else {
          console.error('Error loading referral info:', data.message);
        }

        setTimeout(() => {
          const mockReferralStats = {
            referralCode: referralCode || 'abc12345',
            referralLink: `https://nanti.world/join?ref=${referralCode || 'abc12345'}`,
            totalReferrals: 3,
            totalBonus: totalReferralBonus || 250,
            referralsList: [
              {
                username: "Player_4321",
                joinedAt: "2025-03-15T10:30:00Z",
                totalBonus: 150,
                recentBonuses: [
                  { amount: 30, source: "level_completion", date: "2025-04-01T15:45:00Z" },
                  { amount: 20, source: "game_reward", date: "2025-03-25T12:20:00Z" }
                ]
              },
              {
                username: "Player_5678",
                joinedAt: "2025-03-20T14:15:00Z",
                totalBonus: 100,
                recentBonuses: [
                  { amount: 25, source: "level_completion", date: "2025-04-02T18:10:00Z" }
                ]
              }
            ],
            referrer: null // null если пользователь не был приглашен кем-то
          };
          
          setReferralStats(mockReferralStats);
          if (!referralCode) {
            updateReferralCode(mockReferralStats.referralCode);
          }
        }, 500);
      } catch (error) {
        console.error('Error loading referral info:', error);
      }
    };
    
    loadOwnedItems();
    loadStats();
    
    if (walletAddress) {
      loadReferralInfo();
    }
  }, [walletAddress, silver, ownedItems.length, referralCode, totalReferralBonus, updateReferralCode]);
  
  // Функция для копирования реферальной ссылки
  const copyReferralLink = () => {
    if (!referralStats) return;
    
    const { referralLink } = referralStats;
    navigator.clipboard.writeText(referralLink);
    
    // Очищаем предыдущий таймаут, если он есть
    if (copyTimeout) {
      clearTimeout(copyTimeout);
    }
    
    // Показываем сообщение о копировании
    setIsCopied(true);
    
    // Скрываем сообщение через 2 секунды
    const timeout = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    
    setCopyTimeout(timeout);
  };
  
  // Генерация реферального кода, если его нет
  const generateReferralCode = () => {
    // В будущем здесь будет запрос к API для генерации кода
    // Пока используем моковые данные

    const newCode = 'ref' + Math.random().toString(36).substring(2, 8);
    updateReferralCode(newCode);
    
    const mockReferralStats = {
      referralCode: newCode,
      referralLink: `https://nanti.world/join?ref=${newCode}`,
      totalReferrals: 0,
      totalBonus: 0,
      referralsList: [],
      referrer: null
    };
    
    setReferralStats(mockReferralStats);
  };
  
  // Обработчик кнопки "назад"
  const handleBackClick = () => {
    navigate('/main');
  };

  return (
    <div className="airdrop-screen" style={{ backgroundImage: `url(${airdropBackground})` }}>
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
      
      {/* Реферальная система */}
      <div className="referral-section">
        <h2>Referral Program <span className="referral-subtitle">Earn 20% of referred players' silver!</span></h2>
        
        {referralStats ? (
          <div className="referral-content">
            <div className="referral-link-container">
              <h3>Your Referral Link</h3>
              <div className="referral-link-box">
                <input 
                  type="text" 
                  value={referralStats.referralLink}
                  readOnly
                  className="referral-link-input"
                />
                <button 
                  className="copy-button"
                  onClick={copyReferralLink}
                >
                  <img src={copyIcon} alt="Copy" />
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="referral-explanation">
                Share this link with friends. When they register and earn silver, you'll receive a 20% bonus!
              </p>
            </div>
            
            <div className="referral-stats">
              <div className="referral-stat-item">
                <h3>Total Referrals</h3>
                <div className="referral-stat-value">{referralStats.totalReferrals}</div>
              </div>
              <div className="referral-stat-item">
                <h3>Total Bonus Earned</h3>
                <div className="referral-stat-value">
                  <img src={silverCoin} alt="Silver" className="silver-icon-small" />
                  <span>{totalReferralBonus || referralStats.totalBonus || 0}</span>
                </div>
              </div>
            </div>
            
            {referralStats.referralsList && referralStats.referralsList.length > 0 ? (
              <div className="referrals-list">
                <h3>Your Referrals</h3>
                <table className="referrals-table">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Joined</th>
                      <th>Bonus Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralStats.referralsList.map((ref, index) => (
                      <tr key={index}>
                        <td>{ref.username}</td>
                        <td>{new Date(ref.joinedAt).toLocaleDateString()}</td>
                        <td className="bonus-cell">
                          <img src={silverCoin} alt="Silver" className="silver-icon-small" />
                          <span>{ref.totalBonus}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-referrals-message">
                <h3>No Referrals Yet</h3>
                <p>Share your referral link with friends to start earning bonuses!</p>
              </div>
            )}
            
            {referralStats.referrer && (
              <div className="referred-by">
                <p>You were referred by: <strong>{referralStats.referrer.username}</strong></p>
              </div>
            )}
          </div>
        ) : (
          <div className="generate-referral-code">
            <p>Generate your referral link to start earning bonuses!</p>
            <button 
              className="generate-button"
              onClick={generateReferralCode}
            >
              Generate Referral Link
            </button>
          </div>
        )}
      </div>
      
      <div className="airdrop-status">
        <div className="status-icon">
          <img src={comingSoonIcon} alt="Coming Soon" />
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
              <li>Referral program participation</li>
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
            <img src={discordIcon} alt="Discord" />
          </a>
          <a href="https://x.com/Nanti_NFT" target="_blank" rel="noopener noreferrer" className="social-button twitter">
            <img src={twitterIcon} alt="Twitter" />
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