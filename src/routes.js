/**
 * app/routes.js
 */

'use strict';

const mainCtrl = require('./controllers/main');
const csvCtrl = require('./controllers/csv');

module.exports = function (app) {
  app.get('/api/hello', mainCtrl.hello);

  app.get('/api/create-csv', csvCtrl.createCsvMock);

  app.get('/api/create-gzip', csvCtrl.createZipMock);

  app.get('/api/create-res-gzip', csvCtrl.createZipToResMock);

  app.get(
    '/api/create-res-gzip-tr',
    csvCtrl.createZipToResMockWithTrasformStream
  );

  app.get('/api/create-res-gzip-ch-pr', csvCtrl.createZipToResMockWithChildPr);

  // not found
  app.all('/*', function (req, res) {
    res.send(404, { success: false, message: 'Not found' });
  });
};
