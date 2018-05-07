import Vue from 'vue'
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
Vue.filter('format', interval => {
  interval = interval | 0
  const minute = (interval / 60 | 0) > 9 ? interval / 60 | 0 : `0${interval / 60 | 0}`
  const second = (interval % 60) > 9 ? interval % 60 : `0${interval % 60}`
  return `${minute}:${second}`
})
Vue.filter('percent', value => {
  let _value = `${value * 100 | 0}%`
  return _value
})
