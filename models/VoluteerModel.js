const mongoose = require("mongoose");
const VolunteerSchema = new mongoose.Schema({
  times: {
    type: [
      {
        timeid: {
          ref: "Time",
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
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
      },
    ],

    default: [],
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
  },
  totalTImes: {
    type: String,
    required: true,
    default: 0,
  },
});

const volunteer = mongoose.model("volunteer", VolunteerSchema);
module.exports = volunteer;
