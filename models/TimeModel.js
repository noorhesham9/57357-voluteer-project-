const mongoose = require("mongoose");
const TimeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
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
  duration: {
    type: String,
    default: Date(this.to) - Date(this.from),
  },
});

const Time = mongoose.model("Time", TimeSchema);
module.exports = Time;
