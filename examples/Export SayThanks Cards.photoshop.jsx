#script "Export SayThanks Cards"
#target photoshop
#strict off

#include "./lib/ExtendScript/index.jsxinc"
#include "./lib/ExtendScript/FakeLayer.jsxinc"
#include "./lib/ExtendScript/FakeDocument.jsxinc"

////////////////////////////////////////////////////////////////////////////////

__filename = File($.fileName).fsName;
__dirname = File($.fileName).parent.fsName;

function exportAllTheThingsFromPSD(psdPath){
  var doc = FakeDocument.getByPath(psdPath)
  return new SerializeSayThanksCard(doc).toJSON();
}

function getNodeById(nodes, id){
  return nodes.filter(function(node){return node.id === id})[0];
}
function deepClone(object){
  return JSON.parse(JSON.stringify(object));
}

function getCleanLayerName(name){
  return name.replace(/[^a-z0-9_-]/ig, '');
}

SayThanksNode.create = function(layerDescriptor){
  return new SayThanksNode(layerDescriptor);
};
SayThanksNode.setParent = function(childNode, index, nodes){
  var parentID = childNode.parentID;
  if (!parentID) return;
  var parentNode = getNodeById(nodes, parentID);
  if (!parentNode) return;
  parentNode.children = parentNode.children || [];
  parentNode.children.push(childNode);
};
function SayThanksNode(layerDescriptor){
  this.id = layerDescriptor.layerID;
  this.parentID = layerDescriptor._parentId;
  this.name = layerDescriptor.name;
  if (layerDescriptor.bounds) {
    this.location = [
      layerDescriptor.bounds.left, //x1
      layerDescriptor.bounds.top, //y1
      layerDescriptor.bounds.right, //x2
      layerDescriptor.bounds.bottom, //y2
    ];
  }
  if (layerDescriptor.textKey) {
    this.text = layerDescriptor.textKey && layerDescriptor.textKey.textKey;
    this.textSize = layerDescriptor.textKey && layerDescriptor.textKey.textStyleRange[0] && layerDescriptor.textKey.textStyleRange[0].textStyle.baseParentStyle.impliedFontSize;
  } else if (layerDescriptor.name && layerDescriptor.name.charAt(0) === '[') {
    this.image = 'static_images/' + getCleanLayerName(layerDescriptor.name) + '.png';
  }
  if (layerDescriptor.hasVectorMask || layerDescriptor.hasUserMask) {
    this.maskImage = 'static_images/' + getCleanLayerName(layerDescriptor.name) + '.mask.png';
  }
  this.children = undefined;
}

function SerializeSayThanksCard(doc){
  this.fakeDocument = doc;
}
SerializeSayThanksCard.prototype = {

  toJSON: function(){
    var doc = this.fakeDocument;
    var folder = Folder(doc.getRealDocument().fullName.parent.fsName + '/static_images');
    folder.create();
    var fsName = folder.fsName;
    var layers = PSFakeDOM.getLayersArray();
    doc.doTransaction(function(){
      var layers = doc.getFakeLayers().filter(Boolean);
      layers.forEach(function(layer){
        if (layer.name == null) return;
        if (layer.name.indexOf('[') !== 0) return;
        console.log('layer.name: ' + getCleanLayerName(layer.name));
        layer.saveCroppedPNGToPath(fsName + '/' + getCleanLayerName(layer.name) + '.png');
      });
    });
    
    var nodes = layers
      .sort(function(a,b){return a.index - b.index})
      .filter(function(layer){return layer.visible !== false})
      .map(deepClone)
      .map(SayThanksNode.create)
    ;
    nodes.forEach(SayThanksNode.setParent);
    return getNodeById(nodes, -1);
  },

  getDefaultPath: function(){
    return this.fakeDocument.getFilePath() + '.json';
  },

  exportJSON: function(path){
    var json = JSON.stringify(this, null, 2);
    fs_writeFileSync(path || this.getDefaultPath(), json);
  },
};

function main(){
  var files = Folder(__dirname + "/../01-Card Types").getFiles('*.psd');
  var templates = files.reduce(function(templates, file){
    var name = file.fsName.split('/').reverse()[0].split('.')[0];
    templates[name] = exportAllTheThingsFromPSD(file);
    return templates;
  }, {});
  var json = JSON.stringify(templates, null, 2);
  // return $.writeln(json);
  var templatesPath = __dirname + "/../01-Card Types/templates.json";
  fs_writeFileSync(templatesPath, json);
  return templatesPath;
}

////////////////////////////////////////////////////////////////////////////////

main()
