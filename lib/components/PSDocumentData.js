var PassThrough = require('readable-stream').PassThrough
var photoshop = require('../..')
var fs = require('fs')

exports = module.exports = function render(config){
  var stream = new PassThrough()
  
  stream._read = function(){
    if (!(config && config.psd)) return stream.emit('error', Error('bad config "psd"'));
    fs.exists(config.psd, function(exists){
      if (!exists) return stream.emit('error', Error('file "' + config.psd + '" not found'));
      photoshop.createStream(jsx_streamLayers, [config.psd, config.frame]).pipe(stream)
    })
  }
  // 
  // stream.end = function(){
  //   console.log('stream.end')
  // }
  
  return stream
}

function jsx_streamLayers(writeStream, psd, frameNumber){
  app.open(File(psd))
  
  try {
    if (frameNumber) PSFakeDOM.setFrame(frameNumber)
  } catch(e){}
  
  var layers = PSFakeDOM.getLayersArray()
  
  writeStream.write(JSON.stringify(layers[0]))
  
  layers.reverse().forEach(function(layer, index, layers){
    if (layer.layerID === -1) return
    writeStream.write(JSON.stringify(layer))
  })
  writeStream.close()
  
  PSFakeDOM.close()
}

if (!module.parent) require('../../test/test-PSDocumentData');
