const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cookiesMiddleware = require("universal-cookie-express");
let app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cookiesMiddleware());
app.use(express.static("./public"));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    withCredentials: true,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const timeRoute = require("./routes/TimeRoute");
const adminRoute = require("./routes/AdminRoute");
const volunteerRoute = require("./Routes/VolunteerRoute");

app.use("/home", (req, res, next) => {
  console.log(req.headers.authorization);
  // res.cookie("ff", "nn", { path: "/" }).json(req.cookies);app
});
app.use("/admin", adminRoute);
app.use("/times", timeRoute);
app.use("/volunteer", volunteerRoute);

// app.use(globalErrorHandler);

app.use(express.static("public"));

module.exports = app;
