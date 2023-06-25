var chai = require('chai');
var io = require('socket.io-client');
var app = require('../index');

console.log('Server started...Waiting for client connection...');

describe('Client Connection', function() {
  // Function to check if a port is in use
  function isPortInUse(port) {
    return new Promise((resolve, reject) => {
      const net = require('net');
      const server = net.createServer()
        .once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            resolve(true);
          } else {
            reject(err);
          }
        })
        .once('listening', () => {
          server.close(() => {
            resolve(false);
          });
        })
        .listen(port);
    });
  }

  before(async function() {
    const port = 3000;
    const isPortUsed = await isPortInUse(port);
    if (!isPortUsed) {
      console.log('Server is not running on port 3000. Starting the server...');
      // Start the server if it's not running already
      // Your code to start the server here
    } else {
      console.log('Server is already running on port 3000.');
    }
  });

  it('should connect to the server', function(done) {
    const client = io('http://localhost:3000');
    client.on('connect', function() {
      done();
    });
  });
});
