var streamify = require('streamify')
var photoshop = require('../..')
var fs = require('fs')

exports = module.exports = function render(config){
  if (!config.psd) throw Error('file not found');
  var placeholder = streamify()
  
  fs.exists(config.psd, function(exists){
    if (!exists) return placeholder.emit('error', Error('file "' + config.psd + '" not found'));
    placeholder.resolve(
      photoshop.createStream(jsx_streamLayers, [config.psd, config.frame])
    )
  })
  
  return placeholder
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
