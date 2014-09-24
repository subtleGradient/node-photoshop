var transform = require('jstransform').transform;
var coverify = require('coverify');

transformES6.transformers = []
  .concat(require('jstransform/visitors/es6-arrow-function-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-object-concise-method-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-object-short-notation-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-class-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-rest-param-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-template-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-destructuring-visitors').visitorList)
;
function transformES6(code){
  var cleanCode = code.replace(/^#/gm,'//Commented Hash//#');
  // console.warn(cleanCode)
  try {
    var transformedCode = transform(transformES6.transformers, cleanCode).code;
    return transformedCode;
    var transformedTransformedCode = '';
    // var transformedCode = cleanCode;

    // var coverifyStream = coverify('lulz',{output:'$.writeln'});
    // coverifyStream.on('data', function(data){ transformedTransformedCode += (data.toString() + "\n") });
    // coverifyStream.write(transformedCode);
    // coverifyStream.end();
    //
    // console.warn(transformedTransformedCode);

    // return transformedTransformedCode
    // .replace(RegExp('//Commented Hash//#','gm'),'#');
  } catch(e){
    console.warn(e);
    return code;
  }
}

module.exports = transformES6;
