import EventObserver from '../observer/event-observer'
import WindowSizeObserver from '../observer/window-size-observer'
import ClientData from '../utility/client-data'

class HeightFitter {
  _windowSizeObserver // {Instance}
  _$$el // {HTMLColection|NodeList}
  _resizeEvent = {}
  _platformType = ''
  _windowHeight = 0 // int[0,inf)

  /**
   * @return {Object}
   */
  static get _defOpts() {
    return {
      selfClassName: 'js-height-fitter'
    }
  }

  /**
   * @param {Object} [opts]
   * @param {string} [opts.selfClassName]
   */
  constructor(opts = {}) {
    const { selfClassName } = Object.assign(HeightFitter._defOpts, opts)

    this._platformType = ClientData.getInstance().platformType

    this._$$el = document.getElementsByClassName(selfClassName)

    this._windowSizeObserver = WindowSizeObserver.getInstance()

    const _eventObserver = EventObserver.getInstance()
    this._resizeEvent = _eventObserver.create(
      document,
      'resize',
      this.update.bind(this)
    )
  }

  /**
   * @return {Instance}
   */
  on() {
    this._resizeEvent.add()
    return this
  }

  /**
   * @return {Instance}
   */
  off() {
    this._resizeEvent.remove()
    return this
  }

  /**
   * @return {Instance}
   */
  update() {
    this._windowHeight = this._windowSizeObserver.size.height

    Array.from(this._$$el, ($el) => {
      if (this._platformType === $el.dataset.heightFitterIgnore) return
      $el.style.height = `${this._windowHeight}px`
      $el.dispatchEvent(new CustomEvent('heightResize'))
    })

    document.dispatchEvent(new CustomEvent('heightResize'))

    return this
  }
}

export { HeightFitter as default }
