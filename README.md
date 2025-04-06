# Lands of Nanti

> An immersive dark fantasy card and dice game with Solana blockchain integration

![Lands of Nanti Banner](client/public/images/backgrounds/main-background.png)

## 📖 Overview

Lands of Nanti is a browser-based card and dice game set in a dark fantasy world. Players must navigate through the nine circles of the Abyss of Despair, using strategy and luck to win games against the denizens of each level. The game combines deck building, dice rolling, and risk management mechanics with blockchain integration for authentication and rewards.

### Key Features

- **Blockchain Authentication**: Connect securely using Solana wallets (Phantom or Solflare)
- **Strategic Gameplay**: Combine dice values with matching cards to create powerful combinations
- **Campaign Mode**: Progress through 10 unique levels with increasing difficulty
- **Customization**: Collect special cards and dice to enhance your strategy
- **NFT Rewards**: Earn a unique NFT upon campaign completion
- **Dark Fantasy Setting**: Immerse yourself in a grim world with atmospheric visuals and lore

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Solana wallet (Phantom or Solflare browser extension)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/lands-of-nanti.git
   cd lands-of-nanti
   ```

2. Install dependencies for both server and client:
   ```
   npm run install-all
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   NODE_ENV=development
   PORT=3001
   
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nanti_dev
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   
   # Solana
   SOLANA_RPC_URL=https://api.devnet.solana.com
   
   # Storage
   STORAGE_PATH=./uploads
   ```

4. Set up the PostgreSQL database:
   ```
   CREATE DATABASE nanti_dev;
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to http://localhost:3000

## 🎮 How to Play

1. **Connect your wallet**: Use Phantom or Solflare to authenticate
2. **Enter your name**: Choose a name for your adventure
3. **Learn the basics**: Follow the tutorial to understand game mechanics
4. **Campaign**: Progress through 10 levels, each with unique challenges
5. **Combinations**: Match dice values with appropriate cards to earn points
6. **Risk management**: Decide whether to draw additional cards for higher scores
7. **Customization**: Collect and equip special cards and dice from the shop
8. **NFT Reward**: Complete all 10 levels to earn a unique NFT commemorating your victory

## 🏗️ Project Structure

```
lands-of-nanti/
├── client/                      # Frontend (React)
│   ├── public/                  # Static files
│   └── src/                     # React source code
│       ├── components/          # UI components
│       ├── context/             # React context providers
│       ├── styles/              # CSS styles
│       └── utils/               # Utility functions
├── server/                      # Backend (Node.js/Express)
│   ├── controllers/             # API route controllers
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── middleware/              # Express middleware
│   ├── utils/                   # Utility functions
│   └── db/                      # Database configuration
└── uploads/                     # Uploaded images (cards, dice)
```

## 🧠 Technical Details

- **Frontend**: React, CSS, Solana Wallet Adapter
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Sequelize ORM
- **Blockchain**: Solana (wallet connection, NFT minting)
- **File Storage**: Local filesystem (production: AWS S3)
- **Authentication**: Solana wallet signatures

## 🔮 Future Plans

- Adventure mode with procedurally generated challenges
- Multiplayer battles
- More special cards and dice
- Mobile application
- Additional NFT collections and rewards

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Acknowledgements

- Solana blockchain for providing the infrastructure
- Phantom and Solflare wallet teams
- All contributors and players who make this game possible