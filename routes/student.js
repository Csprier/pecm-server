'use strict';

const express = require('express');
const Student = require('../models/student');

const router = express.Router();

// GET ALL STUDENTS
router.get('/', (req, res, next) => {
  Student.find()
    .populate('period')
    .then(students => {
      res.json(students.map(student => student.toObject()));
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { firstname, lastname, period } = req.body;
  const newStudent = { firstname, lastname, period };
  console.log(newStudent);

  Student.create(newStudent)
    .then(student => {
      return res.status(201)
        .location(`/api/students/${student.id}`)
        .json(student)            
    })
    .catch(err => {
      if (err.code === '11000') {
        err = new Error('This student already exists');
        err.status = 400;
      }
      next(err);
    });
});

// UPDATE A STUDENT (after a period is assigned to them)
router.put('/:id/periods', (req, res, next) => {
  const { id } = req.params;
  const { period } = req.body;
  console.log(period)
  console.log('REQ BODY', req.body);

  Student.findByIdAndUpdate(id, { $push: { periods: period }}, { new: true })
    .then(result => {
      console.log(result);
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      console.error(err);
    })
});

// DELETE A STUDENT BY ID
router.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Student.findOneAndRemove({ _id: id })
    .then(() => {
      res.json({
        message: 'Deleted student'
      });
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;