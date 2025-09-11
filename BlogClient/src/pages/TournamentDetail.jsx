import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchTournamentById } from '../store/slices/tournamentSlice';
import { voteMatch } from '../store/slices/tournamentSlice';
import BlogCard from '../components/BlogCard';
import MobileVotingCard from '../components/MobileVotingCard';

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
                  <span className="font-semibold">{t.winner.title}</span> by {t.winner.author?.username || t.winner.author}
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
    if (!canVote) return;
    dispatch(voteMatch({ id: tId, index: idx, pick }));
  };

  const mapBlogForCard = (b, createdAt) => {
    const author = b?.author && typeof b.author === 'object' ? b.author.username : b?.author;
    return {
      id: b?._id || b,
      _id: b?._id || b,
      title: b?.title || 'TBD',
      image: b?.image,
      category: b?.category,
      content: b?.content,
      description: b?.content ? b.content.slice(0, 150) + '...' : '',
      author: author || 'Unknown',
      createdAt
    };
  };

  // Mobile swipe state: 0 => A, 1 => B
  const [currentIndex, setCurrentIndex] = useState(0);

  const postA = mapBlogForCard(match.blogA, match.startsAt);
  const postB = mapBlogForCard(match.blogB, match.startsAt);

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-300 text-sm">{statusText}</div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary hidden md:inline-flex" disabled={!canVote} onClick={() => onVote('A')}>Vote A ({match.votesA})</button>
          <button className="btn-primary hidden md:inline-flex" disabled={!canVote} onClick={() => onVote('B')}>Vote B ({match.votesB})</button>
        </div>
      </div>

      {/* Vote Progress */}
      {(() => {
        const votesA = match.votesA || 0;
        const votesB = match.votesB || 0;
        const total = votesA + votesB;
        const pctA = total ? Math.round((votesA / total) * 100) : 0;
        const pctB = total ? 100 - pctA : 0;
        return (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>A: {votesA} {total ? `(${pctA}%)` : ''}</span>
              <span>Total: {total}</span>
              <span>B: {votesB} {total ? `(${pctB}%)` : ''}</span>
            </div>
            <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full flex">
                <div
                  className="bg-primary-500 h-full"
                  style={{ width: `${pctA}%` }}
                />
                <div
                  className="bg-indigo-400 h-full"
                  style={{ width: `${pctB}%` }}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Mobile swipe view */}
      <div className="md:hidden">
        <MobileVotingCard
          post={currentIndex === 0 ? postA : postB}
          isVoted={false}
          onVote={() => onVote(currentIndex === 0 ? 'A' : 'B')}
          onSwipeLeft={() => setCurrentIndex(1)}
          onSwipeRight={() => setCurrentIndex(0)}
        />
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            className={`h-2 w-2 rounded-full ${currentIndex === 0 ? 'bg-primary-400' : 'bg-gray-600'}`}
            onClick={() => setCurrentIndex(0)}
            aria-label="Show first blog"
          />
          <button
            className={`h-2 w-2 rounded-full ${currentIndex === 1 ? 'bg-primary-400' : 'bg-gray-600'}`}
            onClick={() => setCurrentIndex(1)}
            aria-label="Show second blog"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="btn-secondary" disabled={!canVote} onClick={() => onVote('A')}>Vote A ({match.votesA})</button>
          <button className="btn-primary" disabled={!canVote} onClick={() => onVote('B')}>Vote B ({match.votesB})</button>
        </div>
      </div>

      {/* Desktop two-column view */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4">
        <BlogCard post={postA} />
        <BlogCard post={postB} />
      </div>
    </div>
  );
};

export default TournamentDetail;


