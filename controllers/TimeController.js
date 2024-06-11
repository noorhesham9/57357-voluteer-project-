let Time = require("./../models/TimeModel");
const CustomError = require("./../utils/CustomError");
const asyncErrorHandler = require("./../utils/asynsErrorHandler");
let Admin = require("./../models/adminModel");
let Volunteer = require("./../models/VoluteerModel");

// function getDuration(startTime, endTime) {
//   // return `${diffdate.getUTCHours()}:${diffdate.getUTCMinutes()}`
// }

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
    from: req.body.from,
    to: req.body.to,
    duration: `${diffdate.getUTCHours()}:${diffdate.getUTCMinutes()}`,
    admin: admin._id,
    volunteer: volunteer._id,
  });

  admin.times.push(time);
  volunteer.times.push(time);

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
  const volunteer = await Volunteer.findOne({ name: req.body.volunteer });
  if (!volunteer) {
    res.status(404).json({ message: "the volunteer was not found" });
  }
  time.from = req.body.from;
  time.to = req.body.to;
  time.duration = `${diffdate.getUTCHours()}:${diffdate.getUTCMinutes()}`;
  time.date = req.body.date;
  time.admin = admin._id;
  time.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    data: {
      newTime: time,
    },
  });
});
