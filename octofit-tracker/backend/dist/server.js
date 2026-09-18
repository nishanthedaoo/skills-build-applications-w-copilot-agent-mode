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
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose_1.default.connection.readyState === 1 }));
app.get('/api/users', async (_req, res) => res.json(await models_1.User.find().sort({ name: 1 })));
app.post('/api/users', async (req, res) => { try {
    res.status(201).json(await models_1.User.create(req.body));
}
catch (error) {
    res.status(400).json({ message: error.message });
} });
app.get('/api/activities', async (_req, res) => res.json(await models_1.Activity.find().populate('userId', 'name').sort({ date: -1 })));
app.post('/api/activities', async (req, res) => { try {
    res.status(201).json(await models_1.Activity.create(req.body));
}
catch (error) {
    res.status(400).json({ message: error.message });
} });
app.get('/api/teams', async (_req, res) => res.json(await models_1.Team.find().populate('members', 'name role')));
app.post('/api/teams', async (req, res) => { try {
    res.status(201).json(await models_1.Team.create(req.body));
}
catch (error) {
    res.status(400).json({ message: error.message });
} });
app.get('/api/leaderboard', async (_req, res) => {
    const rows = await models_1.Activity.aggregate([
        { $group: { _id: '$userId', minutes: { $sum: '$duration' }, calories: { $sum: '$calories' }, sessions: { $sum: 1 } } },
        { $sort: { minutes: -1 } }, { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } }, { $unwind: '$user' },
        { $project: { _id: 0, userId: '$_id', name: '$user.name', role: '$user.role', minutes: 1, calories: 1, sessions: 1 } }
    ]);
    res.json(rows.map((row, index) => ({ rank: index + 1, ...row })));
});
app.get('/api/workouts', async (_req, res) => res.json(await models_1.Workout.find().sort({ level: 1, duration: 1 })));
async function start() {
    try {
        await mongoose_1.default.connect(connectionString);
        app.listen(port, () => console.log(`OctoFit API listening on ${port}`));
    }
    catch (error) {
        console.error('Unable to connect to MongoDB:', error);
        process.exit(1);
    }
}
start();
