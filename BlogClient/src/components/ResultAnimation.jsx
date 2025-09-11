import { useState, useEffect } from 'react';
import WinningBadge from './WinningBadge';

const ResultAnimation = ({ result, onNextVote, currentComparison }) => {
  const [showResults, setShowResults] = useState(false);
  const [animatedVotes, setAnimatedVotes] = useState({
    post1: 0,
    post2: 0
  });

  useEffect(() => {
    // Start animation after a short delay
    const timer = setTimeout(() => {
      setShowResults(true);
      animateVotes();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const animateVotes = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedVotes({
        post1: Math.round(result.post1.votes * progress),
        post2: Math.round(result.post2.votes * progress)
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedVotes({
          post1: result.post1.votes,
          post2: result.post2.votes
        });
      }
    }, stepDuration);
  };

  const getTotalVotes = () => result.post1.votes + result.post2.votes;
  const getPercentage = (votes) => {
    const total = getTotalVotes();
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const getWinner = () => {
    return result.post1.votes > result.post2.votes ? 'post1' : 'post2';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Voting Results</h1>
        <p className="mt-2 text-lg text-gray-600">
          Here's how the community voted on this comparison
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Post 1 Results */}
        <div className={`relative bg-white rounded-xl shadow-lg border-2 p-6 transition-all duration-1000 ${
          showResults && getWinner() === 'post1' 
            ? 'border-yellow-400 bg-yellow-50 shadow-yellow-200' 
            : 'border-gray-200'
        }`}>
          {showResults && getWinner() === 'post1' && (
            <WinningBadge />
          )}
          
          {/* Post Image */}
          {currentComparison.post1.image && (
            <div className="mb-4">
              <img
                src={currentComparison.post1.image}
                alt={currentComparison.post1.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Post Info */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {currentComparison.post1.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {currentComparison.post1.description}
            </p>
          </div>

          {/* Vote Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Votes:</span>
              <span className="text-2xl font-bold text-primary-600">
                {animatedVotes.post1}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: showResults ? `${getPercentage(animatedVotes.post1)}%` : '0%'
                }}
              />
            </div>
            
            <div className="text-center">
              <span className="text-lg font-semibold text-gray-900">
                {showResults ? `${getPercentage(animatedVotes.post1)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Post 2 Results */}
        <div className={`relative bg-white rounded-xl shadow-lg border-2 p-6 transition-all duration-1000 ${
          showResults && getWinner() === 'post2' 
            ? 'border-yellow-400 bg-yellow-50 shadow-yellow-200' 
            : 'border-gray-200'
        }`}>
          {showResults && getWinner() === 'post2' && (
            <WinningBadge />
          )}
          
          {/* Post Image */}
          {currentComparison.post2.image && (
            <div className="mb-4">
              <img
                src={currentComparison.post2.image}
                alt={currentComparison.post2.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Post Info */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {currentComparison.post2.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {currentComparison.post2.description}
            </p>
          </div>

          {/* Vote Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Votes:</span>
              <span className="text-2xl font-bold text-primary-600">
                {animatedVotes.post2}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary-600 h-3 rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: showResults ? `${getPercentage(animatedVotes.post2)}%` : '0%'
                }}
              />
            </div>
            
            <div className="text-center">
              <span className="text-lg font-semibold text-gray-900">
                {showResults ? `${getPercentage(animatedVotes.post2)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Total Votes */}
      <div className="mt-8 text-center">
        <div className="inline-block bg-gray-100 rounded-lg px-6 py-3">
          <span className="text-sm text-gray-600">Total votes: </span>
          <span className="text-lg font-semibold text-gray-900">
            {showResults ? getTotalVotes() : '0'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={onNextVote}
          className="btn-primary px-8 py-3 text-lg"
        >
          Vote on Next Comparison
        </button>
        <button
          onClick={() => window.location.href = '/results'}
          className="btn-secondary px-8 py-3 text-lg"
        >
          View All Results
        </button>
      </div>

      {/* Celebration Animation */}
      {showResults && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/4 left-1/4 animate-bounce">
            <div className="text-4xl">🎉</div>
          </div>
          <div className="absolute top-1/3 right-1/4 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <div className="text-4xl">🏆</div>
          </div>
          <div className="absolute bottom-1/3 left-1/3 animate-bounce" style={{ animationDelay: '1s' }}>
            <div className="text-4xl">⭐</div>
          </div>
          <div className="absolute bottom-1/4 right-1/3 animate-bounce" style={{ animationDelay: '1.5s' }}>
            <div className="text-4xl">🎊</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultAnimation;







