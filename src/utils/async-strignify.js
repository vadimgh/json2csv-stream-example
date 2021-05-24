process.on('message', function (message) {
  try {
    process.send({ error: null, result: JSON.stringify(message.data), processId: message.processId });
  } catch (err) {
    process.send({ error: err, result: null, processId: message.processId });
  }
});
