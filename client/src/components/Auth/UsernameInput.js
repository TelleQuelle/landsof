// client/src/components/Auth/UsernameInput.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletContext } from '../../context/WalletContext';
import { getShortAddress } from '../../utils/web3';
import '../../styles/UsernameInput.css';

const UsernameInput = () => {
  const { publicKey } = useWallet();
  const { updateUsername } = useWalletContext();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Проверка имени пользователя
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    
    // Обновляем имя пользователя в контексте
    updateUsername(username);
    
    // Переходим к тутториалу или главному меню, в зависимости от того, первый ли это визит
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (hasVisitedBefore) {
      navigate('/main');
    } else {
      navigate('/tutorial');
    }
  };

  return (
    <div className="username-container">
      <h1>What's your name, adventurer?</h1>
      
      {publicKey && (
        <p className="wallet-address">
          wallet: {getShortAddress(publicKey)}
        </p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your Name"
            maxLength={20}
            className="username-input"
          />
        </div>
        
        {error && <p className="error-message">{error}</p>}
        
        <button type="submit" className="start-button">
          Start Journey
        </button>
      </form>
    </div>
  );
};

export default UsernameInput;