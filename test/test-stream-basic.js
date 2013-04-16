var t = require('tap')
var psStream = require('../lib/photoshop-stream').psStream

t.test('stream write', function(t){
  
  var stream = psStream(function(stream){
    stream.write("a")
  })
  
  t.plan(1)
  
  stream.on('data', function(data){
    t.is(String(data), 'a')
  })
  
  stream.on('end', t.end.bind(t))
})

t.test('stream write multiple', function(t){
  
  var createScraper = require('json-scrape')
  
  var stream = createScraper()
  
  psStream(function(stream){
    stream.write('{"lulz":true}')
    stream.write('{"lulz":false}')
  }).pipe(stream)
  
  t.plan(4)
  
  stream.once('data', function(object){
    t.is(typeof object, 'object')
    t.is(object.lulz, true)
    stream.once('data', function(object){
      t.is(typeof object, 'object')
      t.is(object.lulz, false)
    })
  })
  
  stream.on('end', t.end.bind(t))
})

t.test('stream write single dual', function(t){
  
  var createScraper = require('json-scrape')
  
  var stream = createScraper()
  
  psStream(function(stream){
    stream.write('{"lulz":true}{"lulz":false}')
  }).pipe(stream)
  
  t.plan(4)
  
  stream.once('data', function(object){
    t.is(typeof object, 'object')
    t.is(object.lulz, true)
    stream.once('data', function(object){
      t.is(typeof object, 'object')
      t.is(object.lulz, false)
    })
  })
  
  stream.on('end', t.end.bind(t))
})
