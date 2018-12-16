import { round } from '../model/math'
import { progress } from '../model/progress'
import ScrollObserver from '../observer/scroll-observer'
import { rect } from '../utility/rect'
import RequestAnimationFramer from '../utility/request-animation-framer'

class Anchor {
  _scrollObserver // {Instance}
  _rAF // {Instance}
  _duration = 0 // int[0,inf)
  _easing = ''

  /**
   * @return {Object}
   */
  static get _defaultOptions() {
    return {
      duration: 1000,
      easing: 'easeInOutCubic'
    }
  }

  /**
   * @param {Object} [options]
   */
  constructor(options = {}) {
    const { duration, easing } = Object.assign(Anchor._defaultOptions, options)

    this._duration = duration
    this._easing = easing

    this._scrollObserver = ScrollObserver.getInstance()
    this._rAF = RequestAnimationFramer.getInstance()
  }

  /**
   * @param {Element} $target
   */
  scroll($target) {
    const _offsetY = this._scrollObserver.offset.y
    const _rectTop = round(rect($target).top)

    this._rAF.add(this, this._animate.bind(this, _offsetY, _rectTop), 60)
  }

  /**
   * @param {Event} e
   */
  _onClick(e) {
    const _$el = includesElement(e.target, 'a')

    if (!_$el) return

    const _href = _$el.getAttribute('href')
    const _hrefStrs = _href.match(/^#(.*)$/)

    if (!_hrefStrs) return

    const _hash = _hrefStrs[1]
    const _$target =
      _hash === '' ? document.body : document.getElementById(_hash)

    if (!_$target) return

    e.preventDefault()

    this.scroll(_$target)
  }

  /**
   * @param {number} begin - int(-inf,inf)
   * @param {number} complete - int(-inf,inf)
   */
  _animate(begin, complete) {
    const _time = this._rAF.getTime(this)
    const _val = progress(this._easing, _time, begin, complete, this._duration)

    window.scrollTo(0, _val)

    if (complete === _val) {
      this._rAF.remove(this)
    }
  }
}

export { Anchor as default }
