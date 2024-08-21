const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/user');

const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUserByUsername = await User.findOne({ username });
    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByUsername || existingUserByEmail) {
      return res.status(400).json({ error: 'Username or Email already in use' });
    }

    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
    const user = await User.create({ username, email, hashedPassword, role });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    return res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong, try again.' });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }

    const isValidPassword = bcrypt.compareSync(password, existingUser.hashedPassword);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid Credentials' });
    }
    
    const token = jwt.sign(
      {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({ user: existingUser, token });
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong, try again.' });
  }
});

// Update Profile
router.put('/update', async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user.id; // Extract user ID from token (ensure `req.user` is set by middleware)

    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new token with updated user information
    const token = jwt.sign(
      {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({ user: updatedUser, token });
  } catch (error) {
    console.error('Update failed:', error);
    res.status(400).json({ error: 'Failed to update profile. Please try again.' });
  }
});

module.exports = router;
