var WorldElement = require('./WorldElement')

class WorldRendererSync {

    imageData = null;
    oldType = null;

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

    renderImage = (world, canvas, ctx) => {
        if (!this.imageData || this.imageData.data.length !== world.length * 4) {
            this.init(world, canvas, ctx);
        }

        var renderedElements = 0;
        for (var i = 0; i < world.length; i += 1) {
            let element = world.getValueAtIndexUnsafe(i);
            let elementType = WorldElement.typeOf(element);

            if (elementType !== this.oldType[i]) {
                this.oldType[i] = elementType;
                renderedElements++;
                switch (elementType) {
                    case WorldElement.TYPE_SHARK:
                        this.renderShark(this.imageData.data, i * 4);
                        break;
                    case WorldElement.TYPE_FISH:
                        this.renderFish(this.imageData.data, i * 4);
                        break;
                    default:
                        this.renderEmpty(this.imageData.data, i * 4);
                        break;
                }
            }


        }

        return renderedElements;
    };


    render = (world, canvas, ctx) => {
        if (this.imageData) {
            ctx.putImageData(this.imageData, 0, 0);
        }
    }
}

module.exports = WorldRendererSync;