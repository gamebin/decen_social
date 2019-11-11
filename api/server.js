var https = require('https');

var express = require('express'),
  redirect = require('express-redirect');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var log4js = require('log4js'),
  fs = require('fs');

require('events').EventEmitter.defaultMaxListeners = 100;

// --- memwatch testing code ---
//const memwatch = require('memwatch-next');

//memwatch.on('leak', (info) => {
//  console.error('Memory leak detected:\n', info);
//});
// --- memwatch testing code end ---

var options = {
  // key: fs.readFileSync('key.pem'),
  // cert: fs.readFileSync('cert.pem')
};

//var $depth = 9; // node v0.12.2
var $depth = 10; // node v4.2.x above

var log_config = {
  appenders: [{
    type: "dateFile",
    filename: "logs/kshop_svr.log",
    pattern: ".yyyy-MM-dd",
    maxLogSize: 10485760,
    numBackups: 7,
    layout: {
      type: "pattern",
      pattern: "%d %p {%x{ln}} -\t%m",
      tokens: {
        ln: function() {
          return (new Error).stack.split("\n")[$depth]
            .replace(/^\s+at\s+(\S+)\s\((.+?)([^\/]+):(\d+):\d+\)$/, function() {
              return arguments[1] + ' ' + arguments[3] + ' line ' + arguments[4];
            });
        }
      }
    }
  }, {
    type: "console",
    layout: {
      type: "pattern",
      pattern: "%d %p {%x{ln}} -\t%m",
      tokens: {
        ln: function() {
          return (new Error).stack.split("\n")[$depth]
            // Just the namespace, filename, line:
            .replace(/^\s+at\s+(\S+)\s\((.+?)([^\/]+):(\d+):\d+\)$/, function() {
              return arguments[1] + ' ' + arguments[3] + ' line ' + arguments[4];
            });
        }
      }
    }
  }]
};

log4js.configure(log_config);

global.logger = log4js.getLogger('kshop_svr');

global.config = require('./config/config.json');
global.errorcode = require('./config/errorcode.json');
global.sequelConfig = require('./config/config.json');
logger.setLevel(config.loglevel);

var app = express();
redirect(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,Authorization,x-auth-token');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// --- heapdump testing code ---
// var heapdump = require('heapdump');
// var memoryLeak = [];
// function leakedObj(){};

// app.use('/leak', function(req, res, next) {
//   for (var i=0; i<1000; i++) {
//     memoryLeak.push(new leakedObj());
//   }
//   res.send('making memory leak. Current memory usage :' + (process.memoryUsage().rss / 1024 / 1024) + 'MB');
// });

// app.use('/heapdump', function(req, res, next) {
//   var filename = '/home/kiki/heapdump/' + Date.now() + '.heapsnapshot';
//   heapdump.writeSnapshot(filename);
//   res.send('Heapdump has been generated in ' + filename);
// });
// --- heapdump testing code end ---

// Auth Middleware - This will check if the token is valid
app.all('/*', [require('./middlewares/validateRequest')]);

app.use('/', require('./routes'));

app.use(function(err, req, res, next) {
  if (err) {
    logger.error('err:::%j', err);
    res.status(412)
    res.json({
      "message": err
    });
    return;
  } else next();
});

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var errorMessage = 'Not Found(undefined api check your request for get/post)';
  logger.error(errorMessage);
  res.status(404);
  res.json({
    "message": errorMessage
  });
  return;
});

// Start the server
if (config.mode == 'live')
  app.set('port', process.env.PORT || config.app_live.port);
else
  app.set('port', process.env.PORT || config.app_dev.port);
// app.set('s_port', process.env.S_PORT || config.app.s_port);

var server = app.listen(app.get('port'), function() {
  if (config.mode == 'live')
    logger.info(config.app_live.title + ' listening on port ' + server.address().port);
  else
    logger.info(config.app_dev.title + ' listening on port ' + server.address().port);
});

// var s_server = https.createServer(options, app).listen(app.get('s_port'), function() {
//   logger.info('HTTPS ' + config.app.title + ' listening on port ' + s_server.address().port);
// });
