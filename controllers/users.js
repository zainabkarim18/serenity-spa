const express = require('express');
// auth
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Models
const User = require('../models/user');
const { model } = require('mongoose')

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;


    const existingUserByUsername = await User.findOne({ username });
    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByUsername || existingUserByEmail) {
      return res.status(400).json({ error: 'Username or Email already in use' });
    }

    const hashedPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS));
    const user = await User.create({ username, email, hashedPassword });


    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    
    return res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong, try again.' });
  }
});

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
      },
      process.env.JWT_SECRET
    );

    
    return res.status(200).json({ user: existingUser, token });
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong, try again.' });
  }
});

module.exports = router;
