const express = require('express');
const router = express.Router();
const { createTournament, getTournaments, getTournamentById, registerToTournament, startTournament, voteMatch, deleteTournament } = require('../controllers/tournamentController');
const { protect, authorize } = require('../middleware/auth');

// Public
router.get('/', getTournaments);
router.get('/:id', getTournamentById);

// Admin
router.post('/', protect, authorize('admin'), createTournament);
router.post('/:id/start', protect, authorize('admin'), startTournament);
router.delete('/:id', protect, authorize('admin'), deleteTournament);

// Register blog to tournament
router.post('/:id/register', protect, registerToTournament);

// Vote
router.post('/:id/matches/:index/vote', protect, voteMatch);

module.exports = router;


