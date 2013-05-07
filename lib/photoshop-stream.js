var psEval = require('./photoshop-eval')
var net = require('net')
var PassThrough = require('readable-stream').PassThrough

exports.createStream = createSingleUseTCPStream

function createSingleUseTCPStream(callback){
  var outputPassThrough = new PassThrough()
  
  outputPassThrough._read = function(){
    outputPassThrough._read = function(){}
    
    var server = net.createServer()
    var _host = '0.0.0.0'
    var _port = 8042
    server.listen(_port)

    server.on('listening', function(){
      callback(null, _host + ':' + _port)
    })
    server.on('error', function(error){
      if (error.code == 'EADDRINUSE') {
        outputPassThrough.emit('log', 'Address ' + _port + ' in use')
        server.listen(++_port, _host)
        return
      }
      outputPassThrough.emit('error', error)
    })
    server.on('connection', function(client){
      outputPassThrough.emit('log', _host + ':' + _port)
      
      client.on('data', outputPassThrough.push.bind(outputPassThrough))
      client.on('error', outputPassThrough.emit.bind(outputPassThrough, 'error'))
      client.on('end', server.close.bind(server))
    })
    server.on('close', function(){
      outputPassThrough.emit('log', 'close')
      outputPassThrough.push(null)
    })
  }
  return outputPassThrough
}


exports.psStream = psStream

function psStream(fn, args){
  var outputPassThrough = createSingleUseTCPStream(function(error, address){
    var result = psEval(applyStream_jsx, [fn, address].concat(args))
    // don't pass the return value of psEval since we're streaming the results instead
    result.on('data', outputPassThrough.emit.bind(outputPassThrough, 'log'))
    result.on('log', outputPassThrough.emit.bind(outputPassThrough, 'log'))
    result.on('error', outputPassThrough.emit.bind(outputPassThrough, 'error'))
    result.on('end', outputPassThrough.end.bind(outputPassThrough))
  })
  return outputPassThrough
}

function applyStream_jsx(fn, address){
  var args = Array.prototype.slice.call(arguments, 2)
  var socket = new Socket, result
  if (socket.open(address)){
    return fn.apply(null, [socket].concat(args))
  }
  throw Error('Cannot open socket for address "' + address + '"')
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
