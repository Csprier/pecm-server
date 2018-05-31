'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  periods: [{ type: Schema.Types.ObjectId, ref: 'Period' }] // wrap in []'s so a student can have more than one period
}, { timestamps: true });

studentSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Student', studentSchema);