const express = require('express');
const workoutRouter = express.Router();
const { addWorkout, getWorkouts } = require('../services/workoutServices');

workoutRouter.post('/add-workout', addWorkout);

workoutRouter.get('/get-workouts', getWorkouts);

module.exports = workoutRouter;
