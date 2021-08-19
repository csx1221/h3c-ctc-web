import { addDynamicRoute } from '@/router'

export default {
  data () {
    return {
      processVisible: false
    }
  },
  methods: {
    // 初始化流程配置(集成发起流程和任务处理功能)
    initProcessMultiple (callbacks) {
      // showType 用于区分流程启动（start）、任务处理(taskHandle)以及查看详情(null)
      // 流程启动显示的是“流程启动”按钮，任务处理显示的是“通过、委托、回退、驳回、终止”按钮，查看详情都不显示
      var showType = this.$route.params.processShowType
      this.processVisible = true
      this.$nextTick(() => {
        if (this.$route.params.processDefinitionKey) {
          this.$refs.renProcessMultiple.dataForm.processDefinitionKey = this.$route.params.processDefinitionKey
        }
        if (this.$route.params.taskId) {
          this.$refs.renProcessMultiple.dataForm.taskId = this.$route.params.taskId
        }
        if (this.$route.params.processInstanceId) {
          this.$refs.renProcessMultiple.dataForm.processInstanceId = this.$route.params.processInstanceId
        }
        this.$refs.renProcessMultiple.dataForm.businessKey = this.$route.params.businessKey
        this.$refs.renProcessMultiple.showType = showType
        this.$refs.renProcessMultiple.parentObj = this
        this.$refs.renProcessMultiple.callbacks = callbacks
      })
    },
    // 关闭当前窗口
    closeCurrentTab (data) {
      var tabName = this.$store.state.contentTabsActiveName
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(item => item.name !== tabName)
      if (this.$store.state.contentTabs.length <= 0) {
        this.$store.state.sidebarMenuActiveName = this.$store.state.contentTabsActiveName = 'home'
        return false
      }
      if (tabName === this.$store.state.contentTabsActiveName) {
        this.$router.push({ name: this.$store.state.contentTabs[this.$store.state.contentTabs.length - 1].name })
      }
    },
    // 获取流程定义的表单路由配置信息
    getProcDefRouteSet (data, callback) {
      this.$http.get(`/activiti/process/getProcDefBizRoute/${data.processDefinitionId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        if (!res.data || !res.data.bizRoute) {
          return this.$message.error(this.$t('process.routeError'))
        }
        var param = {
          ...data,
          ...res.data
        }
        callback(param)
      }).catch(() => {})
    },
    getProcDefBizRouteAndProcessInstance (params, callback) {
      this.$http.get(`/activiti/process/getProcDefBizRouteAndProcessInstance`, {
        params: params
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        if (!res.data || !res.data.bizRoute) {
          return this.$message.error(this.$t('process.routeError'))
        }
        var param = {
          ...params,
          ...res.data
        }
        callback(param)
      }).catch(() => {})
    },
    // 根据流程定义KEY获取最新的表单路由配置信息
    getLatestProcDefRouteSet (procDefKey, callback) {
      this.$http.get(`/activiti/process/getLatestProcDefBizRoute`, {
        params: {
          procDefKey: procDefKey
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        if (!res.data || !res.data.bizRoute) {
          return this.$message.error(this.$t('process.routeError'))
        }
        var param = {
          procDefKey: procDefKey,
          ...res.data
        }
        callback(param)
      }).catch(() => {})
    },
    // 查看流程图
    forwardDetail (data) {
      var routeParams = {
        routeName: `${this.$route.name}__detail_${data.processInstanceId}`,
        menuId: `${this.$route.meta.menuId}`,
        title: `${this.$route.meta.title} - ${data.processDefinitionName}`,
        path: data.bizRoute,
        params: {
          processInstanceId: data.processInstanceId,
          businessKey: data.businessKey
        }
      }
      addDynamicRoute(routeParams, this.$router)
    },
    // 子级 查看流程图
    forwardTaskDetail (data) {
      var routeParams = {
        routeName: `${this.$route.name}__detail_${data.taskId}`,
        menuId: `${this.$route.meta.menuId}`,
        title: `${this.$route.meta.title} - ${data.taskName}`,
        path: data.bizRoute,
        params: {
          taskId: data.taskId,
          processInstanceId: data.processInstanceId,
          businessKey: data.businessKey
        }
      }
      addDynamicRoute(routeParams, this.$router)
    },
    forwardHandleUrl (data) {
      var routeParams = {
        routeName: `${this.$route.name}__handle_${data.taskId}`,
        menuId: `${this.$route.meta.menuId}`,
        title: `${this.$route.meta.title} - ${data.taskName}`,
        path: data.bizRoute,
        params: {
          taskId: data.taskId,
          processInstanceId: data.processInstanceId,
          processShowType: 'taskHandle',
          businessKey: data.businessKey
        }
      }
      addDynamicRoute(routeParams, this.$router)
    },
    // 获取创建人默认的机构部门科室
    getDepartment (ids, arr) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      thisvm.$http
        .post('/sys/user/subadmin/users', ids)
        .then(({
          data: res
        }) => {
          if (res.code === 0) {
            if (arr && arr.length > 0) {
              let fileIds = []
              for (let items = 0; items < arr.length; items++) {
                let item = arr[items]
                res.data.map(oItem => {
                  if (item.handler === oItem.id) {
                    item.userDuty = oItem.userDuty
                    item.sectionName = oItem.sectionName
                  }
                })
                if (item.result === '提交需求') {
                  if (fileIds.indexOf(item.opinion) === -1) {
                    fileIds.push(item.opinion)
                  }
                }
              }
              thisvm.getMutiFile(fileIds, arr)
            } else {
              thisvm.dataForm.ascription = [res.data[0].organizeId, res.data[0].deptId, res.data[0].sectionId]
              let actions = `${res.data[0].organizeName}-${res.data[0].deptName}-${res.data[0].sectionName}`
              thisvm.getNextDealUser(res.data[0].sectionId, '项目总监', actions)
            }
          } else {
            thisvm.$ctcLoading.close()
            thisvm.tableData = arr
            thisvm.$message.error(res.msg)
          }
        })
        .catch(() => {})
    },
    // 根据科室，职位查询下一步处理人
    getNextDealUser (v, f, m) {
      this.$ctcLoading.open()
      this.$http
        .get(`/sys/user/getUserInfoByParams?sectionId=${v}&userDuty=${f}`)
        .then(({
          data: res
        }) => {
          this.$ctcLoading.close()
          if (res.code === 0 && res.data.length > 0) {
            this.dataForm.nextDealUserName = res.data[0].realName
            this.dataForm.nextDealUser = res.data[0].id
          } else if (res.data.length === 0) {
            this.$message.warning(`【${m || this.$store.state.ascription}】下没有${f}!`)
            this.placeholder1 = '请给该科室设置项目总监'
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(() => {})
    },
    getMutiFile (fileIds, arr) {
      this.$axios.all(fileIds.map((item) => {
        return this.$http.get('/ctc/oss/mutiFile/listFiles', {
          params: {
            recordId: item
          }
        })
      })).then((resArr) => {
        this.$ctcLoading.close()
        let arrs = []
        resArr.forEach((el, i) => {
          let {
            data,
            code,
            msg
          } = el.data
          if (code === 0) {
            data.length > 0 && arrs.push({
              id: data[0].id,
              fileName: data[0].fileName,
              attId: fileIds[i]
            })
          } else {
            this.$message.error(msg)
          }
        })
        arr.filter(e => {
          arrs.find(i => {
            if (e.opinion === i.attId) {
              e.opinion = i.fileName
              e.attachementId = i.id
            }
          })
        })
        this.tableData = arr
      })
    }
  }
}
