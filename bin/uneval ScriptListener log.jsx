#target "photoshop"

#include "../lib/ExtendScript/vendor/json2.js"
#include "../lib/ExtendScript/vendor/es5-sham.js"
#include "../lib/ExtendScript/vendor/es5-shim.js"
#include "../lib/ExtendScript/tojson.jsxinc"


var log = new File('~/Desktop/ScriptingListenerJS.log');
if (!log.exists) throw Error('Log not found: "' + log.fsName + '"');

log.open('r');

var file = new File('~/Desktop/ScriptingListenerJS.uneval.jsx');
file.open('w');

;(function(executeAction){
  while(!log.eof) try{eval(log.readln())}catch(e){$.writeln(e)}
}(function executeAction(a, b, c) {
  file.writeln('executeAction(stringIDToTypeID("', typeIDToStringID(a), '"), ', uneval(b), ', ', c + '', ');\n\n\n')
}))

file.writeln()
log.close()
file.close()

file
