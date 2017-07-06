var WorldElement = require('../WorldElement')

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

    renderSync = (world) => {
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
        // ctx.fillStyle = 'rgba(0,0, 0, 1)';
        // ctx.fillRect(0, 0, canvas.width, canvas.height)
        var renderedElements = 0;

        if (!this.imageData || this.imageData.data.length !== world.length * 4) {
            this.init(world, canvas, ctx);
        }

        // renderedElements += this.renderSync(world);
        renderedElements += this.renderSync(world);


        //ctx.fillStyle = 'rgba(0,255,255,1)'
        // ctx.fillRect(canvas.width * 0.5, 0, canvas.width, canvas.height)
        ctx.putImageData(this.imageData, 0, 0);
        //console.log('renderedElements', renderedElements)
    }
}

module.exports = WorldRendererSync;