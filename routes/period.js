'use strict';

const express = require('express');
const Period = require('../models/period');
const fs = require('fs');

const router = express.Router();

router.get('/', (req, res, next) => {
  Period.find()
    .then(periods => {
      res.json(periods.map(period => period.toObject()));
    })
    .catch(err => {
      console.error(err);
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { name, time, maxStudents } = req.body;
  const newPeriod = { name, time, maxStudents };

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
      console.error(err);
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
      console.error(err);
      next(err);
    });
});

module.exports = router;


