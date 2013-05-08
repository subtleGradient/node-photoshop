var t = require('tap')
var psEval = require('../lib/photoshop-eval')

t.test("number returns the correct result", function(t){
  t.plan(1)
  psEval(123).on('data', function(data){
    t.is(JSON.parse(data), 123)
  })
})

t.test("function returns the correct result", function(t){
  t.plan(1)
  psEval(function(){return 1 + 1}).on('data', function(data){
    t.is(JSON.parse(data), 2)
  })
})

t.test("function with args returns the correct result", function(t){
  t.plan(1)
  psEval(function(a, b){return a + b}, [1, 2]).on('data', function(data){
    t.is(JSON.parse(data), 3)
  })
})

t.test("script return the correct result", function(t){
  t.plan(1)
  psEval('1 + 1').on('data', function(data){
    t.is(JSON.parse(data), 2)
  })
})

t.test("consecutive scripts wait for the previous script to end", function(t){
  t.plan(2)
  psEval('$.sleep(1000)').on('end', function(){
    t.pass('first script')
  }).resume()
  psEval('"lulz"').once('end', function(){
    t.pass('second script')
  }).resume()
})

t.test("multiple scripts return the correct result", function(t){
  t.plan(5)
  var e
  e = psEval('1 + 1')
  e.on('data', function(data){ t.is(JSON.parse(data), 1+1) })
  e.on('error', t.fail.bind(t))
  
  e = psEval('2 + 2')
  e.on('data', function(data){ t.is(JSON.parse(data), 2+2) })
  e.on('error', t.fail.bind(t))
  
  e = psEval('3 + 3')
  e.on('data', function(data){ t.is(JSON.parse(data), 3+3) })
  e.on('error', t.fail.bind(t))
  
  e = psEval('4 + 4')
  e.on('data', function(data){ t.is(JSON.parse(data), 4+4) })
  e.on('error', t.fail.bind(t))
  
  e = psEval('5 + 5')
  e.on('data', function(data){ t.is(JSON.parse(data), 5+5) })
  e.on('error', t.fail.bind(t))
  
})
