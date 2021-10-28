const express = require('express');
const passport = require('passport');
const axios = require('axios');
const User = require('../models/User');

const router = express.Router();

/**
 * @desc    Auth with google
 * @route   GET /auth/google
 */
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

/**
 * @desc    google auth callback
 * @route   GET /auth/google/callback
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/,',
  }),
  (_req, res) => {
    res.redirect('/dashboard');
  },
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  },
);

/**
 * @desc    Logout
 * @route   GET /auth/logout
 */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
