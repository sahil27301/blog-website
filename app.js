const dotenv = require('dotenv').config();
const express = require('express');
const { urlencoded, static } = require('express');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.set('view engine', 'ejs');

app.use(urlencoded({ extended: true }));
app.use(static('public'));

app.use('/', require('./routes/index'));

app.use('/posts', require('./routes/posts'));

app.listen(3000, function () {
  console.log('Server started on port 3000');
});
