require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const UserModel = require('../src/models/UserModel');
const jwt = require('jsonwebtoken');
const userRouter = require('./routes/userRouter');
const port = process.env.PORT;
const app = express();

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING)
  .then(() => {
    console.log('Connected to triathlete mongo db successfully');
  })
  .catch(() => {
    console.log('error connecting to mongo db!');
  });

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

app.use(cookieParser());

app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try {
    const { session_token: sessionToken } = req.cookies;
    if (!sessionToken) {
      return next();
    }
    const { userId, iat } = jwt.verify(
      sessionToken,
      process.env.AUTH_SECRET_KEY
    );
    if (iat < Date.now() - 30 * 24 * 60 * 60 * 1000) {
      return res.status(401).send('Session expired');
    }
    const foundUser = await UserModel.findOne({
      _id: userId,
    });
    if (!foundUser) {
      return next();
    }
    req.user = foundUser;
    return next();
  } catch (error) {
    next(error);
  }
});

app.use(userRouter);

// const errorHandler = (error, req, res, next) => {
//   console.log('Error: ', error);
//   res.status(500).send('There was an error, please try again.');
// };
// app.use(errorHandler);

app.listen(port, () => {
  console.log('Triathlete App server is listening for request');
});
