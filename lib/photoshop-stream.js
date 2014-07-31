var psEval = require('./photoshop-eval')
var extendscriptStream = require('./extendscript-stream')

module.exports.createStream = function(){
  return extendscriptStream.defineEval(psEval).createStream.apply(extendscriptStream, arguments);
}
module.exports.psStream = function(){
  return extendscriptStream.defineEval(psEval).jsxStream.apply(extendscriptStream, arguments);
}

if (!module.parent) process.nextTick(function(){
  
  require('../test/test-stream-basic')
  require('../test/test-stream-multiple')
  
})
