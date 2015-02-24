var transform = require('jstransform').transform;
// var coverify = require('coverify');

transformES6.transformers = []
  .concat(require('jstransform/visitors/type-syntax').visitorList)
  .concat(require('jstransform/visitors/es6-arrow-function-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-object-concise-method-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-object-short-notation-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-class-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-rest-param-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-template-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-destructuring-visitors').visitorList)
  .concat(require('jstransform/visitors/es6-call-spread-visitors').visitorList)
  .concat(require('jstransform/visitors/es7-spread-property-visitors').visitorList)
;
function transformES6(code){
  if (transformES6.DEBUG) {
    console.warn("transformES6 BEFORE");
    console.warn(code);
  }
  
  var cleanCode = code.replace(/^#/gm,'//Commented Hash//#');
  // console.warn(cleanCode)
  try {
    var transformedCode = transform(transformES6.transformers, cleanCode).code;
    // return transformedCode;
    // var transformedTransformedCode = '';
    // var transformedCode = cleanCode;

    // var coverifyStream = coverify('lulz',{output:'$.writeln'});
    // coverifyStream.on('data', function(data){ transformedTransformedCode += (data.toString() + "\n") });
    // coverifyStream.write(transformedCode);
    // coverifyStream.end();
    //
    // console.warn(transformedTransformedCode);

    transformedCode = transformedCode.replace(RegExp('//Commented Hash//#','gm'),'#');
    if (transformES6.DEBUG) {
      console.warn("transformES6 AFTER");
      console.warn(transformedCode);
    }
    return transformedCode;
  } catch(e){
    console.warn('ignoring transformES6 error');
    console.warn(e);
    if (transformES6.DEBUG) {
      console.trace();
      console.warn("transformES6 AFTER");
      console.warn(code);
    }
    return code;
  }
}

module.exports = transformES6;
