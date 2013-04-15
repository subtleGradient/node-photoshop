#!/usr/bin/env node

var lockFile = require('lockfile')
var Stream = require('stream')
var spawn = require('child_process').spawn

var lockPath = process.env.HOME + '/.evalInPhotoshop.lock'

var lockOptions = {
  wait: 5*1000
}

function unsafeEvalInPhotoshop(script, stream){
  var args = []
  
  args.push("-e", 'on run argv')
  args.push("-e",   'tell application "Adobe Photoshop CS6" to do javascript (item 1 of argv) -- show debugger on runtime error')
  args.push("-e", 'end run')
  
  args.push(script)
  
  var child = spawn('/usr/bin/osascript', args)
  
  child.stdout.on('data', stream.emit.bind(stream, 'data'))
  
  var error = ''
  child.stderr.on('data', function(data){
    error += data
  })
  
  child.on('exit', function(code){
    if (code) stream.emit('error', error);
    else stream.emit('end')
  })
}


exports = module.exports = evalInPhotoshop

function evalInPhotoshop(script){
  var output = new Stream
  output.readable = true
  lockFile.lock(lockPath, lockOptions, function(error, fileDescriptor){
    if (error) return output.emit('error', error)
    unsafeEvalInPhotoshop(script, output)
    output.on('end', function(){
      lockFile.unlock(lockPath, function(error){
        if (error) output.emit('error', error);
      })
    })
  })
  return output
}

if (!module.parent) process.nextTick(function(){
  module.exports(process.argv[2] || '"Hello World"').pipe(process.stdout)
})
