const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./convig.env" });
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
let dbnamee;
if (process.env.NODE_ENV == "production") {
  dbnamee = "57357Production";
} else if (process.env.NODE_ENV == "development") {
  dbnamee = "57357Development";
}

const app = require("./app");
mongoose.connect(process.env.CONN_STR, { dbName: dbnamee }).then((CONN) => {
  console.log("DB COnnection Successful");
});

const port = process.env.PORT;
console.log(process.env.PORT);
const server = app.listen(port, () => {
  console.log("server has started in port..." + `${port}`);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
