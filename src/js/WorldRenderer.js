class WorldRenderer {

    imageData = null;

    render = (world, canvas, ctx) => {
        if (!this.imageData) {
            this.imageData = ctx.createImageData(canvas.width, canvas.height);
            for (var i = 0; i < this.imageData.data.length; i += 4) {
                this.imageData.data[i + 0] = 0;
                this.imageData.data[i + 1] = 100;
                this.imageData.data[i + 2] = 255;
                this.imageData.data[i + 3] = 255;
            }
        }
        console.log(world)
        //ctx.fillStyle = 'rgba(0,255,255,1)'
        // ctx.fillRect(canvas.width * 0.5, 0, canvas.width, canvas.height)
        ctx.putImageData(this.imageData, 0, 0);
    }
}

module.exports = WorldRenderer;