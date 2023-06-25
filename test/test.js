var chai = require('chai');
var io = require('socket.io-client');
var app = require('../index');
var client = io('http://localhost:3000');

console.log('Server started...Waiting for client connection...');

describe('Client Connection', function() {
  it('should connect to the server', function(done) {
    client.on('connect', function() {
      done(); // Call done() to indicate the completion of the asynchronous operation
    });
  });
});
