const express = require('express');

const router = express.Router();

const Post = require('../models/Post');

// @desc    Login/Landing page
// @route   GET /
router.get('/', async (_req, res) => {
  try {
    const posts = await Post.find();
    res.render('home', {
      posts: posts,
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc    About page
// @route   GET /about
router.get('/about', function (_req, res) {
  res.render('about');
});

// @desc    Contact page
// @route   GET /contact
router.get('/contact', function (_req, res) {
  res.render('contact');
});

module.exports = router;
