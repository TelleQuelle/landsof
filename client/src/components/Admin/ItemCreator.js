// client/src/components/Admin/ItemCreator.js
import React, { useState } from 'react';
import '../../styles/ItemCreator.css';

// Типы предметов
const ITEM_TYPES = {
  CARD_SKIN: 'card_skin',
  DICE_SKIN: 'dice_skin',
  SPECIAL_CARD: 'special_card',
  SPECIAL_DICE: 'special_dice'
};

// Редкости предметов
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Partner'];

// Эффекты для специальных карт
const CARD_EFFECTS = [
  { value: 'increased_points', label: 'Increased Points (1.5x)' },
  { value: 'universal', label: 'Universal (works with any dice)' },
  { value: 'extra_turn', label: 'Extra Turn' },
  { value: 'silver_multiplier', label: 'Silver Multiplier (1.25x)' }
];

// Эффекты для специальных кубиков
const DICE_EFFECTS = [
  { value: 'emotional_vices', label: 'Emotional Vices (Lust, Discord, Carelessness)' },
  { value: 'material_vices', label: 'Material Vices (Greed, Power, Peace)' },
  { value: 'social_vices', label: 'Social Vices (Power, Lust, Carelessness)' },
  { value: 'destructive_vices', label: 'Destructive Vices (Discord, Greed, Peace)' },
  { value: 'score_multiplier', label: 'Score Multiplier (1.25x)' },
  { value: 'extra_turn', label: 'Extra Turn' }
];

// Доступные типы карт персонажей
const CARD_TYPES = [
  'knight', 'witch', 'princess', 'king', 'dwarf', 'skeleton_mage', 'skeleton_warrior', 
  'viking', 'demon', 'hunter', 'thief', 'druid', 'bard', 'monk', 'executioner', 
  'werewolf', 'alchemist', 'cultist', 'plague_doctor', 'peasant'
];

