var t = require('tap')

var photoshop = require('..')
// photoshop.debug = true

t.test('invoke accepts a function and a callback', function(t){
  t.plan(2)
  photoshop.invoke(function(){ return 123 }, function(error, result){
    t.notOk(error)
    t.is(result, 123)
  })
})

t.test('invoke accepts a function, args array and a callback', function(t){
  t.plan(2)
  photoshop.invoke(function(value){ return value }, [123], function(error, result){
    t.notOk(error)
    t.is(result, 123)
  })
})

t.test('errors thrown while executing the extendscript are passed as the first argument to the callback', function(t){
  photoshop.invoke(function(){ throw 'lulz' }, function(error){
    t.is(error, 'lulz')
    t.end()
  })
})

t.test("error objects aren't completely useless", function(t){
  var msg = 'fail, please'
  photoshop.invoke(function(msg){ console.assert(false, msg) }, [msg], function(error){
    t.is(typeof error, 'object')
    t.is(error.message, msg, 'message')
    t.ok(require('fs').existsSync(error.fileName), 'fileName is a real file')
    t.is(error.source, undefined)
    t.end()
  })
})
