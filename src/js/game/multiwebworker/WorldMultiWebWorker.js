var World = require('../World.js')
var worldInternal;
var worldExternal;


self.addEventListener('message', function (e) {

    if (e.data.options) {
        worldInternal = new World(e.data.options);
        worldInternal.setData(e.data.data);

        worldExternal = new World(e.data.options);
        worldExternal.init({empty: true});

    } else {
        worldExternal.setData(e.data);
    }
}, false);

console.log('webworker')


const update = () => {
    if (worldInternal && worldExternal) {

        worldInternal.doWorldTick();

        var dataInternal = worldInternal.getData();
        var dataExternal = worldExternal.getData();


        if (dataExternal && dataExternal.length > 0) {
            dataExternal.set(dataInternal);
            self.postMessage(dataExternal, [dataExternal.buffer]);
        }

    }
    setTimeout(() => {
        update()
    }, 0);

}
setTimeout(() => {
    update()
}, 0);