const ItemCreator = () => {
  // Основные состояния для создания предмета
  const [step, setStep] = useState(1); // Шаг создания предмета
  const [itemType, setItemType] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemRarity, setItemRarity] = useState('Common');
  const [itemPrice, setItemPrice] = useState('');
  const [itemEffect, setItemEffect] = useState('');
  const [cardType, setCardType] = useState('');
  
  // Состояния для партнерского предмета
  const [isPartner, setIsPartner] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerDescription, setPartnerDescription] = useState('');
  const [hasTwitter, setHasTwitter] = useState(false);
  const [hasDiscord, setHasDiscord] = useState(false);
  const [twitterLink, setTwitterLink] = useState('');
  const [discordLink, setDiscordLink] = useState('');
  
  // Состояния для загрузки изображений
  const [mainImage, setMainImage] = useState(null);
  const [diceImages, setDiceImages] = useState(Array(6).fill(null));
  const [partnerLogo, setPartnerLogo] = useState(null);
  
  // Состояние для отображения сообщения об успехе
  const [successMessage, setSuccessMessage] = useState('');
  
  // Обработчик изменения изображения
  const handleImageChange = (e, index = null) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Проверяем формат файла (только PNG)
    if (file.type !== 'image/png') {
      alert('Only PNG images are allowed');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      if (index !== null) {
        // Для кубика - обновляем конкретное изображение
        const newDiceImages = [...diceImages];
        newDiceImages[index] = reader.result;
        setDiceImages(newDiceImages);
      } else if (e.target.name === 'partnerLogo') {
        // Для логотипа партнера
        setPartnerLogo(reader.result);
      } else {
        // Для основного изображения
        setMainImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Обработчик изменения шага
  const handleStepChange = (newStep) => {
    // Валидация полей перед переходом к следующему шагу
    if (newStep > step) {
      if (step === 1) {
        if (!itemType) {
          alert('Please select an item type');
          return;
        }
        if (!itemName.trim()) {
          alert('Please enter a name for the item');
          return;
        }
        if (!itemDescription.trim()) {
          alert('Please enter a description for the item');
          return;
        }
        if (!itemPrice || isNaN(parseInt(itemPrice)) || parseInt(itemPrice) <= 0) {
          alert('Please enter a valid price for the item');
          return;
        }
        
        // Для карт нужно выбрать тип карты
        if ((itemType === ITEM_TYPES.CARD_SKIN || itemType === ITEM_TYPES.SPECIAL_CARD) && !cardType) {
          alert('Please select a card type');
          return;
        }
        
        // Для специальных предметов нужно выбрать эффект
        if ((itemType === ITEM_TYPES.SPECIAL_CARD || itemType === ITEM_TYPES.SPECIAL_DICE) && !itemEffect) {
          alert('Please select an effect for the special item');
          return;
        }
      } else if (step === 2 && isPartner) {
        if (!partnerName.trim()) {
          alert('Please enter a name for the partner');
          return;
        }
        if (!partnerDescription.trim()) {
          alert('Please enter a description for the partner');
          return;
        }
        
        // Если выбраны социальные сети, нужно указать ссылки
        if (hasTwitter && !twitterLink.trim()) {
          alert('Please enter a Twitter link for the partner');
          return;
        }
        if (hasDiscord && !discordLink.trim()) {
          alert('Please enter a Discord link for the partner');
          return;
        }
      } else if (step === 3) {
        if (!mainImage) {
          alert('Please upload a main image for the item');
          return;
        }
        
        // Для кубиков нужно загрузить 6 изображений для каждой грани
        if (itemType.includes('dice') && diceImages.some(img => img === null)) {
          alert('Please upload images for all 6 dice faces');
          return;
        }
        
        // Для партнерских предметов нужно загрузить логотип
        if (isPartner && !partnerLogo) {
          alert('Please upload a partner logo');
          return;
        }
      }
    }
    
    setStep(newStep);
  };
  
  // Обработчик отправки формы
  const handleSubmit = async () => {
    // Собираем данные предмета
    const itemData = {
      type: itemType,
      name: itemName,
      description: itemDescription,
      rarity: isPartner ? 'Partner' : itemRarity,
      price: parseInt(itemPrice),
      effect: (itemType === ITEM_TYPES.SPECIAL_CARD || itemType === ITEM_TYPES.SPECIAL_DICE) ? itemEffect : null,
      cardType: (itemType === ITEM_TYPES.CARD_SKIN || itemType === ITEM_TYPES.SPECIAL_CARD) ? cardType : null,
      isPartner,
      partnerInfo: isPartner ? {
        name: partnerName,
        description: partnerDescription,
        twitter: hasTwitter ? twitterLink : null,
        discord: hasDiscord ? discordLink : null,
        logo: partnerLogo
      } : null,
      mainImage,
      diceImages: itemType.includes('dice') ? diceImages : null
    };
    
    try {
      // В будущем здесь будет запрос к API для сохранения предмета
      // Пока просто выводим объект в консоль
      console.log('Item created:', itemData);
      
      // Показываем сообщение об успехе
      setSuccessMessage('Item successfully created!');
      
      // Сбрасываем форму через 3 секунды
      setTimeout(() => {
        setSuccessMessage('');
        resetForm();
      }, 3000);
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Error creating item. Please try again.');
    }
  };
  
  // Сброс формы
  const resetForm = () => {
    setStep(1);
    setItemType('');
    setItemName('');
    setItemDescription('');
    setItemRarity('Common');
    setItemPrice('');
    setItemEffect('');
    setCardType('');
    setIsPartner(false);
    setPartnerName('');
    setPartnerDescription('');
    setHasTwitter(false);
    setHasDiscord(false);
    setTwitterLink('');
    setDiscordLink('');
    setMainImage(null);
    setDiceImages(Array(6).fill(null));
    setPartnerLogo(null);
  };

  return (
    <div className="item-creator">
      <h2>Create New Shop Item</h2>
      
      <div className="step-indicator">
        <div 
          className={`step-dot ${step >= 1 ? 'active' : ''}`} 
          onClick={() => handleStepChange(1)}
        >
          1
        </div>
        <div className="step-line"></div>
        <div 
          className={`step-dot ${step >= 2 ? 'active' : ''}`} 
          onClick={() => step > 1 && handleStepChange(2)}
        >
          2
        </div>
        <div className="step-line"></div>
        <div 
          className={`step-dot ${step >= 3 ? 'active' : ''}`} 
          onClick={() => step > 2 && handleStepChange(3)}
        >
          3
        </div>
      </div>
      
      <div className="step-description">
        {step === 1 && <p>Step 1: Basic Item Information</p>}
        {step === 2 && <p>Step 2: Partner Information (Optional)</p>}
        {step === 3 && <p>Step 3: Upload Images</p>}
      </div>
      
      {/* Шаг 1: Основная информация */}
      {step === 1 && (
        <div className="item-form">
          <div className="form-group">
            <label>Item Type:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="itemType" 
                  value={ITEM_TYPES.CARD_SKIN} 
                  checked={itemType === ITEM_TYPES.CARD_SKIN}
                  onChange={(e) => setItemType(e.target.value)}
                />
                Card Skin
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="itemType" 
                  value={ITEM_TYPES.DICE_SKIN} 
                  checked={itemType === ITEM_TYPES.DICE_SKIN}
                  onChange={(e) => setItemType(e.target.value)}
                />
                Dice Skin
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="itemType" 
                  value={ITEM_TYPES.SPECIAL_CARD} 
                  checked={itemType === ITEM_TYPES.SPECIAL_CARD}
                  onChange={(e) => setItemType(e.target.value)}
                />
                Special Card
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="itemType" 
                  value={ITEM_TYPES.SPECIAL_DICE} 
                  checked={itemType === ITEM_TYPES.SPECIAL_DICE}
                  onChange={(e) => setItemType(e.target.value)}
                />
                Special Dice
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="itemName">Item Name:</label>
            <input 
              type="text" 
              id="itemName" 
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="itemDescription">Description:</label>
            <textarea 
              id="itemDescription" 
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Enter item description"
              rows={3}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="itemRarity">Rarity:</label>
            <select 
              id="itemRarity" 
              value={itemRarity}
              onChange={(e) => setItemRarity(e.target.value)}
            >
              {RARITIES.slice(0, 5).map(rarity => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="itemPrice">Price (Silver):</label>
            <input 
              type="number" 
              id="itemPrice" 
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="Enter price in silver"
              min="1"
            />
          </div>
          
          {/* Дополнительные поля для карт */}
          {(itemType === ITEM_TYPES.CARD_SKIN || itemType === ITEM_TYPES.SPECIAL_CARD) && (
            <div className="form-group">
              <label htmlFor="cardType">Card Type:</label>
              <select 
                id="cardType" 
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
              >
                <option value="">Select card type</option>
                {CARD_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Дополнительные поля для специальных предметов */}
          {itemType === ITEM_TYPES.SPECIAL_CARD && (
            <div className="form-group">
              <label htmlFor="cardEffect">Special Effect:</label>
              <select 
                id="cardEffect" 
                value={itemEffect}
                onChange={(e) => setItemEffect(e.target.value)}
              >
                <option value="">Select effect</option>
                {CARD_EFFECTS.map(effect => (
                  <option key={effect.value} value={effect.value}>{effect.label}</option>
                ))}
              </select>
            </div>
          )}
          
          {itemType === ITEM_TYPES.SPECIAL_DICE && (
            <div className="form-group">
              <label htmlFor="diceEffect">Special Effect:</label>
              <select 
                id="diceEffect" 
                value={itemEffect}
                onChange={(e) => setItemEffect(e.target.value)}
              >
                <option value="">Select effect</option>
                {DICE_EFFECTS.map(effect => (
                  <option key={effect.value} value={effect.value}>{effect.label}</option>
                ))}
              </select>
            </div>
          )}
          
          <div className="form-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={isPartner}
                onChange={(e) => setIsPartner(e.target.checked)}
              />
              This is a partner item
            </label>
          </div>
          
          <div className="form-actions">
            <button 
              className="button-primary"
              onClick={() => handleStepChange(2)}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Шаг 2: Информация о партнере */}
      {step === 2 && (
        <div className="item-form">
          {isPartner ? (
            <>
              <div className="form-group">
                <label htmlFor="partnerName">Partner Name:</label>
                <input 
                  type="text" 
                  id="partnerName" 
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Enter partner name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="partnerDescription">Partner Description:</label>
                <textarea 
                  id="partnerDescription" 
                  value={partnerDescription}
                  onChange={(e) => setPartnerDescription(e.target.value)}
                  placeholder="Enter partner description"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <h3>Partner Social Media</h3>
                <div className="social-media-controls">
                  <div className="social-media-option">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={hasTwitter}
                        onChange={(e) => setHasTwitter(e.target.checked)}
                      />
                      Twitter
                    </label>
                    
                    {hasTwitter && (
                      <input 
                        type="text" 
                        value={twitterLink}
                        onChange={(e) => setTwitterLink(e.target.value)}
                        placeholder="Enter Twitter URL"
                      />
                    )}
                  </div>
                  
                  <div className="social-media-option">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={hasDiscord}
                        onChange={(e) => setHasDiscord(e.target.checked)}
                      />
                      Discord
                    </label>
                    
                    {hasDiscord && (
                      <input 
                        type="text" 
                        value={discordLink}
                        onChange={(e) => setDiscordLink(e.target.value)}
                        placeholder="Enter Discord URL"
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="not-partner-message">
              <p>This item is not a partner item. You can proceed to the next step.</p>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              className="button-secondary"
              onClick={() => handleStepChange(1)}
            >
              Back
            </button>
            <button 
              className="button-primary"
              onClick={() => handleStepChange(3)}
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Шаг 3: Загрузка изображений */}
      {step === 3 && (
        <div className="item-form">
          <div className="form-group">
            <label htmlFor="mainImage">Main Image (PNG only):</label>
            <div className="image-upload-container">
              <input 
                type="file" 
                id="mainImage" 
                accept=".png"
                onChange={handleImageChange}
              />
              
              {mainImage && (
                <div className="image-preview">
                  <img src={mainImage} alt="Main Preview" />
                </div>
              )}
            </div>
          </div>
          
          {/* Загрузка изображений для кубика */}
          {itemType.includes('dice') && (
            <div className="form-group">
              <h3>Dice Face Images (PNG only)</h3>
              
              <div className="dice-images-grid">
                {diceImages.map((image, index) => (
                  <div key={index} className="dice-image-upload">
                    <label htmlFor={`diceImage${index}`}>Face {index + 1}:</label>
                    <input 
                      type="file" 
                      id={`diceImage${index}`} 
                      accept=".png"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                    
                    {image && (
                      <div className="image-preview">
                        <img src={image} alt={`Face ${index + 1}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Загрузка логотипа партнера */}
          {isPartner && (
            <div className="form-group">
              <label htmlFor="partnerLogo">Partner Logo (PNG only):</label>
              <div className="image-upload-container">
                <input 
                  type="file" 
                  id="partnerLogo" 
                  name="partnerLogo"
                  accept=".png"
                  onChange={handleImageChange}
                />
                
                {partnerLogo && (
                  <div className="image-preview">
                    <img src={partnerLogo} alt="Partner Logo Preview" />
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              className="button-secondary"
              onClick={() => handleStepChange(2)}
            >
              Back
            </button>
            <button 
              className="button-primary"
              onClick={handleSubmit}
            >
              Create Item
            </button>
          </div>
          
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemCreator;