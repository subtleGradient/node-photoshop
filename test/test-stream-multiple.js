var t = require('tap')
var psEval = require('../lib/photoshop-eval')
var createStream = require('../lib/photoshop-stream').createStream

t.test('stream write', function(t){
  
  var stream = createStream(function(streamAddress){
    
    psEval(function(a, b, streamAddress, c){
      
      var socket = new Socket
      socket.open(streamAddress)
      socket.write(a+b+c)
      
    }, [1, 2, streamAddress, 3], function(){})
    
  })
  
  t.plan(1)
  
  stream.on('data', function(data){
    t.is(Number(String(data)), 1 + 2 + 3)
  })
  
  stream.on('end', t.end.bind(t))
})
