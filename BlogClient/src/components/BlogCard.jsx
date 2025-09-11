import { Link } from 'react-router-dom';

const BlogCard = ({ post, showBattleStatus = false }) => {
  const getStatusBadge = (post) => {
    if (post.inBattle) {
      return <span className="badge badge-warning">⚔️ In Battle</span>;
    }
    if (post.wins > 0) {
      return <span className="badge badge-success">🏆 Winner</span>;
    }
    return <span className="badge badge-primary">📝 Published</span>;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Technology': 'badge-primary',
      'Lifestyle': 'badge-secondary',
      'Travel': 'badge-accent',
      'Food': 'badge-success',
      'Health': 'badge-warning',
      'Business': 'badge-danger',
      'Education': 'badge-primary',
      'Entertainment': 'badge-secondary',
      'Sports': 'badge-accent',
      'Other': 'badge-primary'
    };
    return colors[category] || 'badge-primary';
  };

  const authorName = typeof post.author === 'object' ? (post.author?.username || '') : (post.author || '');
  const initial = (authorName || post.title || 'A').charAt(0);

  return (
    <div className="card group hover:shadow-xl transition-all duration-300">
      {/* Image */}
      {post.image && (
        <div className="relative mb-4 overflow-hidden rounded-xl">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {showBattleStatus && (
            <div className="absolute top-3 right-3">
              {getStatusBadge(post)}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        {/* Category and Status */}
        <div className="flex items-center justify-between">
          {post.category && (
            <span className={`badge ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          )}
          {!showBattleStatus && getStatusBadge(post)}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-primary-400 transition-colors">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm line-clamp-3">
          {post.description}
        </p>

        {/* Author and Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {initial}
              </span>
            </div>
            <span>{authorName || 'Unknown'}</span>
          </div>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              {post.votes || 0}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.wins || 0}
            </span>
          </div>
          
          <Link
            to={`/post/${post._id || post.id}`}
            className="text-primary-400 hover:text-primary-300 font-medium text-sm flex items-center"
          >
            Read More
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
