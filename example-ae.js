/**
  JSONify the first layer of the fist composition of the current project
*/

require('./aftereffects').createStream(function jsx(stream, props){
  
  var composition = app.project.ao_comps()[0];
  var layer = composition.layers[1];
  
  stream.writeln(
    JSON.stringify(layer, null, 2)
  );
  
  stream.writeln(JSON.stringify(props));
  
}, [{lulz:Math.random(0)}])
.pipe(process.stdout);
