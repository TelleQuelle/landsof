// client/src/components/Tutorial/Tutorial.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Tutorial.css';

// Данные для шагов тутториала
const tutorialSteps = [
  {
    title: 'Welcome to Lands of Nanti!',
    image: '/images/ui/tutorial-1.png',
    buttons: [{ text: 'Get started', action: 'next' }]
  },
  {
    title: 'Rolling Dice and Drawing Cards',
    image: '/images/ui/tutorial-2.png',
    buttons: [
      { text: 'Previous', action: 'prev' },
      { text: 'Next', action: 'next' }
    ]
  },
  {
    title: 'Scoring Points and Taking Risks',
    image: '/images/ui/tutorial-3.png',
    buttons: [
      { text: 'Previous', action: 'prev' },
      { text: 'Next', action: 'next' }
    ]
  },
  {
    title: 'Ready to Begin? ⚔️',
    image: '/images/ui/tutorial-4.png',
    buttons: [
      { text: 'Previous', action: 'prev' },
      { text: 'Start', action: 'complete' }
    ]
  }
];

const Tutorial = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  // Получаем текущий шаг тутториала
  const step = tutorialSteps[currentStep];
  
  // Обработка нажатия кнопок
  const handleButtonClick = (action) => {
    switch (action) {
      case 'next':
        setCurrentStep(prev => Math.min(prev + 1, tutorialSteps.length - 1));
        break;
      case 'prev':
        setCurrentStep(prev => Math.max(prev - 1, 0));
        break;
      case 'complete':
        // Вызываем функцию завершения тутториала
        onComplete();
        // Переходим к экрану лора
        navigate('/lore');
        break;
      default:
        break;
    }
  };

  return (
    <div className="tutorial-container">
      <h1 className="tutorial-title">{step.title}</h1>
      
      <div className="tutorial-image-container">
        <img
          src={step.image}
          alt={`Tutorial step ${currentStep + 1}`}
          className="tutorial-image"
        />
      </div>
      
      <div className="tutorial-buttons">
        {step.buttons.map((button, index) => (
          <button
            key={index}
            className={`tutorial-button ${button.action === 'complete' ? 'complete-button' : ''}`}
            onClick={() => handleButtonClick(button.action)}
          >
            {button.text}
          </button>
        ))}
      </div>
      
      <div className="tutorial-progress">
        {tutorialSteps.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index === currentStep ? 'active' : ''}`}
            onClick={() => setCurrentStep(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Tutorial;