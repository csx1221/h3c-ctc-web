import CtcSelectTooltip from './src/ctc-select-tooltip'
import Vue from 'vue'
let TooltipConstructor = Vue.extend(CtcSelectTooltip)
let instance
const install = () => {
  Object.defineProperty(Vue.prototype, '$ctcSelectTooltip', {
    get () {
      const alertMsg = options => {
        if (options.title === '关闭浮窗') {
          document.body.removeChild(instance.vm.$el)
        } else {
          instance = new TooltipConstructor({
            propsData: options
          })
          instance.vm = instance.$mount()
          document.body.appendChild(instance.vm.$el)
          return instance.vm
        }
      }
      return alertMsg
    }
  })
}
export default install
