require('dotenv').config();
const cors = require('cors')
const fs = require("fs");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');
const corsOptions = require('./utils/cors/corsOptions')
const { logger } = require('./middlewares/logEvents')
const AppResponseDto = require('./dto/response/app.response.dto');
const credentials = require('./middlewares/credentials')
const AuthenticationMiddleware = require('./middlewares/authentication.middleware')
const BenchmarkMiddleware = require('./middlewares/benchmark.middleware')

const indexRouter = require('./routes/index');
//auth router
const authRouter=require("./routes/auth")
const permissionRouter = require('./routes/permissions');
const roleRouter = require('./routes/roles')
const agencyRouter = require('./routes/agency');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(BenchmarkMiddleware.benchmark)
app.use(logger);
app.use(credentials);
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));


let version = process.env.API_VERSION;

app.use(`/api/${version}/`, indexRouter);
//auth service
app.use(`/api/${version}/auth`, authRouter);
//
app.use(`/api/${version}/agencies`, agencyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.use(function (req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });




module.exports = app;
