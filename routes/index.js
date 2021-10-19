const express = require('express');

const router = express.Router();

const { ensureAuth, ensureGuest } = require('../middleware/auth');

const Post = require('../models/Post');

truncate = (str, len) => {
  if (str.length > len && str.length > 0) {
    let new_str = str + ' ';
    new_str = str.substr(0, len);
    new_str = str.substr(0, new_str.lastIndexOf(' '));
    new_str = new_str.length > 0 ? new_str : str.substr(0, len);
    return new_str + '...';
  }
  return str;
};

/**
 * @desc    Login/Landing page
 * @route   GET /
 */
router.get('/', ensureGuest, (_req, res) => {
  res.render('login');
});

/**
 * @desc    dashboard page
 * @route   GET /dashboard
 */
router.get('/dashboard', ensureAuth, async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('index/home', {
      posts: posts,
      truncate: truncate,
    });
  } catch (err) {
    console.log(err);
  }
});

/**
 * @desc    About page
 * @route   GET /about
 */
router.get('/about', ensureAuth, (_req, res) => {
  res.render('index/about');
});

/**
 * @desc    Contact page
 * @route   GET /contact
 */
router.get('/contact', ensureAuth, (_req, res) => {
  res.render('index/contact');
});

module.exports = router;
