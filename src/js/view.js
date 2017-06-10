var helper = require('./helper.js')
var World = require('./World.js')
var WorldRenderer = require('./WorldRenderer.js')

/* start as soon as things are set up */
document.addEventListener("DOMContentLoaded", function (event) {

    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext("2d")
    var time;


    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    var fishStartCount = 1000;
    var fishReproductionTicks = 50;
    var fishEnergy = 10000;
    var sharkStartCount = 50;
    var sharkReproductionTicks = 10;
    var sharkEnergy = 20;

    var w = new World(width, height, fishStartCount, fishReproductionTicks, fishEnergy, sharkStartCount, sharkReproductionTicks, sharkEnergy);
    canvas.width = width;
    canvas.height = height;
    w.init()


    var wRenderer = new WorldRenderer();

    // render canvas
    var updateCanvas = function (options) {


        ctx.fillStyle = 'rgba(255,0, 255, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height)


        wRenderer.render(w, canvas, ctx)
        /*
         // show some more shutup texts to get a nice effect
         ctx.save()
         ctx.translate(canvas.width * 0.5, canvas.height * 0.5)
         for (var i = 0; i < noiseMuteFilter.gain.value * 10; i++) {
         ctx.rotate(1)
         ctx.scale(0.9, 0.9)
         ctx.fillText(INTL_SHUTUP_MESSAGE, canvas.width * Math.random(), canvas.height * Math.random())
         }
         ctx.restore()

         // render the volume bars
         for (var i = 0; i < arrayLength; i++) {
         var value = values[i]
         ctx.fillStyle = myGradient
         //  ctx.rotate((1.0 / 360.) * Math.PI * 2)
         ctx.fillRect(i * canvas.width / arrayLength, canvas.height - value * canvas.height, canvas.width / arrayLength, value * canvas.height)
         }
         */

    }

    var updateCanvasRegular = function () {

        var now = new Date().getTime(),
            dt = now - (time || now);

        var dtFactor = dt / 30.0;
        if (dtFactor < 0.001) {
            dtFactor = 0.001;
        } else if (dtFactor > 5.0) {
            dtFactor = 5.0;
        }
        time = now;


        updateCanvas({dtFactor: dtFactor})
        window.requestAnimationFrame(updateCanvasRegular)

    }


    updateCanvasRegular()


})
