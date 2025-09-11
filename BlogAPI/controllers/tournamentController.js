const Tournament = require('../models/tournamentModel');
const Blog = require('../models/blogModal');
const User = require('../models/userModel');

// Helper to finalize finished matches and auto-advance rounds
const finalizeAndAdvance = async (tournament) => {
  const now = new Date();
  let changed = false;

  // Finalize any overdue matches and set winners
  for (const m of tournament.matches) {
    if (m.endsAt && now >= m.endsAt && m.status !== 'finished') {
      m.status = 'finished';
      if (!m.winner) {
        m.winner = (m.votesA >= m.votesB) ? m.blogA : m.blogB;
      }
      changed = true;
    }
  }

  // Group by round
  const roundToMatches = new Map();
  for (const m of tournament.matches) {
    const r = m.round || 1;
    if (!roundToMatches.has(r)) roundToMatches.set(r, []);
    roundToMatches.get(r).push(m);
  }

  // Determine highest existing round
  const rounds = Array.from(roundToMatches.keys()).sort((a,b)=>a-b);
  for (const r of rounds) {
    const ms = roundToMatches.get(r);
    const allFinished = ms.length > 0 && ms.every(x => x.status === 'finished');
    if (!allFinished) continue;

    const winners = ms.map(x => x.winner).filter(Boolean);
    if (winners.length <= 1) {
      // If only one winner remains across all rounds, complete tournament
      if (winners.length === 1) {
        // Only update if tournament is not already completed
        if (tournament.status !== 'completed') {
          tournament.status = 'completed';
          tournament.winner = winners[0];
          
          // Increment the winner's user totalWins
          try {
            const winningBlog = await Blog.findById(winners[0]);
            if (winningBlog && winningBlog.author) {
              await User.findByIdAndUpdate(
                winningBlog.author,
                { $inc: { totalWins: 1 } }
              );
            }
          } catch (error) {
            console.error('Error updating user totalWins:', error);
          }
          
          changed = true;
        }
      }
      continue;
    }

    const nextRound = r + 1;
    const nextRoundExists = tournament.matches.some(x => (x.round || 1) === nextRound);
    if (nextRoundExists) continue; // Avoid duplicate creation

    // Create next round matches from winners
    const durationMs = (tournament.matchDurationMinutes || 10) * 60 * 1000;
    for (let i = 0; i < winners.length; i += 2) {
      const startsAt = new Date(now.getTime() + (i / 2) * durationMs);
      const endsAt = new Date(startsAt.getTime() + durationMs);
      tournament.matches.push({
        blogA: winners[i],
        blogB: winners[i + 1],
        round: nextRound,
        votesA: 0,
        votesB: 0,
        voters: [],
        startsAt,
        endsAt,
        status: 'scheduled'
      });
    }
    changed = true;
  }

  if (changed) {
    await tournament.save();
  }
  return changed;
};

// @desc Create tournament (admin)
// @route POST /api/tournaments
// @access Private/Admin
const createTournament = async (req, res) => {
  try {
    const { name, size, blogs, matchDurationMinutes } = req.body;

    if (!name || !size || !blogs || !Array.isArray(blogs) || blogs.length === 0) {
      return res.status(400).json({ success: false, message: 'name, size and blogs are required' });
    }

    const validSizes = [4, 8, 16, 32];
    if (!validSizes.includes(size)) {
      return res.status(400).json({ success: false, message: 'Invalid size' });
    }

    if (blogs.length > size) {
      return res.status(400).json({ success: false, message: 'Blogs exceed bracket size' });
    }

    const tournament = await Tournament.create({
      name,
      size,
      blogs,
      createdBy: req.user._id,
      status: 'draft',
      matchDurationMinutes: matchDurationMinutes || 10,
    });

    let responseDoc = tournament;
    try {
      // Safer re-fetch and populate to avoid chained populate issues on fresh docs
      responseDoc = await Tournament.findById(tournament._id)
        .populate('blogs', 'title author')
        .populate({ path: 'blogs', populate: { path: 'author', select: 'username email' } })
        .populate('createdBy', 'username email');
    } catch (populateError) {
      console.error('Create tournament populate error:', populateError);
    }

    res.status(201).json({ success: true, data: responseDoc });
  } catch (error) {
    console.error('Create tournament error:', error);
    res.status(500).json({ success: false, message: 'Server error creating tournament' });
  }
};

