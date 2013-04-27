var t = require('tap')

var PSDocumentData = require('../lib/components/PSDocumentData')

t.test('PSDocumentData throws unless given a psd', function(t){
  t.plan(1)
  t.throws(function(){
    PSDocumentData({})
  })
})

t.test('PSDocumentData emits an error unless given a valid psd', function(t){
  t.plan(1)
  PSDocumentData({ psd:'lulz' }).on('error', function(error){
    t.ok(error)
  })
})

t.test("PSDocumentData should be a thing", function(t){
  var concat = require('concat-stream')
  
  PSDocumentData({ psd: __dirname + '/stuff/some stuff.psd' })
  .pipe(concat(function(error, data){
    t.notOk(error, 'no error')
    t.ok(data, 'yes data')
    // console.log(data.toString())
    t.end()
  }))
  
})
