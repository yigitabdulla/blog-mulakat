const Blog = require('../models/blogModal');
const Tournament = require('../models/tournamentModel');
const User = require('../models/userModel');

// Get all blogs with pagination
const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBlogs: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs'
    });
  }
};

// Delete a blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Remove blog from user's blogs array
    await User.updateMany(
      { blogs: id },
      { $pull: { blogs: id } }
    );

    // Remove blog from tournaments
    await Tournament.updateMany(
      { blogs: id },
      { $pull: { blogs: id } }
    );

    // Delete the blog
    await Blog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog'
    });
  }
};

// Get all tournaments with pagination
const getAllTournaments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tournaments = await Tournament.find()
      .populate('createdBy', 'username email')
      .populate('blogs', 'title category')
      .populate('matches.blogA', 'title')
      .populate('matches.blogB', 'title')
      .populate('winner', 'title author')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Tournament.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        tournaments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalTournaments: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tournaments'
    });
  }
};

// Delete a tournament
const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if tournament exists
    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Delete the tournament
    await Tournament.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting tournament'
    });
  }
};

// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .populate('blogs', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete all blogs by this user
    await Blog.deleteMany({ author: id });

    // Remove user from tournaments
    await Tournament.updateMany(
      { createdBy: id },
      { $unset: { createdBy: 1 } }
    );

    // Remove user from match voters
    await Tournament.updateMany(
      { 'matches.voters': id },
      { $pull: { 'matches.$.voters': id } }
    );

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
};

// Remove votes from a tournament match
const removeMatchVotes = async (req, res) => {
  try {
    const { tournamentId, matchIndex } = req.params;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    const matchIndexNum = parseInt(matchIndex);
    if (matchIndexNum < 0 || matchIndexNum >= tournament.matches.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid match index'
      });
    }

    const match = tournament.matches[matchIndexNum];
    
    // Reset votes and clear voters
    match.votesA = 0;
    match.votesB = 0;
    match.voters = [];
    match.winner = null;

    await tournament.save();

    res.status(200).json({
      success: true,
      message: 'Match votes removed successfully',
      data: match
    });
  } catch (error) {
    console.error('Error removing match votes:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing match votes'
    });
  }
};

// Get admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalTournaments = await Tournament.countDocuments();
    const activeTournaments = await Tournament.countDocuments({ status: 'active' });
    const completedTournaments = await Tournament.countDocuments({ status: 'completed' });

    // Get recent blogs
    const recentBlogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent tournaments
    const recentTournaments = await Tournament.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalBlogs,
          totalUsers,
          totalTournaments,
          activeTournaments,
          completedTournaments
        },
        recentBlogs,
        recentTournaments
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats'
    });
  }
};

module.exports = {
  getAllBlogs,
  deleteBlog,
  getAllTournaments,
  deleteTournament,
  getAllUsers,
  deleteUser,
  removeMatchVotes,
  getDashboardStats
};
