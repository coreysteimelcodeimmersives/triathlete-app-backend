const UserModel = require('../models/UserModel');
const WorkoutModel = require('../models/WorkoutModel');
const { verifyUserIsAdmin } = require('./permissionServices');

const cleanWorkout = (workoutDocument) => {
  return {
    id: workoutDocument._id,
    title: workoutDocument.title,
    sportType: workoutDocument.sportType,
    energySystem: workoutDocument.energySystem,
    durationMinutes: workoutDocument.durationMinutes,
    durationHours: workoutDocument.durationHours,
    totalDuration: workoutDocument.totalDuration,
    distanceValue: !workoutDocument.distanceValue
      ? ''
      : workoutDocument.distanceValue,
    distanceUnits: !workoutDocument.distanceUnits
      ? ''
      : workoutDocument.distanceUnits,
    warmUp: !workoutDocument.warmUp ? '' : workoutDocument.warmUp,
    mainSet: !workoutDocument.mainSet ? '' : workoutDocument.mainSet,
    coolDown: !workoutDocument.coolDown ? '' : workoutDocument.coolDown,
    specialNotes: !workoutDocument.specialNotes
      ? ''
      : workoutDocument.specialNotes,
    athleteNotes: !workoutDocument.athleteNotes
      ? ''
      : workoutDocument.athleteNotes,
  };
};

const addWorkout = async (req, res, next) => {
  try {
    const { workoutData } = req.body;
    verifyUserIsAdmin(req, res);
    const workoutDocument = new WorkoutModel(workoutData);
    await workoutDocument.save();
    res.send({ workout: cleanWorkout(workoutDocument) });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateWorkout = async (req, res, next) => {
  try {
    const { workoutData } = req.body;
    verifyUserIsAdmin(req, res);
    const filter = { _id: workoutData.id };
    const update = { ...workoutData };
    const opts = { new: true };
    const updateWorkoutDocument = await WorkoutModel.findOneAndUpdate(
      filter,
      update,
      opts
    );
    res.send({ workout: cleanWorkout(updateWorkoutDocument) });
  } catch (error) {
    next(error);
  }
};

const deleteWorkout = async (req, res, next) => {
  try {
    const { workoutId } = req.body;
    verifyUserIsAdmin(req, res);
    await WorkoutModel.findByIdAndDelete(workoutId);
    res.send({ mssg: 'Workout deleted' });
  } catch (error) {
    next(error);
  }
};

const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await WorkoutModel.find();
    res.send({ workouts: workouts.map(cleanWorkout) });
  } catch (error) {
    next(error);
  }
};

const WorkoutServices = {
  addWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout,
};
module.exports = WorkoutServices;
