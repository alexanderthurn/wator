var helper = require('./helper.js')
var World = require('./World.js')

var WorldWebWorker = require('worker-loader!./WorldWebWorker.js')

var WorldRendererSync = require('./WorldRendererSync.js')
var WorldRendererAsync = require('./WorldRendererAsync.js')
var WorldRendererWebWorker = require('./WorldRendererWebWorker.js')

const UPDATE_MODE_SINGLETHREAD = 0;
const UPDATE_MODE_INTERVAL = 1;
const UPDATE_MODE_WEBWORKER = 2;


/* start as soon as things are set up */
document.addEventListener("DOMContentLoaded", function (event) {

    var showText = (text) => {
        elemDescription.innerHTML = text;
    }
    var showFPS = (text) => {
        elemFPS.innerHTML = text;
    }

    var showInfos = () => {
        if (urlMode === 2) {
            updateMode = UPDATE_MODE_WEBWORKER;
            showText(urlParam + ' WEBWORKER ' + scaleFactor.toFixed(1) + (world ? (' ' + world.width + 'x' + world.height) : ''));

        } else if (urlMode === 1) {
            updateMode = UPDATE_MODE_INTERVAL;
            showText(urlParam + ' INTERVAL ' + scaleFactor.toFixed(1) + (world ? (' ' + world.width + 'x' + world.height) : ''));
        } else {
            updateMode = UPDATE_MODE_SINGLETHREAD;
            showText(urlParam + ' SINGLETHREAD ' + scaleFactor.toFixed(1) + (world ? (' ' + world.width + 'x' + world.height) : ''));
        }

    }
    var dt;
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext("2d")
    var time;
    var worldRenderer, world;
    var updateMode = UPDATE_MODE_SINGLETHREAD;
    var worldWebWorker;
    var elemDescription = document.getElementById('description');
    var elemFPS = document.getElementById('fps');
    var world;

    var urlParam = window.location.search && window.location.search.length > 1 && parseInt(window.location.search.substring(1)) || 0;
    var urlMode = urlParam % 3;
    var scaleFactor = urlParam > 2 ? 1.0 : 0.5;
    if (scaleFactor < 0.99) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    }

    showInfos();


    canvas.onclick = () => {
        window.location.search = '?' + ((urlParam + 1) % 6);
    }


    if (!window.requestAnimationFrame) {
        helper.injectRequestAnimationFrame();
    }
    if (updateMode === UPDATE_MODE_WEBWORKER) {
        if (typeof(Worker) !== "undefined") {
            console.log('webworker supported')
        } else {
            updateMode = UPDATE_MODE_SINGLETHREAD;
        }

    }


    var init = () => {

        var options = {
            width: Math.floor(document.body.clientWidth * scaleFactor),
            height: Math.floor(document.body.clientHeight * scaleFactor),
            fishStartCount: 1000,
            fishReproductionTicks: 50,
            fishEnergy: 10000,
            sharkStartCount: 50,
            sharkReproductionTicks: 10,
            sharkEnergy: 20
        }

        world = new World(options);
        world.init()
        var data = world.getData();

        if (updateMode !== UPDATE_MODE_WEBWORKER) {
            worldRenderer = new WorldRendererSync();
        } else {
            worldRenderer = new WorldRendererWebWorker();
        }

        if (updateMode === UPDATE_MODE_WEBWORKER) {
            if (worldWebWorker) {
                worldWebWorker.terminate();
            }
            worldWebWorker = new WorldWebWorker();
            worldWebWorker.postMessage({options: options, data: data}, [data.buffer]);
            worldWebWorker.addEventListener('message', function (e) {
                world.setData(e.data);
                worldRenderer.renderImage(world, canvas, ctx);
                worldWebWorker.postMessage(e.data, [e.data.buffer]);
            }, false);
        }


        canvas.width = options.width;
        canvas.height = options.height;
        console.log('init done', urlMode, updateMode, options)

        showInfos();
    };

    // render canvas
    var updateCanvas = function (options) {
        worldRenderer.render(world, canvas, ctx)
    };

    var updateCanvasRegular = function () {

        var now = new Date().getTime();
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
        if (updateMode === UPDATE_MODE_INTERVAL) {
            setInterval(() => {
                world.doWorldTick();
            }, 30)
        }
    };

    var uppdateFPSRegular = function () {
        setInterval(() => {
            showFPS(Math.floor(1000.0 / dt))
        }, 1000);
    };

    init();
    updateCanvasRegular();
    updateWorldRegular();
    uppdateFPSRegular();

    window.onresize = function (event) {
        init();
    };

})
