module.exports = exports = function functionToExtendScript(fn, args){
  if (args == null) args = []
  else if (!Array.isArray(args)) args = [args]
  
  var script, _header = []
  
  if (typeof fn == 'function'){
    script = ';(' + fn.toString() + ')'
  } else {
    script = String(fn)
  }
  
  if (args.length > 0 || typeof fn == 'function'){
    script += '('
    script += args.map(function(arg){
      if (typeof arg == 'function'){
        if (arg.__jsx_prefix__) _header.push(arg.__jsx_prefix__)
        return arg.toString()
      }
      else {
        return JSON.stringify(arg)
      }
    }).join(', ')
    script += ')'
  }
  return _header.join('\n') +'\n'+ script
}
