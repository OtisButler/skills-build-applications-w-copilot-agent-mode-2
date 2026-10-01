import { model, Schema } from 'mongoose';

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, unique: true },
    activityType: {
      type: String,
      enum: ['running', 'walking', 'strength', 'cycling', 'yoga'],
      required: true,
    },
    description: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  },
  { timestamps: true },
);

export default model('Workout', workoutSchema);