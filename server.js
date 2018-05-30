'use strict';

require('dotenv').config(); // for jwt_secret and expiry
const { JWT_SECRET } = require('./config');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');


const localStrategy = require('./passport/local');
const jwtStrategy = require('./passport/jwt');
const { PORT, MONGODB_URI } = require('./config');
const cors = require('cors');

// Routers
const usersRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const studentRouter = require('./routes/student');
const periodRouter = require('./routes/period');

// Create an Express application
const app = express();

// Log all requests
app.use(morgan(process.env.NODE_ENV === 'developement' ? 'dev' : 'common', {
  skip: () => process.env.NODE_ENV === 'test'
}));

// CORS
app.use(cors());
app.options('*', cors());
console.log('CORS IS ENABLED');

// Create a statis webserver
app.use(express.static('public'));

// Parse request body
app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/students', studentRouter);
app.use('/api/periods', periodRouter);

// Are the periods loaded?


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
