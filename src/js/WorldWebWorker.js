var World = require('./World.js')

var world;

self.addEventListener('message', function (e) {
    world = null;
    world = new World(e.data);
    world.init()

}, false);

setInterval(function () {
    if (world) {
        world.doWorldTick();
        self.postMessage(world.getData());
    }
}, 30);
    





