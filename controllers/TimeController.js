let Time = require("./../models/TimeModel");
const CustomError = require("./../utils/CustomError");
const asyncErrorHandler = require("./../utils/asynsErrorHandler");
let Admin = require("./../models/adminModel");
let Volunteer = require("./../models/VoluteerModel");

// function getDuration(startTime, endTime) {
//   // return `${diffdate.getUTCHours()}:${diffdate.getUTCMinutes()}`
// }

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

exports.createTime = asyncErrorHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    res.status(404).json({ message: "the admin was not found" });
  }
  console.log(admin);
  const volunteer = await Volunteer.findOne({ name: req.body.volunteer });
  if (!volunteer) {
    res.status(404).json({ message: "the volunteer was not found" });
  }
  console.log(volunteer);

  let hoursStart = req.body.from.split(":")[0];
  if (hoursStart < 10) {
    hoursStart = 0 + req.body.from.split(":")[0];
  }
  let minutesstart = req.body.from.split(":")[1];
  if (minutesstart < 10) {
    minutesstart = 0 + req.body.from.split(":")[1];
  }
  let hoursend = req.body.to.split(":")[0];
  if (hoursend < 10) {
    hoursend = 0 + req.body.to.split(":")[0];
  }
  let minutesend = req.body.to.split(":")[1];
  if (minutesend < 10) {
    minutesend = 0 + req.body.to.split(":")[1];
  }
  if (hoursStart > 24 || hoursend > 24 || hoursStart < 0 || hoursend < 0) {
    res.status(400).json({
      success: false,
      message: "hours is more than 24 or less than 0 ",
    });
  }
  if (
    minutesstart > 59 ||
    minutesend > 59 ||
    minutesstart < 0 ||
    minutesend < 0
  ) {
    res.status(400).json({
      success: false,
      message: "minutes is more than 59 or less than 0 ",
    });
  }

  let datestart = new Date(`2024-01-01T${hoursStart}:${minutesstart}:00.000Z`);
  let dateend = new Date(`2024-01-01T${hoursend}:${minutesend}:00.000Z`);

  let diff = dateend.getTime() - datestart.getTime();
  let diffdate = new Date(diff);

  const time = await Time.create({
    day: req.body.day,
    month: req.body.month,
    year: req.body.year,
    from: req.body.from,
    to: req.body.to,
    duration: `${diffdate.getUTCHours()}:${diffdate.getUTCMinutes()}`,
    admin: admin._id,
    volunteer: volunteer._id,
    volunteerName: volunteer.name,
    adminName: admin.name,
  });

  admin.times.push({
    timeid: time,
    day: req.body.day,
    month: req.body.month,
    year: req.body.year,
    from: req.body.from,
    to: req.body.to,
    duration: `${diffdate.getUTCHours()}:${diffdate.getUTCMinutes()}`,
    admin: admin._id,
    volunteer: volunteer._id,
    volunteerName: volunteer.name,
    adminName: admin.name,
  });
  volunteer.times.push({
    timeid: time,
    day: req.body.day,
    month: req.body.month,
    year: req.body.year,
    from: req.body.from,
    to: req.body.to,
    duration: `${diffdate.getUTCHours()}:${diffdate.getUTCMinutes()}`,
    admin: admin._id,
    volunteer: volunteer._id,
    volunteerName: volunteer.name,
    adminName: admin.name,
  });

  const duarationsss = [];
  volunteer.times.forEach((t) => {
    duarationsss.push(t.duration);
  });

  volunteer.totalTImes = calculateTotalDuration(duarationsss);

  await admin.save({ validateModifiedOnly: true });
  await volunteer.save({ validateModifiedOnly: true });
  res.status(201).json({
    status: "success",
    data: {
      time,
    },
  });
});

