// client/src/components/Lore/LevelLore.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/LevelLore.css';

// Данные лора для уровней (для каждого уровня по 2 части)
const levelLoreData = {
  1: [
    {
      title: "Awakening in the Ice",
      image: require('../../assets/images/lore/level-1-1.png'),
      paragraphs: [
        "Awakening in an icy cell after a blow to the head, you smelled decay. A torch's faint light barely pierced the gloom. This is the Abyss's depth, like the ninth circle of hell, where traitors are punished with cold and solitude.",
        "Frost coats the walls, and your breath mists in the air. A distant moan echoes, and the sting of betrayal pierces your soul like a knife. Here, your journey begins."
      ]
    },
    {
      title: "The first game",
      image: require('../../assets/images/lore/level-1-2.png'),
      paragraphs: [
        "Before the cell stands a table where a gaunt old man in a tattered cloak sits. His face is hidden, but his eyes burn with emptiness. On the table lie dice and cards, tools of your fate.",
        "'Play,' he rasps. 'Win, and you ascend; lose, and you freeze here.' You prepare for your first battle, knowing this is just the start of your path through hell."
      ]
    }
  ],
  2: [
    {
      title: "The Hall of Lies",
      image: require('../../assets/images/lore/level-2-1.png'),
      paragraphs: [
        "Victorious, you climbed the stairs. The air grew slightly warmer, but the weight remained. You entered a circular hall where deceivers suffer in the shadows of their lies.",
        "Walls are carved with faces of deceit. Puddles reflect torchlight, and whispers weave intrigue. Here, a cunning foe awaits you."
      ]
    },
    {
      title: "The Thief's Challenge",
      image: require('../../assets/images/lore/level-2-2.png'),
      paragraphs: [
        "At the table sits a thief with a crooked grin, fingers adorned with stolen rings. 'Here, wits win,' he chuckles, gesturing to the game. You sit, ready to outsmart him.",
        "The game begins, each move a struggle against this circle's deceit. Victory will bring you closer to freedom and prove you're stronger than his lies."
      ]
    }
  ],
  3: [
    {
      title: "The Arena of Wrath",
      image: require('../../assets/images/lore/level-3-1.png'),
      paragraphs: [
        "Having won, you ascended to the seventh floor, where rage and blood reign. The air smells of iron, walls are scorched, and cries of fury echo.",
        "You entered an arena where a bloodstained table stands amid the filth. Weapons and armor are scattered—remnants of past battles awaiting a new challenger."
      ]
    },
    {
      title: "The Brute's Game",
      image: require('../../assets/images/lore/level-3-2.png'),
      paragraphs: [
        "At the table sits a scarred brute, his gaze ablaze with anger. 'Strength is useless here,' he growls. 'Only the game decides.' You sit, feeling his rage.",
        "Each turn tests your composure. You must stay calm to overcome this fight and move closer to the light."
      ]
    }
  ],
  4: [
    {
      title: "The Library of the Damned",
      image: require('../../assets/images/lore/level-4-1.png'),
      paragraphs: [
        "Ascending, you reached the sixth floor. Heat parches your throat, walls are lined with tombs of bones, and fires dance.",
        "You're in the library of the damned, surrounded by scrolls and books. In the center, a table where your opponent waits, led here by his faith."
      ]
    },
    {
      title: "The Fanatic's Trial",
      image: require('../../assets/images/lore/level-4-2.png'),
      paragraphs: [
        "Your foe is a gaunt monk in rags, eyes full of zeal. 'I sought truth,' he whispers, shuffling cards. You sit, feeling the weight of his words.",
        "The game starts, and the whispers of the dead try to lead you astray. You keep your mind clear to win and proceed."
      ]
    }
  ],
  5: [
    {
      title: "The Swamp of Rage",
      image: require('../../assets/images/lore/level-5-1.png'),
      paragraphs: [
        "You rose to the fifth floor. The air is filled with screams, the floor is mud, walls stained with blood.",
        "You're on an islet amid a swamp, where a table stands. Ghosts fight around you, their faces twisted with rage. Here, you must control yourself."
      ]
    },
    {
      title: "The Wrathful Woman's Game",
      image: require('../../assets/images/lore/level-5-2.png'),
      paragraphs: [
        "Your enemy is a woman with fiery hair, her face ablaze with anger. 'I lost to myself,' she hisses, throwing dice. You sit, ready for the game.",
        "Each move is a struggle against irritation. You must remain calm to defeat her and this floor of malice."
      ]
    }
  ],
  6: [
    {
      title: "The Hall of Rotting Wealth",
      image: require('../../assets/images/lore/level-6-1.png'),
      paragraphs: [
        "You're on the fourth floor. The hall is filled with dull gold and jewels, but all is rotting.",
        "In the center, a dilapidated table, once luxurious. Here, those who hoarded and squandered play for the illusion of their past."
      ]
    },
    {
      title: "The Miser's Lament",
      image: require('../../assets/images/lore/level-6-2.png'),
      paragraphs: [
        "Your foe is a fat man in faded finery, his rings tarnished. 'I lost everything,' he groans, pointing to the game. You sit, knowing the cost of greed.",
        "The game proceeds, and you learn balance, avoiding avarice. Victory here is a step toward freedom and a lesson in moderation."
      ]
    }
  ],
  7: [
    {
      title: "The Chamber of Filth",
      image: require('../../assets/images/lore/level-7-1.png'),
      paragraphs: [
        "You're on the third floor, where gluttony drowns in filth. The floor is slick with slime, food rots, insects buzz.",
        "Amid this, a sticky table. Here, those who lived for feasts now play in eternal hunger."
      ]
    },
    {
      title: "The Glutton's Game",
      image: require('../../assets/images/lore/level-7-2.png'),
      paragraphs: [
        "Your enemy is a corpulent man, clothes stained. 'Food was my god,' he wails, taking the dice. You sit, fighting revulsion.",
        "The game demands focus. You win, learning restraint where others succumbed to excess."
      ]
    }
  ],
  8: [
    {
      title: "The Whisper of Passion",
      image: require('../../assets/images/lore/level-8-1.png'),
      paragraphs: [
        "You're on the second floor. Sighs and the rustle of fabric fill the air.",
        "In a secluded corner, a table draped in silk. Here, those who yielded to passion seek peace through the game."
      ]
    },
    {
      title: "The Temptress's Game",
      image: require('../../assets/images/lore/level-8-2.png'),
      paragraphs: [
        "Your foe is a beauty with sad eyes. 'Love ruined me,' she whispers, dealing cards. You sit, feeling temptation.",
        "The game proceeds, and you resist allure. Victory teaches self-control where she lost it."
      ]
    }
  ],
  9: [
    {
      title: "The Garden of Twilight",
      image: require('../../assets/images/lore/level-9-1.png'),
      paragraphs: [
        "You're on the first floor, Limbo, where sages languish in twilight. The air is still, the light eternal dusk.",
        "You're in a garden with a bare tree, beneath which stands a table. Here, they play not for torment but for the hope of moving on."
      ]
    },
    {
      title: "The Sage's Game",
      image: require('../../assets/images/lore/level-9-2.png'),
      paragraphs: [
        "Your enemy is an elder with wise eyes. 'I sought knowledge,' he says, inviting you to play. You sit, feeling calm.",
        "The game progresses, each move bringing you closer to freedom. This floor teaches that even in shadow, there is purpose."
      ]
    }
  ],
  10: [
    {
      title: "The Light of Liberation",
      image: require('../../assets/images/lore/level-10-1.png'),
      paragraphs: [
        "You climbed the final staircase and stepped into the light. The Abyss's gates opened, and fresh air filled your lungs. The sun warms you; you are free.",
        "A clerk at the exit hands you a scroll: 'You've passed through hell. This is your freedom and stipend from the treasury.' You take it, scarcely believing your fortune."
      ]
    },
    {
      title: "A New Beginning",
      image: require('../../assets/images/lore/level-10-2.png'),
      paragraphs: [
        "Leaving the Abyss, you look back at your journey. Each game tempered you, showing strength of spirit and the chance for redemption.",
        "With the scroll and money, you walk toward a new life. The prison is behind you, but its lessons will stay with you forever."
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