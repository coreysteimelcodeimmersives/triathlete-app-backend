const express = require('express');
const workoutRouter = express.Router();
const {
  addWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
} = require('../services/workoutServices');

workoutRouter.post('/add-workout', addWorkout);

workoutRouter.post('/update-workout', updateWorkout);

workoutRouter.post('/delete-workout', deleteWorkout);

workoutRouter.get('/get-workouts', getWorkouts);

module.exports = workoutRouter;
