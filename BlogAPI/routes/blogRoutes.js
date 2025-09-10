const express = require('express');
const router = express.Router();
const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getUserBlogs
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllBlogs);

// Protected routes
router.get('/user/my-blogs', protect, getUserBlogs);
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

// Public route by id (placed after specific route above)
router.get('/:id', getBlogById);

module.exports = router;
