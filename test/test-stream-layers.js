var t = require('tap')
var photoshop = require('../')
// require('../lib/functionToExtendScript').DEBUG = true
// require('../lib/transformES6').DEBUG = true
// require('../lib/extendscript-stream').debug = true

t.test("stream layers", function(t){
  
  var readStream = photoshop.createStream(function(writeStream, psd){
    function $time(event){
      if ($time.event) writeStream.writeln(JSON.stringify({key:'duration', event:$time.event, duration:$.hiresTimer/1000}))
      else $.hiresTimer // reset to 0
      $time.event = event
    }
    
    $time('open')
    
    app.open(File(psd))
    
    $time('getLayerIds')
    
    PSFakeDOM.getLayerIds().forEach(function(id){
      
      $time('getMetaDataForLayerId')
      
      writeStream.write(
        JSON.stringify({ key:'meta', id:id, value:
          PSFakeDOM.getMetaDataForLayerId(
            id)}))
      
      $time('getParsedMetaDataForLayerId')
      
      writeStream.write(
        JSON.stringify({ key:'parsed', id:id, value:
          PSFakeDOM.getParsedMetaDataForLayerId(
            id)}))
      
      $time('layer')
      
      writeStream.write(
        JSON.stringify({ key:'layer', id:id, value:
          PSFakeDOM.executeActionGet(
            PSFakeDOM.layerRefForId(
              id))}))
    })
    
    $time('close')
    
    app.activeDocument.close()
    
    $time()
    
  }, [__dirname + '/stuff/some stuff.psd'])
  
  readStream
  .pipe(require('JSONStream').parse())
  .on('data', function(object){
    t.ok('key' in object)
    console.dir(object)
  })
  // .pipe(process.stdout)
  
  readStream.on('end', function(){
    t.end()
  })
  
})
