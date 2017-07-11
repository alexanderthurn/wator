var World = require('../World.js')
var WorldRendererWebWorker = require('../webworker/WorldRendererWebWorker.js')

var world;
var imageData = null;
var worldRenderer = new WorldRendererWebWorker()
self.addEventListener('message', function (e) {

    if (e.data.options) {
        world = new World(e.data.options);
        world.setData(e.data.data);
    }

    if (e.data.imageData) {
        imageData = e.data.imageData;
    }
}, false);

console.log('webworker')


const update = () => {
    if (world) {

        world.doWorldTick();

        console.log('render', imageData)
        if (imageData) {
            worldRenderer.pureRender(world, imageData, false);
            self.postMessage(imageData, [imageData.data.buffer]);
        }
    }
    setTimeout(() => {
        update()
    }, 0);

}
setTimeout(() => {
    update()
}, 0);
