const express = require('express');

const router = express.Router();

const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Post = require('../models/Post');

// TODO: Add login page
// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (_req, res) => {
  res.render('login');
});

// @desc    dashboard page
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('home', {
      posts: posts,
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc    About page
// @route   GET /about
router.get('/about', ensureAuth, (_req, res) => {
  res.render('about');
});

// @desc    Contact page
// @route   GET /contact
router.get('/contact', ensureAuth, (_req, res) => {
  res.render('contact');
});

module.exports = router;
