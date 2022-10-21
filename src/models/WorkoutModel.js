const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  sportType: { type: String, required: true, trim: true },
  energySystem: { type: String, required: true, trim: true },
  durationMinutes: { type: Number, required: true },
  durationHours: { type: Number, required: true },
  totalDuration: { type: Number, required: true },
  distanceValue: { type: Number, required: false },
  distanceUnits: { type: String, required: false, trim: true },
  warmUp: { type: String, required: false, trim: true },
  mainSet: { type: String, required: false, trim: true },
  coolDown: { type: String, required: false, trim: true },
  specialNotes: { type: String, required: false, trim: true },
  athleteNotes: { type: String, required: false, trim: true },
});

const WorkoutModel = mongoose.model('Workout', workoutSchema);

module.exports = WorkoutModel;
