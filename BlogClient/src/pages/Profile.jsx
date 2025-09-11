import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import Achievement from '../components/Achievement';
import { deleteBlogById, fetchMyBlogs } from '../store/slices/blogSlice';
import { calculateAchievements, getLockedAchievements } from '../utils/achievements';
import { useEffect } from 'react';

const Profile = () => {
  const dispatch = useDispatch();
  const { posts, myPosts, isLoading } = useSelector(state => state.blog);
  const { user: authUser } = useSelector(state => state.auth);

  // Mock user data (fallback when not logged in)
  const demoUser = {
    name: 'Alex Johnson',
    username: '@alexj',
    bio: 'Passionate blogger and content creator. Love sharing insights about technology, lifestyle, and travel.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    joinDate: '2024-01-15',
    location: 'San Francisco, CA',
    website: 'alexjohnson.blog'
  };

  const headerUser = authUser ? {
    name: authUser.username,
    username: `@${authUser.username}`,
    bio: '',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.username)}`,
    joinDate: new Date().toISOString(),
    location: '',
    website: ''
  } : demoUser;

  useEffect(() => {
    if (authUser) {
      // Fetch only the logged-in user's posts
      dispatch(fetchMyBlogs());
    }
  }, [dispatch, authUser]);

  // User's posts
  const userPosts = authUser ? myPosts : posts.slice(0, 3);
  const totalVotes = userPosts.reduce((sum, post) => sum + (post.votes || 0), 0);
  const totalWins = authUser ? (authUser.totalWins || 0) : userPosts.reduce((sum, post) => sum + (post.wins || 0), 0);

  // Calculate achievements
  const achievements = authUser ? calculateAchievements(authUser, userPosts, []) : [];
  const lockedAchievements = authUser ? getLockedAchievements(authUser, userPosts, []) : [];
  const allAchievements = [...achievements, ...lockedAchievements];

  const getStatusBadge = (post) => {
    if (post.inBattle) {
      return <span className="badge badge-warning">⚔️ In Battle</span>;
    }
    if (post.wins > 0) {
      return <span className="badge badge-success">🏆 Winner</span>;
    }
    return <span className="badge badge-primary">📝 Published</span>;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl p-8 mb-8 border border-gray-600">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="relative">
            <img
              src={headerUser.avatar}
              alt={headerUser.name}
              className="w-32 h-32 rounded-2xl object-cover shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-white text-sm">✓</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{headerUser.name}</h1>
            <p className="text-lg text-gray-300 mb-4">{headerUser.username}</p>
            <p className="text-gray-300 mb-6 max-w-2xl">{headerUser.bio}</p>
            
            {/* User Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center bg-gray-800 rounded-lg p-2">
                <div className="text-2xl font-bold gradient-text">{userPosts.length}</div>
                <div className="text-sm text-gray-400">Posts</div>
              </div>
              <div className="text-center bg-gray-800 rounded-lg p-2">
                <div className="text-2xl font-bold gradient-text">{totalVotes}</div>
                <div className="text-sm text-gray-400">Total Votes</div>
              </div>
              <div className="text-center bg-gray-800 rounded-lg p-2">
                <div className="text-2xl font-bold gradient-text">{totalWins}</div>
                <div className="text-sm text-gray-400">Wins</div>
              </div>
            </div>

            {/* User Details */}
            <div className="flex flex-col md:flex-row md:space-x-6 text-sm text-gray-400">
              <div className="flex items-center mb-2 md:mb-0">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined {new Date(headerUser.joinDate).toLocaleDateString()}
              </div>
              <div className="flex items-center mb-2 md:mb-0">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {headerUser.location}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <a href={headerUser.website ? `https://${headerUser.website}` : '#'} className="text-primary-400 hover:text-primary-300">
                  {headerUser.website || 'website'}
                </a>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="flex flex-col space-y-3">
            <button className="btn-primary">
              ✏️ Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🏆 Achievements</h2>
          <div className="text-sm text-gray-400">
            {achievements.length} unlocked • {allAchievements.length} total
          </div>
        </div>
        
        {authUser ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAchievements.slice(0, 6).map((achievement) => (
              <Achievement key={achievement.id} achievement={achievement} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center opacity-60">
              <div className="text-4xl mb-3 grayscale">🥇</div>
              <h3 className="font-semibold text-gray-400 mb-2">First Victory</h3>
              <p className="text-sm text-gray-500">Won your first blog battle</p>
            </div>
            <div className="card text-center opacity-60">
              <div className="text-4xl mb-3 grayscale">🔥</div>
              <h3 className="font-semibold text-gray-400 mb-2">Hot Streak</h3>
              <p className="text-sm text-gray-500">Won 3 battles in a row</p>
            </div>
            <div className="card text-center opacity-60">
              <div className="text-4xl mb-3 grayscale">📝</div>
              <h3 className="font-semibold text-gray-400 mb-2">Content Creator</h3>
              <p className="text-sm text-gray-500">Published 5+ posts</p>
            </div>
          </div>
        )}

        {authUser && allAchievements.length > 6 && (
          <div className="mt-6 text-center">
            <Link to="/achievements" className="btn-secondary">
              View All Achievements ({allAchievements.length})
            </Link>
          </div>
        )}
      </div>

      {/* User's Posts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">My Posts</h2>
          <Link to="/submit" className="btn-primary">
            📝 Create New Post
          </Link>
        </div>

        {isLoading ? (
          <div className="text-gray-300">Loading...</div>
        ) : userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <div key={post._id || post.id} className="relative">
                <BlogCard post={{
                  ...post,
                  id: post._id || post.id,
                  description: post.content?.slice(0, 150) + '...',
                  author: post.author?.username || post.author || 'Anonymous'
                }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-gray-300 mb-6">Start your blogging journey by creating your first post!</p>
            <Link to="/submit" className="btn-primary">
              Create Your First Post
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
