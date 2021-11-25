const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  tag: {
    type: String,
  },
  title: {
    type: String,
  },
  link: {
    type: String,
  },
  description: {
    type: String,
  },
  author: {
    type: String,
  },
  image_url: {
    type: String,
  },
  likes: {
    type: Number,
  },
  comments: {
    type: Number,
  },
});

module.exports = mongoose.model('Blog', blogSchema);
