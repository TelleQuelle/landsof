// client/src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletContext } from './context/WalletContext';

// Импорт компонентов для авторизации
import WalletConnect from './components/Auth/WalletConnect';
import UsernameInput from './components/Auth/UsernameInput';

// Импорт компонентов для начального тутториала
import Tutorial from './components/Tutorial/Tutorial';

// Импорт компонентов меню
import MainMenu from './components/Menu/MainMenu';
import GameMenu from './components/Menu/GameMenu';
import CampaignMenu from './components/Menu/CampaignMenu';
import LevelMenu from './components/Menu/LevelMenu';
import LoreScreen from './components/Lore/LoreScreen';
import LevelLore from './components/Lore/LevelLore';

// Импорт компонентов для игрового процесса
import GamePlay from './components/Game/GamePlay';

// Импорт компонентов для разных разделов
import ShopScreen from './components/Shop/ShopScreen';
import InventoryScreen from './components/Inventory/InventoryScreen';
import AirdropScreen from './components/Airdrop/AirdropScreen';
import AboutScreen from './components/About/AboutScreen';

// Импорт компонента для админ-панели
import AdminPanel from './components/Admin/AdminPanel';

// Компонент для защищенных маршрутов (требуется авторизация)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useWalletContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Компонент для маршрутов, доступных только админам
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdminUser } = useWalletContext();
  
  if (!isAuthenticated || !isAdminUser) {
    return <Navigate to="/main" replace />;
  }
  
  return children;
};

const App = () => {
  const { connected } = useWallet();
  const { isAuthenticated } = useWalletContext();
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  // Проверяем, первый ли раз пользователь заходит в игру
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (hasVisitedBefore) {
      setIsFirstVisit(false);
    }
  }, []);
  
  // Отмечаем, что пользователь уже посетил игру
  const completeFirstVisit = () => {
    setIsFirstVisit(false);
    localStorage.setItem('hasVisitedBefore', 'true');
  };

  return (
    <div className="app">
      <Routes>
        {/* Маршруты авторизации */}
        <Route path="/" element={!connected ? <WalletConnect /> : <Navigate to="/username" />} />
        <Route 
          path="/username" 
          element={
            connected ? 
              (isAuthenticated ? <Navigate to="/main" /> : <UsernameInput />) :
              <Navigate to="/" />
          } 
        />
        
        {/* Маршруты для первого посещения (тутториал) */}
        <Route 
          path="/tutorial" 
          element={
            <ProtectedRoute>
              {isFirstVisit ? <Tutorial onComplete={completeFirstVisit} /> : <Navigate to="/main" />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lore" 
          element={
            <ProtectedRoute>
              {isFirstVisit ? <LoreScreen onComplete={completeFirstVisit} /> : <Navigate to="/main" />}
            </ProtectedRoute>
          } 
        />
        
        {/* Основные маршруты */}
        <Route 
          path="/main" 
          element={
            <ProtectedRoute>
              {isFirstVisit ? <Navigate to="/tutorial" /> : <MainMenu />}
            </ProtectedRoute>
          } 
        />
        
        {/* Игровые маршруты */}
        <Route path="/play" element={<ProtectedRoute><GameMenu /></ProtectedRoute>} />
        <Route path="/campaign" element={<ProtectedRoute><CampaignMenu /></ProtectedRoute>} />
        <Route path="/level/:id" element={<ProtectedRoute><LevelMenu /></ProtectedRoute>} />
        <Route path="/level/:id/lore" element={<ProtectedRoute><LevelLore /></ProtectedRoute>} />
        <Route path="/game/:id" element={<ProtectedRoute><GamePlay /></ProtectedRoute>} />
        
        {/* Другие разделы */}
        <Route path="/shop" element={<ProtectedRoute><ShopScreen /></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><InventoryScreen /></ProtectedRoute>} />
        <Route path="/airdrop" element={<ProtectedRoute><AirdropScreen /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutScreen /></ProtectedRoute>} />
        
        {/* Админ-панель */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } 
        />
        
        {/* Маршрут по умолчанию */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;