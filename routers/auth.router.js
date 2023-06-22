const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();

const User = require('../models/user.model');
const { authenticateUser } = require('../middleware');


router.post('/signup', async (req, res) => {
  try {
    const { email, firstName, lastName, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'token');
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'token');
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get('/me', authenticateUser,  async (req, res) => {
  try{
    return res.status(200).end();
  } catch(error) {
    return res.status(error.status).json({ error: error.message });
  }
});
router.get('/logout', async (req, res) => {
  try {
    // Use Passport.js logout() function to log out the user
    req.logout();

    // Clear session and cookies
    req.session.destroy((err) => {
      if (err) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
          key: 'SESSION_INVALID',
          message: 'SESSION INVALID',
          error: err,
        });
      }

      res.clearCookie('firstName', { path: '/' });
      res.clearCookie('lastName', { path: '/' });

      res.status(204).end();
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
module.exports = router;
