import { useState, useEffect } from 'react';

const CrownBadge = ({ size = 'large', type = 'crown' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const sizeClasses = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-base',
    large: 'w-16 h-16 text-lg',
    xlarge: 'w-20 h-20 text-xl'
  };

  const getCrownIcon = () => {
    switch (type) {
      case 'crown':
        return '👑';
      case 'trophy':
        return '🏆';
      case 'medal':
        return '🥇';
      case 'rosette':
        return '🏵️';
      default:
        return '👑';
    }
  };

  const getGradientClass = () => {
    switch (type) {
      case 'crown':
        return 'from-yellow-400 to-yellow-600';
      case 'trophy':
        return 'from-yellow-500 to-orange-500';
      case 'medal':
        return 'from-yellow-400 to-yellow-500';
      case 'rosette':
        return 'from-pink-400 to-red-500';
      default:
        return 'from-yellow-400 to-yellow-600';
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <div
        className={`bg-gradient-to-br ${getGradientClass()} rounded-full flex items-center justify-center shadow-lg transform transition-all duration-500 ${
          isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
        }`}
        style={{
          animation: isVisible ? 'pulse 2s infinite' : 'none'
        }}
      >
        <span className="text-2xl">
          {getCrownIcon()}
        </span>
      </div>
      
      {/* Glow effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getGradientClass()} rounded-full opacity-30 blur-md transform transition-all duration-500 ${
          isVisible ? 'scale-150' : 'scale-0'
        }`}
        style={{
          animation: isVisible ? 'pulse 2s infinite' : 'none'
        }}
      />
      
      {/* Sparkle effects */}
      {isVisible && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 animate-bounce">
            <div className="text-lg">✨</div>
          </div>
          <div className="absolute top-1/4 right-0 transform translate-x-2 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <div className="text-sm">⭐</div>
          </div>
          <div className="absolute bottom-1/4 left-0 transform -translate-x-2 animate-bounce" style={{ animationDelay: '1s' }}>
            <div className="text-sm">✨</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrownBadge;







