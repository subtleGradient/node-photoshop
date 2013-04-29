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
    config.saveFilePath = saveFilePath
    photoshop.includeFakeDOM().invoke(jsx_exportLayer, [config], onExport)
  // })
  
  return placeholderStream
}


function jsx_exportLayer(config, saveFilePath){
  // TODO: Stream the pixel data directly from Photoshop if that is ever supported
  
  var doc = FakeDocument.getByPath(config.psd)
  
  var layer
  if (config.id){
    layer = doc.getLayerById(config.id)
  }
  else if (config.name){
    layer = doc.findByNameWithRegEx(RegExp(config.name, 'i'))[0]
  }
  
  if (!layer) throw Error('layer by name "' + config.name + '" not found');
  
  doc.doThenUndo(function(doc){
    layer.doWhileThisIsTheOnlyThingVisible(function(layer){
      doc.cropTo(layer)
      if (config.trim) doc.trimTransparency()
      doc.exportToPNG(config.saveFilePath)
    })
  })
  
  // FIXME: Don't close the document if we didn't open it
  doc.close()
}

if (!module.parent) require('../../test/test-PSLayerImage');
