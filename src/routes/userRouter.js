const express = require('express');
const userRouter = express.Router();
const {
  signIn,
  signOut,
  registerUser,
  testAuth,
  getAthletes,
} = require('../services/userServices');

userRouter.get('/sign-out', signOut);

userRouter.get('/test-auth', testAuth);

userRouter.post('/register-user', registerUser);

userRouter.post('/sign-in', signIn);

userRouter.get('/get-athletes', getAthletes);

module.exports = userRouter;
