# Photoshop scripting with Node.js

    npm install photoshop

---

## `photoshop.invoke(fn, [args,] callback)`

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

    function setColor_jsx(color){
      app.foregroundColor.rgb.red = color.red
      app.foregroundColor.rgb.green = color.green
      app.foregroundColor.rgb.blue = color.blue
      return app.foregroundColor.rgb.hexValue
    }

    var config = {
      red: Math.random() * 255,
      green: Math.random() * 255,
      blue: Math.random() * 255
    }

    require('photoshop').invoke(setColor_jsx, [config], function(error, foregroundColor){
      console.log('#' + foregroundColor)
    })
