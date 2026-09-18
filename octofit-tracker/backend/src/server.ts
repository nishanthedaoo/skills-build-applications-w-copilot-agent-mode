import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from './models';

const app = express();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

app.use(cors());
app.use(express.json());

app.get('/api/config', (_req, res) => {
  res.json({
    port,
    baseUrl,
    codespaceName: codespaceName || null,
    environment: codespaceName ? 'codespaces' : 'localhost'
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1,
    databaseName: 'octofit_db'
  });
});

app.get('/api/users', async (_req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

app.get('/api/activities', async (_req, res) => {
  const activities = await Activity.find().populate('userId', 'name').sort({ date: -1 });
  res.json(activities);
});

app.post('/api/activities', async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

app.get('/api/teams', async (_req, res) => {
  const teams = await Team.find().populate('members', 'name role');
  res.json(teams);
});

app.post('/api/teams', async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
});

app.get('/api/leaderboard', async (_req, res) => {
  const leaderboard = await Leaderboard.find().sort({ score: -1 });
  res.json(leaderboard.map((entry, index) => ({ ...entry.toObject(), rank: index + 1 })));
});

app.get('/api/workouts', async (_req, res) => {
  const workouts = await Workout.find().sort({ level: 1, duration: 1 });
  res.json(workouts);
});

async function start() {
  try {
    await mongoose.connect(connectionString);
    app.listen(port, () => {
      console.log(`OctoFit API listening on ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to MongoDB:', error);
    process.exit(1);
  }
}

start();
