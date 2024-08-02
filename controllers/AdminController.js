let Admin = require("./../models/adminModel");
const jwt = require("jsonwebtoken");
const util = require("util");
const CustomError = require("./../utils/CustomError");
const asyncErrorHandler = require("./../utils/asynsErrorHandler");
const crypto = require("crypto");
const asynsErrorHandler = require("./../utils/asynsErrorHandler");
const sendEmail = require("./../utils/email");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

exports.login = asyncErrorHandler(async (req, res, next) => {
  const { name, password } = req.body;

  console.log(name, password);

  if (!name || !password) {
    const error = new CustomError(
      "please enter name and password to login!",
      400
    );
    return next(error);
  }

  const admiin = await Admin.findOne({ name }).select("+password");

  if (
    !admiin ||
    !(await admiin.comparePasswordInDB(password, admiin.password))
  ) {
    const error = new CustomError("Incorrect Email Or Password!", 400);
    return next(error);
  }

  const token = signToken(admiin._id);
  res
    .status(200)
    .cookie("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      status: "success",
      token,
      data: {
        Admin: admiin,
      },
    });
  console.log(Admin);
});

exports.addAdmin = asynsErrorHandler(async (req, res, next) => {
  console.log(" adding admin");
  const newAdmin = await Admin.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      Admin: newAdmin,
    },
  });
});

let token;
exports.protect = asyncErrorHandler(async (req, res, next) => {
  console.log("protect entered");
  // 1. read the token & check if exist
  const testToken = req.headers.authorization;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    next(new CustomError("you are not logged in!", 401));
  }

  // 2. validate the token

  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );

  console.log(decodedToken);

  // 3. if the Admin exists

  const admin = await Admin.findById(decodedToken.id);

  if (!admin) {
    const error = new CustomError(
      "the admin with the given token does not exist",
      401
    );
    next(error);
  }

  // 4. if the Admin changeed password after the token was issued
  if (await admin.isPasswordChanged(decodedToken.iat)) {
    const error = new CustomError(
      "the password has been changed recently. please login again",
      401
    );
    return next(error);
  }
  // 5. allow Admin to access route
  req.admin = admin;

  next();
});

exports.getTimes = asynsErrorHandler(async (req, res, next) => {
  const Alltimes = await req.admin.times;
  res.status(200).json({
    status: "success",
    data: {
      Alltimes,
    },
  });
});

// exports.forgotPasword = asyncErrorHandler(async (req, res, next) => {
//   // get admin based on his Email
//   const admin = await Admin.findOne({ name: req.body.name });
//   if (!admin) {
//     const err = new CustomError(
//       "we couldn't find the ADMIN with the given name",
//       404
//     );
//     next(err);
//   }

//   if (!admin.email) {
//     const err = new CustomError(
//       "there is no email for you admin in the database",
//       404
//     );
//     next(err);
//   }

//   // generate a random Reset Token
//   const resetToken = Admin.createResetPasswordToken();
//   await admin.save({ validateBeforeSave: false });
//   // send the token back to the admin email
//   const resetURL = `${req.protocol}://${req.get(
//     "host"
//   )}/resetPassword/${resetToken}`;
//   const message = `we have recived a password reset request. use the link below to reset your password\n\n${resetURL}\n\n this url will be valid for just 10 minutes`;

//   try {
//     await sendEmail({
//       email: Admin.email,
//       subject: "password change request",
//       message: message,
//     });
//     res.status(200).json({
//       status: "success",
//       message: "password reset send to the admin email",
//     });
//   } catch (err) {
//     admin.passwordResetToken = undefined;
//     admin.passwordResetTokenExpires = undefined;
//     admin.save({ validateBeforeSave: false });
//     console.log(err.message);
//     return next(
//       new CustomError(
//         "there was an error sending pasword reset email. please try again later",
//         500
//       )
//     );
//   }
// });

// exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
//   const token = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");
//   const admin = await Admin.findOne({
//     passwordResetToken: token,
//     passwordResetTokenExpires: { $gt: Date.now() },
//   });
//   if (!admin) {
//     const err = new CustomError("token is invalid or has expired!", 400);
//     next(err);
//   }
//   admin.password = req.body.password;
//   admin.confirmPassword = req.body.confirmPassword;
//   admin.passwordResetToken = undefined;
//   admin.passwordResetTokenExpires = undefined;
//   admin.passwordChangedAt = Date.now();
//   admin.save({ validateBeforeSave: true });

//   const logintoken = signToken(admin._id);
//   res.status(200).json({
//     status: "success",
//     token: logintoken,
//   });
// });

// exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
//   const admin = await Admin.findById(req.admin.id).select("+password");
//   if (
//     !(await Admin.comparePasswordInDB(req.body.CurrentPassword, admin.password))
//   ) {
//     return next(new CustomError("Your current password is wrong", 401));
//   }

//   admin.password = req.body.password;
//   admin.confirmPassword = req.body.confirmPassword;
//   admin.passwordChangedAt = Date.now();

//   await admin.save({ validateBeforeSave: true });
//   const token = signToken(admin._id);
//   res.status(200).json({
//     status: "success",
//     token,
//   });
// });

exports.updatephoto = asyncErrorHandler(async (req, res, next) => {
  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    const error = new CustomError(
      "the admin with the given token does not exist",
      401
    );
    next(error);
  }
  admin.photo = req.body.updatephoto;
  await admin.save({ validateModifiedOnly: true });
  res.status(200).json({
    status: "success",
  });
});
