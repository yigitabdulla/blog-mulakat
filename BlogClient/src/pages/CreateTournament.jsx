import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTournament } from '../store/slices/tournamentSlice';
import { fetchBlogs } from '../store/slices/blogSlice';
import { useNavigate } from 'react-router-dom';

const sizes = [4, 8, 16, 32];

const CreateTournament = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { posts } = useSelector(state => state.blog);
  const [name, setName] = useState('');
  const [size, setSize] = useState(8);
  const [selected, setSelected] = useState([]);
  const [duration, setDuration] = useState(10);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !(user.roles || []).includes('admin')) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(fetchBlogs({ limit: 100 }));
  }, [dispatch]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name) return setError('Name is required');
    if (selected.length === 0) return setError('Select at least 1 blog');
    if (selected.length > size) return setError('Selected blogs exceed bracket size');
    const res = await dispatch(createTournament({ name, size, blogs: selected, matchDurationMinutes: duration }));
    if (res.meta.requestStatus === 'fulfilled') {
      navigate('/bracket');
    } else if (typeof res.payload === 'string') {
      setError(res.payload);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Create Tournament</h1>
      {error && <div className="mb-4 text-red-400">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4 card">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Name</label>
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Size</label>
          <select className="input-field" value={size} onChange={(e) => setSize(Number(e.target.value))}>
            {sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Match Duration (minutes)</label>
          <input type="number" min={1} className="input-field" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Select Blogs ({selected.length}/{size})</label>
          <div className="max-h-80 overflow-auto border border-gray-700 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {posts.map(p => (
              <label key={p._id} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ${selected.includes(p._id) ? 'bg-primary-900 border border-primary-700' : 'bg-gray-800'}`}>
                <input type="checkbox" className="mt-1" checked={selected.includes(p._id)} onChange={() => toggleSelect(p._id)} />
                <div>
                  <div className="text-white font-medium">{p.title}</div>
                  <div className="text-gray-400 text-sm">{p.author?.username || 'Anonymous'}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-primary">Create</button>
        </div>
      </form>
    </div>
  );
};

export default CreateTournament;


