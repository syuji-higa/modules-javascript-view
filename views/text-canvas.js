import WebFont from 'webfontloader'
import EventObserver from '../observer/event-observer'
import WindowSizeObserver from '../observer/window-size-observer'
import ClientData from '../utility/client-data'

class TextCanvas {
  _status = {
    text: '',
    size: 0, // int[0,inf)
    fontSize: 0 // float[0,inf)
  }
  _$wrap // {Element}
  _$canvas // {Element}
  _resizeEvent = {}
  _heightResizeEvent = {}
  _ctx // {CanvasRenderingContext2D}
  _fontFamily = ''
  _fontWeight = 0 // int[0,inf)
  _fontSizeRate = 0 // float[0,inf)
  _fontColor = ''

  /**
   * @return {Object}
   */
  static get _defaultOptions() {
    return {
      canvasClassName: 'js-text-canvas',
      fontFamily: 'Nanum Gothic',
      fontWeight: 800,
      fontSizeRatePc: 0.08,
      fontSizeRateSp: 0.04,
      fontColor: '255, 255, 255'
    }
  }

  /**
   * @param {Object}
   * @property {Object} [options]
   * @property {string} [options.canvasClassName]
   * @property {string} [options.fontFamily]
   * @property {number} [options.fontWeight] - int[0,inf)
   * @property {number} [options.fontSizeRatePc] - float[0,inf)
   * @property {number} [options.fontSizeRateSp] - float[0,inf)
   * @property {number} [options.fontColor]
   */
  constructor(options = {}) {
    const {
      canvasClassName,
      fontFamily,
      fontWeight,
      fontSizeRatePc,
      fontSizeRateSp,
      fontColor
    } = Object.assign(TextCanvas._defaultOptions, options)

    this._$wrap = document.getElementsByClassName(canvasClassName)[0]
    this._$canvas = document.createElement('canvas')
    this._$wrap.appendChild(this._$canvas)

    this._ctx = this._$canvas.getContext('2d')

    const _windowSizeObserver = WindowSizeObserver.getInstance()

    this._fontFamily = fontFamily
    this._fontWeight = fontWeight
    this._fontSizeRate =
      _windowSizeObserver.type === 'pc' ? fontSizeRatePc : fontSizeRateSp
    this._fontColor = fontColor

    const _eventObserver = EventObserver.getInstance()
    this._resizeEvent = _eventObserver.create(
      document,
      'resize',
      this._onResize.bind(this)
    )
    this._heightResizeEvent = _eventObserver.create(
      document,
      'heightResize',
      this._onResize.bind(this)
    )
  }

  /**
   * @return {Object}
   * @property {Element}
   */
  get canvas() {
    return this._$canvas
  }

  /**
   * @return {Promise}
   */
  load() {
    return new Promise((resolve) => {
      WebFont.load({
        google: {
          families: [`${this._fontFamily}:${this._fontWeight}`]
        },
        active: () => {
          let _isIOS10Lower = false
          const { name, version } = ClientData.getInstance().result.os
          if (name === 'iOS') {
            const _versionStrings = version.match(/^([0-9]+).[0-9]+.[0-9]+$/)
            if (_versionStrings && 11 > Number(_versionStrings[1])) {
              _isIOS10Lower = true
            }
          }
          if (!_isIOS10Lower) {
            this._setTexture()
            resolve()
          } else {
            // When font data is not read
            setTimeout(() => {
              this._setTexture()
              resolve()
            }, 500)
          }
        },
        inactive: () => {
          resolve()
        }
      })
    })
  }

  /**
   * @return {Instance}
   */
  on() {
    this._resizeEvent.add()
    this._heightResizeEvent.add()
    return this
  }

  /**
   * @return {Instance}
   */
  off() {
    this._resizeEvent.remove()
    this._heightResizeEvent.remove()
    return this
  }

  /**
   * @param {?string} [text]
   * @return {instance}
   */
  update(text = null) {
    if (text !== null) {
      this._status.text = text
    }

    this._setTexture()

    return this
  }

  /**
   * @return {instance}
   */
  resize() {
    const _width = this._$wrap.clientWidth
    const _height = this._$wrap.clientHeight
    const _size = Math.min(_width, _height) * 2

    this._$canvas.width = _size
    this._$canvas.height = _size

    this._status.size = _size
    this._status.fontSize = _size * this._fontSizeRate

    // set font
    this._ctx.fillStyle = `rgb(${this._fontColor})`
    this._ctx.font = `
      ${this._fontWeight} ${this._status.fontSize}px ${this._fontFamily}
    `
    this._ctx.textAlign = 'center'

    return this
  }

  _onResize() {
    this.resize()
    this.update()
  }

  _setTexture() {
    this._ctx.clearRect(0, 0, this._status.size, this._status.size)

    this._ctx.fillText(
      this._status.text,
      this._status.size / 2,
      this._status.size / 2 + this._status.fontSize / 2
    )
  }
}

export { TextCanvas as default }
