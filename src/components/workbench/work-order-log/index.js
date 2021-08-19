// design by lpf 2020/05/13
import workOrderLog from './src/work-order-log'

workOrderLog.install = function (Vue) {
  Vue.component(workOrderLog.name, workOrderLog)
}
export default workOrderLog
