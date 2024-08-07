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

//////////// delete time
router
  .route("/deleteTime/:id")
  .delete(adminController.protect, TimeController.deleteTime);

router.route("/getTimes").get(adminController.protect, TimeController.getTimes);
router
  .route("/getTimesMonth")
  .get(adminController.protect, TimeController.getTimesMonth);
module.exports = router;
