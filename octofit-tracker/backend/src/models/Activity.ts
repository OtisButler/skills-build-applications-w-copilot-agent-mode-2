import { model, Schema } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['running', 'walking', 'strength', 'cycling', 'yoga'],
      required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, default: 0, min: 0 },
    points: { type: Number, required: true, min: 0 },
    performedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

activitySchema.index({ user: 1, performedAt: -1 });

export default model('Activity', activitySchema);