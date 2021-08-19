import debounce from 'lodash/debounce'
import ctcUtils from '@/utils/ctc-utils.js'
export default {
  data () {
    /* eslint-disable */
    return {
      // 设置属性
      mixinViewModuleOptions: {
        createdIsNeed: true,      // 此页面是否在创建时，调用查询数据列表接口？
        activatedIsNeed: false,   // 此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataListURL: '',       // 数据列表接口，API地址
        getDataListIsPage: false, // 数据列表接口，是否需要分页？
        getDataListDynamicTableTitle:false, // 数据列表接口，是否是动态表头？
        deleteURL: '',            // 删除接口，API地址
        deleteIsBatch: false,     // 删除接口，是否需要批量？
        deleteIsBatchKey: 'id',   // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
        exportURL: ''             // 导出接口，API地址
      },
      // 默认属性
      dateTimeArr: [],            // 时间选择的数组
      startTime: '',              // 被赋值的起始时间
      endTime: '',                // 被赋值的结束时间
      dataForm: {},               // 查询条件
      dataList: [],               // 数据列表
      tagDataList: [],            // 特殊处理标签页
      tagTotal: 0,                // 标签页的总数
      order: '',                  // 排序，asc／desc
      orderField: '',             // 排序，字段
      page: 1,                    // 当前页码
      limit: 10,                  // 每页数
      total: 0,                   // 总条数
      dataListLoading: false,     // 数据列表，loading状态
      dataListSelections: [],     // 数据列表，多选项
      addOrUpdateVisible: false,  // 新增／更新，弹窗visible状态
      showMessageDetail: false,   // 消息补偿的visible状态
      quanlityDetail: false,      // 全网质量项目详情
      childQuanlityDetail: false, // 全网质量子项目详情
      showTagDetail: false,       // 标签详情的visible状态
      showTagStatistic: false,    // 标签数量的统计visible状态
      showTagEdit: false,         // 标签编辑页面的visible状态
      tagEditList: false,         // 标签列表新增数组visib状态
      showProjectView: false,     // 项目概况实际进度visible状态
      showChildProgress: false,   // 子级项目概况实际进度visible状态
      showProvinceProgress: false,  // 项目省测概况visible状态
      showChildProvince: false,     // 子级项目省测概况visible状态
      taskConfigureVisible: false,  // 任务配置，弹窗visible状态
      transferOrderVisible: false,  //转单 ，弹窗visible状态
      optionsBusiness: []
    }
    /* eslint-enable */
  },
  created () {
    if (this.mixinViewModuleOptions.createdIsNeed) {
      this.query()
    }
  },
  activated () {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.query()
    }
  },
  methods: {
    // 浮点转百分比
    toPercent (point) {
      var str = Number(point).toFixed(2)
      str += '%'
      return str
    },
    // 省测概况的列表excel导出
    provinceExcel: debounce(function (pid, cid, pageNum, limitNum, pName) {
      let url = '/ctc/visualization/projectSurvey/provinceList/export'
      let data = { 'page': pageNum, 'limit': limitNum, 'projectId': pid, 'parentId': cid }
      data.fileName = pName
      ctcUtils.customExportGet(url, data)
    }, 800, { 'leading': true, 'trailing': false }),
    // 全网用例的excle文件下载
    quanlityExcle: debounce(function (pid, cid, pName) {
      let url = '/ctc/visualization/projectSurvey/caseExcel'
      let data = { 'projectId': pid, 'parentId': cid }
      data.fileName = pName
      ctcUtils.customExportGet(url, data)
    }, 800, { 'leading': true, 'trailing': false }),
    // 表头样式
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'height:47px;padding:3px;color:#EAE7E1 !important;background:rgba(34, 179, 197, 0.85) !important;text-align:center;'
      } else {
        return ''
      }
    },
    // 重置表头的换行问题
    resetTableHead (h, { column, index }) {
      let l = column.label.length
      let f = 20
      column.minWidth = f * l
      return h('div', { class: 'table-head', style: { width: '100%' } }, [ column.label ])
    },
    onDateTime () {
      // 解决时间选择器的事件赋值问题
      this.$nextTick(() => {
        this.startTime = this.dateTimeArr[0]
        this.endTime = this.dateTimeArr[1]
      })
    },
    // 获取数据列表
    query (id) {
      this.dataListLoading = true
      this.$http.get(
        this.mixinViewModuleOptions.getDataListURL,
        {
          params: {
            managerIds: this.managerList ? this.managerList + '' : '',
            organizeIds: this.provinceList ? this.provinceList + '' : '',
            createStartDate: this.startTime,
            createEndDate: this.endTime,
            planStartTime: this.startTime,
            planEndTime: this.endTime,
            applicationId: this.dataForm.applicationId,
            startTime: this.startTime,
            endTime: this.endTime,
            id: id,
            order: this.order,
            orderField: this.orderField,
            page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
            limit: this.mixinViewModuleOptions.getDataListIsPage ? this.limit : null,
            ...this.dataForm
          }
        }
      ).then(({ data: res }) => {
        this.dataListLoading = false
        // 5.25 liyufeng 修改totalCount 总条数 提供给total
        res.data = res.data || {}
        if (res.data.totalCount) {
          res.data.total = res.data.totalCount
        }
        if (res.code !== 0) {
          this.dataList = []
          this.total = 0
          return this.$message.error(res.msg)
        }
        // 判断是否是动态表头
        if (this.mixinViewModuleOptions.getDataListDynamicTableTitle) {
          this.dataList = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.dataList = this.mixinViewModuleOptions.getDataListIsPage ? res.data.list : res.data
          this.total = this.mixinViewModuleOptions.getDataListIsPage ? res.data.total : 0
          this.tagDataList = this.mixinViewModuleOptions.getDataListIsPage ? res.data.data.list : res.data.data
          this.tagTotal = this.mixinViewModuleOptions.getDataListIsPage ? res.data.data.total : 0
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    deleteHe (uuid) {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.delete(`/ctc/project/base/project?projectUuid=${uuid}`).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.query()
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.query()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 排序
    dataListSortChangeHandle (data) {
      if (!data.order || !data.prop) {
        this.order = ''
        this.orderField = ''
        return false
      }
      this.order = data.order.replace(/ending$/, '')
      this.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      this.query()
    },
    // 分页, 每页条数
    pageSizeChangeHandle (val) {
      this.page = 1
      this.limit = val
      this.query()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.query()
    },
    getDataList: function () {
      this.page = 1
      this.query()
    },
    // 转单 -- by 李鹏飞 2020/05/12 add
    transferOrder (projectId, orderDealId, orderType) {
      this.transferOrderVisible = true
      this.$nextTick(() => {
        this.$refs.transferOrder.orderDealId = orderDealId
        this.$refs.transferOrder.orderType = orderType
        this.$refs.transferOrder.init()
        this.$refs.transferOrder.getProjectMember(projectId)
      })
    },
    // 催单 -- by 李鹏飞 2020/05/13 add
    reminder (rows) {
      this.reminderVisible = true
      this.$nextTick(() => {
        this.$refs.reminder.rows = rows
        this.$refs.reminder.init()
      })
    },
    // 工单日志 -- by 李鹏飞 2020/05/13 add
    journal (orderId) {
      this.journalVisible = true
      this.$nextTick(() => {
        this.$refs.journal.orderId = orderId
        this.$refs.journal.init()
      })
    },
    // 子级项目概况的省测概况
    childProvinceProgressHandle (id, num, parentId) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.showChildProvince = true
      this.$nextTick(() => {
        this.$refs.childProvinceRef.dataForm.projectId = id
        this.$refs.childProvinceRef.dataForm.name = num
        this.$refs.childProvinceRef.dataForm.parentId = parentId
        this.$refs.childProvinceRef.dataForm.uuid = num
        this.$refs.childProvinceRef.init()
        this.$refs.childProvinceRef.active = num
        this.$refs.childProvinceRef.displayChild = num
      })
    },
    // 项目概况的省测概况
    provinceProgressHandle (id, num, parentId) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.showProvinceProgress = true
      this.$nextTick(() => {
        this.$refs.provinceProgress.dataForm.projectId = id
        this.$refs.provinceProgress.dataForm.name = num
        this.$refs.provinceProgress.dataForm.parentId = null
        this.$refs.provinceProgress.dataForm.uuid = num
        this.$refs.provinceProgress.init()
        this.$refs.provinceProgress.active = num
        this.$refs.provinceProgress.displayChild = num
      })
    },
    // 子级项目概况的实际进度概况
    childProjectViewHandle (id, num, status, parentId) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.showChildProgress = true
      this.$nextTick(() => {
        this.$refs.childProgressRef.dataForm.projectId = id
        this.$refs.childProgressRef.dataForm.status = status
        this.$refs.childProgressRef.dataForm.name = num
        this.$refs.childProgressRef.dataForm.parentId = parentId
        this.$refs.childProgressRef.dataForm.uuid = num
        this.$refs.childProgressRef.init()
        this.$refs.childProgressRef.active = num
        this.$refs.childProgressRef.displayChild = num
      })
    },
    // 项目概况的实际进度概况
    projectViewHandle (id, num, status) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.showProjectView = true
      this.$nextTick(() => {
        this.$refs.projectView.dataForm.projectId = id
        this.$refs.projectView.dataForm.status = status
        this.$refs.projectView.dataForm.parentId = null
        this.$refs.projectView.dataForm.name = num
        this.$refs.projectView.dataForm.uuid = num
        this.$refs.projectView.init()
        this.$refs.projectView.active = num
        this.$refs.projectView.displayChild = num
      })
    },
    // 标签列表新增数组页面
    tagEditListHandle (id, num) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.tagEditList = true
      this.$nextTick(() => {
        this.$refs.tagEditListRef.dataForm.id = id
        this.$refs.tagEditListRef.dataForm.labelId = id
        this.$refs.tagEditListRef.dataForm.uuid = num
        this.$refs.tagEditListRef.init()
        this.$refs.tagEditListRef.active = num
        this.$refs.tagEditListRef.displayChild = num
      })
    },
    // 标签编辑页面
    tagEditHandle (id, num) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.showTagEdit = true
      this.$nextTick(() => {
        this.$refs.tagEdit.dataForm.id = id
        this.$refs.tagEdit.dataForm.labelId = id
        this.$refs.tagEdit.dataForm.uuid = num
        this.$refs.tagEdit.init()
        this.$refs.tagEdit.active = num
        this.$refs.tagEdit.displayChild = num
      })
    },
    // 标签页面统计
    tagStatisticHandle (id, num) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.showTagStatistic = true
      this.$nextTick(() => {
        this.$refs.tagStatistic.dataForm.id = id
        this.$refs.tagStatistic.dataForm.labelId = id
        this.$refs.tagStatistic.dataForm.uuid = num
        this.$refs.tagStatistic.init()
        this.$refs.tagStatistic.active = num
        this.$refs.tagStatistic.displayChild = num
      })
    },
    // 标签页面详情
    tagDetailHandle (id, num) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.showTagDetail = true
      this.$nextTick(() => {
        this.$refs.tagDetail.dataForm.id = id
        this.$refs.tagDetail.dataForm.labelId = id
        this.$refs.tagDetail.dataForm.uuid = num
        this.$refs.tagDetail.init()
        this.$refs.tagDetail.active = num
        this.$refs.tagDetail.displayChild = num
      })
    },
    // 全网质量的子项目下表详情
    quanlityChildDetailHandle (id, num) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.childQuanlityDetail = true
      this.$nextTick(() => {
        this.$refs.qualityChildProject.dataForm.status = 2
        this.$refs.qualityChildProject.dataForm.managerIds = this.dataForm.managerIds
        this.$refs.qualityChildProject.dataForm.organizeId = id
        this.$refs.qualityChildProject.dataForm.id = id
        this.$refs.qualityChildProject.dataForm.uuid = num
        this.$refs.qualityChildProject.init()
        this.$refs.qualityChildProject.active = num
        this.$refs.qualityChildProject.displayChild = num
      })
    },
    // 全网质量的下表详情
    quanlityDetailHandle (id, num) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.quanlityDetail = true
      this.$nextTick(() => {
        this.$refs.qualityProject.dataForm.status = 1
        this.$refs.qualityProject.dataForm.managerIds = this.dataForm.managerIds
        this.$refs.qualityProject.dataForm.organizeId = id
        this.$refs.qualityProject.dataForm.id = id
        this.$refs.qualityProject.dataForm.uuid = num
        this.$refs.qualityProject.init()
        this.$refs.qualityProject.active = num
        this.$refs.qualityProject.displayChild = num
      })
    },
    // 查看消息补偿详情
    showMessageDetailHandle (id, num) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.showMessageDetail = true
      this.$nextTick(() => {
        this.$refs.messageDetail.dataForm.id = id
        this.$refs.messageDetail.dataForm.uuid = num
        this.$refs.messageDetail.init()
        this.$refs.messageDetail.active = num
        this.$refs.messageDetail.displayChild = num
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id, num) {
      if (num === 1 && this.currentRow === null) {
        this.$message.error('请选择项目!')
        return
      } else if (num === 1 && this.currentRow.projectType === '0') {
        this.$message.error('请选择正确项目!')
        return
      }
      // 缺少判断父项目能否添加子项目
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.dataForm.uuid = num
        this.$refs.addOrUpdate.init()
        this.$refs.addOrUpdate.active = num
        this.$refs.addOrUpdate.displayChild = num
      })
    },
    // 任务配置
    // 新增 / 修改
    taskConfigureHandle (id, num) {
      if (id !== '') {
        this.meth = true
      } else {
        this.meth = false
      }
      this.taskConfigureVisible = true
      this.$nextTick(() => {
        this.$refs.taskConfigure.dataForm.id = id
        this.$refs.taskConfigure.init()
        this.$refs.taskConfigure.active = num
        this.$refs.taskConfigure.fuzi = num
      })
    },
    reset (formName) {
      this.$refs[formName].resetFields()
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
    // 删除
    deleteHandle (id, row) {
      if (row) {
        this.$toggleRowSelectionTable('dataList', row)
      }
      if (this.mixinViewModuleOptions.deleteIsBatch && !id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.delete(
          `${this.mixinViewModuleOptions.deleteURL}${this.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + id}`,
          this.mixinViewModuleOptions.deleteIsBatch ? {
            'data': id ? [id] : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])
          } : {}
        ).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.query()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 导出
    exportHandle () {
      let url = this.mixinViewModuleOptions.exportURL
      let data = this.dataForm
      data.fileName = '数据导出'
      ctcUtils.customExportGet(url, data)
    }
  }
}
