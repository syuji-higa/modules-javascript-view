class Modal {
  /**
   * @return {Object}
   */
  static get _defaultOptions() {
    return {
      modalClassName: 'js-modal',
      modalContentsClassName: 'js-modal-contents',
      isModalOpenedClassName: 'is-modal-opened',
      isModalLoadingClassName: 'is-modal-loading',
      isOpenedClassName: 'is-opened'
    }
  }

  /**
   * @param {Object}
   * @property {Object} [options]
   * @property {string} [options.modalClassName]
   * @property {string} [options.modalContentsClassName]
   * @property {string} [options.isModalOpenedClassName]
   * @property {string} [options.isModalLoadingClassName]
   * @property {string} [options.isOpenedClassName]
   */
  constructor(options = {}) {
    const {
      modalClassName,
      modalContentsClassName,
      isModalOpenedClassName,
      isModalLoadingClassName,
      isOpenedClassName
    } = Object.assign(Modal._defaultOptions, options)

    this._status = {
      id: null
    }

    this._$$modal = document.getElementsByClassName(modalClassName)

    this._modalContentsClassName = modalContentsClassName
    this._isModalOpenedClassName = isModalOpenedClassName
    this._isModalLoadingClassName = isModalLoadingClassName
    this._isOpenedClassName = isOpenedClassName
  }

  /**
   * @param {string} id
   * @return {Promsie}
   */
  async open(id, options = {}) {
    if (this._status.id) return

    const _$modal = Array.from(this._$$modal).find(
      ($modal) => $modal.dataset.modalId === id
    )

    if (!_$modal) {
      throw new Error(`Not find "${id}" id modal.`)
    }

    // crear scroll top
    const _$modalContents = _$modal.getElementsByClassName(
      this._modalContentsClassName
    )[0]
    _$modalContents.scrollTop = 0

    this._status.id = id

    document.documentElement.classList.add(this._isModalOpenedClassName)

    // waiting open modal
    if (options.wait) {
      document.documentElement.classList.add(this._isModalLoadingClassName)
      await options.wait(_$modal)
      document.documentElement.classList.remove(this._isModalLoadingClassName)
    }

    _$modal.classList.add(this._isOpenedClassName)

    return this
  }

  /**
   * @return {Promise}
   */
  async close() {
    if (this._status.id === null) return

    const _$modal = Array.from(this._$$modal).find(
      ($modal) => $modal.dataset.modalId === this._status.id
    )

    if (!_$modal) {
      throw new Error(`Not find "${id}" id modal.`)
    }

    this._status.id = null

    document.documentElement.classList.remove(this._isModalOpenedClassName)
    _$modal.classList.remove(this._isOpenedClassName)

    return this
  }
}

export { Modal as default }
