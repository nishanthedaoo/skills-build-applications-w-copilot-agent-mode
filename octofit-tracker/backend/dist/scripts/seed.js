"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose_1.default.connect(connectionString);
        console.log('Connected to octofit_db');
        await Promise.all([
            models_1.User.deleteMany({}),
            models_1.Activity.deleteMany({}),
            models_1.Team.deleteMany({}),
            models_1.Workout.deleteMany({}),
            models_1.Leaderboard.deleteMany({})
        ]);
        const users = await models_1.User.insertMany([
            { name: 'Maya Chen', email: 'maya@octofit.local', role: 'student', goal: 'Improve endurance and consistency' },
            { name: 'Jordan Ellis', email: 'jordan@octofit.local', role: 'student', goal: 'Build strength and confidence' },
            { name: 'Coach Rivera', email: 'coach@octofit.local', role: 'teacher', goal: 'Help every student reach their target' }
        ]);
        const activities = await models_1.Activity.insertMany([
            { userId: users[0]._id, type: 'Run', duration: 32, calories: 284, date: new Date() },
            { userId: users[0]._id, type: 'Mobility', duration: 18, calories: 74, date: new Date(Date.now() - 86400000) },
            { userId: users[1]._id, type: 'Strength', duration: 45, calories: 312, date: new Date() },
            { userId: users[1]._id, type: 'Cycle', duration: 26, calories: 221, date: new Date(Date.now() - 172800000) }
        ]);
        const teams = await models_1.Team.insertMany([
            { name: 'Morning Momentum', color: '#e07a5f', members: [users[0]._id, users[1]._id], target: 900 },
            { name: 'Recovery Crew', color: '#5b88a5', members: [users[0]._id], target: 700 }
        ]);
        const workouts = await models_1.Workout.insertMany([
            { title: 'Core reset', focus: 'Core', level: 'starter', duration: 12, exercises: ['Dead bug', 'Bird dog', 'Plank'] },
            { title: 'Strong foundations', focus: 'Strength', level: 'steady', duration: 28, exercises: ['Squat', 'Push-up', 'Reverse lunge'] },
            { title: 'Cardio ladder', focus: 'Endurance', level: 'challenge', duration: 24, exercises: ['Jog', 'High knees', 'Fast feet'] }
        ]);
        await models_1.Leaderboard.insertMany([
            { userId: users[0]._id, name: users[0].name, role: users[0].role, minutes: 50, score: 1280, sessions: 2 },
            { userId: users[1]._id, name: users[1].name, role: users[1].role, minutes: 71, score: 1510, sessions: 2 },
            { userId: users[2]._id, name: users[2].name, role: users[2].role, minutes: 18, score: 420, sessions: 1 }
        ]);
        console.log('Seeded users, activities, teams, leaderboard, and workouts');
        console.log(JSON.stringify({ users: users.length, activities: activities.length, teams: teams.length, workouts: workouts.length }, null, 2));
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
