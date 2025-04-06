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
  
  // Обработчик выбора скина
  const handleSkinSelect = (skin) => {
    if (!activeCardType) return;
    
    onSelectCard(activeCardType, skin, false);
  };
  
  // Обработчик выбора специальной карты
  const handleSpecialSelect = (special) => {
    if (!activeCardType) return;
    
    onSelectCard(activeCardType, special, true);
  };
  
  // Получение выбранного скина для карты
  const getSelectedSkin = (cardType) => {
    if (!selectedCards[cardType] || !selectedCards[cardType].skin) {
      return null;
    }
    
    return shopItems.find(item => item.id === selectedCards[cardType].skin);
  };
  
  // Получение выбранной специальной карты
  const getSelectedSpecial = (cardType) => {
    if (!selectedCards[cardType] || !selectedCards[cardType].special) {
      return null;
    }
    
    return shopItems.find(item => item.id === selectedCards[cardType].special);
  };
  
  // Проверка, принадлежит ли предмет пользователю
  const isItemOwned = (itemId) => {
    return ownedItems.includes(itemId);
  };
  
  // Функция для получения изображения карты с учетом выбранного скина
  const getCardImage = (card) => {
    const skin = getSelectedSkin(card.type);
    return skin && isItemOwned(skin.id) ? skin.image : `/assets/images/cards/${card.type}.png`;
  };
  
  // Функция для проверки, используется ли специальная карта
  const hasSpecialCard = (card) => {
    const special = getSelectedSpecial(card.type);
    return special && isItemOwned(special.id);
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
              className={`deck-card ${activeCardType === card.type ? 'active' : ''} ${hasSpecialCard(card) ? 'special' : ''}`}
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
          </div>
          
          {/* Секция скинов */}
          <div className="customization-section">
            <h3>Card Skins</h3>
            <div className="customization-options">
              {/* Базовый скин */}
              <div 
                className={`customization-option ${!getSelectedSkin(activeCardType) ? 'selected' : ''}`}
                onClick={() => handleSkinSelect(null)}
              >
                <img 
                  src={baseCards.find(card => card.type === activeCardType)?.image}
                  alt="Base Skin"
                  className="option-image"
                />
                <div className="option-name">Base</div>
              </div>
              
              {/* Доступные скины */}
              {availableSkins.map(skin => (
                <div 
                  key={skin.id}
                  className={`customization-option ${getSelectedSkin(activeCardType)?.id === skin.id ? 'selected' : ''} ${!isItemOwned(skin.id) ? 'locked' : ''}`}
                  onClick={() => isItemOwned(skin.id) && handleSkinSelect(skin)}
                >
                  <img 
                    src={skin.image}
                    alt={skin.name}
                    className="option-image"
                  />
                  <div className="option-name">{skin.name}</div>
                  
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
              
              {availableSkins.length === 0 && (
                <div className="no-options-message">
                  <p>No skins available for this card</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Секция специальных карт */}
          <div className="customization-section">
            <h3>Special Cards</h3>
            <div className="customization-options">
              {/* Базовая карта (без особых эффектов) */}
              <div 
                className={`customization-option ${!getSelectedSpecial(activeCardType) ? 'selected' : ''}`}
                onClick={() => handleSpecialSelect(null)}
              >
                <img 
                  src={baseCards.find(card => card.type === activeCardType)?.image}
                  alt="Base Card"
                  className="option-image"
                />
                <div className="option-name">None</div>
              </div>
              
              {/* Доступные специальные карты */}
              {availableSpecials.map(special => (
                <div 
                  key={special.id}
                  className={`customization-option ${getSelectedSpecial(activeCardType)?.id === special.id ? 'selected' : ''} ${!isItemOwned(special.id) ? 'locked' : ''}`}
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
              
              {availableSpecials.length === 0 && (
                <div className="no-options-message">
                  <p>No special cards available for this card</p>
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