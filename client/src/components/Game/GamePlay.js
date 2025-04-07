// client/src/components/Game/GamePlay.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWalletContext } from '../../context/WalletContext';
import DiceRoller from './DiceRoller';
import CardDrawer from './CardDrawer';
import CombinationDisplay from './CombinationDisplay';
import GameStats from './GameStats';
import GameControls from './GameControls';
import WinScreen from './WinScreen';
import LoseScreen from './LoseScreen';
import { BASE_DECK } from '../../constants/cards';
import { BASE_DICE, DICE_VALUES, DICE_VALUE_NAMES } from '../../constants/dice';
import { calculateCombinationPoints, isCardValidForDiceValue } from '../../constants/combinations';
import '../../styles/GamePlay.css';
import { gameplayBackground } from '../../assets';

// Данные уровней кампании
const levelData = [
  {
    id: 1,
    name: 'Treachery',
    goal: { points: 300, turns: 5 },
    silverReward: { min: 10, max: 20 }
  },
  {
    id: 2,
    name: 'Fraud',
    goal: { points: 400, turns: 6 },
    silverReward: { min: 15, max: 30 }
  },
  {
    id: 3,
    name: 'Violence',
    goal: { points: 500, turns: 6 },
    silverReward: { min: 20, max: 40 }
  },
  {
    id: 4,
    name: 'Heresy',
    goal: { points: 600, turns: 7 },
    silverReward: { min: 25, max: 50 }
  },
  {
    id: 5,
    name: 'Wrath',
    goal: { points: 700, turns: 7 },
    silverReward: { min: 30, max: 60 },
    specialReward: 'memento_mori' // Особый кубик
  },
  {
    id: 6,
    name: 'Greed',
    goal: { points: 800, turns: 8 },
    silverReward: { min: 35, max: 70 }
  },
  {
    id: 7,
    name: 'Gluttony',
    goal: { points: 900, turns: 8 },
    silverReward: { min: 40, max: 80 }
  },
  {
    id: 8,
    name: 'Lust',
    goal: { points: 1000, turns: 9 },
    silverReward: { min: 45, max: 90 }
  },
  {
    id: 9,
    name: 'Limbo',
    goal: { points: 1100, turns: 9 },
    silverReward: { min: 50, max: 100 }
  },
  {
    id: 10,
    name: 'Freedom',
    goal: { points: 1200, turns: 10 },
    silverReward: { min: 60, max: 120 },
    specialReward: 'nft' // NFT, которую нужно заминтить
  }
];

const GamePlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateSilver } = useWalletContext();
  
  // Состояние игры
  const [levelInfo, setLevelInfo] = useState(null);
  const [score, setScore] = useState(0);
  const [turnScore, setTurnScore] = useState(0);
  const [turn, setTurn] = useState(1);
  const [gameState, setGameState] = useState('waiting'); // waiting, rolling, selecting, win, lose
  const [dice, setDice] = useState([]);
  const [selectedDiceIndex, setSelectedDiceIndex] = useState(null);
  const [availableCards, setAvailableCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [deck, setDeck] = useState([...BASE_DECK]);
  const [gameStats, setGameStats] = useState({
    turns: 0,
    combinations: 0,
    totalScore: 0
  });
  
  // Устанавливаем информацию об уровне при загрузке компонента
  useEffect(() => {
    const levelId = parseInt(id, 10);
    const currentLevel = levelData.find(l => l.id === levelId);
    
    if (currentLevel) {
      setLevelInfo(currentLevel);
      
      // Обновляем количество попыток
      const levelStatsKey = `level_stats_${levelId}`;
      const savedStats = localStorage.getItem(levelStatsKey);
      
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats);
        const updatedStats = {
          ...parsedStats,
          attempts: (parsedStats.attempts || 0) + 1
        };
        localStorage.setItem(levelStatsKey, JSON.stringify(updatedStats));
      } else {
        localStorage.setItem(levelStatsKey, JSON.stringify({ attempts: 1, silver: 0, turns: 0 }));
      }
    } else {
      // Если уровень не найден, возвращаемся к меню кампании
      navigate('/campaign');
    }
  }, [id, navigate]);
  
  // Перемешивание колоды
  const shuffleDeck = useCallback(() => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    return shuffled;
  }, [deck]);
  
  // Бросок кубиков
  const rollDice = useCallback(() => {
    // В будущем здесь будут учитываться особые кубики с их вероятностями
    // Пока используем базовый кубик с равномерным распределением
    const diceValues = BASE_DICE.values;
    
    const rolled = [
      diceValues[Math.floor(Math.random() * diceValues.length)],
      diceValues[Math.floor(Math.random() * diceValues.length)]
    ];
    
    setDice(rolled);
    return rolled;
  }, []);
  
  // Взятие карт из колоды
  const drawCards = useCallback((count = 3) => {
    const shuffled = shuffleDeck();
    const drawn = shuffled.slice(0, count);
    const remaining = shuffled.slice(count);
    
    setDeck(remaining);
    setAvailableCards(drawn);
    return drawn;
  }, [shuffleDeck]);
  
  // Начало нового хода
  const startNewTurn = useCallback(() => {
    setGameState('rolling');
    setSelectedDiceIndex(null);
    setSelectedCards([]);
    setTurnScore(0);
    rollDice();
    drawCards();
  }, [rollDice, drawCards]);
  
  // Выбор значения кубика
  const selectDice = (index) => {
    if (gameState !== 'rolling') return;
    
    setSelectedDiceIndex(index);
    setGameState('selecting');
  };
  
  // Выбор карты
  const selectCard = (card) => {
    if (gameState !== 'selecting' || selectedDiceIndex === null) return;
    
    const diceValue = dice[selectedDiceIndex];
    
    // Проверяем, подходит ли карта для выбранного значения кубика
    if (isCardValidForDiceValue(card.type, diceValue)) {
      // Добавляем карту к выбранным
      setSelectedCards([...selectedCards, card]);
      
      // Удаляем карту из доступных
      setAvailableCards(availableCards.filter(c => c.id !== card.id));
      
      // Пересчитываем очки за ход
      const newSelectedCards = [...selectedCards, card];
      const newTurnScore = calculateCombinationPoints(newSelectedCards, diceValue);
      setTurnScore(newTurnScore);
    } else {
      // Если карта не подходит, игрок теряет все очки за ход
      setTurnScore(0);
      setGameState('turnend');
      
      // Обновляем статистику
      setGameStats(prev => ({
        ...prev,
        turns: prev.turns + 1
      }));
      
      // После короткой паузы начинаем новый ход
      setTimeout(() => {
        if (turn >= levelInfo.goal.turns) {
          // Если достигнуто максимальное количество ходов, проверяем результат
          if (score >= levelInfo.goal.points) {
            setGameState('win');
          } else {
            setGameState('lose');
          }
        } else {
          setTurn(turn + 1);
          startNewTurn();
        }
      }, 1500);
    }
  };
  
  // Взятие дополнительной карты
  const drawAdditionalCard = () => {
    if (gameState !== 'selecting' || selectedDiceIndex === null) return;
    
    // Проверяем, есть ли карты в колоде
    if (deck.length === 0) {
      // Если колода пуста, перемешиваем все неиспользуемые карты
      const allCards = [...BASE_DECK];
      const usedCardIds = [...selectedCards, ...availableCards].map(c => c.id);
      const availableForDraw = allCards.filter(c => !usedCardIds.includes(c.id));
      
      if (availableForDraw.length === 0) {
        // Если нет доступных карт, ничего не делаем
        return;
      }
      
      // Обновляем колоду
      setDeck(availableForDraw);
      
      // Берем случайную карту из доступных
      const randomIndex = Math.floor(Math.random() * availableForDraw.length);
      const newCard = availableForDraw[randomIndex];
      
      // Добавляем карту к доступным
      setAvailableCards([...availableCards, newCard]);
      
      // Удаляем карту из колоды
      setDeck(availableForDraw.filter((_, i) => i !== randomIndex));
    } else {
      // Берем верхнюю карту из колоды
      const newCard = deck[0];
      const newDeck = deck.slice(1);
      
      // Добавляем карту к доступным
      setAvailableCards([...availableCards, newCard]);
      
      // Обновляем колоду
      setDeck(newDeck);
    }
  };
  
  // Завершение хода
  const endTurn = () => {
    if (gameState !== 'selecting') return;
    
    // Добавляем очки за ход к общему счету
    setScore(score + turnScore);
    
    // Обновляем статистику
    setGameStats(prev => ({
      ...prev,
      turns: prev.turns + 1,
      combinations: prev.combinations + (selectedCards.length > 0 ? 1 : 0),
      totalScore: prev.totalScore + turnScore
    }));
    
    // Переходим к следующему ходу или завершаем игру
    if (turn >= levelInfo.goal.turns) {
      // Если достигнуто максимальное количество ходов, проверяем результат
      if (score + turnScore >= levelInfo.goal.points) {
        setGameState('win');
      } else {
        setGameState('lose');
      }
    } else {
      setTurn(turn + 1);
      startNewTurn();
    }
  };
  
  // Отмена выбора карты
  const unselectCard = (card) => {
    if (gameState !== 'selecting') return;
    
    // Удаляем карту из выбранных
    const newSelectedCards = selectedCards.filter(c => c.id !== card.id);
    setSelectedCards(newSelectedCards);
    
    // Возвращаем карту к доступным
    setAvailableCards([...availableCards, card]);
    
    // Пересчитываем очки за ход
    if (selectedDiceIndex !== null) {
      const diceValue = dice[selectedDiceIndex];
      const newTurnScore = calculateCombinationPoints(newSelectedCards, diceValue);
      setTurnScore(newTurnScore);
    }
  };
  
  // Получение награды за уровень
  const claimReward = () => {
    if (!levelInfo) return;
    
    // Генерируем случайное количество серебра в диапазоне наград уровня
    const silverAmount = Math.floor(
      levelInfo.silverReward.min + 
      Math.random() * (levelInfo.silverReward.max - levelInfo.silverReward.min + 1)
    );
    
    // Обновляем количество серебра пользователя
    updateSilver(silverAmount);
    
    // Сохраняем статистику уровня
    const levelId = parseInt(id, 10);
    const levelStatsKey = `level_stats_${levelId}`;
    const savedStats = localStorage.getItem(levelStatsKey);
    
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      const updatedStats = {
        ...parsedStats,
        silver: silverAmount,
        turns: gameStats.turns
      };
      localStorage.setItem(levelStatsKey, JSON.stringify(updatedStats));
    }
    
    // Обновляем прогресс кампании
    const savedProgress = localStorage.getItem('campaign_progress');
    
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      
      // Отмечаем текущий уровень как пройденный
      const updatedProgress = parsedProgress.map(p => {
        if (p.id === levelId) {
          return { ...p, completed: true };
        }
        
        // Разблокируем следующий уровень
        if (p.id === levelId + 1) {
          return { ...p, unlocked: true };
        }
        
        return p;
      });
      
      localStorage.setItem('campaign_progress', JSON.stringify(updatedProgress));
      
      // Если это последний уровень, отмечаем кампанию как завершенную
      if (levelId === 10) {
        localStorage.setItem('campaign_completed', 'true');
      }
    }
    
    // Возвращаемся к меню уровня
    navigate(`/level/${id}`);
  };
  
  // Повторный запуск уровня
  const restartLevel = () => {
    // Сбрасываем состояние игры
    setScore(0);
    setTurnScore(0);
    setTurn(1);
    setGameState('waiting');
    setDice([]);
    setSelectedDiceIndex(null);
    setAvailableCards([]);
    setSelectedCards([]);
    setDeck([...BASE_DECK]);
    setGameStats({
      turns: 0,
      combinations: 0,
      totalScore: 0
    });
    
    // Начинаем новый ход
    startNewTurn();
  };
  
  // Начинаем игру при первой загрузке компонента
  useEffect(() => {
    if (levelInfo && gameState === 'waiting') {
      startNewTurn();
    }
  }, [levelInfo, gameState, startNewTurn]);
  
  // Если информация об уровне еще не загружена, показываем загрузку
  if (!levelInfo) {
    return (
      <div className="game-container">
        <h1>Loading level...</h1>
      </div>
    );
  }
  
  // Отображаем экран победы
  if (gameState === 'win') {
    return (
      <WinScreen
        levelInfo={levelInfo}
        score={score}
        gameStats={gameStats}
        onClaimReward={claimReward}
      />
    );
  }
  
  // Отображаем экран поражения
  if (gameState === 'lose') {
    return (
      <LoseScreen
        levelInfo={levelInfo}
        score={score}
        gameStats={gameStats}
        onRetry={restartLevel}
        onBack={() => navigate(`/level/${id}`)}
      />
    );
  }

  return (
    <div className="game-container" style={{ backgroundImage: `url(${gameplayBackground})` }}>
      <div className="game-header">
        <h1>Level {levelInfo.id}: {levelInfo.name}</h1>
        <div className="game-progress">
          <div className="goal-info">
            <span>Goal: {levelInfo.goal.points} points</span>
            <span>Turn: {turn}/{levelInfo.goal.turns}</span>
            <span>Score: {score + (gameState === 'selecting' ? turnScore : 0)}/{levelInfo.goal.points}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${Math.min(100, ((score + (gameState === 'selecting' ? turnScore : 0)) / levelInfo.goal.points) * 100)}%` 
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="game-main">
        <div className="game-board">
          <DiceRoller
            dice={dice}
            selectedIndex={selectedDiceIndex}
            onSelectDice={selectDice}
            gameState={gameState}
          />
          
          <CardDrawer
            availableCards={availableCards}
            selectedCards={selectedCards}
            onSelectCard={selectCard}
            onUnselectCard={unselectCard}
            selectedDiceValue={selectedDiceIndex !== null ? dice[selectedDiceIndex] : null}
            gameState={gameState}
          />
        </div>
        
        <div className="game-sidebar">
          <CombinationDisplay
            selectedDiceValue={selectedDiceIndex !== null ? dice[selectedDiceIndex] : null}
            selectedCards={selectedCards}
            turnScore={turnScore}
          />
          
          <GameStats
            turn={turn}
            maxTurns={levelInfo.goal.turns}
            score={score}
            turnScore={turnScore}
            goalScore={levelInfo.goal.points}
          />
          
          <GameControls
            gameState={gameState}
            canDrawCard={gameState === 'selecting' && deck.length > 0}
            onDrawCard={drawAdditionalCard}
            onEndTurn={endTurn}
            onExitGame={() => navigate(`/level/${id}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePlay;