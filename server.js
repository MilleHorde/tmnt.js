const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./controllers/index');
const pizzas = require('./controllers/pizzas');
const users = require('./controllers/users');
const ingredients = require('./controllers/ingredients');

const http = require('http');
const config = require('./config');
const tools = require('./tools');
const events = require('./events');

let app = express();
let port = tools.normalizePort(config.port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Load Models
require('./models').load(app, {useMongoClient: true});

app.use('/', index);
app.use('/pizzas', pizzas);
app.use('/users', users);
app.use('/ingredients', ingredients);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send(res.locals);
});

app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', tools.onError);
server.on('listening', () => tools.onListening(server));

module.exports = server;