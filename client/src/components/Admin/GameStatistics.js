// client/src/components/Admin/GameStatistics.js
import React from 'react';
import '../../styles/GameStatistics.css';

const GameStatistics = ({ stats }) => {
  if (!stats) {
    return (
      <div className="game-statistics">
        <h2>Game Statistics</h2>
        <div className="loading-message">
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }
  
  // Для визуализации прогресса кампании
  const renderCampaignProgress = () => {
    return Object.entries(stats.campaignProgress).map(([level, data]) => {
      const levelNumber = level.replace('level', '');
      const completionRate = (data.completed / data.attempts * 100).toFixed(1);
      
      return (
        <div key={level} className="campaign-level-stat">
          <div className="level-name">Level {levelNumber}</div>
          <div className="level-data">
            <div className="level-attempts">{data.attempts} attempts</div>
            <div className="level-completed">{data.completed} completed</div>
            <div className="level-rate">{completionRate}% success rate</div>
          </div>
          <div className="level-progress-bar">
            <div 
              className="level-progress-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      );
    });
  };
  
  // Для визуализации распределения кошельков
  const renderWalletDistribution = () => {
    const total = Object.values(stats.walletDistribution).reduce((a, b) => a + b, 0);
    
    return Object.entries(stats.walletDistribution).map(([wallet, count]) => {
      const percentage = (count / total * 100).toFixed(1);
      
      return (
        <div key={wallet} className="wallet-stat">
          <div className="wallet-name">{wallet.charAt(0).toUpperCase() + wallet.slice(1)}</div>
          <div className="wallet-count">{count} users</div>
          <div className="wallet-percentage">{percentage}%</div>
          <div className="wallet-progress-bar">
            <div 
              className="wallet-progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    });
  };
  
  // Для отображения карточек статистики
  const renderStatCard = (title, value, description, className = '') => {
    return (
      <div className={`stat-card ${className}`}>
        <h3 className="stat-title">{title}</h3>
        <div className="stat-value">{value}</div>
        {description && <div className="stat-description">{description}</div>}
      </div>
    );
  };

  return (
    <div className="game-statistics">
      <h2>Game Statistics</h2>
      
      <div className="stats-overview">
        <div className="stats-cards">
          {renderStatCard('Total Users', stats.totalUsers, 'Registered players')}
          {renderStatCard('Active Players', stats.activePlayers, 'Last 7 days', 'active-stat')}
          {renderStatCard('Average Playtime', `${stats.averagePlaytime} min`, 'Per session')}
          {renderStatCard('Total Games', stats.totalGames, 'Played sessions')}
        </div>
        
        <div className="stats-cards">
          {renderStatCard('Silver Earned', stats.totalSilverEarned, 'Total by all players', 'currency-stat')}
          {renderStatCard('Silver Spent', stats.totalSilverSpent, 'In the shop', 'currency-stat')}
          {renderStatCard('Economy Ratio', `${((stats.totalSilverSpent / stats.totalSilverEarned) * 100).toFixed(1)}%`, 'Spent / Earned')}
          {renderStatCard('NFTs Minted', stats.nftsMinted, 'Freedom Scrolls', 'nft-stat')}
        </div>
      </div>
      
      <div className="stats-detail-container">
        <div className="stats-section">
          <h3>Campaign Progress</h3>
          <div className="campaign-progress">
            {renderCampaignProgress()}
          </div>
        </div>
        
        <div className="stats-section">
          <h3>Most Popular Items</h3>
          <div className="popular-items">
            {stats.mostPopularItems.map((item, index) => (
              <div key={item.id} className="popular-item">
                <div className="item-rank">{index + 1}</div>
                <div className="item-name">{item.name}</div>
                <div className="item-type">
                  {item.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
                <div className="item-purchases">{item.purchases} purchases</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="stats-section">
        <h3>Wallet Distribution</h3>
        <div className="wallet-distribution">
          {renderWalletDistribution()}
        </div>
      </div>
      
      <div className="export-section">
        <button className="export-button">
          Export Statistics (CSV)
        </button>
        <p className="export-description">
          Download detailed statistics data for further analysis.
        </p>
      </div>
    </div>
  );
};

export default GameStatistics;