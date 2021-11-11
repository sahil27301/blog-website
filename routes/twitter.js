const router = require('express').Router();
var request = require('request');
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const make_async_request = options => {
  return new Promise((resolve, reject) => {
    request(options, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
};

const getTrends = async (bearer_token, limit) => {
  const ids = {
    india: 23424848,
    global: 1,
  };
  const options = {
    url: `https://api.twitter.com/1.1/trends/place.json?id=${ids.india}`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bearer_token}`,
    },
  };
  try {
    return JSON.parse(await make_async_request(options))[0]
      .trends.map(trend => `${trend.name}`)
      .slice(0, limit);
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getTweets = async (bearer_token, trend, latitude, longitude, limit) => {
  let query_parameters = {
    q: encodeURI(trend),
  };
  if (latitude && longitude) {
    query_parameters.geocode = encodeURI(`${latitude},${longitude},150km`);
  }
  const options = {
    url: 'https://api.twitter.com/1.1/search/tweets.json',
    method: 'GET',
    qs: query_parameters,
    headers: {
      Authorization: `Bearer ${bearer_token}`,
    },
  };
  try {
    const tweets = JSON.parse(await make_async_request(options)).statuses;
    return {
      trend: trend,
      tweets: tweets
        .map(tweet => {
          return {
            id: tweet.id_str,
            text: tweet.text,
            user: tweet.user.screen_name,
            profile_image_url: tweet.user.profile_image_url_https,
            url: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
          };
        })
        .slice(0, limit),
    };
  } catch (error) {
    console.log(error);
    return { trend: trend, tweets: [] };
  }
};

router.get('/location', async (_req, res) => {
  res.render('twitter/location');
});

const getTweetHtml = async tweet =>
  JSON.parse(
    await make_async_request({
      url: 'https://publish.twitter.com/oembed',
      qs: {
        url: encodeURI(tweet.url),
      },
    }),
  ).html;

const extractTweetHtml = async trending_tweet => {
  return {
    trend: trending_tweet.trend,
    tweets: await Promise.all(trending_tweet.tweets.map(getTweetHtml)),
  };
};

router.post('/location/graphical', async (req, res) => {
  const options = {
    url: 'http://localhost:3000/twitter/location/',
    method: 'POST',
    form: req.body,
  };
  let result;
  try {
    result = JSON.parse(await make_async_request(options));
  } catch (err) {
    res.send(err);
    return;
  }
  const trending_tweets = await Promise.all(result.map(extractTweetHtml));
  res.render('twitter/graphical', { trending_tweets: trending_tweets });
});

router.post('/location', async (req, res) => {
  var options = {
    url: 'https://api.twitter.com/oauth2/token',
    method: 'POST',
    form: {
      grant_type: 'client_credentials',
    },
    auth: {
      user: process.env.TWITTER_CLIENT_ID,
      pass: process.env.TWITTER_CLIENT_SECRET,
    },
  };
  let bearer_token;
  try {
    bearer_token = JSON.parse(await make_async_request(options)).access_token;
  } catch (err) {
    res.send(err);
    return;
  }

  const { latitude, longitude, phoneNumber } = req.body;
  const trends = await getTrends(bearer_token, 5);
  const trending_tweets = await Promise.all(
    trends.map(trend => getTweets(bearer_token, trend, latitude, longitude, 2)),
  );
  res.send(trending_tweets);
  if (!phoneNumber) return;
  let message = '';
  console.log(trending_tweets[0]);
  for (let trending_tweet of trending_tweets) {
    message += `${trending_tweet.trend}\n\nTweets:\n\n`;
    message += `${trending_tweet.tweets[0].text}\n`;
    message += `by @${trending_tweet.tweets[0].user}\n`;
    message += `Find the entire tweet at ${trending_tweet.tweets[0].url}`;
    message += '\n\n\n';
  }
  try {
    const response = await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:' + phoneNumber,
      body: message,
    });
    console.log(response.sid);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
