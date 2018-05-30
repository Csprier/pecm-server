'use strict';

const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  name: { type: String },
  time: { type: String },
  maxStudents: { type: Number }
}, { timestamps: true });

periodSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Period', periodSchema);