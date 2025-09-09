const Blog = require('../models/blogModal');
const User = require('../models/userModel');

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
    try {
        const { title, content, image, category } = req.body;

        // Validation
        if (!title || !content || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, content, and category'
            });
        }

        // Check if category is valid
        const validCategories = ['art', 'sci-fi', 'technology', 'food', 'travel', 'sports'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category. Must be one of: art, sci-fi, technology, food, travel, sports'
            });
        }

        // Create blog
        const blog = await Blog.create({
            title,
            content,
            image: image || '',
            category,
            author: req.user.id
        });

        // Add blog to user's blogs array
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { blogs: blog._id } },
            { new: true }
        );

        // Populate author information
        await blog.populate('author', 'username email');

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: blog
        });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during blog creation'
        });
    }
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getAllBlogs = async (req, res) => {
    try {
        const { category, page = 1, limit = 10 } = req.query;
        
        // Build query
        const query = {};
        if (category) {
            query.category = category;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get blogs with pagination
        const blogs = await Blog.find(query)
            .populate('author', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Blog.countDocuments(query);

        res.status(200).json({
            success: true,
            count: blogs.length,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: blogs
        });
    } catch (error) {
        console.error('Get all blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching blogs'
        });
    }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'username email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        console.error('Get blog by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching blog'
        });
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private (Author only)
const updateBlog = async (req, res) => {
    try {
        const { title, content, image, category } = req.body;

        // Find blog
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user is the author
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this blog'
            });
        }

        // Validate category if provided
        if (category) {
            const validCategories = ['art', 'sci-fi', 'technology', 'food', 'travel', 'sports'];
            if (!validCategories.includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category. Must be one of: art, sci-fi, technology, food, travel, sports'
                });
            }
        }

        // Update blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title: title || blog.title,
                content: content || blog.content,
                image: image !== undefined ? image : blog.image,
                category: category || blog.category
            },
            { new: true, runValidators: true }
        ).populate('author', 'username email');

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            data: updatedBlog
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during blog update'
        });
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private (Author only)
const deleteBlog = async (req, res) => {
    try {
        // Find blog
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }

        // Check if user is the author
        if (blog.author.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this blog'
            });
        }

        // Remove blog from user's blogs array
        await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { blogs: blog._id } }
        );

        // Delete blog
        await Blog.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during blog deletion'
        });
    }
};

// @desc    Get user's blogs
// @route   GET /api/blogs/user/my-blogs
// @access  Private
const getUserBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get user's blogs with pagination
        const blogs = await Blog.find({ author: req.user.id })
            .populate('author', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination
        const total = await Blog.countDocuments({ author: req.user.id });

        res.status(200).json({
            success: true,
            count: blogs.length,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            data: blogs
        });
    } catch (error) {
        console.error('Get user blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user blogs'
        });
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getUserBlogs
};
