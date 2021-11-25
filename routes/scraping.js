const router = require('express').Router();

const { ensureAuth } = require('../middleware/auth');

const Blog = require('../models/Blog');

router.get('/', ensureAuth, async (_req, res) => {
  try {
    const blogs = await Blog.find({});
    const tags = [...new Set(blogs.map(blog => blog.tag))];
    res.render('scraping', { tags: tags, blogs: blogs });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
