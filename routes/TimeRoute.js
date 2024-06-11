const express = require("express");
const TimeController = require("../controllers/TimeController");
const adminController = require("../controllers/AdminController");

const router = express.Router();
router
  .route("/addtime")
  .post(adminController.protect, TimeController.createTime);
router
  .route("/editTime/:id")
  .patch(adminController.protect, TimeController.editTime);
module.exports = router;
