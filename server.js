var url = require('url')

exports.createServer = function(config, callback){
  if (!(config && typeof config == 'object')) config = {};
  if (typeof config.components != 'object') config.components = require('./lib/components');
  
  var server = require('http').createServer(function(request, response){
    var _url = url.parse(request.url, true)
    // console.log(_url.query)
    
    if (!config.components[_url.query.component]){
      response.statusCode = 404
      response.end(JSON.stringify({'error': 'component "' + _url.query.component + '" not found'}))
      return
    }
    
    var rendering
    try {
      rendering = config.components[_url.query.component](_url.query)
      rendering.on('error', function(error){
        response.statusCode = 500
        response.end(JSON.stringify({'error': error.message}))
      })
      rendering.pipe(response)
    }
    catch(error){
      response.statusCode = 500
      response.end(JSON.stringify({'error': error}))
    }
  })
  
  server.on('error', callback)
  
  server.on('listening', function(){
    callback(null, 'http://' + server.address().address + ':' + server.address().port)
  })
  
  return server
}


if (!module.parent) {
  exports.createServer(null, function(error, address){console.log(address)}).listen(8236)
}
