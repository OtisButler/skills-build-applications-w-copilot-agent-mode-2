import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    const teamDefinitions = [
      { name: 'Trailblazers', description: 'Steady miles and outdoor adventures.' },
      { name: 'Power Players', description: 'Strength, balance, and teamwork.' },
    ];

    const teams = new Map<string, mongoose.Types.ObjectId>();
    for (const definition of teamDefinitions) {
      const team = await Team.findOneAndUpdate(
        { name: definition.name },
        { $setOnInsert: { ...definition, members: [], totalPoints: 0 } },
        { returnDocument: 'after', upsert: true },
      );
      teams.set(team.name, team._id);
    }

    const userDefinitions = [
      { username: 'maya-chen', email: 'maya.chen@example.com', displayName: 'Maya Chen', teamName: 'Trailblazers' },
      { username: 'leo-martin', email: 'leo.martin@example.com', displayName: 'Leo Martin', teamName: 'Trailblazers' },
      { username: 'imani-brooks', email: 'imani.brooks@example.com', displayName: 'Imani Brooks', teamName: 'Power Players' },
      { username: 'noah-patel', email: 'noah.patel@example.com', displayName: 'Noah Patel', teamName: 'Power Players' },
    ];

    const users = new Map<string, mongoose.Types.ObjectId>();
    for (const definition of userDefinitions) {
      const user = await User.findOneAndUpdate(
        { email: definition.email },
        {
          $set: {
            username: definition.username,
            displayName: definition.displayName,
            team: teams.get(definition.teamName),
          },
          $setOnInsert: { totalPoints: 0 },
        },
        { returnDocument: 'after', upsert: true },
      );
      users.set(user.username, user._id);
    }

    const teamPointTotals = new Map<string, number>();
    const userPointTotals = new Map<string, number>();
    const utcDay = new Date();
    utcDay.setUTCHours(0, 0, 0, 0);
    const daysAgo = (days: number) => new Date(utcDay.getTime() - days * 24 * 60 * 60 * 1000);
    const activityDefinitions = [
      { username: 'maya-chen', type: 'running', durationMinutes: 32, distanceKm: 4.2, points: 42, daysAgo: 1 },
      { username: 'maya-chen', type: 'strength', durationMinutes: 25, distanceKm: 0, points: 30, daysAgo: 3 },
      { username: 'leo-martin', type: 'cycling', durationMinutes: 40, distanceKm: 11.5, points: 48, daysAgo: 2 },
      { username: 'leo-martin', type: 'walking', durationMinutes: 30, distanceKm: 2.4, points: 24, daysAgo: 5 },
      { username: 'imani-brooks', type: 'strength', durationMinutes: 35, distanceKm: 0, points: 42, daysAgo: 1 },
      { username: 'imani-brooks', type: 'yoga', durationMinutes: 20, distanceKm: 0, points: 20, daysAgo: 4 },
      { username: 'noah-patel', type: 'running', durationMinutes: 24, distanceKm: 3.1, points: 31, daysAgo: 2 },
      { username: 'noah-patel', type: 'walking', durationMinutes: 36, distanceKm: 2.8, points: 29, daysAgo: 6 },
    ] as const;

    for (const definition of activityDefinitions) {
      const userId = users.get(definition.username);
      if (!userId) throw new Error(`Missing seeded user: ${definition.username}`);
      const performedAt = daysAgo(definition.daysAgo);
      await Activity.findOneAndUpdate(
        { user: userId, type: definition.type, performedAt },
        {
          $setOnInsert: {
            user: userId,
            type: definition.type,
            durationMinutes: definition.durationMinutes,
            distanceKm: definition.distanceKm,
            points: definition.points,
            performedAt,
          },
        },
        { upsert: true },
      );
      userPointTotals.set(definition.username, (userPointTotals.get(definition.username) ?? 0) + definition.points);
    }

    for (const definition of userDefinitions) {
      const points = userPointTotals.get(definition.username) ?? 0;
      await User.updateOne({ username: definition.username }, { $set: { totalPoints: points } });
      teamPointTotals.set(definition.teamName, (teamPointTotals.get(definition.teamName) ?? 0) + points);
    }

    for (const [teamName, teamId] of teams) {
      const members = userDefinitions
        .filter((user) => user.teamName === teamName)
        .map((user) => users.get(user.username))
        .filter((userId): userId is mongoose.Types.ObjectId => userId !== undefined);
      await Team.updateOne(
        { _id: teamId },
        { $set: { members, totalPoints: teamPointTotals.get(teamName) ?? 0 } },
      );
    }

    const rankedUsers = [...userPointTotals.entries()].sort((left, right) => right[1] - left[1]);
    const yearStart = new Date(Date.UTC(utcDay.getUTCFullYear(), 0, 1));
    await Leaderboard.findOneAndUpdate(
      { period: 'all-time', periodStart: yearStart },
      {
        $set: {
          entries: rankedUsers.map(([username, points], index) => ({
            user: users.get(username),
            points,
            rank: index + 1,
          })),
        },
      },
      { returnDocument: 'after', upsert: true },
    );

    const workoutDefinitions = [
      {
        title: 'Easy Start Run',
        activityType: 'running',
        description: 'A relaxed run with a short warm-up and cool-down.',
        durationMinutes: 25,
        difficulty: 'beginner',
      },
      {
        title: 'Bodyweight Basics',
        activityType: 'strength',
        description: 'Three rounds of squats, push-ups, lunges, and a short plank.',
        durationMinutes: 20,
        difficulty: 'beginner',
      },
      {
        title: 'Recovery Flow',
        activityType: 'yoga',
        description: 'A gentle mobility sequence for hips, shoulders, and back.',
        durationMinutes: 18,
        difficulty: 'intermediate',
      },
    ];

    for (const workout of workoutDefinitions) {
      await Workout.findOneAndUpdate(
        { title: workout.title },
        { $set: workout },
        { returnDocument: 'after', upsert: true },
      );
    }

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
