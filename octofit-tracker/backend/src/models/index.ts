import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'teacher'], default: 'student' },
    avatar: { type: String, default: '' },
    goal: { type: String, default: 'Build a consistent fitness habit' }
  },
  { timestamps: true }
);

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true, min: 1 },
    calories: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const teamSchema = new Schema(
  {
    name: { type: String, required: true },
    color: { type: String, default: '#f3b562' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    target: { type: Number, default: 1000 }
  },
  { timestamps: true }
);

const leaderboardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], default: 'student' },
    minutes: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    sessions: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const workoutSchema = new Schema(
  {
    title: { type: String, required: true },
    focus: { type: String, required: true },
    level: { type: String, enum: ['starter', 'steady', 'challenge'], default: 'steady' },
    duration: { type: Number, required: true },
    exercises: [{ type: String }]
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
export const Leaderboard = mongoose.models.Leaderboard || mongoose.model('Leaderboard', leaderboardSchema);
export const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);
