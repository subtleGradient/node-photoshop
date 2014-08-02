require('./aftereffects').createStream(function jsx(stream, props){

  var composition = app.project.ao_comps()[0];
  var layer = composition.layers[1];

  stream.writeln(
    JSON.stringify(
      layer.toJSON(),
      null,
      2
    )
  )
  
/*
  stream.writeln(
    layers[0]
    .ao_properties()
    .filter(Object)
    // .map(function(prop){return prop.constructor.name})
    // .filter(uniq)
    .map(function(prop){return [
      prop.name,
      prop.ao_properties && prop.ao_properties().filter(Object)
      .map(function(prop){return [
        prop.name,
        prop.ao_properties && prop.ao_properties().filter(Object),
      ]})
    ]})
    .join('\n')
  )
*/


/*
  stream.writeln(
    app.project.ao_comps()[0].layers.ao_toArray()
    // .map(function(item){return item.name})
    .map(function(layer){
      if (!layer.toJSON) return "FAIL";
      return JSON.stringify(layer.toJSON(), null, 2);
    })
    .join('\n\n\n')
  );

  stream.writeln(
    app.project.ao_comps()[0].layers.ao_toArray()
    .map(function(layer){
      return Object.prototype.toString.call(layer)
    })
    .join('\n')
  );
*/
  
  // app.executeCommand(app.findMenuCommandId("Photoshop Layers..."))
  // stream.writeln($.global.LULZ);
  // stream.writeln(typeof app.project.items);
  // stream.writeln(Object.prototype.toString.call(app.project.items));
  // stream.writeln(app.project.items.constructor == ItemCollection);
  // stream.writeln(typeof ItemCollection);
  
  // stream.writeln(app.project.items[1].constructor.name);
  // console.log(app.project.items)

  // stream.writeln(app.project.constructor.name)
  // stream.writeln(app.project.items.constructor.name)
  // stream.writeln(app.project.items[1].constructor.name)
  // stream.writeln(app.project.items[1].items.constructor.name)
  // stream.writeln(0 in app.project.items)
  
  function uniq(item, index, items){return items.indexOf(item) === index}
  
  // stream.writeln(JSON.stringify(Object.keys(app.project.__proto__)))
  // stream.writeln(app.project.__proto__ == app.project.constructor.prototype)
  // stream.writeln(app.project.__proto__ == app.project.constructor.prototype)
  
  // app.project.items.ao_toArray()
  // .map(function(item){
  //   if (item && item.items) return item.items.ao_toArray();
  // })
  // .forEach(function(name){
  //   stream.writeln(name)
  // })
  
  
  
/*
  app.project.items.ao_toArray()
  .map(function(item){
    
    var keys = []
    for (var key in item) {
      keys.push(key)
    }
    return keys.join(',')
    
    return '<' + item.constructor.name + ';' + item.typeName + ';' + (Object.keys(item).join(',')) + ';' + ('ao_lulz' in item) + '>'
  })
  .filter(uniq)
  .forEach(function(name){
    stream.writeln(name)
  })

  Object.keys(this)
  .forEach(function(name){
    stream.writeln(name)
  })
*/
  
  // app.project.constructor.prototype.ao_
  
  stream.writeln(JSON.stringify(props))
}, [{lulz:true}])
.pipe(process.stdout)
