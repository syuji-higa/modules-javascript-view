import EventObserver from '../observer/event-observer'
import { parseUrl } from '../model/url'
import { includesElement } from '../utility/element'

class LinkMiddleware {
  _clickEvent = {}

  constructor() {
    const _eventObserver = EventObserver.getInstance()
    this._clickEvent = _eventObserver.create(
      document,
      'click',
      this._onClick.bind(this)
    )
  }

  /**
   * @return {Instance}
   */
  on() {
    this._clickEvent.add()
    return this
  }

  /**
   * @return {Instance}
   */
  off() {
    this._clickEvent.remove()
    return this
  }

  /**
   * @param {Event} e
   */
  _onClick(e) {
    const _$el = includesElement(e.target, 'a')

    if (!_$el) return

    const _href = _$el.getAttribute('href')
    const _target = _$el.getAttribute('target')

    const _hashStrings = _href.match(/^#(.*)$/)

    // anchor
    if (_hashStrings) {
      const _hash = _hashStrings[1]
      const _$target =
        _hash === '' ? document.body : document.getElementById(_hash)

      if (!_$target) return

      e.preventDefault()

      CMN.anchor.scroll(_$target)
    }
    // push state
    else if (_target !== '_blank') {
      e.preventDefault()

      CMN.history.change(parseUrl(_$el.href).pathname)
    }
  }
}

export { LinkMiddleware as default }
