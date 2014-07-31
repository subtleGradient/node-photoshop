#!/usr/bin/env node

var lockFile = require('lockfile')
var Readable = require('readable-stream').Readable
var spawn = require('child_process').spawn
var functionToExtendScript = require('./functionToExtendScript')
function noop(){}

var lockPath = process.env.HOME + '/.evalInAfterEffects.lock'

var lockOptions = {
  wait: 5*1000,
  stale: 30*1000,
}

exports = module.exports = evalInAfterEffects

var UID = 0

evalInAfterEffects.NAME = null;

evalInAfterEffects.getName = function(){
  if (evalInAfterEffects.NAME == null) {
    try {
      ;(function(error, Applications){
        if (Applications.indexOf('Adobe After Effects CC 2014') != -1) evalInAfterEffects.NAME = "Adobe After Effects CC 2014";
        else if (Applications.indexOf('Adobe After Effects CC') != -1) evalInAfterEffects.NAME = "Adobe After Effects CC";
        else if (Applications.indexOf('Adobe After Effects CS6') != -1) evalInAfterEffects.NAME = "Adobe After Effects CS6";
        else if (Applications.indexOf('Adobe After Effects CS5') != -1) evalInAfterEffects.NAME = "Adobe After Effects CS5";
      }(null, require('fs').readdirSync('/Applications')));
    } catch(e){}
  }
  return evalInAfterEffects.NAME;
}

function evalInAfterEffects(fn, args){
  var ID = ++UID
  var debugInfo
  
  if (exports.debug){
    debugInfo = {
      ID:ID,
    }
    console.warn('evalInAfterEffects', debugInfo, {
      name:evalInAfterEffects,
      fn:fn,
      args:args
    })
  }
  
  var readable = new Readable
  readable._read = function(size){
    readable._read = noop
    if (exports.debug) console.warn('_read', debugInfo)
    
    var script = functionToExtendScript(fn, args)
    var cliArgs = []
    
    cliArgs.push("-e", 'on run argv')
    cliArgs.push("-e",   'tell application "' + evalInAfterEffects.getName() + '" to DoScript (item 1 of argv)')
    cliArgs.push("-e", 'end run')
    
    cliArgs.push(script)
    if (exports.debug) console.log('script `%s`', script)
    
    if (exports.debug) console.warn('WILL LOCK', debugInfo)
    
    lockFile.lock(lockPath, lockOptions, function(error, fileDescriptor){
      if (error){
        if (exports.debug) {debugInfo.error = error; console.warn('NOT LOCKED', debugInfo)}
        return readable.emit('error', error);
      }
      if (exports.debug) {console.warn('LOCKED', debugInfo)}
      if (exports.debug) {console.warn('spawn', debugInfo)}
      
      var child = spawn('/usr/bin/osascript', cliArgs)
      
      child.stdout.on('readable', function(){
        readable.push(this.read())
      })
      var _error = ''
      child.stderr.on('data', function(data){ _error += data })
  
      child.on('exit', function(code){
        if (exports.debug) {
          debugInfo.exitCode = code
          debugInfo.stderr = _error
          console.warn('spawn exit', debugInfo)
        }
        lockFile.unlock(lockPath, function(error){
          if (exports.debug) {
            debugInfo.exitCode = code
            debugInfo.error = error
            console.warn('UNLOCK', debugInfo)
          }
          readable.push(null)
          if (error) readable.emit('error', error);
          // if (_error && _error.indexOf('(-1750)') != -1) readable.emit('error', Error(_error));
          // else
          if (code) readable.emit('error', Error(_error));
        })
      })
      
    })
  }
  return readable
}

if (!module.parent){
  if (process.argv[2] == null){
    // require('../test/test-aftereffects-eval')
    throw Error("After Effects doesn't support normal eval")
  }
  else {
    process.nextTick(function(){
      module.exports.debug = true
      module.exports(process.argv[2]).pipe(process.stdout)
    })
  }
}
