// client/src/components/Inventory/DeckBuilder.js
import React, { useState, useEffect } from 'react';
import '../../styles/DeckBuilder.css';

const DeckBuilder = ({
  baseCards,
  shopItems,
  selectedCards,
  ownedItems,
  onSelectCard,
  onViewDetails
}) => {
  const [activeCardType, setActiveCardType] = useState(null);
  const [availableSkins, setAvailableSkins] = useState([]);
  const [availableSpecials, setAvailableSpecials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  
  // Фильтрация карт по поисковому запросу
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCards(baseCards);
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = baseCards.filter(card => 
      card.name.toLowerCase().includes(lowerSearchTerm) ||
      card.type.toLowerCase().includes(lowerSearchTerm)
    );
    
    setFilteredCards(filtered);
  }, [searchTerm, baseCards]);
  
  // Обработчик выбора карты для редактирования
  const handleCardSelect = (cardType) => {
    setActiveCardType(cardType);
    
    // Фильтруем доступные скины для этого типа карты
    const skins = shopItems.filter(item => 
      item.type === 'card_skin' && item.cardType === cardType
    );
    
    // Фильтруем доступные специальные карты для этого типа карты
    const specials = shopItems.filter(item => 
      item.type === 'special_card' && item.cardType === cardType
    );
    
    setAvailableSkins(skins);
    setAvailableSpecials(specials);
  };
  
  // Получение выбранного варианта для карты (скин или особая карта)
  const getSelectedVariant = (cardType) => {
    if (!selectedCards[cardType]) {
      return { type: 'base', id: null };
    }
    
    if (selectedCards[cardType].special) {
      return { type: 'special', id: selectedCards[cardType].special };
    }
    
    if (selectedCards[cardType].skin) {
      return { type: 'skin', id: selectedCards[cardType].skin };
    }
    
    return { type: 'base', id: null };
  };
  
  // Обработчик выбора скина
  const handleSkinSelect = (skin) => {
    if (!activeCardType) return;
    
    // Выбираем скин и сбрасываем особую карту
    onSelectCard(activeCardType, skin, false);
  };
  
  // Обработчик выбора базовой карты (сброс всех модификаций)
  const handleBaseSelect = () => {
    if (!activeCardType) return;
    
    // Сбрасываем и скин, и особую карту
    onSelectCard(activeCardType, null, false);
  };
  
  // Обработчик выбора специальной карты
  const handleSpecialSelect = (special) => {
    if (!activeCardType) return;
    
    // Выбираем особую карту и сбрасываем скин
    onSelectCard(activeCardType, special, true);
  };
  
  // Проверка, принадлежит ли предмет пользователю
  const isItemOwned = (itemId) => {
    return ownedItems.includes(itemId);
  };
  
  // Функция для получения изображения карты с учетом выбранного варианта
  const getCardImage = (card) => {
    const variant = getSelectedVariant(card.type);
    
    if (variant.type === 'skin') {
      const skin = shopItems.find(item => item.id === variant.id);
      return skin && isItemOwned(skin.id) ? skin.image : card.image;
    }
    
    if (variant.type === 'special') {
      const special = shopItems.find(item => item.id === variant.id);
      return special && isItemOwned(special.id) ? special.image : card.image;
    }
    
    return card.image;
  };
  
  // Функция для проверки, используется ли специальная карта
  const hasSpecialCard = (card) => {
    const variant = getSelectedVariant(card.type);
    return variant.type === 'special';
  };
  
  // Функция для проверки, используется ли скин
  const hasSkin = (card) => {
    const variant = getSelectedVariant(card.type);
    return variant.type === 'skin';
  };

  return (
    <div className="deck-builder">
      <div className="deck-container">
        <div className="deck-header">
          <h2>Your Card Deck (20 cards)</h2>
          <div className="search-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cards..."
              className="search-input"
            />
          </div>
        </div>
        
        <div className="deck-cards">
          {filteredCards.map(card => (
            <div 
              key={card.id}
              className={`deck-card ${activeCardType === card.type ? 'active' : ''} ${hasSpecialCard(card) ? 'special' : hasSkin(card) ? 'skinned' : ''}`}
              onClick={() => handleCardSelect(card.type)}
            >
              <img 
                src={getCardImage(card)}
                alt={card.name}
                className="card-image"
              />
              <div className="card-name">{card.name}</div>
              
              {hasSpecialCard(card) && (
                <div className="special-card-badge">
                  Special
                </div>
              )}
              
              {hasSkin(card) && !hasSpecialCard(card) && (
                <div className="skin-badge">
                  Skin
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {activeCardType && (
        <div className="card-customization">
          <h2>Customize Card</h2>
          
          <div className="active-card-info">
            <div className="card-type">
              {baseCards.find(card => card.type === activeCardType)?.name}
            </div>
            <div className="variant-info">
              Current: {getSelectedVariant(activeCardType).type === 'base' ? 'Base Card' : 
                      getSelectedVariant(activeCardType).type === 'skin' ? 'Card Skin' : 'Special Card'}
            </div>
          </div>
          
          {/* Выбор варианта карты */}
          <div className="customization-section">
            <h3>Select Card Variant</h3>
            <p className="variant-explanation">You can choose one variant for this card: the base card, a skin, or a special card.</p>
            
            <div className="customization-options">
              {/* Базовая карта */}
              <div 
                className={`customization-option ${getSelectedVariant(activeCardType).type === 'base' ? 'selected' : ''}`}
                onClick={() => handleBaseSelect()}
              >
                <img 
                  src={baseCards.find(card => card.type === activeCardType)?.image}
                  alt="Base Card"
                  className="option-image"
                />
                <div className="option-name">Base Card</div>
                <div className="option-description">Standard card with no special effects</div>
              </div>
              
              {/* Доступные скины */}
              {availableSkins.map(skin => (
                <div 
                  key={skin.id}
                  className={`customization-option ${getSelectedVariant(activeCardType).type === 'skin' && getSelectedVariant(activeCardType).id === skin.id ? 'selected' : ''} ${!isItemOwned(skin.id) ? 'locked' : ''}`}
                  onClick={() => isItemOwned(skin.id) && handleSkinSelect(skin)}
                >
                  <img 
                    src={skin.image}
                    alt={skin.name}
                    className="option-image"
                  />
                  <div className="option-name">{skin.name}</div>
                  <div className="option-description">Visual variant with no special effects</div>
                  
                  {!isItemOwned(skin.id) && (
                    <div className="locked-overlay">
                      <span>Not Owned</span>
                    </div>
                  )}
                  
                  <button 
                    className="view-details-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(skin);
                    }}
                  >
                    Details
                  </button>
                </div>
              ))}
              
              {/* Доступные специальные карты */}
              {availableSpecials.map(special => (
                <div 
                  key={special.id}
                  className={`customization-option ${getSelectedVariant(activeCardType).type === 'special' && getSelectedVariant(activeCardType).id === special.id ? 'selected' : ''} ${!isItemOwned(special.id) ? 'locked' : ''}`}
                  onClick={() => isItemOwned(special.id) && handleSpecialSelect(special)}
                >
                  <img 
                    src={special.image}
                    alt={special.name}
                    className="option-image"
                  />
                  <div className="option-name">{special.name}</div>
                  
                  {special.effect && (
                    <div className="special-effect-badge">
                      Special
                    </div>
                  )}
                  
                  <div className="option-description">Special card with unique effect</div>
                  
                  {!isItemOwned(special.id) && (
                    <div className="locked-overlay">
                      <span>Not Owned</span>
                    </div>
                  )}
                  
                  <button 
                    className="view-details-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(special);
                    }}
                  >
                    Details
                  </button>
                </div>
              ))}
              
              {availableSkins.length === 0 && availableSpecials.length === 0 && (
                <div className="no-options-message">
                  <p>No alternative versions available for this card. Check the shop!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckBuilder;