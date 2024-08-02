const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please inter your first name"],
    unique: [true, "this name is already please login with your password"],
  },

  photo: String,

  password: {
    type: String,
    required: [true, "please anter a password"],
    minlength: 8,
    select: false,
  },

  confirmPassword: {
    type: String,
    required: [true, "please anter a password"],
    validate: {
      // this will only work in save() and create() ;
      validator: function (val) {
        console.log(val);
        console.log(this.password);
        return val == this.password;
      },
      message: "password and confirm password does not match!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,

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
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

adminSchema.methods.comparePasswordInDB = async function (pswd, pswdDB) {
  return await bcrypt.compare(pswd, pswdDB);
};

adminSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const pswdChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < pswdChangedTimestamp;
  }
  return false;
};

adminSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  // console.log(resetToken, this.passwordResetToken);
  return resetToken;
};

const admin = mongoose.model("admin", adminSchema);
module.exports = admin;
