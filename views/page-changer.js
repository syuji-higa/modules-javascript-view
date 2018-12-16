import Fetch from '../utility/fetch'
import ImagePreloader from '../utility/image-preloader'
import { cloneScript } from '../utility/script'
import { getDOMParseChildElement } from '../utility/dom-parser'

class PageChanger {
  _imagePreloader // {Instance}
  _$contents // {Element}
  _contentsClassName = ''
  _scriptClassName = ''

  /**
   * @return {Object}
   */
  static get _defaultOptions() {
    return {
      contentsClassName: 'js-page-changer',
      scriptClassName: 'js-page-changer-script'
    }
  }

  /**
   * @param {Object}
   * @property {Object} [options]
   * @property {string} [options.contentsClassName]
   * @property {string} [options.scriptClassName]
   */
  constructor(options = {}) {
    const { contentsClassName, scriptClassName } = Object.assign(
      PageChanger._defaultOptions,
      options
    )

    this._$contents = document.getElementsByClassName(contentsClassName)[0]

    this._contentsClassName = contentsClassName
    this._scriptClassName = scriptClassName

    this._imagePreloader = ImagePreloader.getInstance()
  }

  /**
   * @param {string} path
   * @return {Promise}
   */
  async createPage(path) {
    const _data = await new Fetch(path).request({ responseType: 'text' })

    this._setTitle(_data)

    this._$contents.appendChild(
      getDOMParseChildElement(_data, `.${this._contentsClassName}`)[0]
    )

    this._runScripts()

    await this._imagePreloader.add(this._$contents)
    await this._imagePreloader.load(this._$contents)
    this._imagePreloader.remove(this._$contents)
  }

  /**
   * @return {Instance}
   */
  destroyPage() {
    this._$contents.textContent = ''
    return this
  }

  /**
   * @param {string} data
   */
  _setTitle(data) {
    const _strings = data.match(/<title>(.*)<\/title>/)
    document.title = _strings ? _strings[1] : ''
  }

  _runScripts() {
    const _$$script = this._$contents.getElementsByClassName(
      this._scriptClassName
    )
    const _$df = document.createDocumentFragment()
    for (const $script of _$$script) {
      _$df.appendChild(cloneScript($script))
    }
    this._$contents.appendChild(_$df)
  }
}

export { PageChanger as default }
