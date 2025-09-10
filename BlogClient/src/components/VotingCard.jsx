import { useState } from 'react';

const VotingCard = ({ post, onVote, isVoted }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleVote = () => {
    if (!isVoted) {
      onVote();
    }
  };

  return (
    <div
      className={`relative bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-300 cursor-pointer ${
        isVoted 
          ? 'border-green-500 bg-green-900' 
          : isHovered 
            ? 'border-primary-500 shadow-xl transform scale-105' 
            : 'border-gray-700 hover:border-primary-400'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleVote}
    >
      {/* Vote Button Overlay */}
      {!isVoted && (
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 rounded-xl flex items-center justify-center z-10">
          <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="bg-gray-700 rounded-full p-4 shadow-lg">
              <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      )}

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
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-900 text-primary-200 rounded-full border border-primary-700">
              {post.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm line-clamp-3 mb-4">
          {post.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
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
          <span className="text-xs">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Vote Button */}
      {!isVoted && (
        <div className="px-6 pb-6">
          <button
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleVote();
            }}
          >
            Vote for this post
          </button>
        </div>
      )}

      {/* Voted State */}
      {isVoted && (
        <div className="px-6 pb-6">
          <div className="w-full bg-green-500 text-white font-medium py-3 px-4 rounded-lg text-center">
            ✓ Voted!
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingCard;
