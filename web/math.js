const PI = Math.PI
const PI2 = Math.PI * 2
const PI05 = Math.PI / 2

function ccw(p1, p2, p3) {
  return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x)
}

function isIntersects(p1, p2, p3, p4) {
  return (ccw(p1, p3, p4) !== ccw(p2, p3, p4)) && (ccw(p1, p2, p3) !== ccw(p1, p2, p4))
}

function findIntersection(p1, p2, p3, p4) {
  const denominator = ((p4.y - p3.y) * (p2.x - p1.x)) - ((p4.x - p3.x) * (p2.y - p1.y))
  if (denominator === 0) {
    return null
  }
  let a = p1.y - p3.y
  let b = p1.x - p3.x
  const numerator1 = ((p4.x - p3.x) * a) - ((p4.y - p3.y) * b)
  const numerator2 = ((p2.x - p1.x) * a) - ((p2.y - p1.y) * b)
  a = numerator1 / denominator
  b = numerator2 / denominator

  const onLine1 = a > 0 && a < 1
  const onLine2 = b > 0 && b < 1

  if (onLine1 && onLine2) {
    return new Point(
      p1.x + (a * (p2.x - p1.x)),
      p1.y + (a * (p2.y - p1.y))
    )
  } else {
    return null
  }
}

function getLineApprox(points) {
  let xSum = 0
  let sumY = 0
  let xSum2 = 0
  let xySum = 0
  const n = points.length
  for (let i = 0; i < n; i++) {
    const p = points[i]
    xSum += p.x
    sumY += p.y
    xSum2 += p.x * p.x
    xySum += p.x * p.y
  }
  const a = (n * xySum - (xSum * sumY)) / (n * xSum2 - xSum * xSum)
  const b = (sumY - a * xSum) / n
  return {a, b}
}
