import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setCurrentComparison, addVote, fetchBlogs } from '../store/slices/blogSlice';
import { fetchTournaments, registerTournament, startTournament, deleteTournament } from '../store/slices/tournamentSlice';
import { fetchMyBlogs } from '../store/slices/blogSlice';
import VotingCard from '../components/VotingCard';
import MobileVotingCard from '../components/MobileVotingCard';
import ResultAnimation from '../components/ResultAnimation';
import BlogCard from '../components/BlogCard';
import { Trophy } from 'lucide-react';
const VotingScreen = () => {
  const dispatch = useDispatch();
  const { posts, currentComparison } = useSelector(state => state.blog);
  const { items: tournaments } = useSelector(state => state.tournament);
  const { user } = useSelector(state => state.auth);
  const [showResults, setShowResults] = useState(false);
  const [votedPost, setVotedPost] = useState(null);
  const [voteResult, setVoteResult] = useState(null);

  // Generate random comparison when component mounts or when we need a new comparison
  useEffect(() => {
    if (posts.length >= 2) {
      generateNewComparison();
    }
  }, [posts.length]);

  useEffect(() => {
    dispatch(fetchTournaments());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyBlogs());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(fetchBlogs({ limit: 12 }));
    }
  }, [dispatch]);

  const generateNewComparison = () => {
    if (posts.length < 2) return;

    // Get two random posts
    const shuffled = [...posts].sort(() => 0.5 - Math.random());
    const post1 = shuffled[0];
    const post2 = shuffled[1];

    dispatch(setCurrentComparison({
      post1,
      post2,
      id: Date.now().toString()
    }));
  };

  const handleVote = (postId, isWinner) => {
    // Record the vote
    dispatch(addVote({ postId, isWinner }));
    
    // Set voted post and show results
    setVotedPost(postId);
    
    // Simulate vote result (in real app, this would come from API)
    const result = {
      post1: {
        id: currentComparison.post1.id,
        votes: Math.floor(Math.random() * 100) + 1,
        isWinner: currentComparison.post1.id === postId
      },
      post2: {
        id: currentComparison.post2.id,
        votes: Math.floor(Math.random() * 100) + 1,
        isWinner: currentComparison.post2.id === postId
      }
    };
    
    setVoteResult(result);
    setShowResults(true);
  };

  const handleNextVote = () => {
    setShowResults(false);
    setVotedPost(null);
    setVoteResult(null);
    generateNewComparison();
  };

  const canShowComparison = posts.length >= 2 && !!currentComparison;

  if (showResults && voteResult) {
    return (
      <ResultAnimation
        result={voteResult}
        onNextVote={handleNextVote}
        currentComparison={currentComparison}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          ⚔️ Battle Arena
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Choose your champion! Your vote determines which post advances to the next round.
        </p>
      </div>

      {/* Active Tournaments */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Active Tournaments</h2>
        </div>
        {tournaments.filter(t => t.status === 'active' || t.status === 'draft').length === 0 ? (
          <div className="text-gray-300">No active tournaments.</div>
        ) : (
          <div className="space-y-3">
            {tournaments.filter(t => t.status === 'active' || t.status === 'draft').map(t => (
              <div key={t._id} className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
                <div>
                  <Link to={`/tournaments/${t._id}`} className="text-white font-medium hover:text-primary-400">{t.name}</Link>
                  <div className="text-gray-400 text-sm">
                    {t.blogs.length}/{t.size} slots • 
                    <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                      t.status === 'active' ? 'bg-green-100 text-green-800' : 
                      t.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user && t.status === 'draft' && t.blogs.length < t.size && (
                    <RegisterDropdown tournament={t} />
                  )}
                  {(user?.roles || []).includes('admin') && t.status === 'draft' && (
                    <button className="btn-primary" disabled={t.blogs.length !== t.size} onClick={() => dispatch(startTournament(t._id))}>Start</button>
                  )}
                  {(user?.roles || []).includes('admin') && (
                    <button className="btn-secondary" onClick={() => dispatch(deleteTournament(t._id))}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tournaments */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-xl font-semibold">Completed Tournaments</h2>
        </div>
        {tournaments.filter(t => t.status === 'completed').length === 0 ? (
          <div className="text-gray-300">No completed tournaments yet.</div>
        ) : (
          <div className="space-y-3">
            {tournaments.filter(t => t.status === 'completed').map(t => (
              <div key={t._id} className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
                <div>
                  <Link to={`/tournaments/${t._id}`} className="text-white font-medium hover:text-primary-400">{t.name}</Link>
                  <div className="text-gray-400 text-sm">
                    {t.blogs.length}/{t.size} slots • 
                    <span className="ml-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {t.status}
                    </span>
                  </div>
                  {t.winner && (
                    <div className="text-yellow-400 text-sm mt-1 flex items-center gap-2">
                      <Trophy size={16} color="#ffcc14" /> Winner: {t.winner.title} by {t.winner.author?.username || 'Anonymous'}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/tournaments/${t._id}`} className="btn-secondary text-sm">
                    View Results
                  </Link>
                  {(user?.roles || []).includes('admin') && (
                    <button className="btn-secondary" onClick={() => dispatch(deleteTournament(t._id))}>Delete</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VS Divider */}
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t-2 border-gray-600" />
        </div>
        <div className="relative flex justify-center">
          <div className="bg-gray-800 px-6 py-3 rounded-2xl shadow-lg border-2 border-gray-600">
            <span className="text-2xl font-bold gradient-text">VS</span>
          </div>
        </div>
      </div>


      {/* Blog Cards Grid */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Discover Blogs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 12).map((post) => (
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
      </div>
    </div>
  );
};

const RegisterDropdown = ({ tournament }) => {
  const dispatch = useDispatch();
  const { myPosts } = useSelector(state => state.blog);
  const { user } = useSelector(state => state.auth);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState('');

  const handleRegister = async (blogId) => {
    setErr('');
    const res = await dispatch(registerTournament({ id: tournament._id, blogId }));
    if (res.meta.requestStatus === 'fulfilled') {
      setOpen(false);
    } else if (typeof res.payload === 'string') {
      setErr(res.payload);
    }
  };

  if (!user) return null;
  if (!myPosts || myPosts.length === 0) {
    return <span className="text-gray-400 text-sm">You have no posts</span>;
  }

  return (
    <div className="relative">
      <button className="btn-primary" onClick={() => setOpen(o => !o)}>Register</button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-10">
          {myPosts.map(p => (
            <button key={p._id} className="w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-200" onClick={() => handleRegister(p._id)}>
              {p.title}
            </button>
          ))}
          {err && <div className="px-4 py-2 text-red-400 text-sm border-t border-gray-700">{err}</div>}
        </div>
      )}
    </div>
  );
};

export default VotingScreen;
