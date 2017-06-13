class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  set(p) {
    this.x = p.x
    this.y = p.y
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  setVal(x, y) {
    this.x = x
    this.y = y
  }

  add(p) {
    this.x += p.x
    this.y += p.y
    return this
  }

  sub(p) {
    this.x -= p.x
    this.y -= p.y
    return this
  }

  mul(p) {
    this.x *= p.x
    this.y *= p.y
    return this
  }

  div(p) {
    this.x /= p.x
    this.y /= p.y
    return this
  }

  addVal(v) {
    this.x += v
    this.y += v
    return this
  }

  subVal(v) {
    this.x -= v
    this.y -= v
    return this
  }

  mulVal(v) {
    this.x *= v
    this.y *= v
    return this
  }

  divVal(v) {
    this.x /= v
    this.y /= v
    return this
  }

  round(n = 0) {
    const k = Math.pow(10, n)
    this.x = Math.round(this.x * k) / k
    this.y = Math.round(this.y * k) / k
    return this
  }

  rotate(p) {
    const [x, y] = [this.x, this.y]
    this.x = x * p.x - y * p.y
    this.y = x * p.y + y * p.x
    return this
  }

  rotateAngle(a) {
    const [x, y] = [this.x, this.y]
    const [px, py] = [Math.cos(a), Math.sin(a)]
    this.x = x * px - y * py
    this.y = x * py + y * px
    return this
  }

  clone() {
    return new Point(this.x, this.y)
  }

  toString() {
    return `{x: ${this.x}, y: ${this.y}}`
  }
}
