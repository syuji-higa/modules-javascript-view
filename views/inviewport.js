import EventObserver from '../observer/event-observer'
import { rect } from '../utility/rect'
import { animate } from './inviewport-animation'

class Inviewport {
  _status = {
    ranges: [] // <number> int[0,inf)
  }
  _elms = [] // <Element>
  _resizeEvent = {}
  _scrollEvent = {}

  /**
   * @return {Object}
   */
  static get _defaultOptions() {
    return {
      selfClassName: 'js-inviewport',
      isViewportClassName: 'is-inviewport'
    }
  }

  /**
   * @param {Object}
   * @property {Object} [options]
   * @property {string} [options.selfClassName]
   * @property {string} [options.isViewportClassName]
   */
  constructor(options = {}) {
    const { selfClassName, isViewportClassName } = Object.assign(
      Inviewport._defaultOptions,
      options
    )

    this._selfClassName = selfClassName
    this._isViewportClassName = isViewportClassName

    const _eventObserver = EventObserver.getInstance()
    this._resizeEvent = _eventObserver.create(
      document,
      'resize',
      this.resize.bind(this)
    )
    this._scrollEvent = _eventObserver.create(
      document,
      'windowScroll',
      this.update.bind(this)
    )
  }

  /**
   * @return {Instance}
   */
  create() {
    Array.from(document.getElementsByClassName(this._selfClassName), ($el) => {
      if (getComputedStyle($el).display !== 'none') {
        this._elms.push($el)
      }
    })
    return this
  }

  /**
   * @return {Instance}
   */
  destroy() {
    this._elms = []
    return this
  }

  /**
   * @return {Instance}
   */
  on() {
    this._resizeEvent.add()
    this._scrollEvent.add()
    return this
  }

  /**
   * @return {Instance}
   */
  off() {
    this._resizeEvent.remove()
    this._scrollEvent.remove()
    return this
  }

  /**
   * @return {Instance}
   */
  resize() {
    const _windowHeight = window.innerHeight
    this._status.ranges = []
    for (const $el of this._elms) {
      const _rect = rect($el)
      const _offsetY = _windowHeight * 0.3
      this._status.ranges.push({
        $el,
        top: Math.max(_rect.top - _windowHeight + _offsetY, 0),
        bottom: Math.max(_rect.bottom - _offsetY, 0),
        t: [_rect.top, _windowHeight, _offsetY]
      })
    }
    return this
  }

  /**
   * @return {Instance}
   */
  update() {
    const _offsetY = window.pageYOffset
    const _viewedIndexes = []

    for (const [i, range] of Object.entries(this._status.ranges)) {
      if (range.top <= _offsetY && _offsetY <= range.bottom) {
        _viewedIndexes.push(i)
        range.$el.classList.add(this._isViewportClassName)
        animate(range.$el)
      }
    }

    for (const [i, index] of Object.entries(_viewedIndexes)) {
      this._elms.splice(index - i, 1)
      this._status.ranges.splice(index - i, 1)
    }

    return this
  }
}

export { Inviewport as default }
