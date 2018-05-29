'use strict';

require('dotenv').config; // for jwt_secret and expiry

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');
const { PORT, MONGODB_URI } = require('./config');

// Routers
const usersRouter = require('./routes/user');
const authRouter = require('./routes/auth');

// Create an Express application
const app = express();

// Log all requests
app.use(morgan(process.env.NODE_ENV === 'developement' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

// Create a statis webserver
app.use(express.static('public'));

// Parse request body
app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api', authRouter);
app.use('/api/users', usersRouter);

// Catch-all 404
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// STATIC SERVER
mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, function() {
      console.info(`Server listening on ${this.address().port}`);
    }).on('error', err => {
      console.error(err);
    });
  });
