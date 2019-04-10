function main(){
  var doc = FakeDocument.$0();
  doc.doWriteTransaction(function(){

    var width = doc.getWidth();
    var height = doc.getHeight();
    var newHeight = height * 1.3
    var newWidth = newHeight * 0.7
 
    doc.setCanvasSize(newWidth, newHeight);
  });
}

////////////////////////////////////////////////////////////////////////////////
#script "Smart Crop"
#target photoshop
#strict off

#include "./lib/ExtendScript/index.jsxinc"
#include "./lib/ExtendScript/FakeLayer.jsxinc"
#include "./lib/ExtendScript/FakeDocument.jsxinc"
//#include "./lib/ExtendScript/SerializeFakeDocument.jsxinc"

main()
