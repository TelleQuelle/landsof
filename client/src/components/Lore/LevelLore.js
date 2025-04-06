// client/src/components/Lore/LevelLore.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/LevelLore.css';

// Данные лора для уровней (для каждого уровня по 2 части)
const levelLoreData = {
  1: [
    {
      title: "The Circle of Treachery",
      image: require('../../assets/images/lore/level-1-1.png'),
      paragraphs: [
        "The first circle greets you with cold stone and the echoes of whispers. Here, betrayers wander in eternal regret for their deeds.",
        "The room is dim, lit by blue flames that cast long shadows. The inmates' eyes follow you with suspicion—treachery is their nature."
      ]
    },
    {
      title: "The Master of Deceivers",
      image: require('../../assets/images/lore/level-1-2.png'),
      paragraphs: [
        "A hooded figure sits in the corner, shuffling cards with impossible speed. 'Newcomer,' he hisses, 'I am the master of lies. Beat me at my game, and you may ascend.'",
        "You know he cannot be trusted, but there is no other path. You approach his table, ready to match wits with one who has deceived even the devil himself."
      ]
    }
  ],
  // Данные для остальных уровней добавятся позднее
};

const LevelLore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [loreData, setLoreData] = useState(null);
  
  // Загружаем данные лора для текущего уровня
  useEffect(() => {
    const levelId = parseInt(id, 10);
    
    if (levelLoreData[levelId]) {
      setLoreData(levelLoreData[levelId]);
    } else {
      // Если данных лора нет, возвращаемся к меню уровня
      navigate(`/level/${id}`);
    }
  }, [id, navigate]);
  
  // Обработчики кнопок
  const handleNext = () => {
    if (loreData && currentScreen < loreData.length - 1) {
      setCurrentScreen(prev => prev + 1);
    } else {
      // Если это последний экран, возвращаемся к меню уровня
      navigate(`/level/${id}`);
    }
  };
  
  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(prev => prev - 1);
    } else {
      // Если это первый экран, возвращаемся к меню уровня
      navigate(`/level/${id}`);
    }
  };
  
  // Если данные лора еще не загружены, показываем загрузку
  if (!loreData) {
    return (
      <div className="level-lore-container">
        <h1>Loading lore...</h1>
      </div>
    );
  }
  
  // Получаем текущий экран лора
  const screen = loreData[currentScreen];

  return (
    <div className="level-lore-container">
      <h1 className="lore-title">{screen.title}</h1>
      
      <div className="lore-image-container">
        <img
          src={screen.image}
          alt={`Level ${id} Lore ${currentScreen + 1}`}
          className="lore-image"
        />
      </div>
      
      <div className="lore-paragraphs">
        {screen.paragraphs.map((paragraph, index) => (
          <p key={index} className="lore-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
      
      <div className="lore-buttons">
        <button className="lore-button back-button" onClick={handleBack}>
          Back
        </button>
        
        <button className="lore-button next-button" onClick={handleNext}>
          {currentScreen < loreData.length - 1 ? 'Next' : 'Return to Level'}
        </button>
      </div>
    </div>
  );
};

export default LevelLore;