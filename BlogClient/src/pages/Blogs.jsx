import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../store/slices/blogSlice';
import BlogCard from '../components/BlogCard';

const categories = ['all', 'art', 'sci-fi', 'technology', 'food', 'travel', 'sports'];

const Blogs = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, error } = useSelector(state => state.blog);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    const params = { page, limit };
    if (category !== 'all') params.category = category;
    dispatch(fetchBlogs(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, page]);

  const canPrev = useMemo(() => page > 1, [page]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Blogs</h1>
        <div className="flex items-center gap-3">
          <label className="text-gray-300 text-sm">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <div className="text-gray-300">Loading...</div>}
      {error && <div className="text-red-400">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard
            key={post._id}
            post={{
              ...post,
              id: post._id,
              description: post.content?.slice(0, 150) + '...',
              author: post.author?.username || 'Anonymous',
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button className="btn-secondary" disabled={!canPrev || isLoading} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <span className="text-gray-300">Page {page}</span>
        <button className="btn-primary" disabled={isLoading || posts.length < limit} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Blogs;


