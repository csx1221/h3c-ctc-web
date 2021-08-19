// design by lpf 2020/05/13
import workOrderProcessing from './src/work-order-processing'

workOrderProcessing.install = function (Vue) {
  Vue.component(workOrderProcessing.name, workOrderProcessing)
}
export default workOrderProcessing
