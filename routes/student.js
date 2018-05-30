'use strict';

const express = require('express');
const Student = require('../models/student');

const router = express.Router();

// GET ALL STUDENTS
router.get('/', (req, res, next) => {
  Student.find()
    .then(student => {
      console.log('------------------------------------');
      console.log(student);
      res.json(student);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { firstname, lastname } = req.body;
  const newStudent = { firstname, lastname };
  console.log(newStudent);

  Student.create(newStudent)
    .then(student => {
      return res.status(201)
        .location(`/api/students/${student.id}`)
        .json(student)            
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('This student already exists');
        err.status = 400;
      }
      next(err);
    });
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