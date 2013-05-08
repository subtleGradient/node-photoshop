var t = require('tap')
var photoshop = require('../')

function openFile_jsx(path){
  var file = File(path)
  app.open(file)
  return app.activeDocument.fullName.fsName
}

t.test('open a file', function(t){
  var psd = __dirname + '/stuff/some stuff.psd'
  photoshop.invoke(openFile_jsx, [psd], function(error, path){
    t.notOk(error, 'no error')
    t.is(path, psd, 'psd path')
    
    
    photoshop.invoke('PSFakeDOM.getParsedMetaDataForLayerId', [8], function(error, parsedMetadata){
      t.notOk(error, 'no error')
      t.is(typeof parsedMetadata, 'object', 'parsedMetadata')
      if (parsedMetadata){
        t.ok('source' in parsedMetadata, 'parsedMetadata.source exists')
        t.equals(parsedMetadata.source, "http://graph.facebook.com/subtlegradient/picture", "Layer has the correct source uri")
      }
    })
    photoshop.invoke('app.activeDocument.close', function(error, result){
      if (error) t.fail(error)
      t.notOk(error, 'no error for closing document')
      t.ok(result == null, "no result for closing document")
      t.is(typeof result, 'undefined', "no result for closing document")
      t.end()
    })
    
  })
})
