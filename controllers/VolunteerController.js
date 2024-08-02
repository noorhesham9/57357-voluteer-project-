const Volunteer = require("./../models/VoluteerModel");
let Time = require("./../models/TimeModel");

const asyncErrorHandler = require("./../utils/asynsErrorHandler");
const calculateTotalDuration = (durations) => {
  let totalMinutes = 0;

  durations.forEach((duration) => {
    const [hours, minutes] = duration.split(":").map(Number);
    totalMinutes += hours * 60 + minutes;
  });

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return `${totalHours}:${remainingMinutes.toString().padStart(2, "0")}`;
};

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
  const volunteer = await Volunteer.findOne({ name: req.query.name });
  const times = await Time.find({ volunteer: volunteer._id });
  const durations = [];

  times.forEach((t) => {
    return durations.push(t.duration);
  });
  if (times) {
    volunteer.totalTImes = calculateTotalDuration(durations);
  }
  await volunteer.save();
  if (times.length > 0) {
    res.status(200).json({ success: true, data: times });
  } else {
    res.status(200).json({ success: false, data: ["No times found"] });
  }
});

exports.setTotalTImes = asyncErrorHandler(async (req, res, next) => {
  const volunteer = await Volunteer.findOne({ name: req.query.name });
  const times = await Time.find({ volunteer: volunteer._id });
  const durations = times.forEach((t) => {
    return t.duration;
  });
  if (times) {
    volunteer.totalTImes = calculateTotalDuration(durations);
  }
  await volunteer.save();
  if (times.length > 0) {
    res.status(200).json({
      success: true,
      data: times,
      text: "total times seted successfully",
    });
  } else {
    res.status(200).json({ success: false, data: ["No times found"] });
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

const calculateTotalhours = (durations) => {
  let totalMinutes = 0;

  durations.forEach((duration) => {
    const [hours, minutes] = duration.split(":").map(Number);
    totalMinutes += hours * 60 + minutes;
  });

  const totalHours = Math.floor(totalMinutes / 60);

  return totalHours;
};

exports.getmonthlyVolunteer = asyncErrorHandler(async (req, res, next) => {
  const month = req.query.month;
  const year = req.query.year;
  const volunteers = await Volunteer.find();

  let monthlyVolunteer = [];
  volunteers.forEach((v) => {
    v.times.every((time) => {
      if (time.month == month) {
        monthlyVolunteer.push(v);
        return false;
      }
      return true;
    });
  });

  const totalVolunteers = monthlyVolunteer.length;
  let totalHours = 0;

  let timesArray = [];
  for (let i = 0; i < monthlyVolunteer.length; i++) {
    const times = await Time.find({
      volunteer: monthlyVolunteer[i]._id,
    });
    for (let j = 0; j < times.length; j++) {
      timesArray.push(times[j].duration);
    }
  }
  totalHours = calculateTotalhours(timesArray);
  const totalDurations = calculateTotalDuration(timesArray);
  const averageHours = totalHours / totalVolunteers;
  res.status(200).json({
    status: "success",
    data: {
      monthlyVolunteer,
      totalDurations,
      totalHours,
      totalVolunteers,
      averageHours,
    },
  });
});
