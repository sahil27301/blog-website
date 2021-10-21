const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

const compress = string => string.replace(/\s/g, '').toLowerCase();

/**
 * @desc    Fetch all posts
 * @route   GET /api/posts/
 */
router.get('/posts', async (_req, res) => {
  try {
    const posts = await Post.find().lean().populate('user');
    res.send(posts);
  } catch (err) {
    res.send(err);
  }
});

/**
 * @desc    Fetch a post by ID
 * @route   GET /api/posts/:postId
 */
router.get('/posts/:postId', async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId).lean().populate('user');
    res.send(post);
  } catch (err) {
    res.send(err);
  }
});

/**
 * @desc    Fetch all posts whose title matches the search term
 * @route   GET /api/posts/search/:searchTerm
 */
router.get('/posts/search/:searchTerm', async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const posts = await Post.find().lean().populate('user');
    const matchedPosts = [];
    posts.forEach(post => {
      if (compress(post.title).includes(compress(searchTerm))) {
        matchedPosts.push(post);
      }
    });
    res.send(matchedPosts);
  } catch (err) {
    res.send(err);
  }
});

/**
 * @desc    Fetch all posts of a specific user
 * @route   GET /api/posts/user/:userId
 */
router.get('/posts/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .lean()
      .populate('user');
    res.send(posts);
  } catch (err) {
    res.send(err);
  }
});

/**
 * @desc    Fetch all posts of a specific user by name
 * @route   GET /api/posts/user/name/:name
 */
router.get('/posts/user/name/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const posts = await Post.find().lean().populate('user');
    const matchedPosts = [];
    posts.forEach(post => {
      if (
        post.user.firstName.toLowerCase() === name.toLowerCase() ||
        post.user.lastName.toLowerCase() === name.toLowerCase()
      ) {
        matchedPosts.push(post);
      }
    });
    res.send(matchedPosts);
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
    await Post.findOneAndReplace({ _id: postId }, req.body);
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
    res.send(`Created a post with id ${post._id}`);
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
    res.send('Deleted successfully');
  } catch (err) {
    res.send(err);
  }
});

/**
 * @desc    Fetch all users
 * @route   GET /api/users
 */
router.get('/users', async (_req, res) => {
  try {
    const users = await User.find().lean();
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

/**
 * @desc    Fetch user by ID
 * @route   GET /api/users/:userId
 */
router.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).lean();
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
