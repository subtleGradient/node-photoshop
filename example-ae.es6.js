/**
  JSONify the first layer of the fist composition of the current project
*/

var jsxCodeHeader = require('fs').readFileSync(__dirname + '/lib/ExtendScript/prototype-extensions-ae.jsxinc').toString('utf-8');
var jsxCode = require('fs').readFileSync(__dirname + '/example-ae.es6.jsx').toString('utf-8');

var stream = require('./aftereffects').createStream(jsxCodeHeader +'\n\n'+ jsxCode, [{lulz:Math.random(0)}]);
stream.on('end', function(){
  process.exit();
});
stream.pipe(process.stdout);
