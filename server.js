require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./config/dbConnection');
const cors = require('cors');
const session = require('express-session');
const Mongostore = require('connect-mongo');
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const PORT = process.env.PORT || 5000;

connectDB();

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: Mongostore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 60 * 60,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'UPDATE', 'PATCH'],
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization',
  })
);
app.use('/', require('./routes'));

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req, res) => {
  res.send(
    req.user !== undefined
      ? `You are logged in as ${req.user.displayName}`
      : 'You are logged out'
  );
});

app.get(
  '/oauth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login-failure',
    session: true,
  }),
  (req, res) => {
    (req.session.user = req.user), res.redirect('/');
  }
);

app.get('/login-failure', (req, res) => {
  res.send('Failed attempt to log in.');
});

//Error handling.
//No new codes to be added below these lines
app.use((req, res, next) => {
  const error = new Error('Sorry, page not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: error.message });
  next();
});

mongoose.connection.once('open', () => {
  console.log('The database is now connected');
  app.listen(PORT, () => {
    console.log(`Server is open at PORT ${PORT}`);
  });
});
