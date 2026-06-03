// DEVELOPMENT ONLY - Auto-verify users without email
// Replace backend/routes/auth.js temporarily for testing

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/auth/signup
// @desc    Register user WITHOUT email verification (DEV ONLY)
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user and auto-verify (skip email)
    const user = await User.create({
      email,
      password,
      isVerified: true  // Auto-verify for development
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'Registration successful! You can now login.',
      token  // Return token immediately
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration. Please try again.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Skip email verification check for dev
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login'
    });
  }
});

module.exports = router;
