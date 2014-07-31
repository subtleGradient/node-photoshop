var aeEval = require('./aftereffects-eval')
var extendscriptStream = require('./extendscript-stream')

module.exports.createStream = function(){
  return extendscriptStream.defineEval(aeEval).createStream.apply(extendscriptStream, arguments);
}
module.exports.aeStream = function(){
  return extendscriptStream.defineEval(aeEval).jsxStream.apply(extendscriptStream, arguments);
}

if (!module.parent) process.nextTick(function(){
  
  require('../test/test-stream-basic-ae')
  
})
