/**
 * src/app.js
 */

'use strict';

const express = require('express');

module.exports = function (app, config, passport) {
  // main app configuration
  app.set('port', process.env.PORT);
  app.use(express.bodyParser());
  app.use(express.logger('dev'));
  app.use(app.router);
};
