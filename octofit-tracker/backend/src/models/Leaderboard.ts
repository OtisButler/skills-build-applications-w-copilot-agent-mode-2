import { model, Schema } from 'mongoose';

const leaderboardEntrySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const leaderboardSchema = new Schema(
  {
    period: { type: String, enum: ['weekly', 'monthly', 'all-time'], required: true },
    periodStart: { type: Date, required: true },
    entries: { type: [leaderboardEntrySchema], default: [] },
  },
  { timestamps: true },
);

leaderboardSchema.index({ period: 1, periodStart: 1 }, { unique: true });

export default model('Leaderboard', leaderboardSchema);