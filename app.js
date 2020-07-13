var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dessertsRouter = require('./routes/desserts')

var app = express();
mongoose
  .connect("mongodb://localhost/w11-final-project", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to MongoDB..."))
  .catch((err) => console.error("failed to connect to MongoDB...", err));


app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cors()); // didn't npm install yet

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/desserts', dessertsRouter)

module.exports = app;
