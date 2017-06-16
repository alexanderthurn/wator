var WorldElement = require('./WorldElement')
var GOL = require('./gol.js')

class WorldRendererShader {
    gol = null;

    init = (world, canvas, ctx) => {
        this.gol = new GOL(canvas).draw().start();
    };


    update = () => {
        gol.step();
    };
    render = (world, canvas, ctx) => {

        if (!this.gol) {
            this.init(world, canvas, ctx);
        }

        this.gol.draw();
    }
}

module.exports = WorldRendererShader;