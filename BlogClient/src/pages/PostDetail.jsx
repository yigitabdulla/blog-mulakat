import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/client';
import { deleteBlogById } from '../store/slices/blogSlice';
import EditPostModal from '../components/EditPostModal';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    api.get(`/blogs/${id}`)
      .then((res) => {
        if (!isMounted) return;
        setPost(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.response?.data?.message || 'Failed to load post');
        setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, [id]);

  if (isLoading) {
    return <div className="text-gray-300">Loading post...</div>;
  }

  if (error) {
    return <div className="text-red-400">{error}</div>;
  }

  if (!post) return null;

  const authorName = post.author?.username || 'Anonymous';
  const isOwner = user && (post.author?._id === user._id);

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="text-primary-400 hover:text-primary-300">← Back</Link>
      <div className="flex items-start justify-between mt-4 mb-4">
        <h1 className="text-3xl font-bold text-white">{post.title}</h1>
        {isOwner && (
          <div className="flex items-center space-x-2">
            <button
              className="btn-secondary text-sm"
              onClick={() => setIsEditOpen(true)}
            >
              Update
            </button>
            <button
              className="btn-secondary text-sm"
              onClick={() => {
                if (confirm('Delete this post?')) {
                  dispatch(deleteBlogById(id));
                  navigate('/blogs');
                }
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-80 object-contain rounded-xl mb-6" />
      )}
      {post.category && (
        <div className="mb-4">
          <span className="badge badge-primary">{post.category}</span>
        </div>
      )}
      <div className="text-sm text-gray-400 mb-6">
        By {authorName} • {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <div className="card">
        <p className="text-gray-200 whitespace-pre-wrap">{post.content}</p>
      </div>

      <EditPostModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        post={post}
        onUpdated={(updated) => setPost(updated)}
      />
    </div>
  );
};

export default PostDetail;


