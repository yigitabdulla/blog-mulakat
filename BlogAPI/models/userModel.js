const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        totalWins: { type: Number, default: 0 },
        roles: { type: [String], default: ['user'] },
        blogs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Blog',
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);