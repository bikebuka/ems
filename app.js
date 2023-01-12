require('dotenv').config();
const cors = require('cors')
const fs = require("fs");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
let bodyParser=require("body-parser")

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const customCss = fs.readFileSync((process.cwd()+"/swagger.css"), 'utf8');
const { logger } = require('./middlewares/logEvents')
const credentials = require('./middlewares/credentials')
const indexRouter = require('./routes/index');
//auth router
const authRouter=require("./routes/auth")
//users
const userRouter=require("./routes/user")
//agencies
const agencyRouter = require('./routes/agency');
//agent
const agentRouter = require('./routes/agent');
//properties
const propertyRouter=require("./routes/property")
//property units
const unitRouter=require("./routes/unit")
//tenants
const tenantRouter=require("./routes/tenant")
//rents
const rentRouter=require("./routes/rent")

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(BenchmarkMiddleware.benchmark)
app.use(bodyParser.json({limit: '200mb', extended: true}))
app.use(logger);
app.use(credentials);
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {customCss}));


let version = process.env.API_VERSION;

app.use(`/api/${version}/`, indexRouter);
//auth service
app.use(`/api/${version}/auth`, authRouter);
//users
app.use(`/api/${version}/users`, userRouter);
//agents
app.use(`/api/${version}/agents`, agentRouter);
//agencies
app.use(`/api/${version}/agencies`, agencyRouter);
//properties
app.use(`/api/${version}/properties`, propertyRouter);
//units
app.use(`/api/${version}/units`, unitRouter);
//tenants
app.use(`/api/${version}/tenants`, tenantRouter);
//Record rent payments
app.use(`/api/${version}/rents`, rentRouter);
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

module.exports = app;
