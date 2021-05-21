/*
 * src/controllers/csv.js
 */
'use strict';

const fs = require('fs');
const { createWriteStream } = require('fs');
const path = require('path');
const { AsyncParser } = require('json2csv');

const createCsvMock = async (req, res, next) => {
  try {
    const input = fs.createReadStream(path.join(__dirname, '/../../', 'storage', 'data.json'));
    const asyncParser = new AsyncParser();
     const output = createWriteStream(path.join(__dirname, '/../../', 'storage', 'file.csv'), { encoding: 'utf8' });
    asyncParser.fromInput(input).toOutput(output)
    res.send(200, { success: true, message: 'Csv created' });
  } catch (err) {
    res.send(500, { success: true, message: 'Cannot generate csv' });
    console.log('Error creating csv', err);
  }
};

exports.createCsvMock = createCsvMock;
