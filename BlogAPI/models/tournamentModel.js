const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    size: { type: Number, required: true, enum: [4, 8, 16, 32] },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['draft', 'active', 'completed'], default: 'draft' },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
    matchDurationMinutes: { type: Number, default: 10 },
    matches: [
      {
        blogA: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
        blogB: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
        winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
        round: { type: Number, default: 1 },
        votesA: { type: Number, default: 0 },
        votesB: { type: Number, default: 0 },
        voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        startsAt: { type: Date, required: true },
        endsAt: { type: Date, required: true },
        status: { type: String, enum: ['scheduled', 'live', 'finished'], default: 'scheduled' }
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tournament', tournamentSchema);


