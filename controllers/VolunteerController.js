const Volunteer = require("./../models/VoluteerModel");
let Time = require("./../models/TimeModel");

const asyncErrorHandler = require("./../utils/asynsErrorHandler");

exports.addvolunteer = asyncErrorHandler(async (req, res, next) => {
  const newVolunteer = await Volunteer.create({
    name: req.body.name,
    phone: req.body.phone,
  });
  res.status(201).json({
    success: true,
    data: newVolunteer,
  });
});

exports.getTImes = asyncErrorHandler(async (req, res, next) => {
  const volunteer = await Volunteer.find({ name: req.body.name });
  const times = await Time.find({ volunteer: volunteer._id });
  if (times.length > 0) {
    res.status(200).json({ success: true, data: times });
  } else {
    res.status(200).json({ success: false, data: "No times found" });
  }
});

exports.getvolunteers = asyncErrorHandler(async (req, res, next) => {
  const volunteers = await Volunteer.find();
  res.status(200).json({
    status: "success",
    data: {
      volunteers,
    },
  });
});
