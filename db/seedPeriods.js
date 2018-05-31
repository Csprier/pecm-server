'use strict';

const express = require('express');
const Period = require('../models/period');
const fs = require('fs');

const seedPeriods = require('./db/seed/seed-period-data');

function seedPeriodsInDatabase(req, res) {
  return Promise.all(Period.insertMany(seedPeriods))
    .then(res => res.json())
    .catch(err => console.error(err));
}