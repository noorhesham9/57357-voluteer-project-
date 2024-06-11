const mongoose = require("mongoose");
const VolunteerSchema = new mongoose.Schema({
  times: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Time",
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
