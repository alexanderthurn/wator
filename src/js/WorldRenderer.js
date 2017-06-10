class WorldRenderer {
    render = (world, canvas, ctx) => {
        ctx.fillStyle = 'rgba(0,255,255,1)'
        ctx.fillRect(canvas.width * 0.5, 0, canvas.width, canvas.height)
    }
}

module.exports = WorldRenderer;