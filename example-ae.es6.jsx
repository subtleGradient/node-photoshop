#target "aftereffects"
#include "./lib/ExtendScript/index-ae.jsxinc"

if (typeof STDOUT == 'undefined') {
  STDOUT = $;
}

var console = {log: function(){var args=Array.prototype.slice.call(arguments,0);
  args.forEach(function(arg, index)  {
    if (index > 0) STDOUT.write(" ");
    if (typeof arg != 'string') {
      arg = JSON.stringify(arg, null, 2);
    }
    STDOUT.write('' + arg);
  });
  STDOUT.write("\n");
}};

function inspect(thing){
  return ''
    + Object.prototype.toString.call(thing)
    + '\n'
    + Object.keys(thing).map(function(key)  {return typeof comp[key] + ': ' + key;}).sort().join('\n')
  ;
}

////////////////////////////////////////////////////////////////////////////////

app.onError = function(message, severity){
  //$.writeln(message, severity);
};

////////////////////////////////////////////////////////////////////////////////

console.log(
  app.project
)
