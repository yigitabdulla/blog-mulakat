const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllBlogs,
  deleteBlog,
  getAllTournaments,
  deleteTournament,
  getAllUsers,
  deleteUser,
  removeMatchVotes,
  getDashboardStats
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// Blog management
router.get('/blogs', getAllBlogs);
router.delete('/blogs/:id', deleteBlog);

// Tournament management
router.get('/tournaments', getAllTournaments);
router.delete('/tournaments/:id', deleteTournament);
router.delete('/tournaments/:tournamentId/matches/:matchIndex/votes', removeMatchVotes);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;




