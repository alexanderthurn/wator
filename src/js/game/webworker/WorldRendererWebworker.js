var WorldElement = require('../WorldElement')

class WorldRendererSync {

    imageData1 = null;
    imageData2 = null;
    oldTypeData1 = null;
    oldTypeData2 = null;

    init = (world, canvas, ctx) => {
        this.imageData1 = ctx.createImageData(world.width, world.height);
        this.imageData2 = ctx.createImageData(world.width, world.height);
        this.oldTypeData1 = new Array(world.width * world.height);
        this.oldTypeData2 = new Array(world.width * world.height);
        for (var i = 0; i < this.imageData1.data.length; i += 4) {
            this.renderEmpty(this.imageData1.data, i);
            this.renderEmpty(this.imageData2.data, i);
            this.oldTypeData1[i] = 0;
            this.oldTypeData2[i] = 0;
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

    pureRender = (world, imageData, doOldCheck) => {
        var renderedElements = 0;
        for (var i = 0; i < world.length; i += 1) {
            let element = world.getValueAtIndexUnsafe(i);
            let elementType = WorldElement.typeOf(element);

            if (!doOldCheck || elementType !== this.oldTypeData1[i]) {
                if (doOldCheck) {
                    this.oldTypeData1[i] = elementType;
                }
                renderedElements++;
                switch (elementType) {
                    case WorldElement.TYPE_SHARK:
                        this.renderShark(imageData.data, i * 4);
                        break;
                    case WorldElement.TYPE_FISH:
                        this.renderFish(imageData.data, i * 4);
                        break;
                    default:
                        this.renderEmpty(imageData.data, i * 4);
                        break;
                }
            }


        }
    };
    renderImage = (world, canvas, ctx) => {
        if (!this.imageData1 || this.imageData1.data.length !== world.length * 4) {
            this.init(world, canvas, ctx);
        }

        var renderedElements = this.pureRender(world, this.imageData1, true);
        this.pureSwapImageData(this.imageData1);


        return renderedElements;
    };

    pureSwapImageData = (imageData) => {
        this.imageData1 = imageData;

        var temp = this.imageData2;
        this.imageData2 = this.imageData1;
        this.imageData1 = temp;

        temp = this.oldTypeData2;
        this.oldTypeData2 = this.oldTypeData1;
        this.oldTypeData1 = temp;
    }

    getImageData = () => {
        return this.imageData1;
    };


    render = (world, canvas, ctx) => {
        if (this.imageData2) {
            ctx.putImageData(this.imageData2, 0, 0);
        } else {
            ctx.fillStyle = 'rgba(0,0, 0, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
    }
}

module.exports = WorldRendererSync;