const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
const UserModel = require("./model/model");

/** Mongodb config**/
const connectionURL =
  "mongodb+srv://Ravindra:Y9MU89QY4WGWcmH@cluster1.ktlzo.mongodb.net/to-do-app?retryWrites=true&w=majority";

mongoose.connect(connectionURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.connection.on("error", (error) => console.log(error));
require("./auth/auth");

/***middlewares config */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

/***Routes config***/
const routes = require("./routes/routes");
const secureRoute = require("./routes/secure-route");

app.use("/", routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use("/user", passport.authenticate("jwt", { session: false }), secureRoute);

//Handle errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(3000, () => {
  console.log("Server started");
});
