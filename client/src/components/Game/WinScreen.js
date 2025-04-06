// client/src/components/Game/WinScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { SPECIAL_DICE } from '../../constants/dice';
import '../../styles/WinScreen.css';

const WinScreen = ({ levelInfo, score, gameStats, onClaimReward }) => {
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const [silverReward, setSilverReward] = useState(0);
  const [hasSpecialReward, setHasSpecialReward] = useState(false);
  const [specialRewardType, setSpecialRewardType] = useState('');
  const [specialRewardName, setSpecialRewardName] = useState('');
  const [specialRewardImage, setSpecialRewardImage] = useState('');
  const [mintingNFT, setMintingNFT] = useState(false);
  const [mintingError, setMintingError] = useState('');
  const [mintingSuccess, setMintingSuccess] = useState(false);
  
  // Генерируем награды при загрузке компонента
  useEffect(() => {
    if (levelInfo) {
      // Генерируем случайное количество серебра в диапазоне наград уровня
      const silver = Math.floor(
        levelInfo.silverReward.min + 
        Math.random() * (levelInfo.silverReward.max - levelInfo.silverReward.min + 1)
      );
      setSilverReward(silver);
      
      // Проверяем наличие особой награды
      if (levelInfo.specialReward) {
        setHasSpecialReward(true);
        setSpecialRewardType(levelInfo.specialReward);
        
        // Настраиваем данные особой награды
        if (levelInfo.specialReward === 'memento_mori') {
          const dice = SPECIAL_DICE.memento_mori;
          setSpecialRewardName(dice.name);
          setSpecialRewardImage(dice.image);
        } else if (levelInfo.specialReward === 'nft') {
          setSpecialRewardName('Freedom Scroll');
          setSpecialRewardImage('/images/rewards/freedom_scroll.png');
        }
      }
    }
  }, [levelInfo]);
  
  // Функция для минтинга NFT
  const mintNFT = async () => {
    if (!publicKey) return;
    
    setMintingNFT(true);
    setMintingError('');
    
    try {
      // В будущем здесь будет реальный код для создания NFT
      // Сейчас просто симулируем процесс с задержкой
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Имитируем успешный минтинг
      setMintingSuccess(true);
      
      // Отмечаем кампанию как завершенную
      localStorage.setItem('campaign_completed', 'true');
      
    } catch (error) {
      console.error('Error minting NFT:', error);
      setMintingError('Failed to mint NFT. Please try again.');
    } finally {
      setMintingNFT(false);
    }
  };
  
  // Функция для получения всех наград
  const handleClaimAll = () => {
    onClaimReward();
  };

  return (
    <div className="win-screen">
      <h1 className="victory-title">Victory!</h1>
      <div className="victory-message">
        <p>Congratulations! You have conquered Level {levelInfo.id}: {levelInfo.name}</p>
      </div>
      
      <div className="stats-summary">
        <h2>Your Results</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Final Score:</span>
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
      
      <div className="rewards-section">
        <h2>Your Rewards</h2>
        
        <div className="rewards-container">
          <div className="reward-item silver-reward">
            <div className="reward-image">
              <img src="/images/ui/silver-coin.png" alt="Silver" />
            </div>
            <div className="reward-details">
              <h3>Silver</h3>
              <p>{silverReward} coins</p>
            </div>
            <button 
              className="claim-button"
              onClick={onClaimReward}
            >
              Claim Silver
            </button>
          </div>
          
          {hasSpecialReward && (
            <div className="reward-item special-reward">
              <div className="reward-image">
                <img src={specialRewardImage} alt={specialRewardName} />
              </div>
              <div className="reward-details">
                <h3>{specialRewardName}</h3>
                <p>{specialRewardType === 'nft' ? 'An NFT commemorating your escape from the Abyss' : 'Special dice with unique powers'}</p>
              </div>
              
              {specialRewardType === 'nft' ? (
                <button 
                  className={`claim-button ${mintingNFT ? 'disabled' : ''} ${mintingSuccess ? 'success' : ''}`}
                  onClick={mintNFT}
                  disabled={mintingNFT || mintingSuccess}
                >
                  {mintingNFT ? 'Minting...' : mintingSuccess ? 'Minted!' : 'Mint NFT'}
                </button>
              ) : (
                <button 
                  className="claim-button"
                  onClick={onClaimReward}
                >
                  Claim Item
                </button>
              )}
              
              {mintingError && (
                <div className="minting-error">
                  {mintingError}
                </div>
              )}
            </div>
          )}
        </div>
        
        <button 
          className="claim-all-button"
          onClick={handleClaimAll}
        >
          Claim All Rewards
        </button>
      </div>
      
      <div className="navigation-buttons">
        {levelInfo.id < 10 ? (
          <button 
            className="next-level-button"
            onClick={() => navigate(`/level/${levelInfo.id + 1}`)}
          >
            Next Level
          </button>
        ) : (
          <button 
            className="campaign-complete-button"
            onClick={() => navigate('/main')}
          >
            Complete Campaign
          </button>
        )}
        
        <button 
          className="back-to-menu-button"
          onClick={() => navigate(`/level/${levelInfo.id}`)}
        >
          Back to Level Menu
        </button>
      </div>
    </div>
  );
};

export default WinScreen;