import { useSelector } from 'react-redux';
import WinningBadge from '../components/WinningBadge';

const Results = () => {
  const { posts, votingHistory } = useSelector(state => state.blog);

  // Sort posts by wins, then by votes
  const sortedPosts = [...posts].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return (b.votes || 0) - (a.votes || 0);
  });

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };

  const getRankColor = (index) => {
    switch (index) {
      case 0:
        return 'border-yellow-400 bg-yellow-900';
      case 1:
        return 'border-gray-500 bg-gray-700';
      case 2:
        return 'border-orange-400 bg-orange-900';
      default:
        return 'border-gray-700 bg-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
        <p className="mt-2 text-lg text-gray-300">
          See which posts are winning the community's hearts
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text">{posts.length}</div>
          <div className="text-sm text-gray-400">Total Posts</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text">
            {votingHistory.length}
          </div>
          <div className="text-sm text-gray-400">Total Votes</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text">
            {posts.filter(post => post.wins > 0).length}
          </div>
          <div className="text-sm text-gray-400">Winning Posts</div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4">
        {sortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">No posts yet</h3>
              <p className="mt-1 text-sm text-gray-400">
                Submit some posts to see the leaderboard!
              </p>
              <div className="mt-6">
                <a
                  href="/submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Submit a Post
                </a>
              </div>
            </div>
          </div>
        ) : (
          sortedPosts.map((post, index) => (
            <div
              key={post.id}
              className={`relative card border-2 transition-all duration-300 hover:shadow-lg ${getRankColor(index)}`}
            >
              {/* Rank Badge */}
              <div className="absolute -left-4 -top-4 z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-500' :
                  'bg-primary-600'
                }`}>
                  {getRankIcon(index)}
                </div>
              </div>

              {/* Winning Badge for top 3 */}
              {index < 3 && (
                <WinningBadge size="medium" />
              )}

              <div className="flex flex-col md:flex-row gap-6">
                {/* Post Image */}
                {post.image && (
                  <div className="md:w-48 flex-shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-32 md:h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Post Content */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                        {post.description}
                      </p>
                      {post.category && (
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-900 text-primary-200 rounded-full border border-primary-700">
                          {post.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">
                        {post.votes || 0}
                      </div>
                      <div className="text-xs text-gray-400">Total Votes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {post.wins || 0}
                      </div>
                      <div className="text-xs text-gray-400">Wins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {post.wins && post.votes ? Math.round((post.wins / post.votes) * 100) : 0}%
                      </div>
                      <div className="text-xs text-gray-400">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400">Posted</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Call to Action */}
      {sortedPosts.length > 0 && (
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white border border-primary-500">
            <h2 className="text-2xl font-bold mb-4">Ready to vote?</h2>
            <p className="text-primary-100 mb-6">
              Help decide which posts deserve to be at the top of the leaderboard
            </p>
            <a
              href="/vote"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-100 transition-colors"
            >
              Start Voting
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
