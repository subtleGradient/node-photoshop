var t = require('tap')

var PSDocumentData = require('../lib/components/PSDocumentData')

t.test('PSDocumentData throws unless given a psd', function(t){
  t.plan(1)
  var stream = PSDocumentData({})
  stream.on('error', function(error){
    t.ok(error)
  })
  stream.resume()
})

t.test('PSDocumentData emits an error unless given a valid psd', function(t){
  t.plan(1)
  var stream = PSDocumentData({ psd:'lulz' })
  stream.on('error', function(error){
    t.ok(error)
  })
  stream.resume()
})

t.test("PSDocumentData should be a thing", function(t){
  var concat = require('concat-stream')
  
  var stream = PSDocumentData({ psd: __dirname + '/stuff/some stuff.psd' })
  
  var _data = ''
  stream.on('data', function(data){
    console.log('data', data)
    _data += data
  })
  stream.on('error', function(error){
    t.fail(error)
    t.end()
  })
  stream.on('end', function(){
    t.ok(_data, 'yes data')
    t.end()
  })
  // stream.pipe(concat(function(error, data){
  //   t.notOk(error, 'no error')
  //   t.ok(data, 'yes data')
  //   // console.log(data.toString())
  //   t.end()
  // }))
  
})
