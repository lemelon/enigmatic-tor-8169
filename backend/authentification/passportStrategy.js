/////////////////////////////////////////////////////////////////
// MODULE DEPENDENCIES //////////////////////////////////////////
/////////////////////////////////////////////////////////////////
var passport = require('passport');
var mongoose = require('mongoose');
var User     = mongoose.model('User');

/////////////////////////////////////////////////////////////////
// AUTHENTIFICATION STRATEGY ////////////////////////////////////
/////////////////////////////////////////////////////////////////
module.exports = function(app) {
  'use strict';
  ///////////////////////////////////////////////////////////////
  // USE PASSPORT SESSION ///////////////////////////////////////
  ///////////////////////////////////////////////////////////////
  app.use(passport.initialize());
  passport.use(User.createStrategy());
};
