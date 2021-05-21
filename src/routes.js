
/**
 * app/routes.js
 */

'use strict';

const mainCtrl = require('./controllers/main');
const csvCtrl = require('./controllers/csv');

module.exports = function (app) {

  app.get('/api/hello', mainCtrl.hello);

  app.get('/api/create-csv', csvCtrl.createCsvMock);

  // not found
  app.all('/*', function (req, res) { res.send(404, { success: false, message: 'Not found' }) });
};