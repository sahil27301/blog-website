const express = require('express');

const router = express.Router();

const Post = require('../models/Post');

// @desc    Create new blog page
// @route   GET /posts/compose
router.get('/compose', function (_req, res) {
  res.render('compose');
});

// @desc    Create new blog page
// @route   POST /posts/compose
router.post('/compose', function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    body: req.body.postBody,
  });
  post.save(err => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});

// @desc    Get Single Blog
// @route   GET /posts/:post_id
router.get('/:post_id', function (req, res) {
  if (!req.params.post_id.match(/^[0-9a-f]{24}$/i)) {
    res.render('error');
    return;
  }
  Post.findById(req.params.post_id, (err, post) => {
    if (err) {
      console.log(err);
    } else {
      if (post) {
        res.render('post', {
          postName: post.title,
          postBody: post.body,
        });
      } else {
        res.render('error');
      }
    }
  });
});

module.exports = router;
