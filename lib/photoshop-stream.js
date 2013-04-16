var psEval = require('./photoshop-eval')
var net = require('net')
var Stream = require('stream')

exports.createStream = createSingleUseTCPStream

function createSingleUseTCPStream(callback){
  var outputStream = new Stream
  outputStream.readable = true
  
  var server = net.createServer()
  var _host = '0.0.0.0'
  var _port = 8042
  server.listen(_port)
  
  server.on('error', function(error){
    if (error.code == 'EADDRINUSE') {
      console.log('Address ' + _port + ' in use')
      server.listen(++_port, _host)
    }
  })
  server.on('connection', function(client){
    outputStream.emit('log', _host + ':' + _port)
    client.on('data', outputStream.emit.bind(outputStream, 'data'))
    client.on('error', outputStream.emit.bind(outputStream, 'error'))
    server.on('error', outputStream.emit.bind(outputStream, 'error'))
    client.on('end', server.close.bind(server))
  })
  server.on('close', function(){
    console.log('close')
    outputStream.emit('log', 'close')
    outputStream.emit('end')
  })
  server.on('listening', function(){
    callback(null, _host + ':' + _port)
  })
  return outputStream
}


exports.psStream = psStream

function psStream(fn){
  if (typeof fn != 'function') throw Error('fn must be a function');
  
  var outputStream = createSingleUseTCPStream(function(error, address){
    var resultStream = psEval(';(' + fn.toString() + ')(' + outputStream_jsx.toString() + '(' + JSON.stringify(address) + '))')
    resultStream.on('log', outputStream.emit.bind(outputStream, 'log'))
    resultStream.on('data', outputStream.emit.bind(outputStream, 'log'))
    resultStream.on('error', outputStream.emit.bind(outputStream, 'error'))
  })
  return outputStream
}

function outputStream_jsx(address){
  var socket = new Socket
  socket.open(address, 'UTF-8')
  return socket
}

if (!module.parent) process.nextTick(function(){
  
  require('../test/test-stream-basic')
  require('../test/test-stream-multiple')
  
})
