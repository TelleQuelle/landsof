// client/src/components/Auth/WalletConnect.js
import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate } from 'react-router-dom';
import { getShortAddress } from '../../utils/web3';
import { authBackground } from '../../assets';
import '../../styles/WalletConnect.css';

// Импортируем стили Solana для кнопки кошелька
require('@solana/wallet-adapter-react-ui/styles.css');

const WalletConnect = () => {
  const { wallet, publicKey, connected, connecting, disconnect } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Эффект при изменении статуса подключения
  useEffect(() => {
    if (connected && publicKey) {
      // Когда кошелек подключен, перенаправляем на экран ввода имени
      setIsConnecting(false);
      navigate('/username');
    } else if (!connecting && isConnecting) {
      // Если попытка подключения завершилась, но кошелек не подключен
      setIsConnecting(false);
      setError('Wallet connection failed. Please try again.');
    }
  }, [connected, publicKey, connecting, isConnecting, navigate]);

  // Обработчик клика по кнопке подключения
  const handleConnect = () => {
    setIsConnecting(true);
    setError('');
  };

  // Переадресация на страницу кошелька, если кошелек не найден
  const redirectToWalletSite = (walletName) => {
    let walletUrl = '';
    if (walletName === 'phantom') {
      walletUrl = 'https://phantom.app/';
    } else if (walletName === 'solflare') {
      walletUrl = 'https://solflare.com/';
    }
    
    if (walletUrl) {
      window.open(walletUrl, '_blank');
    }
  };

  return (
    <div className="wallet-connect-container">
      <div className="wallet-connect-box">
        <h1>Lands of Nanti</h1>
        <p>Connect your wallet to begin the adventure</p>
        
        <div className="wallet-buttons">
          <div className="wallet-button-wrapper" onClick={handleConnect}>
            <WalletMultiButton />
          </div>
          
          {!wallet && (
            <div className="wallet-links">
              <p>No wallet detected?</p>
              <div className="wallet-redirect-buttons">
                <button 
                  className="wallet-redirect-button phantom" 
                  onClick={() => redirectToWalletSite('phantom')}
                >
                  Get Phantom
                </button>
                <button 
                  className="wallet-redirect-button solflare" 
                  onClick={() => redirectToWalletSite('solflare')}
                >
                  Get Solflare
                </button>
              </div>
            </div>
          )}
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        {connected && publicKey && (
          <div className="wallet-info">
            <p>Connected: {getShortAddress(publicKey)}</p>
            <button className="disconnect-button" onClick={disconnect}>
              Disconnect
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;