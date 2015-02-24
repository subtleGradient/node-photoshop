var t = require('tap')
var psStream = require('../lib/photoshop-stream').psStream
// require('../lib/functionToExtendScript').DEBUG = true
// require('../lib/transformES6').DEBUG = true
// require('../lib/extendscript-stream').debug = true

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
  
  var createScraper = require('JSONStream').parse
  
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
  
  var createScraper = require('JSONStream').parse
  
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

t.test('stream write multiple args', function(t){
  
  var createScraper = require('JSONStream').parse
  
  var stream = createScraper()
  
  psStream(function(stream, a, b){
    // var stream = arguments[arguments.length-1]
    stream.write('{"lulz":' + a(10) + '}')
    stream.write('{"lulz":' + b + '}')
  }, [function(c){return 12.3 * c}, 456]).pipe(stream)
  
  t.plan(4)
  
  stream.once('data', function(object){
    t.is(typeof object, 'object')
    t.is(object.lulz, 123)
    stream.once('data', function(object){
      t.is(typeof object, 'object')
      t.is(object.lulz, 456)
    })
  })
  
  stream.on('end', t.end.bind(t))
})

t.test('stream write single dual', function(t){
  
  var createScraper = require('JSONStream').parse
  
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
