// client/src/components/About/AboutScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tutorial from '../Tutorial/Tutorial';
import LoreScreen from '../Lore/LoreScreen';
import '../../styles/AboutScreen.css';
import { aboutBackground, discordIcon, twitterIcon } from '../../assets';

const AboutScreen = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showLore, setShowLore] = useState(false);
  
  // Обработчики для отображения тутториала и лора
  const handleShowTutorial = () => {
    setShowTutorial(true);
    setShowLore(false);
  };
  
  const handleShowLore = () => {
    setShowLore(true);
    setShowTutorial(false);
  };
  
  // Обработчик для закрытия тутториала или лора
  const handleClose = () => {
    setShowTutorial(false);
    setShowLore(false);
  };
  
  // Обработчик кнопки "назад"
  const handleBackClick = () => {
    navigate('/main');
  };

  // Если открыт тутториал или лор, отображаем соответствующий компонент
  if (showTutorial) {
    return (
      <div className="tutorial-wrapper">
        <Tutorial onComplete={handleClose} />
        <button className="close-button" onClick={handleClose}>
          Close Tutorial
        </button>
      </div>
    );
  }
  
  if (showLore) {
    return (
      <div className="lore-wrapper">
        <LoreScreen onComplete={handleClose} />
        <button className="close-button" onClick={handleClose}>
          Close Lore
        </button>
      </div>
    );
  }

  return (
    <div className="about-screen" style={{ backgroundImage: `url(${aboutBackground})` }}>
      <h1 className="about-title">About Lands of Nanti</h1>
      
      <div className="about-content">
        <div className="about-section game-info">
          <h2>Game Information</h2>
          <p>
            Welcome to Lands of Nanti, a dark fantasy card and dice game where you must survive the 
            Abyss of Despair. Betrayed and condemned, you find yourself in a prison that descends deep 
            into the earth, with nine circles awaiting their victims.
          </p>
          <p>
            Use strategy, luck, and cunning to defeat your opponents in games of chance, 
            collecting combinations of cards and dice to earn points and ascend through 
            the circles of the Abyss.
          </p>
        </div>
        
        <div className="about-section features">
          <h2>Features</h2>
          <ul>
            <li>
              <span className="feature-name">Strategic Gameplay:</span> 
              Combine dice values with matching cards to create powerful combinations.
            </li>
            <li>
              <span className="feature-name">Campaign Mode:</span> 
              Journey through 10 unique levels, each with its own challenges and rewards.
            </li>
            <li>
              <span className="feature-name">Special Items:</span> 
              Collect special cards and dice with unique effects to enhance your strategy.
            </li>
            <li>
              <span className="feature-name">Web3 Integration:</span> 
              Utilize Solana blockchain for secure authentication and unique NFT rewards.
            </li>
            <li>
              <span className="feature-name">Dark Fantasy Setting:</span> 
              Immerse yourself in the grim world of the Abyss with atmospheric visuals and lore.
            </li>
          </ul>
        </div>
        
        <div className="about-section how-to-play">
          <h2>How to Play</h2>
          <div className="gameplay-summary">
            <p>
              Each turn begins with rolling two dice and drawing three cards. Select one die value 
              to determine which cards can be used in your combination. Match cards to your chosen 
              die to earn points, but be careful—drawing additional cards may improve your score, 
              but can end your turn if they don't match.
            </p>
            <p>
              Balance risk and reward as you aim to reach the target score for each level with a 
              limited number of turns. Each level presents a new challenge in your journey to 
              escape the Abyss.
            </p>
            <button className="tutorial-button" onClick={handleShowTutorial}>
              Replay Tutorial
            </button>
          </div>
        </div>
        
        <div className="about-section story">
          <h2>Story</h2>
          <div className="lore-summary">
            <p>
              You were betrayed by those you trusted, accused of crimes you didn't commit. Cast into 
              the Abyss of Despair, a prison deep beneath the earth, you must face nine circles of 
              punishment. Each circle is governed by twisted guardians who challenge prisoners to 
              games of chance and skill.
            </p>
            <p>
              Win, and you ascend toward freedom. Lose, and you'll be forever trapped in the depths. 
              Your journey through treachery, fraud, violence, and other sins will test not only 
              your luck but your soul.
            </p>
            <button className="lore-button" onClick={handleShowLore}>
              Replay Lore Intro
            </button>
          </div>
        </div>
        
        <div className="about-section credits">
          <h2>Credits</h2>
          <div className="credits-content">
            <div className="credit-group">
              <h3>Game Design & Development</h3>
              <p>Lands of Nanti Team</p>
            </div>
            <div className="credit-group">
              <h3>Artwork & Visual Design</h3>
              <p>Lands of Nanti Creative Studio</p>
            </div>
            <div className="credit-group">
              <h3>Music & Sound</h3>
              <p>Abyss Audio Productions</p>
            </div>
            <div className="credit-group">
              <h3>Special Thanks</h3>
              <p>To all our players who brave the depths of the Abyss!</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="social-links">
        <h2>Follow Us</h2>
        <div className="social-buttons">
          <a href="https://discord.gg/tdMWdrwCSD" target="_blank" rel="noopener noreferrer" className="social-button discord">
            <img src={discordIcon} alt="Discord" />
          </a>
          <a href="https://x.com/Nanti_NFT" target="_blank" rel="noopener noreferrer" className="social-button twitter">
            <img src={twitterIcon} alt="Twitter" />
          </a>
        </div>
      </div>
      
      <div className="version-info">
        <p>Version 1.0.0</p>
      </div>
      
      <button className="back-button" onClick={handleBackClick}>
        Back to Main Menu
      </button>
    </div>
  );
};

export default AboutScreen;