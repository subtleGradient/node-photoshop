/*jshint asi:true evil:true laxbreak:true*/

var aftereffects = exports
var aeEval = require('./lib/aftereffects-eval')

var PSLIB_PATHS = [
  __dirname + '/lib/ExtendScript/index-ae.jsxinc',
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

aftereffects.setAppName = function(appName){
  aeEval.NAME = appName
  return aftereffects
}

aftereffects.include = function(paths){
  if (paths && paths.length)
    for (var index = -1, length = paths.length; ++index < length;)
      TMP_IMPORT_PATHS.push(paths[index])
  return this
}

var aeStream = require('./lib/aftereffects-stream').aeStream

aftereffects.createStream = function(jsx, args){
  return aeStream(jsx, args, jsx_header())
}

function jsx_header(){
  var script = PSLIB_SCRIPT + '\n' + TMP_IMPORT_PATHS.map(pathToImport).join('\n') + '\n'
  TMP_IMPORT_PATHS.length = 0
  return script
}


////////////////////////////////////////////////////////////////////////////////

if (module.id == '.') {
  
  aftereffects.debug = true
  
  aftereffects.createStream(function(stream){
    // app.open(File(psd))
    //
    // PSFakeDOM.getLayersArray().forEach(function(layer){
    //   stream.writeln(JSON.stringify(layer.layerID))
    //   // $.sleep(100)
    // })
    
  }, [/*__dirname + '/test/stuff/some stuff.psd'*/])
  
  .pipe(process.stdout)

}
