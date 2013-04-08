var test = require('tap').test
var photoshop = require('../')

function openFile_jsx(path){
  var file = File(path)
  app.open(file)
  return app.activeDocument.fullName.fsName
}

test('open a file', function(t){
  var psd = __dirname + '/stuff/some stuff.psd'
  photoshop.invoke(openFile_jsx, [psd], function(error, path){
    t.ok(error == null, 'no error')
    
    photoshop.invoke('PSFakeDOM.getParsedMetaDataForLayerId', [8], function(error, parsedMetadata){
      t.ok(error == null, 'no error')
      t.is(typeof parsedMetadata, 'object')
      t.ok('source' in parsedMetadata, 'parsedMetadata.source exists')
      t.equals(parsedMetadata.source, "http://graph.facebook.com/subtlegradient/picture")
      t.end()
    })
    
    photoshop.invoke('app.activeDocument.close', function(error){
      t.ok(error == null, 'no error')
      t.end()
    })
  })
})
