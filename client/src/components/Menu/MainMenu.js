// client/src/components/Menu/MainMenu.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletContext } from '../../context/WalletContext';
import { ADMIN_ADDRESSES } from '../../utils/web3';
import '../../styles/MainMenu.css';
import { mainMenuImage, discordIcon, twitterIcon, settingsIcon } from '../../assets';

const MainMenu = () => {
  const navigate = useNavigate();
  const { disconnect, publicKey } = useWallet();
  const { username, silver, isAdminUser } = useWalletContext();
  
  // Обработчики переходов на другие экраны
  const handlePlay = () => navigate('/play');
  const handleShop = () => navigate('/shop');
  const handleInventory = () => navigate('/inventory');
  const handleAirdrop = () => navigate('/airdrop');
  const handleAbout = () => navigate('/about');
  const handleAdmin = () => navigate('/admin');
  
  // Обработчик отключения кошелька
  const handleDisconnect = () => {
    disconnect();
    navigate('/');
  };
  
  // Открытие внешних ссылок
  const openExternalLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="main-menu-container">
      <div className="main-header">
        <img
          src={mainMenuImage}
          alt="Lands of Nanti"
          className="main-background"
        />
      </div>
      
      <div className="main-content">
        <h1 className="main-title">Lands of Nanti: {username}'s quest</h1>
        <p className="main-subtitle">Choose your path, wanderer... 🏰</p>
        
        <div className="silver-counter">
          <span>Silver: {silver}</span>
        </div>
        
        <div className="main-buttons">
          <button className="main-button play-button" onClick={handlePlay}>Play</button>
          <button className="main-button" onClick={handleShop}>Shop</button>
          <button className="main-button" onClick={handleInventory}>Inventory</button>
          <button className="main-button" onClick={handleAirdrop}>Airdrop</button>
          <button className="main-button" onClick={handleAbout}>About</button>
          <button className="main-button disconnect-button" onClick={handleDisconnect}>Disconnect wallet</button>
        </div>
      </div>
      
      <div className="main-footer">
        <div className="social-links">
          <button 
            className="social-button discord"
            onClick={() => openExternalLink('https://discord.gg/tdMWdrwCSD')}
          >
            <img src={discordIcon} alt="Discord" />
          </button>
          <button 
            className="social-button twitter"
            onClick={() => openExternalLink('https://x.com/Nanti_NFT')}
          >
            <img src={twitterIcon} alt="Twitter" />
          </button>
        </div>
        
        {isAdminUser && (
          <button className="admin-button" onClick={handleAdmin}>
            <img src={settingsIcon} alt="Admin Panel" />
          </button>
        )}
      </div>
    </div>
  );
};

export default MainMenu;