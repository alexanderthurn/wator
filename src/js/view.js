var helper = require('./helper.js')
var World = require('./World.js')
var WorldRenderer = require('./WorldRenderer.js')

/* start as soon as things are set up */
document.addEventListener("DOMContentLoaded", function (event) {

    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext("2d")
    var time;
    var worldRenderer, world;


    var init = () => {

        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        var fishStartCount = 1000;
        var fishReproductionTicks = 50;
        var fishEnergy = 10000;
        var sharkStartCount = 50;
        var sharkReproductionTicks = 10;
        var sharkEnergy = 20;

        world = new World(width, height, fishStartCount, fishReproductionTicks, fishEnergy, sharkStartCount, sharkReproductionTicks, sharkEnergy);
        canvas.width = width;
        canvas.height = height;
        world.init()


        worldRenderer = new WorldRenderer();

        console.log('init done', width, height, world)
    }

    // render canvas
    var updateCanvas = function (options) {
        worldRenderer.render(world, canvas, ctx)
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


    init();
    updateCanvasRegular();

    window.onresize = function (event) {
        init();
    };

})
