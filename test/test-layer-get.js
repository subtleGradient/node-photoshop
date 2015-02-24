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
    t.ok(error == null, 'should not throw ' + JSON.stringify(error))
    t.equal(psd, path, 'activeDocument must be the one we just tried to open')
    
    
    test('getLayers', function(t){
      photoshop.invoke('PSFakeDOM.getLayers', function(error, layers){
        
        t.ok(error == null, 'no error')
        t.ok(!!layers[-1], 'has layer -1')
        
        Object.keys(layers).map(Number).forEach(function(layerID){
          t.equal(layerID, layers[layerID].layerID, 'layerID key')
          if (layerID == -1){
            
          }
          else { verify_Layer(t, layers[layerID]) }
        })
        
        photoshop.invoke('app.activeDocument.close', function(error){
          t.ok(error == null, 'no error')
          t.end()
        })
      })
    })
    
    
    t.end()
  })
})

function verify_Layer(t, layer){
  t.notEqual(layer.layerID, -1, 'is not the root')
  t.equal(typeof layer._parentId, 'number', 'has a _parentId')
  t.equal(typeof layer.name, 'string', 'has a name')
  t.equal(typeof layer.metadata, 'object', 'has metadata')
  t.equal(typeof (layer.metadata && layer.metadata.layerTime), 'number', 'has a metadata.layerTime')
  t.equal(typeof layer.parsedMetadata, 'object', 'has parsedMetadata')
  t.equal(typeof layer.opacity, 'number', 'has opacity')
  t.equal(typeof layer.layerSection, 'string', 'layerSection')
  t.ok({
    layerSectionStart: true,
    layerSectionEnd: true,
    layerSectionContent: true
  }[layer.layerSection], 'layerSection enum')
  
  t.equal(typeof layer.hasFilterMask, 'boolean', 'hasFilterMask')
  t.equal(typeof layer.hasVectorMask, 'boolean', 'hasVectorMask')
  t.equal(typeof layer.hasUserMask, 'boolean', 'hasUserMask')
  t.equal(typeof layer.layerFXVisible, 'boolean', 'layerFXVisible')
  
  verify_Bounds(t, layer.bounds)
}

function verify_Bounds(t, bounds){
  t.is(typeof bounds, 'object', 'bounds')
  t.is(typeof bounds.top, 'number', 'bounds.top')
  t.is(typeof bounds.right, 'number', 'bounds.right')
  t.is(typeof bounds.bottom, 'number', 'bounds.bottom')
  t.is(typeof bounds.left, 'number', 'bounds.left')
  t.is(typeof bounds.width, 'number', 'bounds.width')
  t.is(typeof bounds.height, 'number', 'bounds.height')
}

