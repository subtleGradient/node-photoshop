/*jshint asi:true evil:true laxbreak:true*/

var photoshop = exports
var psEval = require('./lib/photoshop-eval')

var PSLIB_PATHS = [
  __dirname + '/lib/ExtendScript/index.jsxinc',
]
function pathToImport(path){ return '#include "' + path + '"' }
var PSLIB_SCRIPT = PSLIB_PATHS.map(pathToImport).join('\n')

var TMP_IMPORT_PATHS = []

////////////////////////////////////////////////////////////////////////////////

var execFile = require('child_process').execFile
var TEMPLATE = function(){
  var transaction = $TRANSACTION
  var result
  function transactionWrapper(){ result = transaction() }
  if (!(app.documents.length)) transactionWrapper()
  else app.activeDocument.suspendHistory(decodeURIComponent("$NAME"), "transactionWrapper()")
  return result
}
var APP_NAME = 'Adobe Photoshop CS6'

photoshop.setAppName = function(appName){
  APP_NAME = appName
  return photoshop
}

photoshop.execute = function(name, script, callback){
  if (arguments.length === 2) {
    callback = script
    script = name
    name = 'AoPS'
  }
  if (typeof script != 'function') script = new Function(script);
  script = TEMPLATE.toString()
    .replace('$NAME', encodeURIComponent(name))
    .replace('$TRANSACTION', script.toString())
  photoshop.run('JSON.stringify(' + script.toString() + '(), null, 2);', function(err, out){
    if (err) return callback(err);
    try { out = JSON.parse(out) }catch(e){}
    callback(null, out)
  })
}

var runQueue = []
photoshop.run = function(script, callback){
  runQueue.push({script:script, callback:callback})
  if (!runReal.isRunning) runReal()
}
function runReal(){
  if (!runQueue.length) return;
  runReal.isRunning = true
  var args = runQueue.shift()
  var script = args.script, callback = args.callback
  
  if (typeof script == 'function') script = ';(' + script.toString() + '());';
  
  script = PSLIB_SCRIPT + '\n' + TMP_IMPORT_PATHS.map(pathToImport).join('\n') + '\n' + script
  TMP_IMPORT_PATHS.length = 0
  
  photoshop.debug && console.warn(script + '\n\n')
  
  var result = ''
  
  var _callback = callback
  callback = function(error, result){
    if (_callback) {
      runReal.isRunning = false
      process.nextTick(runReal)
      var cb = _callback
      _callback = null
      cb(error, result)
    }
  }
  
  var evalStream = psEval(script)
  
  evalStream.on('data', function(data){
    result += data
  })
  evalStream.once('error', callback)
  evalStream.on('end', function(){
    callback(null, result)
  })
  
  
}

photoshop.include = function(paths){
  if (paths && paths.length)
    for (var index = -1, length = paths.length; ++index < length;)
      TMP_IMPORT_PATHS.push(paths[index])
  return this
}

photoshop.invoke = function(fn, args, callback){
  if (arguments.length == 2){
    callback = args
    args = []
  }
  if (!Array.isArray(args)) args = [args]
  photoshop.run(';try{JSON.stringify(' + fn + '(' + JSON.stringify(args).replace(/^\[|\]$/g,'') + '))}catch(e){JSON.stringify(e)};', function(err, out, error){
    if (err) return callback(err, error || out)
    try { out = JSON.parse(out) }catch(e){}
    callback && callback(null, out)
  })
}

////////////////////////////////////////////////////////////////////////////////

if (module.id == '.') {
  
  photoshop.debug = true
  
  photoshop.run('1+1', function(err, out){
    console.log('Test', err, out)
    console.assert(out.charAt(0) === '2')
  })
  
  photoshop.execute('return 1+1', function(err, out){
    console.log('Test', err, out)
    console.assert(out === 2)
  })
  
  photoshop.invoke(function(path){ app.open(File(path)) }, [__dirname + '/test/stuff/some stuff.psd'], function(error){
    
    photoshop.invoke('PSFakeDOM.getDocumentNode', function(error, document){
      if (error) return console.warn(error)
      console.log(document)
    })
  
    photoshop.invoke(function(){
      PSFakeDOM.debug=true
      PSFakeDOM.getLayers()
      return ['PSFakeDOM.LayerKeyBlacklist', PSFakeDOM.LayerKeyBlacklist]
    }, function(error, document){
      if (error) return console.warn(error)
      console.log(document)
    })
  
    photoshop.invoke('PSFakeDOM.getLayers', function(error, document){
      if (error) return console.warn(error)
      console.log(document)
      photoshop.invoke('app.activeDocument.close')
    })
    
  })
  
}
