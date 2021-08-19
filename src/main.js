import Vue from 'vue'
import Element from 'element-ui'
import App from '@/App'
import i18n from '@/i18n'
import router from '@/router'
import store from '@/store'
import moment from 'moment'
import axios from 'axios'
import '@/icons'
import '@/element-ui/theme/index.css'
import '@/assets/scss/aui.scss'
import '@/assets/icon/iconfont.css'
import http from '@/utils/request'
import ctcRadioGroup from '@/components/ctc-radio-group'
import ctcSelect from '@/components/ctc-select'
import ctcInput from '@/components/ctc-input'
import ctcSelectTooltip from '@/components/ctc-select-tooltip'
import splitBar from '@/components/split-bar'
import ctcProcessMultiple from '@/components/ctc-process-multiple'
import ctcProcessStart from '@/components/ctc-process-start'
import ctcProcessRunning from '@/components/ctc-process-running'
import ctcProcessDetail from '@/components/ctc-process-detail'
import ctcDeptTree from '@/components/ctc-dept-tree'
import ctcRegionTree from '@/components/ctc-region-tree'
import ctcOrganizeTable from '@/components/ctc-organize-table'
import ctcDeptTable from '@/components/ctc-dept-table'
import ctcSectionTable from '@/components/ctc-section-table'
import ctcUserTable from '@/components/ctc-user-table'
import ctcDataTag from '@/components/ctc-data-tag'
import CtcProjectInfoTable from '@/components/project/ctc-project-info-table'
import CtcChildProjectInfoTable from '@/components/project/ctc-child-project-info-table'
import CtcFileImport from '@/components/ctc-file-import'
import CtcFileUpload from '@/components/ctc-file-upload'
import CtcDownloadTable from '@/components/ctc-download-table'
import CtcTreeTable from '@/components/ctc-tree-table'
import CtcTreeTableGy from '@/components/ctc-tree-table-gy'
import CtcTreeSelectTableGy from '@/components/ctc-tree-select-table-gy'
import CtcTreeReviewTable from '@/components/ctc-tree-review-table'
import CtcTreeTaskTable from '@/components/ctc-tree-task-table'
import CtcTreeObjectTable from '@/components/ctc-tree-object-table'
import CtcPagePath from '@/components/ctc-page-path'
import CtcBigImg from '@/components/ctc-big-img'
import CtcProjectTeam from '@/components/accountManagement4A/ctc-project-team'
import CtcProvinceTeam from '@/components/resourceManagement/ctc-province-team'
import CtcPlatformList from '@/components/resourceManagement/ctc-platform-list'
import CtcAccountFile from '@/components/ctc-account-file'
import CtcOrganHandler from '@/components/accountManagement4A-new/ctc-organ-handler'
import CtcNextStepHandler from '@/components/accountManagement4A-new/ctc-next-step-handler'
import CtcNextStepHandlerTable from '@/components/accountManagement4A-new/ctc-next-step-handler-table'
import CtcSelectRole from '@/components/accountManagement4A-new/ctc-select-role'
import CtcTreeOrgan from '@/components/accountManagement4A-new/ctc-tree-organ'
import CtcTreeOrganServe from '@/components/accountManagement4A-new/ctc-tree-organ-serve'
import CtcProcessRecord from '@/components/accountManagement4A-new/ctc-process-record'
import CtcSelectManage from '@/components/accountManagement4A-new/ctc-select-manage'

import cloneDeep from 'lodash/cloneDeep'
// 选人插件
import selectControl from '@/components/select-control'
// 单选插件
import radioControl from '@/components/radio-control'
// 关联搜索
import CtcAssociatedSearch from '@/components/ctc-associated-search'
import {
  hasPermission,
  getDictLabel,
  getDictDataList,
  toggleRowSelectionTable,
  handTriggerReLoadEvent,
  copyContent
} from '@/utils'
// 全局引入自定义loading
import loadEvents from '@/utils/loading/loading.js'
import VueDND from 'awe-dnd'

Vue.config.productionTip = false
Vue.use(ctcRadioGroup)
Vue.use(ctcSelect)
Vue.use(ctcInput)
Vue.use(ctcSelectTooltip)
Vue.use(splitBar)
Vue.use(ctcDeptTree)
Vue.use(ctcRegionTree)
Vue.use(ctcProcessMultiple)
Vue.use(ctcProcessStart)
Vue.use(ctcProcessRunning)
Vue.use(ctcProcessDetail)
Vue.use(selectControl)
Vue.use(radioControl)
Vue.use(ctcOrganizeTable)
Vue.use(ctcDeptTable)
Vue.use(ctcSectionTable)
Vue.use(ctcUserTable)
Vue.use(ctcDataTag)
Vue.use(CtcProjectInfoTable)
Vue.use(CtcChildProjectInfoTable)
Vue.use(CtcFileImport)
Vue.use(CtcFileUpload)
Vue.use(CtcDownloadTable)
Vue.use(VueDND)
Vue.use(CtcAssociatedSearch)
Vue.use(CtcTreeTable)
Vue.use(CtcTreeTableGy)
Vue.use(CtcTreeSelectTableGy)
Vue.use(CtcTreeReviewTable)
Vue.use(CtcTreeTaskTable)
Vue.use(CtcTreeObjectTable)
Vue.use(CtcPagePath)
Vue.use(CtcBigImg)
Vue.use(CtcProjectTeam)
Vue.use(CtcProvinceTeam)
Vue.use(CtcPlatformList)
Vue.use(CtcAccountFile)
Vue.use(CtcOrganHandler)
Vue.use(CtcNextStepHandler)
Vue.use(CtcNextStepHandlerTable)
Vue.use(CtcSelectRole)
Vue.use(CtcTreeOrgan)
Vue.use(CtcTreeOrganServe)
Vue.use(CtcProcessRecord)
Vue.use(CtcSelectManage)
Vue.use(Element, {
  size: 'default',
  i18n: (key, value) => i18n.t(key, value)
})

// 挂载全局
Vue.prototype.$http = http
Vue.prototype.$axios = axios
Vue.prototype.$moment = moment
Vue.prototype.$hasPermission = hasPermission
Vue.prototype.$getDictLabel = getDictLabel
Vue.prototype.$getDictDataList = getDictDataList
Vue.prototype.$ctcLoading = loadEvents
Vue.prototype.$toggleRowSelectionTable = toggleRowSelectionTable
Vue.prototype.$handTriggerReLoadEvent = handTriggerReLoadEvent
Vue.prototype.$copyContent = copyContent

// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state)

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
