import ClientData from '../utility/client-data'

class ClientFlagSetter {
  constructor() {
    const { result, platformType } = ClientData.getInstance()

    const _osName = result.os.name.toLowerCase()

    let _browserName = result.browser.name.toLowerCase().replace(' ', '-')
    switch (_browserName) {
      case 'microsoft-edge': {
        _browserName = 'edge'
        break
      }
      case 'internet-explorer': {
        _browserName = 'ie'
        break
      }
      default: {
        break
      }
    }

    document.documentElement.classList.add(`is-${platformType}`)
    document.documentElement.classList.add(`is-${_osName}`)
    document.documentElement.classList.add(`is-${_browserName}`)
  }
}

export { ClientFlagSetter as default }
