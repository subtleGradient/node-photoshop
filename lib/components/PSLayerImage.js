exports = module.exports = render

var photoshop = require('../..')
var streamify = require('streamify')

function render(config){
  if (config.type == null) config.type = 'png'
  if (/[^a-z0-9]/i.test(config.name)) encodeURIComponent(config.name)
  var saveFilePath = config.psd.replace(require('path').extname(config.psd), '/' + config.name + '.' + config.type)
  
  var placeholderStream = streamify()
  
  function found(){placeholderStream.resolve(require('fs').createReadStream(saveFilePath))}
  
  function onExport(error){
    if (error) return placeholderStream.emit('error', error);
    require('fs').exists(saveFilePath, function(exists){
      if (!exists) return placeholderStream.emit('error', Error("something went wrong, the image wasn't found"));
      found()
    })
  }
  
  // require('fs').exists(saveFilePath, function(exists){
  //   if (exists) return found();
    photoshop.includeFakeDOM().invoke(jsx_exportLayer, [config.psd, config.name, saveFilePath], onExport)
  // })
  
  return placeholderStream
}


function jsx_exportLayer(psd, layerName, saveFilePath){
  // TODO: Stream the pixel data directly from Photoshop if that is ever supported
  
  var doc = FakeDocument.getByPath(psd)
  
  var layer = doc.findByNameWithRegEx(RegExp(layerName, 'i'))[0]
  if (!layer) throw Error('layer by name "' + layerName + '" not found');
  
  doc.doThenUndo(function(doc){
    layer.doWhileThisIsTheOnlyThingVisible(function(layer){
      doc.cropTo(layer)
      doc.exportToPNG(saveFilePath)
    })
  })
  
  // FIXME: Don't close the document if we didn't open it
  doc.close()
}

if (!module.parent) require('../../test/test-PSLayerImage');
