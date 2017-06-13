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
  const numerator = ((p4.x - p3.x) * a) - ((p4.y - p3.y) * b)
  a = numerator / denominator
  // const numerator2 = ((p2.x - p1.x) * a) - ((p2.y - p1.y) * b)
  // b = numerator2 / denominator

  // if we cast these lines infinitely in both directions, they intersect here:
  return new Point(
    p1.x + (a * (p2.x - p1.x)),
    p1.y + (a * (p2.y - p1.y))
  )
  // if line1 is a segment and line2 is infinite, they intersect if:
  // if (a > 0 && a < 1) {
  //   result.onLine1 = true
  // }
  // if line2 is a segment and line1 is infinite, they intersect if:
  // if (b > 0 && b < 1) {
  //   result.onLine2 = true
  // }
  // if line1 and line2 are segments, they intersect if both of the above are true
}
