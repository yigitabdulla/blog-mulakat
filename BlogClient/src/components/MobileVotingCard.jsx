import { useState, useRef, useEffect } from 'react';

const MobileVotingCard = ({ post, onVote, isVoted, onSwipeLeft, onSwipeRight }) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    if (isVoted) return;
    
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    setSwipeDirection(null);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isVoted) return;
    
    const currentTouchX = e.touches[0].clientX;
    const deltaX = currentTouchX - startX;
    setCurrentX(deltaX);
    
    // Determine swipe direction
    if (Math.abs(deltaX) > 50) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || isVoted) return;
    
    const threshold = 100;
    const deltaX = Math.abs(currentX);
    
    if (deltaX > threshold) {
      if (swipeDirection === 'left' && onSwipeLeft) {
        onSwipeLeft();
      } else if (swipeDirection === 'right' && onSwipeRight) {
        onSwipeRight();
      }
    }
    
    // Reset
    setIsDragging(false);
    setCurrentX(0);
    setSwipeDirection(null);
  };

  const handleMouseDown = (e) => {
    if (isVoted) return;
    
    setStartX(e.clientX);
    setIsDragging(true);
    setSwipeDirection(null);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isVoted) return;
    
    const deltaX = e.clientX - startX;
    setCurrentX(deltaX);
    
    if (Math.abs(deltaX) > 50) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging || isVoted) return;
    
    const threshold = 100;
    const deltaX = Math.abs(currentX);
    
    if (deltaX > threshold) {
      if (swipeDirection === 'left' && onSwipeLeft) {
        onSwipeLeft();
      } else if (swipeDirection === 'right' && onSwipeRight) {
        onSwipeRight();
      }
    }
    
    setIsDragging(false);
    setCurrentX(0);
    setSwipeDirection(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentX, startX]);

  const getCardStyle = () => {
    const rotation = currentX * 0.1;
    const opacity = Math.max(0.3, 1 - Math.abs(currentX) / 200);
    
    return {
      transform: `translateX(${currentX}px) rotate(${rotation}deg)`,
      opacity,
      transition: isDragging ? 'none' : 'all 0.3s ease-out'
    };
  };

  const getSwipeIndicator = () => {
    if (!swipeDirection) return null;
    
    return (
      <div className={`absolute inset-0 flex items-center justify-center text-4xl font-bold ${
        swipeDirection === 'left' ? 'text-red-500' : 'text-green-500'
      }`}>
        {swipeDirection === 'left' ? '👎' : '👍'}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div
        ref={cardRef}
        className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 ${
          isVoted 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-200 hover:border-primary-300'
        }`}
        style={getCardStyle()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Swipe Indicator */}
        {getSwipeIndicator()}

        {/* Voted Overlay */}
        {isVoted && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-xl flex items-center justify-center z-10">
            <div className="bg-green-500 rounded-full p-4 shadow-lg animate-bounce-in">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className="p-6">
          {/* Image */}
          {post.image && (
            <div className="mb-4">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Category Badge */}
          {post.category && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {post.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              {post.votes || 0} votes
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.wins || 0} wins
            </span>
          </div>

          {/* Vote Button */}
          {!isVoted && (
            <button
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              onClick={onVote}
            >
              Vote for this post
            </button>
          )}

          {/* Voted State */}
          {isVoted && (
            <div className="w-full bg-green-500 text-white font-medium py-3 px-4 rounded-lg text-center">
              ✓ Voted!
            </div>
          )}
        </div>

        {/* Swipe Instructions */}
        {!isVoted && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
            Swipe left to reject, right to vote
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileVotingCard;





