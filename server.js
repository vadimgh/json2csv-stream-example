const http = require('http');
const express = require('express');
const env = process.env.NODE_ENV || 'development';
const app = express();
const server = http.createServer(app);

// routes
require('./src/routes')(app);

// start server
server.listen(process.env.PORT, function () {
  console.log(
      ' server listening on port ' +
      process.env.PORT +
      ' for ' +
      env
  );
});
