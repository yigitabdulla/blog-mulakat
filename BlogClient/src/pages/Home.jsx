import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import { fetchBlogs } from '../store/slices/blogSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector(state => state.blog);

  useEffect(() => {
    // Fetch once on initial mount only
    dispatch(fetchBlogs({ limit: 9 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get featured posts (top 6 posts)
  const featuredPosts = posts.slice(0, 6);
  const inBattlePosts = posts.filter(post => post.inBattle);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-white sm:text-6xl md:text-7xl">
          Welcome to <span className="gradient-text">BlogBattle</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
          Where the best blog posts compete in epic battles. Submit your content, vote for favorites, and watch the champions rise!
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/submit" className="btn-primary text-lg px-8 py-4">
            🚀 Submit Your Post
          </Link>
          <Link to="/battles" className="btn-accent text-lg px-8 py-4">
            ⚔️ Join Battle
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text">{posts.length}</div>
          <div className="text-sm text-gray-400 mt-1">Total Posts</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text">{inBattlePosts.length}</div>
          <div className="text-sm text-gray-400 mt-1">In Battle</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text">24</div>
          <div className="text-sm text-gray-400 mt-1">Active Battles</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text">156</div>
          <div className="text-sm text-gray-400 mt-1">Votes Today</div>
        </div>
      </div>

      {/* Featured Posts Grid */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Posts</h2>
          <Link to="/blogs" className="text-primary-400 hover:text-primary-300 font-medium">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <BlogCard key={post._id} post={{
              ...post,
              id: post._id,
              description: post.content?.slice(0, 150) + '...',
              author: post.author?.username || 'Anonymous'
            }} />
          ))}
        </div>
      </div>

      {/* Active Battles */}
      {inBattlePosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">🔥 Active Battles</h2>
            <Link to="/battles" className="text-primary-400 hover:text-primary-300 font-medium">
              Join Battle →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inBattlePosts.slice(0, 4).map((post) => (
              <div key={post.id} className="card-battle">
                <div className="flex items-center justify-between mb-4">
                  <span className="badge badge-warning">⚔️ In Battle</span>
                  <span className="text-sm text-gray-400">2h left</span>
                </div>
                <BlogCard post={post} showBattleStatus={true} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl p-8 border border-gray-600">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How BlogBattle Works</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Simple, engaging, and fair. Here's how the battle system works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">1. Submit</h3>
            <p className="text-gray-300">
              Create and submit your blog post with title, content, category, and image.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">⚔️</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">2. Battle</h3>
            <p className="text-gray-300">
              Your post enters the tournament bracket and faces off against other posts.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">3. Win</h3>
            <p className="text-gray-300">
              The community votes, and the best posts advance to become champions.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Battle?</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of bloggers competing for the title of best content creator.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/submit" className="btn-primary text-lg px-8 py-4">
            Submit Your First Post
          </Link>
          <Link to="/bracket" className="btn-secondary text-lg px-8 py-4">
            View Tournament Bracket
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
