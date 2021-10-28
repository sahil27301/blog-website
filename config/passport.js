const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const GitHubStrategy = require('passport-github').Strategy;
const axios = require('axios');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (_accessToken, _refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.log(err);
        }
      },
    ),
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
      },
      async (accessToken, _refreshToken, _profile, done) => {
        const response = await axios({
          method: 'get',
          url: 'https://api.github.com/user',
          headers: {
            Authorization: `token ${accessToken}`,
          },
        });
        const newUser = {
          githubId: response.data.id,
          displayName: response.data.name,
          image: response.data.avatar_url,
        };
        let users = await User.find({ githubId: response.data.id });
        let user = users.length ? users[0] : null;
        if (user) {
          return done(null, user);
        } else {
          user = await User.create(newUser);
          return done(null, user);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
