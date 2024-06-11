const express = require("express");
const VolunteerController = require("./../controllers/VolunteerController");
const AdminController = require("./../controllers/AdminController");
const router = express.Router();
router
  .route("/addvolunteer")
  .post(AdminController.protect, VolunteerController.addvolunteer);
router
  .route("/getTImes")
  .get(AdminController.protect, VolunteerController.getTImes);
router
  .route("/getvolunteers")
  .get(AdminController.protect, VolunteerController.getvolunteers);

module.exports = router;