// @desc Get tournaments (public)
// @route GET /api/tournaments
const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('blogs', 'title author')
      .populate({ path: 'blogs', populate: { path: 'author', select: 'username email' } })
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });

    // Auto finalize/advance for each tournament before responding
    for (const t of tournaments) {
      await finalizeAndAdvance(t);
    }
    const refreshed = await Tournament.find()
      .populate('blogs', 'title author')
      .populate({ path: 'blogs', populate: { path: 'author', select: 'username email' } })
      .populate({ path: 'matches.blogA', select: 'title author image category content', populate: { path: 'author', select: 'username email' } })
      .populate({ path: 'matches.blogB', select: 'title author image category content', populate: { path: 'author', select: 'username email' } })
      .populate({ path: 'winner', select: 'title author', populate: { path: 'author', select: 'username email' } })
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: refreshed });
  } catch (error) {
    console.error('Get tournaments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createTournament, getTournaments };
// @desc Register a blog to a tournament (owner only)
// @route POST /api/tournaments/:id/register
// @access Private
const registerToTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const { blogId } = req.body;

    if (!blogId) return res.status(400).json({ success: false, message: 'blogId is required' });

    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ success: false, message: 'Tournament not found' });

    // Size check
    if (tournament.blogs.length >= tournament.size) {
      return res.status(400).json({ success: false, message: 'Tournament is full' });
    }

    // Blog ownership and existence
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only register your own blog' });
    }

    // No duplicate registrations for same blog
    if (tournament.blogs.find((b) => b.toString() === blogId)) {
      return res.status(400).json({ success: false, message: 'Blog already registered' });
    }

    // Enforce one entry per user in a tournament
    const existingUserEntry = await Blog.findOne({ _id: { $in: tournament.blogs }, author: req.user._id });
    if (existingUserEntry) {
      return res.status(400).json({ success: false, message: 'You have already registered a blog to this tournament' });
    }

    tournament.blogs.push(blogId);
    await tournament.save();

    const populated = await Tournament.findById(id)
      .populate('blogs', 'title author')
      .populate({ path: 'blogs', populate: { path: 'author', select: 'username email' } })
      .populate('createdBy', 'username email');

    res.json({ success: true, data: populated });
  } catch (error) {
    console.error('Register tournament error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createTournament, getTournaments, registerToTournament };
// @desc Start tournament (admin)
// @route POST /api/tournaments/:id/start
// @access Private/Admin
const startTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ success: false, message: 'Tournament not found' });
    if (tournament.status !== 'draft') return res.status(400).json({ success: false, message: 'Tournament already started or completed' });
    if (tournament.blogs.length !== tournament.size) return res.status(400).json({ success: false, message: 'Tournament is not full' });

    // Build matches as simple pairs in current order
    const now = new Date();
    const durationMs = (tournament.matchDurationMinutes || 10) * 60 * 1000;
    const matches = [];
    const totalRounds = Math.log2(tournament.size);
    for (let i = 0; i < tournament.blogs.length; i += 2) {
      const startsAt = new Date(now.getTime() + (i / 2) * durationMs);
      const endsAt = new Date(startsAt.getTime() + durationMs);
      matches.push({
        blogA: tournament.blogs[i],
        blogB: tournament.blogs[i + 1],
        round: 1,
        votesA: 0,
        votesB: 0,
        voters: [],
        startsAt,
        endsAt,
        status: 'scheduled'
      });
    }

    tournament.matches = matches;
    tournament.status = 'active';
    await tournament.save();

    const populated = await Tournament.findById(id)
      .populate('blogs', 'title author')
      .populate({ path: 'blogs', populate: { path: 'author', select: 'username email' } })
      .populate({ path: 'matches.blogA', select: 'title author', populate: { path: 'author', select: 'username email' } })
      .populate({ path: 'matches.blogB', select: 'title author', populate: { path: 'author', select: 'username email' } });

    res.json({ success: true, data: populated });
  } catch (error) {
    console.error('Start tournament error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc Vote in a match
// @route POST /api/tournaments/:id/matches/:index/vote
// @access Private
const voteMatch = async (req, res) => {
  try {
    const { id, index } = req.params;
    const { pick } = req.body; // 'A' or 'B'
    const tournament = await Tournament.findById(id);
    if (!tournament) return res.status(404).json({ success: false, message: 'Tournament not found' });
    if (tournament.status !== 'active') return res.status(400).json({ success: false, message: 'Tournament is not active' });
    const match = tournament.matches[Number(index)];
    if (!match) return res.status(404).json({ success: false, message: 'Match not found' });

    const now = new Date();
    if (now < match.startsAt) return res.status(400).json({ success: false, message: 'Match not started yet' });
    // If already finished by time, finalize and maybe advance instead of early return
    if (now >= match.endsAt) {
      if (match.status !== 'finished') {
        match.status = 'finished';
        if (!match.winner) match.winner = (match.votesA >= match.votesB) ? match.blogA : match.blogB;
        // Round advance check
        const round = match.round || 1;
        const thisRoundMatches = tournament.matches.filter(m => (m.round || 1) === round);
        const allFinished = thisRoundMatches.every(m => m.status === 'finished');
        if (allFinished) {
          const winners = thisRoundMatches.map(m => m.winner);
          if (winners.length > 1) {
            const nextRound = round + 1;
            const durationMs = (tournament.matchDurationMinutes || 10) * 60 * 1000;
            for (let i = 0; i < winners.length; i += 2) {
              const startsAt = new Date(now.getTime() + (i / 2) * durationMs);
              const endsAt = new Date(startsAt.getTime() + durationMs);
              tournament.matches.push({
                blogA: winners[i],
                blogB: winners[i + 1],
                round: nextRound,
                votesA: 0,
                votesB: 0,
                voters: [],
                startsAt,
                endsAt,
                status: 'scheduled'
              });
            }
          } else {
            // Only update if tournament is not already completed
            if (tournament.status !== 'completed') {
              tournament.status = 'completed';
              // Record the winner and increment user's totalWins
              const finalWinner = winners[0];
              if (finalWinner) {
                tournament.winner = finalWinner;
                try {
                  const winningBlog = await Blog.findById(finalWinner);
                  if (winningBlog && winningBlog.author) {
                    await User.findByIdAndUpdate(
                      winningBlog.author,
                      { $inc: { totalWins: 1 } }
                    );
                  }
                } catch (error) {
                  console.error('Error updating user totalWins:', error);
                }
              }
            }
          }
        }
      }
      await tournament.save();
      try {
        const populated = await Tournament.findById(id)
          .populate({ path: 'matches.blogA', select: 'title author image category content', populate: { path: 'author', select: 'username email' } })
          .populate({ path: 'matches.blogB', select: 'title author image category content', populate: { path: 'author', select: 'username email' } });
        const populatedMatch = populated?.matches?.[Number(index)] || match;
        return res.json({ success: true, data: populatedMatch });
      } catch (popErr) {
        console.error('Vote populate (ended) error:', popErr);
        return res.json({ success: true, data: match });
      }
    }

    if (match.voters.find(v => v.toString() === req.user._id.toString())) {
      return res.status(400).json({ success: false, message: 'You already voted in this match' });
    }

    if (pick === 'A') match.votesA += 1; else if (pick === 'B') match.votesB += 1; else {
      return res.status(400).json({ success: false, message: 'Invalid pick' });
    }

    match.voters.push(req.user._id);
    match.status = 'live';
    // If time elapsed after this vote, close and advance
    if (now >= match.endsAt) {
      match.status = 'finished';
      if (!match.winner) match.winner = (match.votesA >= match.votesB) ? match.blogA : match.blogB;
      const round = match.round || 1;
      const thisRoundMatches = tournament.matches.filter(m => (m.round || 1) === round);
      const allFinished = thisRoundMatches.every(m => m.status === 'finished');
      if (allFinished) {
        const winners = thisRoundMatches.map(m => m.winner);
        if (winners.length > 1) {
          const nextRound = round + 1;
          const durationMs = (tournament.matchDurationMinutes || 10) * 60 * 1000;
          for (let i = 0; i < winners.length; i += 2) {
            const startsAt = new Date(now.getTime() + (i / 2) * durationMs);
            const endsAt = new Date(startsAt.getTime() + durationMs);
            tournament.matches.push({
              blogA: winners[i],
              blogB: winners[i + 1],
              round: nextRound,
              votesA: 0,
              votesB: 0,
              voters: [],
              startsAt,
              endsAt,
              status: 'scheduled'
            });
          }
        } else {
          // Only update if tournament is not already completed
          if (tournament.status !== 'completed') {
            tournament.status = 'completed';
            // Record the winner and increment user's totalWins
            const finalWinner = winners[0];
            if (finalWinner) {
              tournament.winner = finalWinner;
              try {
                const winningBlog = await Blog.findById(finalWinner);
                if (winningBlog && winningBlog.author) {
                  await User.findByIdAndUpdate(
                    winningBlog.author,
                    { $inc: { totalWins: 1 } }
                  );
                }
              } catch (error) {
                console.error('Error updating user totalWins:', error);
              }
            }
          }
        }
      }
    }

    await tournament.save();

    try {
      const populated = await Tournament.findById(id)
        .populate({ path: 'matches.blogA', select: 'title author image category content', populate: { path: 'author', select: 'username email' } })
        .populate({ path: 'matches.blogB', select: 'title author image category content', populate: { path: 'author', select: 'username email' } });
      const populatedMatch = populated?.matches?.[Number(index)] || match;
      return res.json({ success: true, data: populatedMatch });
    } catch (popErr) {
      console.error('Vote populate error:', popErr);
      return res.json({ success: true, data: match });
    }
  } catch (error) {
    console.error('Vote match error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc Delete tournament (admin)
// @route DELETE /api/tournaments/:id
// @access Private/Admin
const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Tournament.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Tournament not found' });
    res.json({ success: true, message: 'Tournament deleted' });
  } catch (error) {
    console.error('Delete tournament error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc Get tournament by id
// @route GET /api/tournaments/:id
const getTournamentById = async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id)
      .populate('blogs', 'title author')
      .populate({ path: 'blogs', populate: { path: 'author', select: 'username email' } })
      .populate({ path: 'matches.blogA', select: 'title author', populate: { path: 'author', select: 'username email' } })
      .populate({ path: 'matches.blogB', select: 'title author', populate: { path: 'author', select: 'username email' } })
      .populate('createdBy', 'username email');
    if (!t) return res.status(404).json({ success: false, message: 'Tournament not found' });
    await finalizeAndAdvance(t);
    const refreshed = await Tournament.findById(req.params.id)
      .populate('blogs', 'title author')
      .populate({ path: 'blogs', populate: { path: 'author', select: 'username email' } })
      .populate({ path: 'matches.blogA', select: 'title author image category content', populate: { path: 'author', select: 'username email' } })
      .populate({ path: 'matches.blogB', select: 'title author image category content', populate: { path: 'author', select: 'username email' } })
      .populate({ path: 'winner', select: 'title author', populate: { path: 'author', select: 'username email' } })
      .populate('createdBy', 'username email');
    res.json({ success: true, data: refreshed });
  } catch (error) {
    console.error('Get tournament by id error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createTournament, getTournaments, getTournamentById, registerToTournament, startTournament, voteMatch, deleteTournament };


