var chai = require('chai');
var io = require('socket.io-client')
var app = require('../index');
var client = io('http://localhost:3001');
 
console.log('Server started...Waiting for client connection...');
it('Client connected...', function(done) {
  client.on('connect', function (data) {
    done();
  });
});