exports.editTime = asyncErrorHandler(async (req, res, next) => {
  console.log(req.params.id);
  const time = await Time.findById(req.params.id);
  if (!time) {
    return next(new CustomError("No time found with that ID", 404));
  }

  let hoursStart = req.body.from.split(":")[0];
  if (hoursStart < 10) {
    hoursStart = 0 + req.body.from.split(":")[0];
  }
  let minutesstart = req.body.from.split(":")[1];
  if (minutesstart < 10) {
    minutesstart = 0 + req.body.from.split(":")[1];
  }
  let hoursend = req.body.to.split(":")[0];
  if (hoursend < 10) {
    hoursend = 0 + req.body.to.split(":")[0];
  }
  let minutesend = req.body.to.split(":")[1];
  if (minutesend < 10) {
    minutesend = 0 + req.body.to.split(":")[1];
  }
  if (hoursStart > 24 || hoursend > 24 || hoursStart < 0 || hoursend < 0) {
    res.status(400).json({
      success: false,
      message: "hours is more than 24 or less than 0 ",
    });
  }
  if (
    minutesstart > 59 ||
    minutesend > 59 ||
    minutesstart < 0 ||
    minutesend < 0
  ) {
    res.status(400).json({
      success: false,
      message: "minutes is more than 59 or less than 0 ",
    });
  }

  let datestart = new Date(`2024-01-01T${hoursStart}:${minutesstart}:00.000Z`);
  let dateend = new Date(`2024-01-01T${hoursend}:${minutesend}:00.000Z`);

  let diff = dateend.getTime() - datestart.getTime();
  let diffdate = new Date(diff);

  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    res.status(404).json({ message: "the admin was not found" });
  }
  const volunteer = await Volunteer.findOne({ name: req.body.volunteerName }); //
  if (!volunteer) {
    res.status(404).json({ message: "the volunteer was not found" });
  }

  let admintimeobject = admin.times.filter((obj) => {
    return obj.timeid.toString() === time._id.toString();
  });
  let volunteertimeobject = volunteer.times.find((obj) => {
    return obj.timeid.toString() == time._id.toString();
  });

  time.from = req.body.from;
  time.to = req.body.to;
  time.duration = `${diffdate.getUTCHours()}:${diffdate.getUTCMinutes()}`;
  time.date = Date.now();
  time.admin = admin._id;

  if (!admintimeobject || !volunteertimeobject) {
    res.status(404).json({ message: "time not found in admin or volunteer" });
    return;
  }
  console.log(admintimeobject);
  console.log(volunteertimeobject);
  admintimeobject[0].from = req.body.from;
  admintimeobject[0].to = req.body.to;
  admintimeobject[0].duration = `${diffdate.getUTCHours()}:${diffdate.getUTCMinutes()}`;
  admintimeobject[0].date = Date.now();
  admintimeobject[0].admin = admin._id;

  volunteertimeobject.from = req.body.from;
  volunteertimeobject.to = req.body.to;
  volunteertimeobject.duration = `${diffdate.getUTCHours()}:${diffdate.getUTCMinutes()}`;
  volunteertimeobject.date = Date.now();
  volunteertimeobject.admin = admin._id;

  let duarationsss = [];
  volunteer.times.forEach((t) => {
    duarationsss.push(t.duration);
  });
  volunteer.totalTImes = calculateTotalDuration(duarationsss);
  time.save({ validateBeforeSave: false });
  volunteer.save({ validateBeforeSave: false });
  admin.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    data: {
      newTime: time,
    },
  });
});

exports.getTimes = asyncErrorHandler(async (req, res, next) => {
  console.log(req.query);

  const day = req.query.day;
  const month = req.query.month;
  const year = req.query.year;

  if ((day, month, year)) {
    const times = await Time.find({
      day: day,
      month: month,
      year: year,
    });
    res.status(200).json({
      status: "success",
      data: times,
    });
  }
});

exports.getTimesMonth = asyncErrorHandler(async (req, res, next) => {
  console.log(req.query);

  const month = req.query.month;
  const year = req.query.year;

  if ((month, year)) {
    const times = await Time.find({
      month: month,
      year: year,
    });
    res.status(200).json({
      status: "success",
      data: times,
    });
  }
});

exports.deleteTime = asyncErrorHandler(async (req, res, next) => {
  console.log(req.params.id);
  const time = await Time.findById(req.params.id);
  if (!time) {
    return next(new CustomError("No time found with that ID", 404));
  }
  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    res.status(404).json({ message: "the admin was not found" });
  }
  const volunteer = await Volunteer.findOne({ name: time.volunteerName }); //
  if (!volunteer) {
    res.status(404).json({ message: "the volunteer was not found" });
  }

  const filteredADmintimes = admin.times.filter(
    (timee) => timee.timeid.toString() !== time._id.toString()
  );
  const filteredVlounteertimes = volunteer.times.filter((timee) => {
    return timee.timeid.toString() !== time._id.toString();
  });

  console.log(filteredADmintimes);

  admin.times = filteredADmintimes;
  volunteer.times = filteredVlounteertimes;
  const duarationsss = [];
  volunteer.times.forEach((t) => {
    duarationsss.push(t.duration);
  });
  volunteer.totalTImes = calculateTotalDuration(duarationsss);

  await admin.save({ validateModifiedOnly: true });
  await volunteer.save({ validateModifiedOnly: true });
  await time.deleteOne({ id: time._id });

  res.status(200).json({
    success: true,
    message: "Time deleted successfully",
  });
});
