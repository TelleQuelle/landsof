// client/src/components/Lore/LoreScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/LoreScreen.css';

// Данные для экранов лора
const loreScreens = [
  {
    title: 'Betrayed and Condemned',
    image: require('../../assets/images/lore/lore-1.png'),
    paragraphs: [
      'You were betrayed by friends who accused you of crimes you didn`t commit. Bribed guards seized you and dragged you through the court`s shadowy halls. Execution seemed certain, but fate had other plans—you were cast into the Abyss of Despair, a prison that descends deep into the earth.',
      'There, nine circles await their victims, each a reflection of hell itself. Few escape alive, and those who do are broken. As you were thrown to the prison gates, hope fled from your heart.'
    ],
    buttons: [{ text: 'Next', action: 'next' }]
  },
  {
    title: 'The Rules of the Abyss',
    image: require('../../assets/images/lore/lore-2.png'),
    paragraphs: [
      'In the prison`s reception, a guard smirked as he revealed your fate: "Nine circles below, each more dreadful than the last. Play dice and cards with their denizens—win, and you rise; lose, and you rot."',
      'You realized freedom was a prize earned through trials. The gates slammed shut, and the guard`s laughter faded. Now a prisoner of the Abyss, your path to the surface lies through infernal games.'
    ],
    buttons: [
      { text: 'Previous', action: 'prev' },
      { text: 'Begin', action: 'complete' }
    ]
  }
];

const LoreScreen = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigate = useNavigate();
  
  // Получаем текущий экран лора
  const screen = loreScreens[currentScreen];
  
  // Обработка нажатия кнопок
  const handleButtonClick = (action) => {
    switch (action) {
      case 'next':
        setCurrentScreen(prev => Math.min(prev + 1, loreScreens.length - 1));
        break;
      case 'prev':
        setCurrentScreen(prev => Math.max(prev - 1, 0));
        break;
      case 'complete':
        // Вызываем функцию завершения просмотра лора
        onComplete();
        // Переходим к главному меню
        navigate('/main');
        break;
      default:
        break;
    }
  };

  return (
    <div className="lore-container">
      <h1 className="lore-title">{screen.title}</h1>
      
      <div className="lore-image-container">
        <img
          src={screen.image}
          alt={`Lore ${currentScreen + 1}`}
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
        {screen.buttons.map((button, index) => (
          <button
            key={index}
            className={`lore-button ${button.action === 'complete' ? 'complete-button' : ''}`}
            onClick={() => handleButtonClick(button.action)}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LoreScreen;