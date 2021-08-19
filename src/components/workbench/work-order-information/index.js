// design by lpf 2020/05/13
import workOrderInformation from './src/work-order-information'

workOrderInformation.install = function (Vue) {
  Vue.component(workOrderInformation.name, workOrderInformation)
}
export default workOrderInformation
