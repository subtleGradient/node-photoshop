var transformES6 = require('./transformES6');

module.exports = exports = function functionToExtendScript(fn, args){
  if (args == null) args = []
  else if (!Array.isArray(args)) args = [args]
  
  var script, _header = []
  if (fn.__jsx_prefix__) _header.push(fn.__jsx_prefix__)
  
  if (typeof fn == 'function'){
    script = ';(' + fn.toString() + ')'
  } else {
    script = String(fn)
  }
  script = transformES6(script)
  if (args.length > 0 || typeof fn == 'function'){
    script += '('
    script += args.map(function(arg){
      if (typeof arg == 'function'){
        if (arg.__jsx_prefix__) _header.push(arg.__jsx_prefix__)
        return transformES6('(' + arg.toString() + ')')
      }
      else {
        return JSON.stringify(arg)
      }
    }).join(', ')
    script += ')'
  }
  var finalCode = _header.join('\n') +'\n'+ script
  if (functionToExtendScript.DEBUG) {
    console.warn('functionToExtendScript AFTER');
    console.warn(finalCode);
  }
  return finalCode;
}
