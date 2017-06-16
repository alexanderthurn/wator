import {Igloo} from "../lib/igloo-0.1.0";

/**
 * Game of Life simulation and display.
 * @param {HTMLCanvasElement} canvas Render target
 * @param {number} [scale] Size of each cell in pixels (power of 2)
 */
function GOL(canvas, scale) {
    var igloo = this.igloo = new Igloo(canvas);
    var gl = igloo.gl;
    if (gl == null) {
        alert('Could not initialize WebGL!');
        throw new Error('No WebGL');
    }
    scale = this.scale = scale || 4;
    var w = canvas.width, h = canvas.height;
    this.viewsize = new Float32Array([w, h]);
    this.statesize = new Float32Array([w / scale, h / scale]);
    this.timer = null;
    this.lasttick = GOL.now();
    this.fps = 0;

    gl.disable(gl.DEPTH_TEST);
    this.programs = {
        copy: igloo.program('glsl/quad.vert', 'glsl/copy.frag'),
        gol: igloo.program('glsl/quad.vert', 'glsl/gol.frag')
    };
    this.buffers = {
        quad: igloo.array(Igloo.QUAD2)
    };
    this.textures = {
        front: igloo.texture(null, gl.RGBA, gl.REPEAT, gl.NEAREST)
            .blank(this.statesize[0], this.statesize[1]),
        back: igloo.texture(null, gl.RGBA, gl.REPEAT, gl.NEAREST)
            .blank(this.statesize[0], this.statesize[1])
    };
    this.framebuffers = {
        step: igloo.framebuffer()
    };
    this.setRandom();
}

/**
 * @returns {number} The epoch in integer seconds
 */
GOL.now = function () {
    return Math.floor(Date.now() / 1000);
};

/**
 * Compact a simulation state into a bit array.
 * @param {Object} state Array-like state object
 * @returns {ArrayBuffer} Compacted bit array
 */
GOL.compact = function (state) {
    var compact = new Uint8Array(state.length / 8);
    for (var i = 0; i < state.length; i++) {
        var ii = Math.floor(i / 8),
            shift = i % 8,
            bit = state[i] ? 1 : 0;
        compact[ii] |= bit << shift;
    }
    return compact.buffer;
};

/**
 * Expand a simulation state from a bit array.
 * @param {ArrayBuffer} compact Compacted bit array
 * @returns {Object} Array-like state object
 */
GOL.expand = function (buffer) {
    var compact = new Uint8Array(buffer),
        state = new Uint8Array(compact.length * 8);
    for (var i = 0; i < state.length; i++) {
        var ii = Math.floor(i / 8),
            shift = i % 8;
        state[i] = (compact[ii] >> shift) & 1;
    }
    return state;
};

/**
 * Set the entire simulation state at once.
 * @param {Object} state Boolean array-like
 * @returns {GOL} this
 */
GOL.prototype.set = function (state) {
    var gl = this.igloo.gl;
    var rgba = new Uint8Array(this.statesize[0] * this.statesize[1] * 4);
    for (var i = 0; i < state.length; i++) {
        var ii = i * 4;
        rgba[ii + 0] = rgba[ii + 1] = rgba[ii + 2] = state[i] ? 255 : 0;
        rgba[ii + 3] = 255;
    }
    this.textures.front.subset(rgba, 0, 0, this.statesize[0], this.statesize[1]);
    return this;
};

/**
 * Fill the entire state with random values.
 * @param {number} [p] Chance of a cell being alive (0.0 to 1.0)
 * @returns {GOL} this
 */
GOL.prototype.setRandom = function (p) {
    var gl = this.igloo.gl, size = this.statesize[0] * this.statesize[1];
    p = p == null ? 0.5 : p;
    var rand = new Uint8Array(size);
    for (var i = 0; i < size; i++) {
        rand[i] = Math.random() < p ? 1 : 0;
    }
    this.set(rand);
    return this;
};

/**
 * Clear the simulation state to empty.
 * @returns {GOL} this
 */
GOL.prototype.setEmpty = function () {
    this.set(new Uint8Array(this.statesize[0] * this.statesize[1]));
    return this;
};

/**
 * Swap the texture buffers.
 * @returns {GOL} this
 */
GOL.prototype.swap = function () {
    var tmp = this.textures.front;
    this.textures.front = this.textures.back;
    this.textures.back = tmp;
    return this;
};

/**
 * Step the Game of Life state on the GPU without rendering anything.
 * @returns {GOL} this
 */
GOL.prototype.step = function () {
    if (GOL.now() != this.lasttick) {
        this.lasttick = GOL.now();
        this.fps = 0;
    } else {
        this.fps++;
    }
    var gl = this.igloo.gl;
    this.framebuffers.step.attach(this.textures.back);
    this.textures.front.bind(0);
    gl.viewport(0, 0, this.statesize[0], this.statesize[1]);
    this.programs.gol.use()
        .attrib('quad', this.buffers.quad, 2)
        .uniformi('state', 0)
        .uniform('scale', this.statesize)
        .draw(gl.TRIANGLE_STRIP, 4);
    this.swap();
    return this;
};

/**
 * Render the Game of Life state stored on the GPU.
 * @returns {GOL} this
 */
GOL.prototype.draw = function () {
    var gl = this.igloo.gl;
    this.igloo.defaultFramebuffer.bind();
    this.textures.front.bind(0);
    gl.viewport(0, 0, this.viewsize[0], this.viewsize[1]);
    this.programs.copy.use()
        .attrib('quad', this.buffers.quad, 2)
        .uniformi('state', 0)
        .uniform('scale', this.viewsize)
        .draw(gl.TRIANGLE_STRIP, 4);
    return this;
};

/**
 * Set the state at a specific position.
 * @param {number} x
 * @param {number} y
 * @param {boolean} state True/false for live/dead
 * @returns {GOL} this
 */
GOL.prototype.poke = function (x, y, state) {
    var gl = this.igloo.gl,
        v = state * 255;
    this.textures.front.subset([v, v, v, 255], x, y, 1, 1);
    return this;
};

/**
 * @returns {Object} Boolean array-like of the simulation state
 */
GOL.prototype.get = function () {
    var gl = this.igloo.gl, w = this.statesize[0], h = this.statesize[1];
    this.framebuffers.step.attach(this.textures.front);
    var rgba = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
    var state = new Uint8Array(w * h);
    for (var i = 0; i < w * h; i++) {
        state[i] = rgba[i * 4] > 128 ? 1 : 0;
    }
    return state;
};

/**
 * Run the simulation automatically on a timer.
 * @returns {GOL} this
 */
GOL.prototype.start = function () {
    if (this.timer == null) {
        this.timer = setInterval(function () {
            gol.step();
            gol.draw();
        }, 60);
    }
    return this;
};

/**
 * Stop animating the simulation.
 * @returns {GOL} this
 */
GOL.prototype.stop = function () {
    clearInterval(this.timer);
    this.timer = null;
    return this;
};

/**
 * Toggle the animation state.
 * @returns {GOL} this
 */
GOL.prototype.toggle = function () {
    if (this.timer == null) {
        this.start();
    } else {
        this.stop();
    }
};

/* Initialize everything. */
var gol = null, controller = null;


document.addEventListener("DOMContentLoaded", function (event) {
    var canvas = document.getElementById('canvas')
    gol = new GOL(canvas).draw().start();
});

module.exports = GOL;