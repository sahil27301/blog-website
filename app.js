const express = require('express');
const { urlencoded, static } = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blogDB');

const homeStartingContent =
  'Welcome to our blog project. Here, you can create and view multiple blogs.';
const aboutContent =
  'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const postSchema = mongoose.Schema({
  title: String,
  body: String,
});

const Post = mongoose.model('Post', postSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(urlencoded({ extended: true }));
app.use(static('public'));

app.get('/', function (_req, res) {
  Post.find({}, (err, posts) => {
    if (err) {
      console.log(err);
    } else {
      res.render('home', {
        homeStart: homeStartingContent,
        posts: posts,
      });
    }
  });
});

app.get('/about', function (_req, res) {
  res.render('about');
});

app.get('/contact', function (_req, res) {
  res.render('contact');
});

app.get('/compose', function (_req, res) {
  res.render('compose');
});

app.post('/compose', function (req, res) {
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

app.get('/posts/:post_id', function (req, res) {
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

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
