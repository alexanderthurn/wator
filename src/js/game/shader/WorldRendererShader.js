var WorldElement = require('../WorldElement')

class WorldRendererSync {


    init = (world, canvas, ctx) => {
        this.imageData = ctx.createImageData(world.width, world.height);
    };


    render = (world, canvas, ctx) => {
        var renderedElements = 0;


        if (!this.imageData || this.imageData.data.length !== world.length * 4) {
            this.init(world, canvas, ctx);
        }

        ctx.putImageData(this.imageData, 0, 0);


        ctx.fillStyle = 'rgba(255,0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
}

module.exports = WorldRendererSync;