const express = require("express");
const adminController = require("./../controllers/AdminController");
const router = express.Router();
router.route("/login").post(adminController.login);
router.route("/addAdmin").post(adminController.addAdmin);
router
  .route("/getTimes")
  .get(adminController.protect, adminController.getTimes);

module.exports = router;
