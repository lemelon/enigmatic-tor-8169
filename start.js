/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var http      = require('http');
var express   = require('express');
var mongoose  = require('mongoose');
var config    = require('./backend/db/database');
var multipart = require('connect-multiparty');
var chalk     = require('chalk');

console.log(chalk.blue('Launching dependencies ... please wait.'));

/////////////////////////////////////////////////////////////////
// CREATE AND CONFIG SERVER /////////////////////////////////////
/////////////////////////////////////////////////////////////////
var app = module.exports = express();

app.use(multipart({
  uploadDir: config.tmp
}));

/////////////////////////////////////////////////////////////////
// CONNECT TO DATABASE //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
require('./backend/db/mongo');

/////////////////////////////////////////////////////////////////
// CONFIG DATA MODELS ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////
console.log('check the models...');
require('./backend/models/models')(mongoose);
console.log(chalk.green('done'));

/////////////////////////////////////////////////////////////////
// CONFIGURE APPLICATION ////////////////////////////////////////
/////////////////////////////////////////////////////////////////
console.log('check the config...');
require('./backend/config/config')(app, express, config);
console.log(chalk.green('done'));

/////////////////////////////////////////////////////////////////
// PASSPORT AUTH STRATEGY ///////////////////////////////////////
/////////////////////////////////////////////////////////////////
console.log('check passportStrategy...');
require('./backend/authentification/passportStrategy.js')(app);
console.log(chalk.green('done'));

/////////////////////////////////////////////////////////////////
// ROUTES ///////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
console.log('check routes...');
require('./backend/routes/routes.js')(app);
console.log(chalk.green('done'));

/////////////////////////////////////////////////////////////////
// WEB SERVER /////////////////////////////////////
/////////////////////////////////////////////////////////////////
var server = http.createServer(app);

/////////////////////////////////////////////////////////////////
// SOCKET SERVER ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var chatServer = require('./backend/chatServer/chatServer')(server);

/////////////////////////////////////////////////////////////////
// START THE SERVER /////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
server.listen(process.env.PORT || 3000), function() {
  'use strict';
  console.log(chalk.green('Express server listening on port ' + process.env.PORT || 3000));
});
