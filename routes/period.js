'use strict';

const express = require('express');
const Period = require('../models/period');
const fs = require('fs');

// const seedPeriods = require('../models/seed-period-data.json');

const router = express.Router();

router.get('/', (req, res, next) => {
  Period.find()
    .then(periods => {
      res.json(periods.map(period => period.toObject()));
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  // Load Seed Period Seed Data
  // const periods = fs.readFileSync('/Users/cameronprier/Desktop/PECM/server/models/seed-period-data.json', 'utf-8');
  const { name, time, maxStudents } = req.body;
  const newPeriod = { name, time, maxStudents };
  console.log(newPeriod);

  Period.create(newPeriod)
    .then(period => {
      return res.status(201)
        .location(`/api/periods/${period.id}`)
        .json(period)
    })
    .catch(err => {
      if (err.code === '11000') {
        err = new Error('This period already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Period.findOneAndRemove({ _id: id })
    .then(() => {
      res.json({
        message: 'Deleted period'
      });
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;


