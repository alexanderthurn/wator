var VecN = VecN || function () {
    };
VecN.FIELDS = "xyzwabcdefghijklmnopqrstuv".split("");
VecN.make = function (c) {
    if (c > VecN.FIELDS.length) {
        throw new Error("VecN limited to " + VecN.FIELDS.length)
    }
    function d(q, i) {
        var p = q.slice(0);
        p.push(i);
        p.unshift(null);
        var n = Function.bind.apply(Function, p);
        return new n()
    }

    var k = VecN.FIELDS.slice(0, c);
    var e = d(k, k.map(function (i) {
        return "this." + i + " = " + i + ";"
    }).join("\n"));
    e.prototype = Object.create(VecN.prototype);
    e.prototype.constructor = e;
    e.prototype.length = c;
    e.prototype.VecN = this;
    e.prototype.toString = d([], 'return "[Vec' + c + ' (" + ' + k.map(function (i) {
            return "this." + i
        }).join(' + ", " + ') + ' + ")]";');
    function h(n, i) {
        i = i || "this.constructor";
        return "return new " + i + "(" + k.map(n).join(", ") + ");"
    }

    function l(i) {
        return d(["vec"], h(function (n) {
            return "this." + n + " " + i + " vec." + n
        }))
    }

    e.prototype.add = l("+");
    e.prototype.subtract = l("-");
    e.prototype.multiply = l("*");
    e.prototype.divide = l("/");
    function j(i) {
        return d(["scalar"], h(function (n) {
            return "this." + n + " " + i + " scalar"
        }))
    }

    e.prototype.fadd = j("+");
    e.prototype.fsubtract = j("-");
    e.prototype.fmultiply = j("*");
    e.prototype.fdivide = j("/");
    e.prototype.magnitude = d([], "return Math.sqrt(" + k.map(function (i) {
            return "this." + i + " * this." + i
        }).join(" + ") + ");");
    function o(i, n) {
        n = n || [];
        return d(n, h(function (q) {
            var p = n.slice(0);
            p.unshift("this." + q);
            return i + "(" + p.join(", ") + ")"
        }))
    }

    e.prototype.floor = o("Math.floor");
    e.prototype.ceil = o("Math.ceil");
    e.prototype.abs = o("Math.abs");
    e.prototype.negate = o("-1 * ");
    e.prototype.pow = o("Math.pow", ["expt"]);
    e.prototype.pow2 = d([], h(function (i) {
        return "this." + i + " * this." + i
    }));
    e.prototype.pow3 = d([], h(function (i) {
        return "this." + i + " * this." + i + " * this." + i
    }));
    e.prototype.product = d([], "return " + k.map(function (i) {
            return "this." + i
        }).join(" * ") + ";");
    e.prototype.sum = d([], "return " + k.map(function (i) {
            return "this." + i
        }).join(" + ") + ";");
    e.prototype.normalize = function g() {
        return this.fdivide(this.magnitude())
    };
    e.prototype.dot = function a(i) {
        return this.multiply(i).sum()
    };
    e.prototype.toArray = d([], "return [" + k.map(function (i) {
            return "this." + i
        }).join(", ") + "]");
    function m(i) {
        var n = i.map(function (p) {
            return "this." + p
        }).join(", ");
        Object.defineProperty(e.prototype, i.join(""), {get: new Function("return new this.VecN.Vec" + i.length + "(" + n + ");")})
    }

    function b(i, n) {
        k.forEach(function (p) {
            i.push(p);
            if (n === 1) {
                m(i)
            } else {
                b(i, n - 1)
            }
            i.pop()
        })
    }

    if (c <= 6) {
        for (var f = 2; f <= c; f++) {
            b([], f)
        }
    }
    e.random = d([], h(function () {
        return "Math.random()"
    }, "this"));
    return e
};
(10);
VecN.convenience = function (a) {
    return function () {
        var d = [];
        for (var f = 0; f < arguments.length; f++) {
            var c = arguments[f];
            if (c.toArray) {
                d.push.apply(d, c.toArray())
            } else {
                d.push(c)
            }
        }
        var b = VecN["Vec" + a];
        var e = Object.create(b.prototype);
        b.apply(e, d);
        return e
    }
};
VecN.Vec2 = VecN.make(2);
VecN.Vec3 = VecN.make(3);
VecN.Vec4 = VecN.make(4);
var vec2 = VecN.convenience(2);
var vec3 = VecN.convenience(3);
var vec4 = VecN.convenience(4);
function Igloo(b) {
    var a;
    if (b instanceof HTMLCanvasElement) {
        a = b;
        b = Igloo.getContext(b, true)
    } else {
        a = b.canvas
    }
    this.gl = b;
    this.canvas = a;
    this.defaultFramebuffer = new Igloo.Framebuffer(b, null)
}
Igloo.fetch = function (a, c) {
    var b = new XMLHttpRequest();
    b.open("GET", a, Boolean(c));
    if (c != null) {
        b.onload = function () {
            c(b.responseText)
        }
    }
    b.send();
    return b.responseText
};
Igloo.getContext = function (a, b) {
    var d;
    try {
        d = a.getContext("webgl") || a.getContext("experimental-webgl")
    } catch (c) {
        d = null
    }
    if (d == null && !b) {
        throw new Error("Could not create WebGL context.")
    } else {
        return d
    }
};
Igloo.QUAD2 = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
Igloo.looksLikeURL = function (a) {
    return /^[\w+:\/\/]/.exec(a) != null
};
Igloo.prototype.program = function (c, b, a) {
    if (Igloo.looksLikeURL(c)) {
        c = Igloo.fetch(c)
    }
    if (Igloo.looksLikeURL(b)) {
        b = Igloo.fetch(b)
    }
    if (a != null) {
        c = a(c);
        b = a(b)
    }
    return new Igloo.Program(this.gl, c, b)
};
Igloo.prototype.array = function (c, b) {
    var d = this.gl, a = new Igloo.Buffer(d, d.ARRAY_BUFFER);
    if (c != null) {
        a.update(c, b == null ? d.STATIC_DRAW : b)
    }
    return a
};
Igloo.prototype.elements = function (c, b) {
    var d = this.gl, a = new Igloo.Buffer(d, d.ELEMENT_ARRAY_BUFFER);
    if (c != null) {
        a.update(c, b == null ? d.STATIC_DRAW : b)
    }
    return a
};
Igloo.prototype.texture = function (d, e, b, a) {
    var c = new Igloo.Texture(this.gl, e, b, a);
    if (d != null) {
        c.set(d)
    }
    return c
};
Igloo.prototype.framebuffer = function (a) {
    var b = new Igloo.Framebuffer(this.gl);
    if (a != null) {
        b.attach(a)
    }
    return b
};
Igloo.Program = function (d, b, a) {
    this.gl = d;
    var c = this.program = d.createProgram();
    d.attachShader(c, this.makeShader(d.VERTEX_SHADER, b));
    d.attachShader(c, this.makeShader(d.FRAGMENT_SHADER, a));
    d.linkProgram(c);
    if (!d.getProgramParameter(c, d.LINK_STATUS)) {
        throw new Error(d.getProgramInfoLog(c))
    }
    this.vars = {}
};
Igloo.Program.prototype.makeShader = function (a, c) {
    var d = this.gl;
    var b = d.createShader(a);
    d.shaderSource(b, c);
    d.compileShader(b);
    if (d.getShaderParameter(b, d.COMPILE_STATUS)) {
        return b
    } else {
        throw new Error(d.getShaderInfoLog(b))
    }
};
Igloo.Program.prototype.use = function () {
    this.gl.useProgram(this.program);
    return this
};
Igloo.Program.prototype.uniform = function (b, d, c) {
    if (d == null) {
        this.vars[b] = this.gl.getUniformLocation(this.program, b)
    } else {
        if (this.vars[b] == null) {
            this.uniform(b)
        }
        var a = this.vars[b];
        if (d instanceof VecN) {
            switch (d.length) {
                case 2:
                    if (c) {
                        this.gl.uniform2i(a, d.x, d.y)
                    } else {
                        this.gl.uniform2f(a, d.x, d.y)
                    }
                    break;
                case 3:
                    if (c) {
                        this.gl.uniform3i(a, d.x, d.y, d.z)
                    } else {
                        this.gl.uniform3f(a, d.x, d.y, d.z)
                    }
                    break;
                case 4:
                    if (c) {
                        this.gl.uniform4i(a, d.x, d.y, d.z, d.w)
                    } else {
                        this.gl.uniform4f(a, d.x, d.y, d.z, d.w)
                    }
                    break;
                default:
                    throw new Error("Invalid vector length")
            }
        } else {
            if (d instanceof Float32Array) {
                this.gl["uniform" + d.length + "fv"](a, d)
            } else {
                if (d instanceof Int32Array) {
                    this.gl["uniform" + d.length + "iv"](a, d)
                } else {
                    if (c) {
                        this.gl.uniform1i(a, d)
                    } else {
                        this.gl.uniform1f(a, d)
                    }
                }
            }
        }
    }
    return this
};
Igloo.Program.prototype.uniformi = function (a, b) {
    return this.uniform(a, b, true)
};
Igloo.Program.prototype.attrib = function (a, d, b, c) {
    var e = this.gl;
    if (d == null) {
        this.vars[a] = e.getAttribLocation(this.program, a)
    } else {
        if (this.vars[a] == null) {
            this.attrib(a)
        }
        d.bind();
        e.enableVertexAttribArray(this.vars[a]);
        e.vertexAttribPointer(this.vars[a], b, e.FLOAT, false, c == null ? 0 : c, 0)
    }
    return this
};
Igloo.Program.prototype.draw = function (d, b, a) {
    var c = this.gl;
    if (a == null) {
        c.drawArrays(d, 0, b)
    } else {
        c.drawElements(d, b, a, 0)
    }
    if (c.getError() !== c.NO_ERROR) {
        throw new Error("WebGL rendering error")
    }
    return this
};
Igloo.Program.prototype.disable = function () {
    for (var b in this.vars) {
        var a = this.vars[b];
        if (this.vars.hasOwnProperty(b)) {
            if (typeof a === "number") {
                this.gl.disableVertexAttribArray(a)
            }
        }
    }
    return this
};
Igloo.Buffer = function (b, a) {
    this.gl = b;
    this.buffer = b.createBuffer();
    this.target = (a == null ? b.ARRAY_BUFFER : a);
    this.size = -1
};
Igloo.Buffer.prototype.bind = function () {
    this.gl.bindBuffer(this.target, this.buffer);
    return this
};
Igloo.Buffer.prototype.update = function (b, a) {
    var c = this.gl;
    if (b instanceof Array) {
        b = new Float32Array(b)
    }
    a = a == null ? c.DYNAMIC_DRAW : a;
    this.bind();
    if (this.size !== b.byteLength) {
        c.bufferData(this.target, b, a);
        this.size = b.byteLength
    } else {
        c.bufferSubData(this.target, 0, b)
    }
    return this
};
Igloo.Texture = function (e, d, b, a) {
    this.gl = e;
    var c = this.texture = e.createTexture();
    e.bindTexture(e.TEXTURE_2D, c);
    b = b == null ? e.CLAMP_TO_EDGE : b;
    a = a == null ? e.LINEAR : a;
    e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, b);
    e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, b);
    e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, a);
    e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, a);
    this.format = d = d == null ? e.RGBA : d
};
Igloo.Texture.prototype.bind = function (a) {
    var b = this.gl;
    if (a != null) {
        b.activeTexture(b.TEXTURE0 + a)
    }
    b.bindTexture(b.TEXTURE_2D, this.texture);
    return this
};
Igloo.Texture.prototype.blank = function (b, a) {
    var c = this.gl;
    this.bind();
    c.texImage2D(c.TEXTURE_2D, 0, this.format, b, a, 0, this.format, c.UNSIGNED_BYTE, null);
    return this
};
Igloo.Texture.prototype.set = function (c, b, a) {
    var d = this.gl;
    this.bind();
    if (c instanceof Array) {
        c = new Uint8Array(c)
    }
    if (b != null || a != null) {
        d.texImage2D(d.TEXTURE_2D, 0, this.format, b, a, 0, d.UNSIGNED_BYTE, c)
    } else {
        d.texImage2D(d.TEXTURE_2D, 0, this.format, this.format, d.UNSIGNED_BYTE, c)
    }
    return this
};
Igloo.Texture.prototype.subset = function (d, b, f, c, a) {
    var e = this.gl;
    this.bind();
    if (d instanceof Array) {
        d = new Uint8Array(d)
    }
    if (c != null || a != null) {
        e.texSubImage2D(e.TEXTURE_2D, 0, b, f, c, a, this.format, e.UNSIGNED_BYTE, d)
    } else {
        e.texSubImage2D(e.TEXTURE_2D, 0, b, f, this.format, e.UNSIGNED_BYTE, d)
    }
    return this
};
Igloo.Framebuffer = function (b, a) {
    this.gl = b;
    this.framebuffer = arguments.length == 2 ? a : b.createFramebuffer();
    this.renderbuffer = null
};
Igloo.Framebuffer.prototype.bind = function () {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
    return this
};
Igloo.Framebuffer.prototype.unbind = function () {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    return this
};
Igloo.Framebuffer.prototype.attach = function (a) {
    var b = this.gl;
    this.bind();
    b.framebufferTexture2D(b.FRAMEBUFFER, b.COLOR_ATTACHMENT0, b.TEXTURE_2D, a.texture, 0);
    return this
};
Igloo.Framebuffer.prototype.attachDepth = function (b, a) {
    var c = this.gl;
    this.bind();
    if (this.renderbuffer == null) {
        this.renderbuffer = c.createRenderbuffer();
        c.renderbufferStorage(c.RENDERBUFFER, c.DEPTH_COMPONENT16, b, a);
        c.framebufferRenderbuffer(c.FRAMEBUFFER, c.DEPTH_ATTACHMENT, c.RENDERBUFFER, this.renderbuffer)
    }
    return this
};

export {Igloo, VecN}