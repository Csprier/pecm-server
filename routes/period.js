'use strict';

const express = require('express');
const Period = require('../models/period');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res, next) => {
  // Load Seed Period Seed Data
  // const periods = fs.readFileSync('/Users/cameronprier/Desktop/PECM/server/models/seed-period-data.json', 'utf-8');
  // console.log(periods);
  // Period.insertMany(periods);
  // Period.deleteMany();
  // Period.insert({
  //   firstname: "Test Period",
  //   time: "Death til Forever",
  //   maxStudents: 100
  // });
});

module.exports = router;

// Look at populating seed-data to get all the periods
// Mongoose seed data loading examples
// wipe students collection from the command line to add Periods to the students
// Get all periods into the state
// Get a component that is a dropdown that has all the periods, with a PUT router
