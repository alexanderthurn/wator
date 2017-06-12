var WorldElement = require('./WorldElement')

class WorldRenderer {

    imageData = null;

    init = (world, canvas, ctx) => {
        this.imageData = ctx.createImageData(world.width, world.height);
        for (var i = 0; i < this.imageData.data.length; i += 4) {
            this.imageData.data[i + 0] = 0;
            this.imageData.data[i + 1] = 0;
            this.imageData.data[i + 2] = 0;
            this.imageData.data[i + 3] = 255;
        }
    };
    renderShark = (imageDataindex) => {
        this.imageData.data[imageDataindex + 0] = 255;
        this.imageData.data[imageDataindex + 1] = 0;
        this.imageData.data[imageDataindex + 2] = 0;
        this.imageData.data[imageDataindex + 3] = 255;
    };

    renderFish = (imageDataindex) => {

        this.imageData.data[imageDataindex + 0] = 0;
        this.imageData.data[imageDataindex + 1] = 255;
        this.imageData.data[imageDataindex + 2] = 0;
        this.imageData.data[imageDataindex + 3] = 255;
    };

    renderEmpty = (imageDataindex) => {

        this.imageData.data[imageDataindex + 0] = 0;
        this.imageData.data[imageDataindex + 1] = 0;
        this.imageData.data[imageDataindex + 2] = 0;
        this.imageData.data[imageDataindex + 3] = 255;
    };


    render = (world, canvas, ctx) => {
        ctx.fillStyle = 'rgba(0,0, 0, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        if (!this.imageData || this.imageData.data.length !== world.length * 4) {
            this.init(world, canvas, ctx);
        }

        for (var i = 0; i < world.length; i += 1) {
            let element = world.getValueAtIndexUnsafe(i);
            let elementType = WorldElement.typeOf(element);
            switch (elementType) {
                case WorldElement.TYPE_SHARK:
                    this.renderShark(i * 4);
                    break;
                case WorldElement.TYPE_FISH:
                    this.renderFish(i * 4);
                    break;
                default:
                    this.renderEmpty(i * 4);
                    break;
            }

        }

        //ctx.fillStyle = 'rgba(0,255,255,1)'
        // ctx.fillRect(canvas.width * 0.5, 0, canvas.width, canvas.height)
        ctx.putImageData(this.imageData, 0, 0);
    }
}

module.exports = WorldRenderer;