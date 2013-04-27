exports = module.exports = render

var photoshop = require('../..')
var streamify = require('streamify')
var fs = require('fs')

function render(config){
  if (!config.psd) throw Error('file not found');
  if (!config.name) throw Error('layer not found');
  
  var placeholder = streamify()
  
  fs.exists(config.psd, function(exists){
    if (!exists) return placeholder.emit('error', Error('file "' + config.psd + '" not found'));
    placeholder.resolve(
      photoshop.createStream(
        jsx_streamPhotoshopLayer_byName,
        [config.psd, config.name]
      )
    )
  })
  
  return placeholder
}

function jsx_streamPhotoshopLayer_byName(writeStream, psd, layerName){
  app.open(File(psd))
  
  var layerRef = PSFakeDOM.layerRefForName(layerName)
  var layer = PSFakeDOM.executeActionGet(layerRef)
  
  writeStream.write(JSON.stringify(layer))
  
  app.activeDocument.close()
}

if (!module.parent) require('../../test/test-PSLayerData');
