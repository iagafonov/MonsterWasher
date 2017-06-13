class Bot {
  constructor(room) {
    this._room = room
    this.pos = new Point(0, 0)
    this.speed = 0
    this._angle = 0
    this.heading = new Point(Math.cos(this._angle), Math.sin(this._angle))
    this._lastTime = Date.now() / 1000
    this._state = 'lookAround'
    this._visionLength = 100
    this._lookAroundInterval = 200 / 1000
    this._lookAroundCounter = this._lookAroundInterval
    this._data = []
  }

  get angle() {
    return this._angle
  }

  set angle(v) {
    this._angle = v
    this.heading = new Point(Math.cos(v), Math.sin(v))
  }

  tick() {
    const t = Date.now() / 1000
    const dt = t - this._lastTime
    this[this._state](dt)
    this._lastTime = t
  }

  look() {
    const vision = this.heading.clone().mulVal(this._visionLength)
    this._room.geometry.forEach((polygon, index) => {
      let intersection = null
      let intersectionLength = 0
      let p0 = polygon[polygon.length - 1]
      for (let i = 0, maxi = polygon.length; i < maxi; i++) {
        const p1 = polygon[i]
        const int = findIntersection(this.pos, vision, p0, p1)
        if (int) {
          const len = int.clone().sub(this.pos).length
          if (!intersection || intersectionLength > len) {
            intersection = int
            intersectionLength = len
          }
        }
        p0 = p1
      }
      if (!intersection) {
        intersection = vision.clone().add(this.pos)
        intersectionLength = vision.length
      }

      if (!this._data[index]) {
        this._data[index] = []
      }
      const dPoly = this._data[index]

      intersection.add(new Point(Math.random() * intersectionLength * 0.01, Math.random() * intersectionLength * 0.01))
      dPoly.push(intersection)
    })
  }

  lookAround(dt) {
    if (this._lookAroundCounter >= this._lookAroundInterval) {
      this._lookAroundCounter -= this._lookAroundInterval
      this.look()
    }
    this.pos.add(this.heading.clone().mulVal(this.speed * dt))
    this.angle += dt * 0.3
    this._lookAroundCounter += dt
  }

  render(ctx, t) {
    ctx.strokeStyle = '#ff872f'
    ctx.fillStyle = '#000000'
    const p = this.pos
    const pC = t.apply(p.clone())
    const pA = t.apply(this.heading.clone().mulVal(20).add(p))
    ctx.beginPath()
    ctx.moveTo(pC.x, pC.y)
    ctx.lineTo(pA.x, pA.y)
    ctx.stroke()

    const rect = [
      new Point(-5, 8),
      new Point(5, 8),
      new Point(5, -8),
      new Point(-5, -8)
    ].map(point => t.apply(point.rotate(this.heading).add(p)))

    ctx.moveTo(rect[0].x, rect[0].y)
    rect.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.closePath()
    ctx.fill()

    ctx.fillText(p.clone().round(1), pC.x + 20 * t.k, pC.y + 7)
    this._renderData()
  }

  _renderData() {
    if (this._data && this._data[0] && this._data[0].length) {
      ctx.strokeStyle = '#001242'
      ctx.fillStyle = '#rgba(120, 120, 180, 0.5)'
      drawPolygon(ctx, t, this._data)
    }
  }
}
