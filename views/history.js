import EventObserver from '../observer/event-observer'

class History {
  _popstateEvent = {}

  constructor() {
    const _eventObserver = EventObserver.getInstance()
    this._popstateEvent = _eventObserver.create(
      window,
      'popstate',
      this._onPopstate.bind(this)
    )
  }

  /**
   * @return {Instance}
   */
  on() {
    this._popstateEvent.add()
    return this
  }

  /**
   * @return {Instance}
   */
  off() {
    this._popstateEvent.remove()
    return this
  }

  /**
   * @return {Promise}
   */
  change(path) {
    history.pushState({}, '', path)
    this._dispatchEvent(path)
  }

  _onPopstate() {
    this._dispatchEvent(location.pathname)
  }

  /**
   * @param {string} path
   */
  _dispatchEvent(path) {
    document.dispatchEvent(
      new CustomEvent('onUrlChange', {
        detail: { path }
      })
    )
  }
}

export { History as default }
