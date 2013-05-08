#!/usr/bin/env node

var lockFile = require('lockfile')
var Stream = require('stream')
var spawn = require('child_process').spawn

var lockPath = process.env.HOME + '/.evalInPhotoshop.lock'

var lockOptions = {
  wait: 5*1000,
  stale: 30*1000,
}

function unsafeEvalInPhotoshop(script, stream){
  stream.emit('log', ['unsafeEvalInPhotoshop', script])
  var args = []
  
  args.push("-e", 'on run argv')
  args.push("-e",   'tell application "Adobe Photoshop CS6" to do javascript (item 1 of argv)' + (module.exports.debug ? ' show debugger on runtime error' : ''))
  args.push("-e", 'end run')
  
  args.push(script)
  
  var child = spawn('/usr/bin/osascript', args)
  
  child.stdout.on('open', stream.emit.bind(stream, 'open'))
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

function evalInPhotoshop(fn, args){
  var output = new Stream
  output.readable = true
  lockFile.lock(lockPath, lockOptions, function(error, fileDescriptor){
    if (error) return output.emit('error', error);
    
    unsafeEvalInPhotoshop(functionToExtendScript(fn, args), output)
    
    output.on('end', function(){
      lockFile.unlock(lockPath, function(error){
        if (error) output.emit('error', error);
      })
    })
  })
  return output
}

function functionToExtendScript(fn, args){
  if (args == null) args = []
  else if (!Array.isArray(args)) args = [args]
  
  var script, _header = []
  
  if (typeof fn == 'function'){
    script = ';(' + fn.toString() + ')'
  } else {
    script = String(fn)
  }
  
  if (args.length > 0 || typeof fn == 'function'){
    script += '('
    script += args.map(function(arg){
      if (typeof arg == 'function'){
        if (arg.__jsx_prefix__) _header.push(arg.__jsx_prefix__)
        return arg.toString()
      }
      else {
        return JSON.stringify(arg)
      }
    }).join(', ')
    script += ')'
  }
  return _header.join('\n') +'\n'+ script
}


if (!module.parent){
  if (process.argv[2] == null){
    require('../test/test-photoshop-eval')
  }
  else {
    process.nextTick(function(){
      module.exports.debug = true
      module.exports(process.argv[2]).pipe(process.stdout)
    })
  }
}
