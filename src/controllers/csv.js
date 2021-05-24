/*
 * src/controllers/csv.js
 */
'use strict';

const fs = require('fs');
const { createWriteStream } = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const { AsyncParser } = require('json2csv');
const { createGzip } = require('zlib');
const { Readable, Transform } = require('stream');
const fork = require('child_process').fork;
const stringnifyPr = fork(path.join(__dirname, '..', 'utils', 'async-strignify.js'));

const createCsvMock = async (req, res, next) => {
  try {
    const input = fs.createReadStream(
      path.join(__dirname, '/../../', 'storage', 'data.json')
    );
    const asyncParser = new AsyncParser();
    const output = createWriteStream(
      path.join(__dirname, '/../../', 'storage', 'file.csv'),
      { encoding: 'utf8' }
    );
    asyncParser.fromInput(input).toOutput(output);
    res.send(200, { success: true, message: 'Csv created' });
  } catch (err) {
    res.send(500, { success: false, message: 'Cannot generate csv' });
    console.log('Error creating csv', err);
  }
};

const createZipMock = async (req, res, next) => {
  try {
    const input = fs.createReadStream(
      path.join(__dirname, '/../../', 'storage', 'data.json')
    );
    const asyncParser = new AsyncParser();
    const output = createWriteStream(
      path.join(__dirname, '/../../', 'storage', 'file.gz'),
      { encoding: 'utf8' }
    );
    const gzip = createGzip();
    asyncParser.fromInput(input).throughTransform(gzip).toOutput(output);
    res.send(200, { success: true, message: 'Archive created' });
  } catch (err) {
    res.send(500, { success: false, message: 'Cannot generate archive' });
    console.log('Error creating archive', err);
  }
};

const createZipToResMock = async (req, res, next) => {
  try {
    const input = fs.createReadStream(
      path.join(__dirname, '/../../', 'storage', 'data.json')
    );
    const asyncParser = new AsyncParser();
    const gzip = createGzip();
    asyncParser.fromInput(input).throughTransform(gzip).toOutput(res);
  } catch (err) {
    res.send(500, { success: false, message: 'Cannot generate archive' });
    console.log('Error creating archive', err);
  }
};

const createZipToResMockWithTrasformStream = async (req, res, next) => {
  try {
    let data = await fsPromises.readFile(
      path.join(__dirname, '/../../', 'storage', 'data.json'),
      { encoding: 'utf-8' }
    );
    // receive array of object (by test terms)
    data = JSON.parse(data);
    const asyncParser = new AsyncParser();
    const gzip = createGzip();
    const input = new Readable({
      objectMode: true,
      read() {
        const item = data.pop();
        if (!item) {
          this.push(null);
          return;
        }
        this.push(item);
      },
    });
    const stringify = new Transform({
      writableObjectMode: true,
      transform(chunk, encoding, callback) {
        const data = JSON.stringify(chunk);
        callback(null, data);
      },
    });
    asyncParser
      .fromInput(input.pipe(stringify))
      .throughTransform(gzip)
      .toOutput(res);
  } catch (err) {
    res.send(500, { success: false, message: 'Cannot generate archive' }, err);
    console.log('Error creating archive', err);
  }
};


const createZipToResMockWithChildPr = async (req, res, next) => {
  const strignifyCallers = {};

  stringnifyPr.on('message', function (message) {
    if (message.error) strignifyCallers[message.processId].reject(message.error);
    strignifyCallers[message.processId].resolve(message.result);
  });

  let processId = 0;
  const strignify = message => {
    return new Promise((resolve, reject) => {
      strignifyCallers[message.processId] = { resolve, reject };
      stringnifyPr.send({ data: message.data, processId: message.processId });
    });
  };

  try {
    let data = await fsPromises.readFile(
      path.join(__dirname, '/../../', 'storage', 'data.json'),
      { encoding: 'utf-8' }
    );
    // receive array of object (by test terms)
    data = JSON.parse(data);
    const asyncParser = new AsyncParser();
    const gzip = createGzip();

    async function* gen(data) {
      for (const item of data) {
        yield strignify({ data: item, processId });
        processId++;
      }
    }

    const input = Readable.from(gen(data), {
      encoding: 'utf-8',
    });

    asyncParser.fromInput(input).throughTransform(gzip).toOutput(res);
  } catch (err) {
    res.send(500, { success: false, message: 'Cannot generate archive' }, err);
    console.log('Error creating archive', err);
  }
};

exports.createCsvMock = createCsvMock;
exports.createZipMock = createZipMock;
exports.createZipToResMock = createZipToResMock;
exports.createZipToResMockWithTrasformStream =
  createZipToResMockWithTrasformStream;
exports.createZipToResMockWithChildPr = createZipToResMockWithChildPr;
