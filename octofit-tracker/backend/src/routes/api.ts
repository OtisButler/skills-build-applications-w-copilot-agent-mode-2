import { Router } from 'express';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const router = Router();

router.get('/users', async (_request, response) => {
  const users = await User.find().populate('team', 'name').sort({ username: 1 });
  response.json(users);
});

router.get('/teams', async (_request, response) => {
  const teams = await Team.find().populate('members', 'username displayName').sort({ name: 1 });
  response.json(teams);
});

router.get('/activities', async (_request, response) => {
  const activities = await Activity.find()
    .populate('user', 'username displayName')
    .sort({ performedAt: -1 });
  response.json(activities);
});

router.get('/leaderboard', async (_request, response) => {
  const leaderboards = await Leaderboard.find()
    .populate('entries.user', 'username displayName')
    .sort({ periodStart: -1 });
  response.json(leaderboards);
});

router.get('/workouts', async (_request, response) => {
  const workouts = await Workout.find().sort({ difficulty: 1, title: 1 });
  response.json(workouts);
});

export default router;