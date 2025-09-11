import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTournamentById } from '../store/slices/tournamentSlice';
import { voteMatch } from '../store/slices/tournamentSlice';
import BlogCard from '../components/BlogCard';

const TournamentDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: t, isLoading, error } = useSelector(state => state.tournament);

  useEffect(() => {
    dispatch(fetchTournamentById(id));
  }, [dispatch, id]);

  if (isLoading || !t) return <div className="text-gray-300">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">{t.name}</h1>
        <div className="text-gray-400">{t.blogs.length}/{t.size} slots • {t.status}</div>
        <div className="text-gray-400">Match duration: {t.matchDurationMinutes} min</div>
        
        {/* Winner Display */}
        {t.status === 'completed' && t.winner && (
          <div className="mt-4 p-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl border-2 border-yellow-400">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🏆</div>
              <div>
                <h2 className="text-xl font-bold text-white">Tournament Winner!</h2>
                <p className="text-yellow-100">
                  <span className="font-semibold">{t.winner.title}</span> by {t.winner.author?.username || 'Anonymous'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {t.matches?.length ? t.matches.map((m, idx) => (
          <MatchRow key={idx} tId={t._id} idx={idx} match={m} />
        )) : <div className="text-gray-300">No matches yet.</div>}
      </div>
    </div>
  );
};

const MatchRow = ({ tId, idx, match }) => {
  const now = Date.now();
  const starts = new Date(match.startsAt).getTime();
  const ends = new Date(match.endsAt).getTime();
  const remainingMs = Math.max(0, ends - now);
  const mins = Math.floor(remainingMs / 60000);
  const secs = Math.floor((remainingMs % 60000) / 1000);
  const live = now >= starts && now <= ends;
  const statusText = live ? `Live • ${mins}:${secs.toString().padStart(2, '0')}` : (now < starts ? 'Scheduled' : 'Finished');

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const canVote = live && !!user;

  const onVote = (pick) => {
    dispatch(voteMatch({ id: tId, index: idx, pick }));
  };

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-300 text-sm">{statusText}</div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary" disabled={!canVote} onClick={() => onVote('A')}>Vote A ({match.votesA})</button>
          <button className="btn-primary" disabled={!canVote} onClick={() => onVote('B')}>Vote B ({match.votesB})</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BlogCard post={{
          id: match.blogA?._id || match.blogA,
          _id: match.blogA?._id || match.blogA,
          title: match.blogA?.title || 'TBD',
          image: match.blogA?.image,
          category: match.blogA?.category,
          content: match.blogA?.content,
          description: match.blogA?.content ? match.blogA.content.slice(0, 150) + '...' : '',
          author: match.blogA?.author?.username || 'Anonymous',
          createdAt: match.startsAt
        }} />
        <BlogCard post={{
          id: match.blogB?._id || match.blogB,
          _id: match.blogB?._id || match.blogB,
          title: match.blogB?.title || 'TBD',
          image: match.blogB?.image,
          category: match.blogB?.category,
          content: match.blogB?.content,
          description: match.blogB?.content ? match.blogB.content.slice(0, 150) + '...' : '',
          author: match.blogB?.author?.username || 'Anonymous',
          createdAt: match.startsAt
        }} />
      </div>
    </div>
  );
};

export default TournamentDetail;


