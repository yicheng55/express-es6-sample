#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app';
import debugLib from 'debug';
import http from 'http';
import { spawn } from 'child_process';
import { join } from 'path';

// import rfidhandle from '../rfidhandle.js';
const rfidp = join(__dirname, '../rfidhandle.js');

//2nd Reader
const AL510data = spawn('node', [rfidp]);

AL510data.stdout.on('data', (data) => {
    console.log(data.toString());
});

AL510data.stderr.on('data', (data) => {
    console.error(`grep 的 stderr: ${data}`);
});

AL510data.on('close', (code) => {
    if (code !== 0) {
        console.log(`rawdatadb.js 进程退出，退出码 ${code}`);
    }
});

var debug = debugLib('myapp:server');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on ' + bind);
}
