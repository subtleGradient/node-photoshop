var t = require('tap')
var streamPSLayerImage = require('../lib/components/PSLayerImage')


t.test('PSLayerImage streams the pixel data for a layer given a name', function(t){
  
  var JSONStream = require('JSONStream')
  
  var query = {
    psd: __dirname + '/stuff/some stuff.psd',
    name: "SubtleGradient",
    type: 'png',
  }
  
  var savePath = process.env.TMPDIR + '/tmp' + Date.now() + '.png'
  var writeStream = require('fs').createWriteStream(savePath)
  
  var layerImageReadStream = streamPSLayerImage(query)
  
  layerImageReadStream.pipe(writeStream)
  
  layerImageReadStream.on('error', function(error){
    console.error(error)
    t.fail(error)
    t.end()
  })
  
  layerImageReadStream.on('end', function(){
    require('fs').stat(savePath, function(error, stat){
      t.notOk(error)
      t.ok(stat.size > 0, 'file has something in it')
      t.end()
    })
  })
  
})
