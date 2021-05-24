/*
 * src/controllers/csv.js
 */
'use strict';

const fs = require('fs');
const { createWriteStream } = require('fs');
const path = require('path');
const { AsyncParser } = require('json2csv');
const { createGzip } = require('zlib');

const createCsvMock = async (req, res, next) => {
  try {
    const input = fs.createReadStream(path.join(__dirname, '/../../', 'storage', 'data.json'));
    const asyncParser = new AsyncParser();
     const output = createWriteStream(path.join(__dirname, '/../../', 'storage', 'file.csv'), { encoding: 'utf8' });
    asyncParser.fromInput(input).toOutput(output)
    res.send(200, { success: true, message: 'Csv created' });
  } catch (err) {
    res.send(500, { success: false, message: 'Cannot generate csv' });
    console.log('Error creating csv', err);
  }
};

const createZipMock = async (req, res, next) => {
  try {
    const input = fs.createReadStream(path.join(__dirname, '/../../', 'storage', 'data.json'));
    const asyncParser = new AsyncParser();
     const output = createWriteStream(path.join(__dirname, '/../../', 'storage', 'file.gz'), { encoding: 'utf8' });
     const gzip = createGzip();
    asyncParser.fromInput(input).throughTransform(gzip).toOutput(output)
    res.send(200, { success: true, message: 'Archive created' });
  } catch (err) {
    res.send(500, { success: true, message: 'Cannot generate archive' });
    console.log('Error creating archive', err);
  }
};

const createZipToResMock = async (req, res, next) => {
  try {
    const input = fs.createReadStream(path.join(__dirname, '/../../', 'storage', 'data.json'));
    const asyncParser = new AsyncParser();
     const gzip = createGzip();
    asyncParser.fromInput(input).throughTransform(gzip).toOutput(res)
  } catch (err) {
    res.send(500, { success: true, message: 'Cannot generate archive' });
    console.log('Error creating archive', err);
  }
};

exports.createCsvMock = createCsvMock;
exports.createZipMock = createZipMock;
exports.createZipToResMock = createZipToResMock;
