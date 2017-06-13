class Bot {
  constructor(room) {
    this._room = room
    this.pos = new Point(15, 2)
    this.speed = 0
    this.visionLength = 100
    this._angle = 0
    this.heading = new Point(Math.cos(this._angle), Math.sin(this._angle))
    this._lastTime = Date.now() / 1000
    this.state = 'lookAround'
    this._lastState = null
    this._ticker = function () {}
    this.data = []
  }

  get angle() {
    return this._angle
  }

  set angle(v) {
    this._angle = v > PI ? v - PI2 : v
    this.heading = new Point(Math.cos(v), Math.sin(v))
  }

  tick() {
    const t = Date.now() / 1000
    const dt = t - this._lastTime
    const lastState = this.state
    if (this._lastState !== this.state) {
      if (this[this.state]) {
        this._ticker = this[this.state]()
      } else {
        this._ticker = function () {}
      }
    } else {
      this._ticker(dt)
    }
    this._lastState = lastState
    this._lastTime = t
  }

  look() {
    const visionPoint = this.heading.clone().mulVal(this.visionLength).add(this.pos)
    let intersection = null
    let intersectionLength = 0
    this._room.geometry.forEach(polygon => {
      let p0 = polygon[polygon.length - 1]
      for (let i = 0, maxi = polygon.length; i < maxi; i++) {
        const p1 = polygon[i]
        const int = findIntersection(this.pos, visionPoint, p0, p1)
        if (int) {
          const len = int.clone().sub(this.pos).length
          if (!intersection || intersectionLength > len) {
            intersection = int
            intersectionLength = len
            intersection.p0 = p0
            intersection.p1 = p1
          }
        }
        p0 = p1
      }
    })

    if (!intersection) {
      intersection = visionPoint.clone()
      intersectionLength = visionPoint.length
    }

    if (!this.data[0]) {
      this.data[0] = []
    }
    const dPoly = this.data[0]

    const rand = (Math.random() - 0.5) * intersectionLength * 0.02
    intersection.add(new Point(rand * this.heading.x, rand * this.heading.y))
    dPoly.push(intersection)
  }

  lookAround() {
    let totalRotation = 0
    const aroundInterval = 100 / 1000
    let aroundCounter = aroundInterval

    return function (dt) {
      if (totalRotation >= PI2) {
        this.state = 'approximate'
        return
      }
      if (aroundCounter >= aroundInterval) {
        aroundCounter -= aroundInterval
        this.look()
      }
      this.pos.add(this.heading.clone().mulVal(this.speed * dt))
      const dAngle = dt * 0.3
      this.angle += dAngle
      totalRotation += dAngle
      aroundCounter += dt
    }
  }

  approximate() {
    const data = bot.data[0].slice(0, 50)
    const {a, b} = getLineApprox(data)
    let x
    x = data[0].x
    const p0 = new Point(x, x * a + b)
    x = data[data.length - 1].x
    const p1 = new Point(x, x * a + b)
    this.p0 = p0
    this.p1 = p1
    return function () {}
  }

  render(ctx, t) {
    ctx.strokeStyle = '#ff872f'
    ctx.fillStyle = '#000000'
    const p = this.pos
    const pC = t.apply(p.clone())
    const pA = t.apply(this.heading.clone().mulVal(this.visionLength).add(p))
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
    if (this.p0 && this.p1) {
      const p0 = t.apply(this.p0.clone())
      const p1 = t.apply(this.p1.clone())
      ctx.strokeStyle = '#000'
      ctx.beginPath()
      ctx.moveTo(p0.x, p0.y)
      ctx.lineTo(p1.x, p1.y)
      ctx.stroke()
    }
  }

  _renderData() {
    if (this.data && this.data[0] && this.data[0].length) {
      ctx.strokeStyle = '#001242'
      ctx.fillStyle = 'rgba(120, 120, 180, 0.5)'
      drawPolygon(ctx, t, this.data)
    }
  }
}
