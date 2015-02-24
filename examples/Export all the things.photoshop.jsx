/*jshint asi:true evil:true*/

function main(){
  var fsName = app.activeDocument.fullName.fsName;
  var doc = FakeDocument.$0()

  doc.doTransaction(function(){
    doc.getLayerCompNames().forEach(function(layerCompName){
      console.log(layerCompName);
      var doc = new FakeDocument(app.activeDocument);
      if (layerCompName != "Current State") {
        doc.applyLayerCompNamed(layerCompName);
      }
      new SerializeFakeDocument(doc).exportJSON();

      var layers = doc.getFakeLayers().filter(Boolean);
      layers.forEach(function(layer){
        if (layer.name == null) return;
        console.log('layer.name: ' + layer.name);
        layer.saveCroppedPNGToPath(fsName.replace('.psd','') + '.' + layerCompName + '.layer_' + layer.id + '.png');
      });
    });
  });

}

////////////////////////////////////////////////////////////////////////////////
#script "Export all the things"
#target photoshop
#strict off

#include "./lib/ExtendScript/index.jsxinc"
#include "./lib/ExtendScript/FakeLayer.jsxinc"
#include "./lib/ExtendScript/FakeDocument.jsxinc"
#include "./lib/ExtendScript/SerializeFakeDocument.jsxinc"

main()

// app.documents[0].fullName.fsName
