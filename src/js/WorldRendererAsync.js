var WorldElement = require('./WorldElement')

class WorldRendererAsync {

    imageData = null;
    oldType = null;
    renderStep = 0;
    init = (world, canvas, ctx) => {
        this.imageData = ctx.createImageData(world.width, world.height);
        this.oldType = new Array(world.width * world.height);
        for (var i = 0; i < this.imageData.data.length; i += 4) {
            this.renderEmpty(this.imageData.data, i);
            this.oldType[i] = 0;
        }

    };
    renderShark = (data, imageDataindex) => {
        data[imageDataindex + 0] = 255;
        data[imageDataindex + 1] = 0;
        data[imageDataindex + 2] = 0;
        data[imageDataindex + 3] = 255;
    };

    renderFish = (data, imageDataindex) => {
        data[imageDataindex + 0] = 0;
        data[imageDataindex + 1] = 255;
        data[imageDataindex + 2] = 0;
        data[imageDataindex + 3] = 255;
    };

    renderEmpty = (data, imageDataindex) => {
        data[imageDataindex + 0] = 0;
        data[imageDataindex + 1] = 0;
        data[imageDataindex + 2] = 0;
        data[imageDataindex + 3] = 255;
    };

    renderAsync = (world) => {


    };

    render = (world, canvas, ctx) => {
        ctx.fillStyle = 'rgba(0,0, 0, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        /*var renderedElements = 0;

         if (!this.imageData || this.imageData.data.length !== world.length * 4) {
         this.init(world, canvas, ctx);
         }


         renderedElements += this.renderAsync(world);


         //ctx.fillStyle = 'rgba(0,255,255,1)'
         // ctx.fillRect(canvas.width * 0.5, 0, canvas.width, canvas.height)
         //  ctx.putImageData(this.imageData, 0, 0);
         //console.log('renderedElements', renderedElements)

         */
    }
}

module.exports = WorldRendererAsync;