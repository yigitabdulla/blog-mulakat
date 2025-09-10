import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Bracket = () => {
  const { posts } = useSelector(state => state.blog);

  // Simulate tournament bracket data
  const tournamentRounds = [
    {
      name: "Round of 16",
      matches: [
        { id: 1, post1: posts[0], post2: posts[1], winner: posts[0]?.id, score: "65-35" },
        { id: 2, post1: posts[2], post2: posts[3], winner: posts[2]?.id, score: "72-28" },
        { id: 3, post1: posts[4], post2: posts[1], winner: posts[4]?.id, score: "58-42" },
        { id: 4, post1: posts[0], post2: posts[2], winner: posts[0]?.id, score: "61-39" },
        { id: 5, post1: posts[3], post2: posts[4], winner: posts[3]?.id, score: "67-33" },
        { id: 6, post1: posts[1], post2: posts[0], winner: posts[1]?.id, score: "54-46" },
        { id: 7, post1: posts[2], post2: posts[3], winner: posts[2]?.id, score: "70-30" },
        { id: 8, post1: posts[4], post2: posts[1], winner: posts[4]?.id, score: "63-37" },
      ]
    },
    {
      name: "Quarterfinals",
      matches: [
        { id: 9, post1: posts[0], post2: posts[2], winner: posts[0]?.id, score: "68-32" },
        { id: 10, post1: posts[4], post2: posts[3], winner: posts[4]?.id, score: "55-45" },
        { id: 11, post1: posts[1], post2: posts[2], winner: posts[1]?.id, score: "71-29" },
        { id: 12, post1: posts[0], post2: posts[4], winner: posts[0]?.id, score: "59-41" },
      ]
    },
    {
      name: "Semifinals",
      matches: [
        { id: 13, post1: posts[0], post2: posts[4], winner: posts[0]?.id, score: "64-36" },
        { id: 14, post1: posts[1], post2: posts[0], winner: posts[1]?.id, score: "57-43" },
      ]
    },
    {
      name: "Final",
      matches: [
        { id: 15, post1: posts[0], post2: posts[1], winner: posts[0]?.id, score: "62-38" },
      ]
    }
  ];

  const MatchCard = ({ match, isFinal = false }) => {
    const isPost1Winner = match.winner === match.post1?.id;
    const isPost2Winner = match.winner === match.post2?.id;

    return (
      <div className={`bg-gray-800 rounded-xl shadow-lg border-2 p-4 ${isFinal ? 'border-accent-400 bg-accent-900' : 'border-gray-700'}`}>
        <div className="space-y-3">
          {/* Post 1 */}
          <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
            isPost1Winner ? 'bg-green-900 border border-green-700' : 'bg-gray-700'
          }`}>
            {isPost1Winner && (
              <div className="text-2xl">👑</div>
            )}
            <div className="flex-1">
              <h4 className="font-medium text-white line-clamp-1">
                {match.post1?.title || 'TBD'}
              </h4>
              <p className="text-sm text-gray-300">
                {match.post1?.category || ''}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {isPost1Winner ? match.score.split('-')[0] : match.score.split('-')[1]}
              </div>
            </div>
          </div>

          {/* VS */}
          <div className="text-center">
            <span className="text-sm font-medium text-gray-400">VS</span>
          </div>

          {/* Post 2 */}
          <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
            isPost2Winner ? 'bg-green-900 border border-green-700' : 'bg-gray-700'
          }`}>
            {isPost2Winner && (
              <div className="text-2xl">👑</div>
            )}
            <div className="flex-1">
              <h4 className="font-medium text-white line-clamp-1">
                {match.post2?.title || 'TBD'}
              </h4>
              <p className="text-sm text-gray-300">
                {match.post2?.category || ''}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {isPost2Winner ? match.score.split('-')[0] : match.score.split('-')[1]}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          🏆 Tournament Bracket
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Watch the epic battles unfold as posts compete for the championship title
        </p>
      </div>

      {/* Tournament Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text">16</div>
          <div className="text-sm text-gray-400 mt-1">Total Posts</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text">15</div>
          <div className="text-sm text-gray-400 mt-1">Battles Fought</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text">1</div>
          <div className="text-sm text-gray-400 mt-1">Champion</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text">1,247</div>
          <div className="text-sm text-gray-400 mt-1">Total Votes</div>
        </div>
      </div>

      {/* Bracket Visualization */}
      <div className="overflow-x-auto">
        <div className="flex space-x-8 min-w-max pb-8">
          {tournamentRounds.map((round, roundIndex) => (
            <div key={round.name} className="flex-shrink-0">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {round.name}
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
              </div>
              
              <div className="space-y-4">
                {round.matches.map((match, matchIndex) => (
                  <div key={match.id} className="relative">
                    <MatchCard match={match} isFinal={round.name === "Final"} />
                    
                    {/* Connection lines */}
                    {roundIndex < tournamentRounds.length - 1 && (
                      <div className="absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Champion Spotlight */}
      <div className="mt-16">
        <div className="bg-gradient-to-br from-accent-900 to-accent-800 rounded-3xl p-8 border border-accent-700">
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Tournament Champion
            </h2>
            <div className="max-w-md mx-auto">
              <div className="card-battle">
                <div className="flex items-center justify-center mb-4">
                  <span className="badge badge-accent text-lg">👑 CHAMPION</span>
                </div>
                {posts[0] && (
                  <>
                    {posts[0].image && (
                      <img
                        src={posts[0].image}
                        alt={posts[0].title}
                        className="w-full h-48 object-cover rounded-xl mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {posts[0].title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {posts[0].description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="badge badge-primary">
                        {posts[0].category}
                      </span>
                      <div className="text-sm text-gray-400">
                        by {posts[0].author}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 text-center">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/battles" className="btn-primary text-lg px-8 py-4">
            ⚔️ Join Next Tournament
          </Link>
          <Link to="/submit" className="btn-secondary text-lg px-8 py-4">
            📝 Submit Your Post
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Bracket;
