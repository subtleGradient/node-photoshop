exports = module.exports = render

var photoshop = require('../..')
var Readable = require('readable-stream').Readable
var fs = require('fs')

function render(config){
  var stream = new Readable()
  
  stream._read = function(){
    stream._read = function(){}
    if (!config.psd) return stream.emit('error', Error('file not found'));
    if (!config.name) return stream.emit('error', Error('layer not found'));
  
    fs.exists(config.psd, function(exists){
      if (!exists) return stream.emit('error', Error('file "' + config.psd + '" not found'));
      var resultStream = photoshop.createStream(
        jsx_streamPhotoshopLayer_byName,
        [config.psd, config.name]
      )
      resultStream.on('readable', function(){
        stream.push(resultStream.read())
      })
      resultStream.on('end', function(){
        stream.push(null)
      })
      // resultStream.on('data', function(result){
      //   stream.push(result)
      // })
      // resultStream.on('end', function(){
      //   stream.push(null)
      // })
    })
  }
  
  return stream
}

function jsx_streamPhotoshopLayer_byName(writeStream, psd, layerName){
  app.open(File(psd))
  
  var layerRef = PSFakeDOM.layerRefForName(layerName)
  var layer = PSFakeDOM.executeActionGet(layerRef)
  
  writeStream.write(JSON.stringify(layer))
  writeStream.close()
  
  app.activeDocument.close()
}

if (!module.parent) require('../../test/test-PSLayerData');
