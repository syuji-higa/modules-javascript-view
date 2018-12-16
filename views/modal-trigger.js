import doT from 'dot'
import EventObserver from '../observer/event-observer'
import ImagePreloader from '../utility/image-preloader'
import { includesElement } from '../utility/element'

class ModalTrigger {
  _imagePreloader // {Instance}
  _documentClickEvent = {}
  _openSelector = ''
  _openTemplateSelector = ''
  _closeSelector = ''
  _templateClassName = ''
  _templateContainerClassName = ''
  _data = []

  /**
   * @return {Object}
   */
  static get _defaultOptions() {
    return {
      openSelector: '.js-modal-open',
      openTemplateSelector: '.js-modal-open-template',
      closeSelector: '.js-modal-close',
      templateClassName: 'js-modal-template',
      templateContainerClassName: 'js-modal-template-container'
    }
  }

  /**
   * @param {Object}
   * @property {Object} [options]
   * @property {string} [options.openSelector]
   * @property {string} [options.openTemplateSelector]
   * @property {string} [options.closeSelector]
   * @property {string} [options.templateClassName]
   * @property {string} [options.templateContainerClassName]
   */
  constructor(options = {}) {
    const {
      openSelector,
      openTemplateSelector,
      closeSelector,
      templateClassName,
      templateContainerClassName
    } = Object.assign(ModalTrigger._defaultOptions, options)

    this._openSelector = openSelector
    this._openTemplateSelector = openTemplateSelector
    this._closeSelector = closeSelector
    this._templateClassName = templateClassName
    this._templateContainerClassName = templateContainerClassName

    this._imagePreloader = ImagePreloader.getInstance()

    const _eventObserver = EventObserver.getInstance()
    this._documentClickEvent = _eventObserver.create(
      document,
      'click',
      this._onDocumentClick.bind(this)
    )
  }

  /**
   * @return {Instance}
   */
  on() {
    this._documentClickEvent.add()
    return this
  }

  /**
   * @return {Instance}
   */
  off() {
    this._documentClickEvent.remove()
    return this
  }

  /**
   * @param {Array<Object>}
   * @return {Instance}
   */
  setData(data) {
    this._data = data
    return this
  }

  /**
   * @param {Event} e
   */
  _onDocumentClick(e) {
    // open
    const _$open = includesElement(e.target, this._openSelector)
    if (_$open) {
      this._open(_$open)
      return
    }

    // open template
    const _$openTemplate = includesElement(e.target, this._openTemplateSelector)
    if (_$openTemplate) {
      this._openTemplate(_$openTemplate)
      return
    }

    // close
    const _$close = includesElement(e.target, this._closeSelector)
    if (_$close) {
      this._close()
      return
    }
  }

  _open($open) {
    const _id = $open.dataset.modalTargetId
    if (!_id) {
      throw new Error('Modal target id empty.')
    }
    CMN.modal.open(_id)
  }

  _openTemplate($openTemplate) {
    const { modalTargetId: _modalId, dataId: _dataId } = $openTemplate.dataset

    if (!_modalId) {
      throw new Error('Modal target id empty.')
    }

    CMN.modal.open(_modalId, {
      wait: async ($modal) => {
        const _$tmeplate = $modal.getElementsByClassName(
          this._templateClassName
        )[0]
        const _$templateContainer = $modal.getElementsByClassName(
          this._templateContainerClassName
        )[0]

        if (!_$tmeplate) {
          throw new Error('Not find modal template scripts.')
        }
        if (!_$templateContainer) {
          throw new Error('Not find modal container element.')
        }

        const _data = this._data.find((data) => data.id === Number(_dataId))

        if (!_data) {
          throw new Error(`Not find partner data "${_dataId}" id.`)
        }

        const _templateFunc = doT.template(_$tmeplate.innerHTML)

        _$templateContainer.innerHTML = _templateFunc(_data)

        await this._imagePreloader.add(_$templateContainer)
        await this._imagePreloader.load(_$templateContainer)
      }
    })
  }

  _close() {
    CMN.modal.close()
  }
}

export { ModalTrigger as default }
