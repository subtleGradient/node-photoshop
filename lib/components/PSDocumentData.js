var streamify = require('streamify')
var photoshop = require('../..')
var fs = require('fs')

exports = module.exports = function render(config){
  if (!config.psd) throw Error('file not found');
  var placeholder = streamify()
  
  fs.exists(config.psd, function(exists){
    if (!exists) return placeholder.emit('error', Error('file "' + config.psd + '" not found'));
    placeholder.resolve(
      photoshop.createStream(jsx_streamLayers, [config.psd])
    )
  })
  
  return placeholder
}

function jsx_streamLayers(writeStream, psd){
  app.open(File(psd))
  
  PSFakeDOM.getLayersArray().forEach(function(layer, index, layers){
    writeStream.write(JSON.stringify(layer))
  })
  writeStream.close()
  
  app.activeDocument.close()
}

if (!module.parent) require('../../test/test-PSDocumentData');
