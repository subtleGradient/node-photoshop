var t = require('tap')
var psEval = require('../lib/photoshop-eval')
var createStream = require('../lib/photoshop-stream').createStream

t.test('stream write', function(t){
  
  var stream = createStream(function(error, streamAddress){
    t.notOk(error, 'createStream no error')
    t.ok(streamAddress, 'createStream streamAddress')
    
    psEval(function(a, b, streamAddress, c){
      
      var socket = new Socket
      socket.open(streamAddress)
      socket.write(a+b+c)
      
    }, [1, 2, streamAddress, 3])
    .resume()
    
  })
  
  stream.on('data', function(data){
    t.is(Number(String(data)), 1 + 2 + 3, 'correct data')
  })
  
  stream.on('end', t.end.bind(t))
})
