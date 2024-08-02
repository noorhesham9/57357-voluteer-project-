const mongoose = require("mongoose");
const TimeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 31,
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  volunteerName: {
    type: String,
    required: true,
  },
  adminName: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: Date(this.to) - Date(this.from),
  },
});

const Time = mongoose.model("Time", TimeSchema);
module.exports = Time;
