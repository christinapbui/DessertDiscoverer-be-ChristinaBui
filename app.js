var express = require("express");
// var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

var routes = require("./routes");

var app = express();
mongoose
	.connect(process.env.DB_LOCAL, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log("connected to MongoDB..."))
	.catch((err) => console.error("failed to connect to MongoDB...", err));
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors()); // didn't npm install yet

app.use("/", routes);

module.exports = app;
