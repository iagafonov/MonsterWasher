class PanZoom {
  constructor(el, transform) {
    this.dragStarted = false
    this.downX = null
    this.downY = null
    this.moveX = null
    this.moveY = null
    this.transform = transform
    this.pointer = new Point(0, 0)
    this.rect = el.getBoundingClientRect()

    const onMouseMoveListener = this.onMouseMove.bind(this)
    const onMouseUpListener = this.onMouseUp.bind(this)
    const onMouseDownListener = this.onMouseDown.bind(this)
    const onWheelListener = this.onWheel.bind(this)

    this.ondestroy = () => {
      document.removeEventListener('mousemove', onMouseMoveListener)
      document.removeEventListener('mouseup', onMouseUpListener)
      document.removeEventListener('mousedown', onMouseDownListener)
      el.removeEventListener('wheel', onWheelListener)
    }

    document.addEventListener('mousemove', onMouseMoveListener)
    document.addEventListener('mouseup', onMouseUpListener)
    document.addEventListener('mousedown', onMouseDownListener)
    el.addEventListener('wheel', onWheelListener)
  }

  destroy() {
    if (this.ondestroy) {
      this.ondestroy()
      this.ondestroy = null
    }
  }

  startDrag(e) {
    this.moveX = e.clientX
    this.moveY = e.clientY
    this.dragStarted = true
  }

  finishDrag(e) {
    this.downX = null
    this.downY = null
    this.dragStarted = false
  }

  onMouseDown(e) {
    this.downX = e.clientX
    this.downY = e.clientY
    return false
  }

  onMouseMove(e) {
    if (this.dragStarted) {
      this.transform.translate(e.clientX - this.moveX, e.clientY - this.moveY)
    } else if (this.downX != null) {
      const moveX = e.clientX - this.downX
      const moveY = e.clientY - this.downY
      if (Math.sqrt(moveX * moveX + moveY * moveY) >= 3) {
        this.startDrag(e)
      }
    }
    this.moveX = e.clientX
    this.moveY = e.clientY
    this.pointer.set(this.transform.invert(new Point(e.clientX - this.rect.left, e.clientY - this.rect.top)))
    return false
  }

  onMouseUp(e) {
    if (this.dragStarted) {
      this.finishDrag(e)
    } else {
      this.downX = null
      this.downY = null
    }
  }

  onWheel(e) {
    e.preventDefault()
    this.transform.scale(e.deltaY > 0 ? 0.5 : 2)
    return false
  }
}
