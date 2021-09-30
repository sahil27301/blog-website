const express = require('express');

const router = express.Router();

const { ensureAuth } = require('../middleware/auth');

const Post = require('../models/Post');

// @desc    Create new blog page
// @route   GET /posts/compose
router.get('/compose', ensureAuth, (_req, res) => {
  res.render('compose');
});

// @desc    Create new blog page
// @route   POST /posts/compose
router.post('/compose', ensureAuth, async (req, res) => {
  req.body.user = req.user.id;
  const post = new Post(req.body);
  try {
    await post.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect('/');
});

// @desc    Get Single Blog
// @route   GET /posts/:post_id
router.get('/:post_id', ensureAuth, async (req, res) => {
  // Ensure post_id is a 24 character hex string
  if (!req.params.post_id.match(/^[0-9a-f]{24}$/i)) {
    res.render('error');
    return;
  }

  try {
    const post = await Post.findById(req.params.post_id)
      .populate('user')
      .lean();
    if (!post) {
      res.render('error');
    } else {
      res.render('post', { post: post });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
