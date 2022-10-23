const {
  verifyUserLoggedIn,
  verifyUserIsAdmin,
} = require('./permissionServices');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const cleanUser = (userDocument) => {
  return {
    id: userDocument._id,
    firstName: userDocument.firstName,
    lastName: userDocument.lastName,
    email: userDocument.email,
    profilePicture: userDocument.profilePicture,
    isAdmin: userDocument.isAdmin,
    workouts: !userDocument.workouts ? [] : userDocument.workouts,
  };
};

const getToken = (userId) => {
  return jwt.sign({ userId, iat: Date.now() }, process.env.AUTH_SECRET_KEY);
};

const signOut = (req, res, next) => {
  res.clearCookie('session_token');
  res.send('Signed out successfully');
};

const testAuth = async (req, res, next) => {
  //check if user is logged in ... they should have valid JWT
  try {
    verifyUserLoggedIn(req, res);
    res.send({ userFirstName: req.user.firstName });
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    console.log('req.body: ', req.body);
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userDocument = new UserModel({
      firstName,
      lastName,
      email,
      hashedPassword,
    });
    await userDocument.save();
    const token = getToken(userDocument._id);
    res.cookie('session_token', token, { httpOnly: true, secure: false });
    res.send({
      user: cleanUser(userDocument),
    });
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body.credentials;
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      return res.status(401).send('User not found or incorrect credentials');
    }
    const passwordMatch = await bcrypt.compare(
      password,
      foundUser.hashedPassword
    );
    if (!passwordMatch) {
      return res.status(401).send('User not found or incorrect credentials');
    }
    const token = getToken(foundUser._id);
    res.cookie('session_token', token, { httpOnly: true, secure: false });
    res.send({
      user: cleanUser(foundUser),
    });
  } catch (error) {
    next(error);
  }
};

const getAthletes = async (req, res, next) => {
  try {
    verifyUserIsAdmin(req, res);
    const athletes = await UserModel.find({ isAdmin: false });
    res.send({ athletes: athletes.map(cleanUser) });
  } catch (error) {
    next(error);
  }
};

const addWorkout = async (req, res, next) => {
  try {
    const workoutData = req.body.workoutData;
    const athleteId = req.body.athleteId;
    console.log(req.body.athleteId);
    verifyUserLoggedIn(req, res);
    const athlete = await UserModel.findOne({ _id: athleteId });
    if (!athlete) {
      return res.status(401).send('User not found or incorrect credentials');
    }
    athlete.workouts.push(workoutData);
    await athlete.save();
    res.send({ athlete: cleanUser(athlete) });
  } catch (error) {
    next(error);
  }
};

const UserServices = {
  signIn,
  signOut,
  registerUser,
  testAuth,
  getAthletes,
  addWorkout,
};
module.exports = UserServices;
