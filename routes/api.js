const router = require('express').Router();
const Post = require('../models/Post');

/**
 * @desc    Fetch a post by ID
 * @route   GET /api/posts/:postId
 */
router.get('/posts/:postId', async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    res.send(post);
  } catch (err) {
    res.send(err);
  }
});

/**
 * @desc    Replace a post by ID
 * @route   PUT /api/posts/:postId
 */
router.put('/posts/:postId', async (req, res) => {
  const postId = req.params.postId;
  try {
    await Post.findByIdAndReplace(postId, req.body);
    res.send('Updated successfully');
  } catch (err) {
    res.send(err);
  }
});

/**
 * @desc    Update a post by ID
 * @route   PATCH /api/posts/:postId
 */
router.patch('/posts/:postId', async (req, res) => {
  const postId = req.params.postId;
  try {
    await Post.findByIdAndUpdate(postId, req.body);
    res.send('Updated successfully');
  } catch (err) {
    res.send(err);
  }
});

/**
 * @desc    Upload a new post
 * @route   POST /api/posts
 */
router.post('/posts', async (req, res) => {
  const post = new Post(req.body);
  try {
    await post.save();
    res.send('Posted successfully');
  } catch (err) {
    res.send(err);
  }
});

/**
 * @desc    Delete a post by ID
 * @route   DELETE /api/posts/:postId
 */
router.delete('/posts/:postId', async (req, res) => {
  const postId = req.params.postId;
  try {
    await Post.findByIdAndDelete(postId);
    res.send('Deleted');
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
