import { useState, useRef, useEffect } from 'react';

const MobileVotingCard = ({ post, onVote, isVoted, onSwipeLeft, onSwipeRight }) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef(null);

  const handleTouchStart = (e) => {
    if (isVoted) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isVoted) return;
    const currentTouchX = e.touches[0].clientX;
    const deltaX = currentTouchX - startX;
    setCurrentX(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isVoted) return;
    const threshold = 100;
    const deltaX = currentX;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0 && onSwipeLeft) onSwipeLeft();
      if (deltaX > 0 && onSwipeRight) onSwipeRight();
    }
    setIsDragging(false);
    setCurrentX(0);
  };

  const handleMouseDown = (e) => {
    if (isVoted) return;
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isVoted) return;
    const deltaX = e.clientX - startX;
    setCurrentX(deltaX);
  };

  const handleMouseUp = () => {
    if (!isDragging || isVoted) return;
    const threshold = 100;
    const deltaX = currentX;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0 && onSwipeLeft) onSwipeLeft();
      if (deltaX > 0 && onSwipeRight) onSwipeRight();
    }
    setIsDragging(false);
    setCurrentX(0);
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
  }, [isDragging]);

  const getCardStyle = () => {
    return {
      transform: `translateX(${currentX}px)`,
      transition: isDragging ? 'none' : 'transform 0.15s ease-out'
    };
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div
        ref={cardRef}
        className={`relative bg-white rounded-xl shadow-lg border-2 transition-colors duration-150 ${
          isVoted 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-200'
        }`}
        style={getCardStyle()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Voted State */}
        {isVoted && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-10 rounded-xl flex items-center justify-center z-10">
            <div className="bg-green-500 rounded-full p-3 shadow">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        {/* Card Content */}
        <div className="p-6">
          {/* Media */}
          <div className="mb-4 h-48 w-full rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-500 text-sm">No image</div>
            )}
          </div>

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

          {/* Vote Button */}
          {!isVoted && (
            <button
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-150"
              onClick={onVote}
            >
              Vote for this post
            </button>
          )}

          {/* Voted State */}
          {isVoted && (
            <div className="w-full bg-green-500 text-white font-medium py-3 px-4 rounded-lg text-center">
              ✓ Voted
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileVotingCard;





