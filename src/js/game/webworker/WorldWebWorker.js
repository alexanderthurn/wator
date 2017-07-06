var World = require('../World.js')
var world;


self.addEventListener('message', function (e) {

    if (e.data.options) {
        world = new World(e.data.options);
        world.setData(e.data.data);
    } else {
        world.setData(e.data);
    }


    world.doWorldTick();

    var data = world.getData();
    self.postMessage(data, [data.buffer]);
}, false);





