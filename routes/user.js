'use strict';

const express = require('express');

const User = require('../models/user');

const router = express.Router();

// GET ALL USERS
router.get('/', (req, res, next) => {
  User.find()
    .then(user => {
      console.log(user);
      res.json(user);
    })
    .catch(err => {
      next(err);
    });
});

// CREATE NEW USER
router.post('/', (req, res, next) => {
  // Missing field validation
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
  // If either field is missing, throw an error saying which is missing
  if (missingField) {
    const err = new Error(`Missing ${missingField} in request body`);
    err.status = 422;
    return next(err);
  }

  // Fields must be strings validation
  const stringFields = ['username', 'password', 'fullname'];
  const nonStringField = stringFields.find(field => {
    field in req.body && typeof req.body[field] !== 'string';
  });
  // If any of the fields are not strings, throw an error saying which is not a string
  if (nonStringField) {
    const err = new Error(`Field: '${nonStringField}' must be typeof String`);
    err.status = 422;
    return next(err);
  }

  // No whitespaces validation
  const trimmedFields = ['username', 'password'];
  const nonTrimmedField = trimmedFields.find(field => {
    req.body[field].trim() !== req.body[field];
  });
  // If there are white spaces, throw an error
  if (nonTrimmedField) {
    const err = new Error(`Field: '${nonTrimmedField}' cannot start or end with a whitespace!`);
    err.status = 422;
    return next(err);
  }

  // bcrypt cuts off after 72 characters
  const sizedFields = {
    username: { min: 1 },
    password: { min: 8, max: 72 }
  };
  // Too small of a field validation
  const tooSmall = Object.keys(sizedFields).find(field => {
    'min' in sizedFields[field] 
    && 
    req.body[field].trim().length < sizedFields[field].min;
  });
  if (tooSmall) {
    const min = sizedFields[tooSmall].min;
    const err = new Error(`Field: '${tooSmall}' must be at least ${min} characters long`);
    err.status = 422;
    return next(err);
  }

  // Too large of a field validation
  const tooLarge = Object.keys(sizedFields).find(field => {
    'max' in sizedFields[field] 
    &&
    req.body[field].trim().length > sizedFields[field].max;
  });
  if (tooLarge) {
    const max = sizedFields[tooLarge].max;
    const err = new Error(`Field: '${tooLarge}' must be at most ${max} characters long `);
    err.status = 422;
    return next(err);
  }

  // Create the new user
  let { username, password, fullname = '' } = req.body;
  fullname = fullname.trim();

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username, 
        password: digest, 
        fullname
      };
      console.log(newUser);
      return User.create(newUser);
    })
    .then(result => {
      console.log(result);
      return res.status(201)
        .location(`/api/users/${result.id}`)
        .json(result);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
});

// DELETE A USER BY ID
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  User.findOneAndRemove({ _id: id })
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;