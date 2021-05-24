/*
 * src/controllers/main.js
 */

'use strict';


const hello = async (req, res) => {
  res.send(200, { success: true, message: 'Hello' });
};

exports.hello = hello;
