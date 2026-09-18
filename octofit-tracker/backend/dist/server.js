"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("./models");
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8000);
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
        database: mongoose_1.default.connection.readyState === 1,
        databaseName: 'octofit_db'
    });
});
app.get('/api/users', async (_req, res) => {
    const users = await models_1.User.find().sort({ name: 1 });
    res.json(users);
});
app.post('/api/users', async (req, res) => {
    try {
        const user = await models_1.User.create(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.get('/api/activities', async (_req, res) => {
    const activities = await models_1.Activity.find().populate('userId', 'name').sort({ date: -1 });
    res.json(activities);
});
app.post('/api/activities', async (req, res) => {
    try {
        const activity = await models_1.Activity.create(req.body);
        res.status(201).json(activity);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.get('/api/teams', async (_req, res) => {
    const teams = await models_1.Team.find().populate('members', 'name role');
    res.json(teams);
});
app.post('/api/teams', async (req, res) => {
    try {
        const team = await models_1.Team.create(req.body);
        res.status(201).json(team);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.get('/api/leaderboard', async (_req, res) => {
    const leaderboard = await models_1.Leaderboard.find().sort({ score: -1 });
    res.json(leaderboard.map((entry, index) => ({ ...entry.toObject(), rank: index + 1 })));
});
app.get('/api/workouts', async (_req, res) => {
    const workouts = await models_1.Workout.find().sort({ level: 1, duration: 1 });
    res.json(workouts);
});
async function start() {
    try {
        await mongoose_1.default.connect(connectionString);
        app.listen(port, () => {
            console.log(`OctoFit API listening on ${port}`);
        });
    }
    catch (error) {
        console.error('Unable to connect to MongoDB:', error);
        process.exit(1);
    }
}
start();
