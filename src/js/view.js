var helper = require('./helper.js')
var World = require('./World.js')
var WorldRendererSync = require('./WorldRendererSync.js')
var WorldRendererAsync = require('./WorldRendererAsync.js')

const UPDATE_MODE_SINGLETHREAD = 0;
const UPDATE_MODE_INTERVANL = 1;
const UPDATE_MODE_WEBWORKER = 2;


const RENDER_MODE_SYNC = 0;
const RENDER_MODE_ASYNC = 1;

/* start as soon as things are set up */
document.addEventListener("DOMContentLoaded", function (event) {

    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext("2d")
    var time;
    var worldRenderer, world;
    var updateMode = UPDATE_MODE_INTERVANL;
    var renderMode = RENDER_MODE_SYNC;
    var scaleFactor = 0.5;

    var init = () => {

        var width = Math.floor(document.body.clientWidth * scaleFactor);
        var height = Math.floor(document.body.clientHeight * scaleFactor);
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

        if (renderMode === RENDER_MODE_SYNC) {
            worldRenderer = new WorldRendererSync();
        } else if (renderMode === RENDER_MODE_ASYNC) {
            worldRenderer = new WorldRendererAsync();
        }

        console.log('init done', width, height, world)
    };

    // render canvas
    var updateCanvas = function (options) {
        worldRenderer.render(world, canvas, ctx)
    };

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

        if (updateMode === UPDATE_MODE_SINGLETHREAD) {
            world.doWorldTick()
        }

        updateCanvas({dtFactor: dtFactor})
        window.requestAnimationFrame(updateCanvasRegular)

    };

    var updateWorldRegular = function () {
        if (updateMode === UPDATE_MODE_INTERVANL) {
            setInterval(world.doWorldTick, 30)
        }
    };


    init();
    updateCanvasRegular();
    updateWorldRegular();

    window.onresize = function (event) {
        init();
    };

})
