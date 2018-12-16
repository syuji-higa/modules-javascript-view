import { easings } from '../model/cubic-bezier-easing'
import { groupByDataElement } from '../utility/element'

export const animate = async ($el) => {
  const _id = $el.dataset.animationId

  if (!(_id in _aniamte)) {
    throw new Error(`Not find "${_id}" id.`)
  }

  const _elms = groupByDataElement($el, 'a', {
    filter: ($item) => {
      return getComputedStyle($item, '').display !== 'none'
    }
  })

  await _aniamte[_id]($el, _elms)
  $el.classList.add('is-animated')
  for (const itemElms of Object.values(_elms)) {
    for (const $item of Object.values(itemElms)) {
      $item.classList.add('is-animated')
    }
  }
}

const _aniamte = {
  sample: async ($el, elms) => {
    await _animations.sample(elms)
  }
}

const _animations = {
  sample: async (elms, delay = 0) => {
    await elms['sample'][0].animate(
      _effects.fadeIn.keyframes,
      Object.assign({}, _effects.fadeIn.options, { delay })
    ).finished
  }
}

const _effects = {
  // fadeIn
  fadeIn: {
    keyframes: [
      {
        opacity: 0
      },
      {
        opacity: 1
      }
    ],
    options: {
      duration: 1000,
      easing: easings.easeOutCubic,
      fill: 'forwards'
    }
  }
}
