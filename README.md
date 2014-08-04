## ExtendScript

Adobe Photoshop has an EcmaScript 3 compatible scripting engine.  
Its variant of EcmaScript is called ExtendScript.  
ExtendScript files use the `jsx` file extension.  
The ExtendScript Toolkit.app will let you experiment with this code.  
It's installed at `/Applications/Utilities/Adobe Utilities-CC.localized/ExtendScript Toolkit CC/ExtendScript Toolkit.app`.

### Here's some sample ExtendScript

    function setColor_jsx(color){
      app.foregroundColor.rgb.red = color.red
      app.foregroundColor.rgb.green = color.green
      app.foregroundColor.rgb.blue = color.blue
      return app.foregroundColor.rgb.hexValue
    }
    
    var color = {
      red: Math.random() * 255,
      green: Math.random() * 255,
      blue: Math.random() * 255
    }
    
    setColor_jsx(color)

---

# Photoshop / After Effects scripting with Node.js

## Install

    npm install photoshop


## `photoshop.createStream(jsx, [args])`

This is almost always what you want to use.

`photoshop.createStream` creates a Node.js Stream.
The first argument to `createStream` is an ExtendScript `jsx` function to evaluate in Photoshop.
The `jsx` function will be called with an ExtendScript `Socket` instance and whatever additional arguments you supply as the second argument to `createStream`.

Writing to the socket from Photoshop will immediately stream that string back to node.

    function streamColorChanges_jsx(writeStream, setColor_jsx, color){
      writeStream.write(setColor_jsx(color));
      alert("Photoshop won't return until this window is closed, but the stream already sent its data!");
    }

    var readStream = require('photoshop').createStream(streamColorChanges_jsx, [setColor_jsx, color]);

    readStream.pipe(process.stdout);

    readStream.on('end', function(){
      console.log('Done!')
    });


## `aftereffects.createStream(jsx, [args])`

    require('photoshop/aftereffects').createStream(function jsx(stream, props){
      stream.writeln(JSON.stringify(props))
      alert("After Effects won't return until this window is closed, but the stream already sent its data!")
    }, [{lulz:true}])
    .pipe(process.stdout)


### `JSON`ify manythings!

    require('./aftereffects').createStream(function jsx(stream, props){
    
      var composition = app.project.ao_comps()[0];
      var layer = composition.layers[1];
    
      stream.writeln(
        JSON.stringify(layer, null, 2)
      );
    
      stream.writeln(JSON.stringify(props))
    
    }, [{lulz:Math.random(0)}])
    .pipe(process.stdout)


## `photoshop.invoke(jsx, [args,] callback)`

The `invoke` method evaluates the given ExtendScript script in Adobe Photoshop.  
It handles serializing and deserializing the result of your script so **you can return pretty much anything**.  
You can even return Photoshop host objects and it'll do its best to not completely wet its pants.  
It includes `es5shim` and `JSON2` so you can **use normal JavaScript** like `Array map` in your ExtendScript.

    function recentFilesThatExist_jsx(){
      return app.recentFiles.map(File).filter(function(file){return file.exists})
    }
    require('photoshop').invoke(recentFilesThatExist_jsx, function(error, recentFiles){
      console.log(recentFiles)
    })

The `args` argument is optional.  
You can pass JSONable objects as arguments.

    require('photoshop').invoke(setColor_jsx, [color], function(error, foregroundColor){
      console.log('#' + foregroundColor)
    })
