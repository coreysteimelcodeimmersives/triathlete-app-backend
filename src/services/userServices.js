const { verifyUserLoggedIn } = require('./permissionServices');
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

const UserServices = { signIn, signOut, registerUser, testAuth };
module.exports = UserServices;
