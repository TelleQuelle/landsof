// client/src/context/WalletContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { isAdmin, ADMIN_ADDRESSES } from '../utils/web3';

// Создаем контекст
const WalletContext = createContext(null);

// Провайдер контекста
export const WalletContextProvider = ({ children }) => {
  const { publicKey, connected, connecting, disconnecting } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [silver, setSilver] = useState(0);
  // Новые состояния для реферальной системы
  const [referralCode, setReferralCode] = useState(null);
  const [totalReferralBonus, setTotalReferralBonus] = useState(0);

  // Обновляем состояние при изменении подключения к кошельку
  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toString());
      
      // Проверяем, является ли пользователь администратором
      const adminStatus = isAdmin(publicKey, ADMIN_ADDRESSES);
      setIsAdminUser(adminStatus);
      
      // Получаем данные пользователя из локального хранилища или API
      const storedUsername = localStorage.getItem(`username_${publicKey.toString()}`);
      if (storedUsername) {
        setUsername(storedUsername);
        setIsAuthenticated(true);
      }
      
      // Загружаем количество серебра из локального хранилища или API
      const storedSilver = localStorage.getItem(`silver_${publicKey.toString()}`);
      if (storedSilver) {
        setSilver(parseInt(storedSilver, 10));
      } else {
        // По умолчанию 0 серебра для новых игроков
        setSilver(0);
        localStorage.setItem(`silver_${publicKey.toString()}`, '0');
      }
      
      // Загружаем реферальный код пользователя
      const storedReferralCode = localStorage.getItem(`referralCode_${publicKey.toString()}`);
      if (storedReferralCode) {
        setReferralCode(storedReferralCode);
      }
      
      // Загружаем сумму реферальных бонусов
      const storedReferralBonus = localStorage.getItem(`referralBonus_${publicKey.toString()}`);
      if (storedReferralBonus) {
        setTotalReferralBonus(parseInt(storedReferralBonus, 10));
      } else {
        // По умолчанию 0 бонусов для новых игроков
        setTotalReferralBonus(0);
        localStorage.setItem(`referralBonus_${publicKey.toString()}`, '0');
      }
    } else {
      // Сбрасываем данные при отключении кошелька
      setWalletAddress('');
      setUsername('');
      setIsAuthenticated(false);
      setIsAdminUser(false);
      setSilver(0);
      setReferralCode(null);
      setTotalReferralBonus(0);
    }
  }, [connected, connecting, disconnecting, publicKey]);

  // Функция для обновления имени пользователя
  const updateUsername = (newUsername) => {
    if (connected && publicKey) {
      setUsername(newUsername);
      setIsAuthenticated(true);
      localStorage.setItem(`username_${publicKey.toString()}`, newUsername);
    }
  };

  // Функция для обновления количества серебра
  const updateSilver = (amount) => {
    if (connected && publicKey) {
      const newSilver = silver + amount;
      setSilver(newSilver);
      localStorage.setItem(`silver_${publicKey.toString()}`, newSilver.toString());
    }
  };
  
  // Функция для обновления реферального кода
  const updateReferralCode = (code) => {
    if (connected && publicKey) {
      setReferralCode(code);
      localStorage.setItem(`referralCode_${publicKey.toString()}`, code);
    }
  };
  
  // Функция для обновления общей суммы реферальных бонусов
  const updateReferralBonus = (amount) => {
    if (connected && publicKey) {
      const newTotal = totalReferralBonus + amount;
      setTotalReferralBonus(newTotal);
      localStorage.setItem(`referralBonus_${publicKey.toString()}`, newTotal.toString());
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isAuthenticated,
        username,
        walletAddress,
        isAdminUser,
        silver,
        referralCode,
        totalReferralBonus,
        updateUsername,
        updateSilver,
        updateReferralCode,
        updateReferralBonus
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Хук для использования контекста
export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletContextProvider');
  }
  return context;
};