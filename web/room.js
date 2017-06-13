class Room {
  constructor(geometry, {fillStyle, strokeStyle}, angle) {
    this.geometry = geometry.map(polygon => polygon.map(p => new Point(p.x, p.y).rotateAngle(angle)))
    this.strokeStyle = strokeStyle
    this.fillStyle = fillStyle
  }

  render(ctx, t) {
    ctx.strokeStyle = this.strokeStyle
    ctx.fillStyle = this.fillStyle
    drawPolygon(ctx, t, this.geometry)
  }
}

const room = new Room([
  [
    {x: 135, y: 65},
    {x: 140, y: 65},
    {x: 140, y: -65},
    {x: -130, y: -65},
    {x: -130, y: 15},
    {x: -65, y: 15},
    {x: -65, y: -45},
    {x: -15, y: -45},
    {x: -15, y: 65}
  ],
  [
    {x: 50, y: -30},
    {x: 100, y: -30},
    {x: 100, y: 50},
    {x: 50, y: 50}
  ]
], {
  strokeStyle: 'rgb(60, 60, 180)',
  fillStyle: 'rgba(180, 180, 255, 0.4)'
}, Math.PI / 6)
