function drawPolygon(ctx, t, geometry) {
  ctx.beginPath()
  geometry.forEach(polygon => {
    const p = t.apply(polygon[0].clone())
    ctx.moveTo(p.x, p.y)
    polygon.forEach(point => {
      const p = t.apply(point.clone())
      ctx.lineTo(p.x, p.y)
    })
    ctx.closePath()
  })
  ctx.fill()
  ctx.stroke()
}
