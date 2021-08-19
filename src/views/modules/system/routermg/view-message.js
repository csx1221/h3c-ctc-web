import Cookies from 'js-cookie'
import qs from 'qs'
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
      order: '',                  // 排序，asc／desc
      orderField: '',             // 排序，字段
      page: 1,                    // 当前页码
      limit: 10,                  // 每页数
      total: 0,                   // 总条数
      dataListLoading: false,     // 数据列表，loading状态
      dataListSelections: [],     // 数据列表，多选项
      addOrUpdateVisible: false,  // 新增／更新，弹窗visible状态
      showMessageDetail: false,   // 消息补偿的visible状态
      taskConfigureVisible: false,    // 任务配置，弹窗visible状态
      transferOrderVisible: false,  //转单 ，弹窗visible状态
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      optionsBusiness: [
        {
          value: 0,
          label: '项目'
        },
        {
          value: 1,
          label: '任务'
        },
        {
          value: 2,
          label: '工单'
        },
        {
          value: 3,
          label: '用例主本'
        },
        {
          value: 4,
          label: '用例副本'
        },
        {
          value: 5,
          label: '参测对象'
        },
        {
          value: 6,
          label: '参测对象成员'
        },
        {
          value: 7,
          label: '项目成员'
        },
        {
          value: 8,
          label: '工单执行人'
        }
      ],
      optionsOperation: [
        {
          value: 0,
          label: '新增'
        },
        {
          value: 1,
          label: '修改'
        },
        {
          value: 2,
          label: '删除'
        },
        {
          value: 3,
          label: '其他'
        }
      ],
      OptionsStatus: [
        {
          value: 0,
          label: '未处理'
        },
        {
          value: 1,
          label: '消费成功'
        },
        {
          value: 2,
          label: '消费失败'
        },
        {
          value: 3,
          label: '已处理'
        },
        {
          value: 4,
          label: '人工处理'
        }
      ],
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
      var params = qs.stringify({
        'token': Cookies.get('token'),
        ...this.dataForm
      })
      window.location.href = `${window.SITE_CONFIG['apiURL']}${this.mixinViewModuleOptions.exportURL}?${params}`
    }
  }
}
