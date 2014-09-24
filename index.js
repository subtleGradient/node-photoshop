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

photoshop.setAppName = function(appName){
  psEval.NAME = appName
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
  runQueue.push({
    script: script,
    callback: callback,
    header: PSLIB_SCRIPT + '\n' + TMP_IMPORT_PATHS.map(pathToImport).join('\n')
  })
  TMP_IMPORT_PATHS.length = 0
  
  if (!runReal.isRunning) runReal()
}
function runReal(){
  if (!runQueue.length) return;
  runReal.isRunning = true
  var args = runQueue.shift()
  var script = args.script, callback = args.callback
  
  if (typeof script == 'function') script = ';(' + script.toString() + '());';
  
  script = args.header + '\n' + script
  
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

var _fakeDOMIncludes = [
  __dirname + '/lib/ExtendScript/FakeDocument.jsxinc',
  __dirname + '/lib/ExtendScript/FakeLayer.jsxinc',
]

photoshop.includeFakeDOM = function(){
  return photoshop.include(_fakeDOMIncludes)
}

photoshop.invoke = function(fn, args, callback){
  if (arguments.length == 2){
    callback = args
    args = []
  }
  if (!Array.isArray(args)) args = [args]
  photoshop.run(';try{JSON.stringify({"node-photoshop-result":' + fn + '(' + JSON.stringify(args).replace(/^\[|\]$/g,'') + ')})}catch(e){JSON.stringify({"node-photoshop-error":e})};', function(err, out, error){
    if (err) return callback(err, error || out)
    try { out = JSON.parse(out) }catch(e){}
    var psError = out["node-photoshop-error"]
    if (psError){
      if (psError.fileName) {
        psError.fileName = decodeURIComponent(psError.fileName).replace(/^\~/, process.env.HOME);
        delete psError.source
      }
    }
    callback && callback(psError, out["node-photoshop-result"])
  })
}

var psStream = require('./lib/photoshop-stream').psStream

photoshop.createStream = function(jsx, args){
  return psStream(jsx, args, jsx_header())
}

function jsx_header(){
  var script = PSLIB_SCRIPT + '\n' + TMP_IMPORT_PATHS.map(pathToImport).join('\n') + '\n'
  TMP_IMPORT_PATHS.length = 0
  return script
}


////////////////////////////////////////////////////////////////////////////////

if (module.id == '.') {
  
  photoshop.debug = true
  
  photoshop.createStream(function(stream, psd){
    app.open(File(psd))
    
    PSFakeDOM.getLayersArray().forEach(function(layer){
      stream.writeln(JSON.stringify(layer.layerID))
      // $.sleep(100)
    })
    
  }, [__dirname + '/test/stuff/some stuff.psd'])
  
  .pipe(process.stdout)
  
  return
  
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
      setTimeout(function(){
        photoshop.invoke('app.activeDocument.close')
      }, 100);
    })
    
  })
  
}
