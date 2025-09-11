import React from 'react';

const Achievement = ({ achievement }) => {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return 'from-purple-600 to-pink-600 border-purple-400';
      case 'rare':
        return 'from-blue-600 to-cyan-600 border-blue-400';
      case 'uncommon':
        return 'from-green-600 to-emerald-600 border-green-400';
      case 'common':
        return 'from-gray-600 to-gray-500 border-gray-400';
      default:
        return 'from-gray-600 to-gray-500 border-gray-400';
    }
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return 'shadow-purple-500/50';
      case 'rare':
        return 'shadow-blue-500/50';
      case 'uncommon':
        return 'shadow-green-500/50';
      case 'common':
        return 'shadow-gray-500/50';
      default:
        return 'shadow-gray-500/50';
    }
  };

  const progressPercentage = achievement.maxProgress > 0 
    ? Math.round((achievement.progress / achievement.maxProgress) * 100)
    : 0;

  return (
    <div className={`card text-center relative overflow-hidden ${
      achievement.unlocked 
        ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} shadow-lg ${getRarityGlow(achievement.rarity)}` 
        : 'bg-gray-800 border-gray-700 opacity-60'
    }`}>
      {/* Rarity indicator */}
      <div className="absolute top-2 right-2">
        <div className={`w-2 h-2 rounded-full ${
          achievement.rarity === 'legendary' ? 'bg-purple-400' :
          achievement.rarity === 'rare' ? 'bg-blue-400' :
          achievement.rarity === 'uncommon' ? 'bg-green-400' :
          'bg-gray-400'
        }`}></div>
      </div>

      {/* Achievement icon */}
      <div className={`text-4xl mb-3 ${achievement.unlocked ? '' : 'grayscale'}`}>
        {achievement.icon}
      </div>

      {/* Achievement title */}
      <h3 className={`font-semibold mb-2 ${
        achievement.unlocked ? 'text-white' : 'text-gray-400'
      }`}>
        {achievement.title}
      </h3>

      {/* Achievement description */}
      <p className={`text-sm mb-3 ${
        achievement.unlocked ? 'text-gray-200' : 'text-gray-500'
      }`}>
        {achievement.description}
      </p>

      {/* Progress bar (if applicable) */}
      {achievement.maxProgress > 1 && (
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span className={achievement.unlocked ? 'text-gray-200' : 'text-gray-500'}>
              {achievement.progress}/{achievement.maxProgress}
            </span>
            <span className={achievement.unlocked ? 'text-gray-200' : 'text-gray-500'}>
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                  : 'bg-gray-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Unlocked indicator */}
      {achievement.unlocked && (
        <div className="absolute top-2 left-2">
          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievement;

