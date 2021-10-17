require('dotenv').config();
const express = require('express');
const { urlencoded, static } = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// passport config
require('./config/passport')(passport);

connectDB();

const app = express();

app.set('view engine', 'ejs');

app.use(urlencoded({ extended: true }));
app.use(static('public'));

// Sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
    }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/index'));

app.use('/posts', require('./routes/posts'));

app.use('/auth', require('./routes/auth'));

app.use('/api', require('./routes/api'))

app.listen(3000, function() {
    console.log('Server started on port 3000');
});