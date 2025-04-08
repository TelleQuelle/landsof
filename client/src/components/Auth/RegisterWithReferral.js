// client/src/components/Auth/RegisterWithReferral.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletContext } from '../../context/WalletContext';
import { authBackground } from '../../assets';
import '../../styles/RegisterWithReferral.css';

// Импортируем стили Solana для кнопки кошелька
require('@solana/wallet-adapter-react-ui/styles.css');

const RegisterWithReferral = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { connected, publicKey } = useWallet();
  const { isAuthenticated } = useWalletContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referrerInfo, setReferrerInfo] = useState(null);
  
  // Получаем реферальный код из параметров URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      
      // Получаем информацию о реферрере
      const fetchReferrerInfo = async () => {
        try {
          // В будущем здесь будет запрос к API
          // Пока используем моковые данные
          setTimeout(() => {
            setReferrerInfo({
              username: "Player_" + Math.floor(Math.random() * 10000)
            });
          }, 500);
        } catch (error) {
          console.error('Error fetching referrer info:', error);
        }
      };
      
      fetchReferrerInfo();
    }
  }, [searchParams]);
  
  // Эффект при изменении статуса подключения
  useEffect(() => {
    if (connected && publicKey) {
      setIsConnecting(false);
      
      // Вызываем функцию подключения с реферальным кодом
      if (!isAuthenticated) {
        // Импортируем connectWallet из контекста
        const { connectWallet } = useWalletContext();
        connectWallet(referralCode);
      } else {
        navigate('/username');
      }
    } else if (!connected && isConnecting) {
      setIsConnecting(false);
    }
  }, [connected, publicKey, isConnecting, isAuthenticated, navigate, referralCode]);
  
  // Обработчик клика по кнопке подключения
  const handleConnect = () => {
    setIsConnecting(true);
  };
  
  // После успешного подключения кошелька реферальный код будет использован при регистрации
  
  return (
    <div className="register-container" style={{ backgroundImage: `url(${authBackground})` }}>
      <div className="register-card">
        <h1>Welcome to Lands of Nanti</h1>
        
        {referrerInfo && (
          <div className="referrer-info">
            <p>You were invited by <span className="referrer-name">{referrerInfo.username}</span></p>
          </div>
        )}
        
        <div className="connect-instruction">
          <p>Connect your wallet to begin your adventure in the Abyss</p>
        </div>
        
        <div className="wallet-connect-area">
          <div className="wallet-button-wrapper" onClick={handleConnect}>
            <WalletMultiButton />
          </div>
          
          <div className="referral-note">
            <p>By connecting, you accept the referral from {referrerInfo ? referrerInfo.username : 'your friend'}</p>
          </div>
        </div>
        
        <div className="register-footer">
          <p>
            Don't have a Solana wallet? Get <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">Phantom</a> or <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer">Solflare</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterWithReferral;