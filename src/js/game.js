var helper = require('./helper.js')
var World = require('./World.js')
var WorldElement = require('./WorldElement.js')

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
        showText(urlParam + ' ' + scaleFactor.toFixed(1) + (world ? (' ' + world.width + 'x' + world.height) : ''));
    }
    var dtRender, dtCalc;
    var timeRender = new Date().getTime();
    var timeCalc = new Date().getTime();
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext("2d")
    var worldRenderer;
    var updateMode = UPDATE_MODE_SINGLETHREAD;
    var worldWebWorker;
    var elemDescription = document.getElementById('description');
    var elemFPS = document.getElementById('fps');
    var world;
    var brushSizeHalf = Math.ceil((helper.getSearchParam('brushSize') || 5) * 0.5);
    var fishesPositionsToBePlaced = [];

    var urlParam = helper.getSearchParam('calcMethod') || 'UI';

    switch (urlParam) {
        case 'UI':
            updateMode = UPDATE_MODE_SINGLETHREAD;
            break;
        case 'INTERVAL':
            updateMode = UPDATE_MODE_INTERVAL;
            break;
        case 'WEBWORKER':
            updateMode = UPDATE_MODE_WEBWORKER;
            break;
    }
    var scaleFactor = parseFloat(helper.getSearchParam('scaleFactor') || 0.2);


    if (scaleFactor < 0.99) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
    }

    showInfos();

    var getMousePos = function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor((evt.clientX - rect.left) * scaleFactor),
            y: Math.floor((evt.clientY - rect.top) * scaleFactor)
        };
    }

    var getTouchPos = function (canvas, touchEvent) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor((touchEvent.touches[0].clientX - rect.left) * scaleFactor),
            y: Math.floor((touchEvent.touches[0].clientY - rect.top) * scaleFactor)
        };
    }

    var placeFishes = function (mousePos, type, _brushSizeHalf) {
        for (var x = mousePos.x - _brushSizeHalf; x < mousePos.x + _brushSizeHalf; x++) {
            for (var y = mousePos.y - _brushSizeHalf; y < mousePos.y + _brushSizeHalf; y++) {
                fishesPositionsToBePlaced.push({
                    x: x,
                    y: y,
                    type: type
                });
            }
        }
    }

    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        if (evt.buttons > 0 || helper.isTouchDevice()) {
            if (helper.isTouchDevice() && mousePos.x < canvas.width * 0.5) {
                placeFishes(mousePos, WorldElement.TYPE_SHARK, brushSizeHalf)
            } else {
                placeFishes(mousePos, evt.buttons === 2 ? WorldElement.TYPE_SHARK : (evt.buttons === 4 ? WorldElement.TYPE_EMPTY : WorldElement.TYPE_FISH), (evt.buttons === 4 ? brushSizeHalf * 8 : brushSizeHalf))
            }

        }

    }, false);

    canvas.addEventListener('mousedown', function (evt) {
        var mousePos = getMousePos(canvas, evt);
        if (evt.buttons > 0) {
            placeFishes(mousePos, evt.buttons === 2 ? WorldElement.TYPE_SHARK : (evt.buttons === 4 ? WorldElement.TYPE_EMPTY : WorldElement.TYPE_FISH), (evt.buttons === 4 ? brushSizeHalf * 8 : brushSizeHalf))
        }

    }, false);

    /*
     canvas.addEventListener('touchmove', (evt) => {
     var mousePos = getTouchPos(canvas, evt);
     alert(mousePos.x, mousePos.y)
     if (evt.buttons > 0) {
     placeFishes(mousePos, evt.touches.length === 2 ? WorldElement.TYPE_SHARK : (evt.length === 3 ? WorldElement.TYPE_EMPTY : WorldElement.TYPE_FISH), (evt.buttons === 3 ? brushSizeHalf * 8 : brushSizeHalf))
     }
     }, false);
     */

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
            fishStartCount: parseInt(helper.getSearchParam('fishStartCount') || 1000),
            fishReproductionTicks: parseInt(helper.getSearchParam('fishReproductionTicks') || 50),
            fishEnergy: 10000,
            sharkStartCount: parseInt(helper.getSearchParam('sharkStartCount') || 50),
            sharkReproductionTicks: parseInt(helper.getSearchParam('sharkReproductionTicks') || 10),
            sharkEnergy: parseInt(helper.getSearchParam('sharkEnergy') || 20)
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
                world.fillWithFishes(fishesPositionsToBePlaced);
                worldRenderer.renderImage(world, canvas, ctx);
                worldWebWorker.postMessage(e.data, [e.data.buffer]);
                updateDTCalc()
            }, false);
        }


        canvas.width = options.width;
        canvas.height = options.height;
        console.log('init done', updateMode, options)

        showInfos();
    };

    // render canvas
    var updateCanvas = function () {
        worldRenderer.render(world, canvas, ctx)
    };

    var updateDTFPS = function () {
        var now = new Date().getTime();
        dtRender = now - timeRender;
        timeRender = now;
    }

    var updateDTCalc = function () {
        var now = new Date().getTime();
        dtCalc = now - timeCalc;
        timeCalc = now;
    }
    var updateCanvasRegular = function () {
        updateDTFPS()

        if (updateMode === UPDATE_MODE_SINGLETHREAD) {
            world.fillWithFishes(fishesPositionsToBePlaced);
            world.doWorldTick()
            updateDTCalc()
        }

        updateCanvas()
        window.requestAnimationFrame(updateCanvasRegular)

    };

    var updateWorldRegular = function () {
        if (updateMode === UPDATE_MODE_INTERVAL) {
            setInterval(() => {
                world.fillWithFishes(fishesPositionsToBePlaced);
                world.doWorldTick();
                updateDTCalc()
            }, 30)
        }
    };

    var uppdateFPSRegular = function () {
        setInterval(() => {
            showFPS(Math.floor(1000.0 / dtCalc) + ' / ' + Math.floor(1000.0 / dtRender))
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
