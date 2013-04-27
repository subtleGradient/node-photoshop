## ExtendScript

Adobe Photoshop has an EcmaScript 3 compatible scripting engine.  
Its variant of EcmaScript is called ExtendScript.  
ExtendScript files use the `jsx` file extension.  
The ExtendScript Toolkit.app will let you experiment with this code.  
It's installed at `/Applications/Utilities/Adobe Utilities-CS6.localized/ExtendScript Toolkit CS6/ExtendScript Toolkit.app`.

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

# Photoshop scripting with Node.js

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

---

## Photoshop Components (Stream Sources)

Each component…

* exports a single function
* accepts a configuration object
* returns a readable stream


### PSLayerData

    var readStream = require('photoshop/lib/components/PSLayerData')({
      "name": "Group 1",
      "psd": "/Users/aylott/Projects/node-photoshop/test/stuff/some stuff.psd"
    })
    
    // Parse the stream as JSON or whatever
    readStream
      .pipe(require('JSONStream').parse())
      .on('data', function(layer){
        console.dir('my awesome layer!', layer)
      })

Or, with the server...

http://0.0.0.0:8236/?component=PSLayerData&name=Group%201&psd=/Users/aylott/Projects/node-photoshop/test/stuff/some%20stuff.psd


### PSLayerImage

    var readStream = require('photoshop/lib/components/PSLayerImage')({
      "name": "Group 1",
      "psd": "/Users/aylott/Projects/node-photoshop/test/stuff/some stuff.psd"
    })
    
    // Write it out to a file or whatever
    readStream.pipe(fs.createWriteStream(process.env.HOME + '/Desktop/Group 1.png'))

Or, with the server...

http://0.0.0.0:8236/?component=PSLayerImage&name=Group%201&psd=/Users/aylott/Projects/node-photoshop/test/stuff/some%20stuff.psd


### HTTP Server

The QueryString is the configuration object.
The `component` QueryString parameter is the id of the component.

    $ npm start

or

    require('photoshop/server').createServer(config, callback).listen(8345)

