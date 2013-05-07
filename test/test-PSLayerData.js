var t = require('tap')
var streamPSLayerData = require('../lib/components/PSLayerData')

// t.test('PSLayerData throws unless given a psd', function(t){
//   t.plan(1)
//   t.throws(function(){
//     streamPSLayerData({ name: "Group 1" })
//   })
// })
// 
// t.test('PSLayerData throws unless given a name', function(t){
//   t.plan(1)
//   t.throws(function(){
//     streamPSLayerData({ psd: __dirname + '/stuff/some stuff.psd' })
//   })
// })
// 
t.test('PSLayerData streams the layer data for a layer given a name', function(t){
  
  var query = {
    psd: __dirname + '/stuff/some stuff.psd',
    name: "Group 1",
  }
  
  var readStream = streamPSLayerData(query)
  
  readStream.on('data', function(layer){
    console.log('data', ''+layer)
  })
  
  readStream.on('end', function(){
    console.log('end')
    t.end()
  })
  
})

t.test('PSLayerData streams the layer data for a layer given a name', function(t){
  
  var JSONStream = require('JSONStream')
  
  var query = {
    psd: __dirname + '/stuff/some stuff.psd',
    name: "Group 1",
  }
  
  var readStream = streamPSLayerData(query)
  
  readStream
  .pipe(JSONStream.parse())
  .on('data', function(layer){
    t.is(layer.name, query.name, 'name')
  })
  
  readStream.on('end', function(){
    t.end()
  })
  
})
