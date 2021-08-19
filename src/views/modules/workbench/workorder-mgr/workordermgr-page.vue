<template>
  <el-row>
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill project-task-mgr">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="工单编号" prop="orderId">
                <el-input v-model="dataForm.orderId" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工单类型" prop="orderTypes">
                <el-select v-model="dataForm.orderTypes" multiple placeholder="请选择">
                  <el-option v-for="(item,index) in orderTypesData" :key="index" :label="item.dictLabel" :value="item.dictValue">{{item.dictLabel}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单状态" prop="orderStatus">
                <ctc-select v-model="dataForm.orderStatus" multiple dict-type="dealStatus" placeholder="请选择"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="text-align:right;">
              <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
              <el-button type="primary" size="small" @click="getDataRe()">查询</el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
              <br />
              <el-checkbox v-model="batchCheckAll" @change="batchCheckAllChange" style="margin-top:6px;">全选</el-checkbox>
            </el-col>
          </el-row>
          <el-row v-if="isOpen">
            <el-col :span="6">
              <el-form-item prop="taskId" label="关联任务">
                <ctc-project-task-table v-model="dataForm.taskId" placeholder="请选择任务" :parentProjectId.sync="dataForm.parentProjectId" :projectId.sync="dataForm.projectId" :taskId.sync="dataForm.taskId"></ctc-project-task-table>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="dealUser" label="处理人名">
                <el-select v-model="dataForm.dealUser" multiple filterable placeholder="请选择处理人" :disabled="!((dataForm.parentProjectId!='' || dataForm.projectId!='') && nowHandlerData.length>0)">
                  <el-option v-for="item in nowHandlerData" :key="item.id" :value="item.id" :label="item.realName">{{item.realName}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间" prop="createDate">
                <el-date-picker v-model="dataForm.createDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="计划时间" prop="planEndTimes">
                <el-date-picker v-model="dataForm.planEndTimes" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill  project-mgr-page">
        <el-container style="height: 100%;width: 100%;">
          <el-aside width="250px">
            <el-row style="margin-bottom:0px;">
              <el-col class="split-line" style="text-align:left;">
                树列表
              </el-col>
            </el-row>
            <el-row style="margin-bottom:10px;margin-top:5px;">
              <el-input placeholder="项目\子项目" v-model="nameFromProjectCase" clearable class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getSeachTreeData"></el-button>
              </el-input>
            </el-row>
            <el-row>
              <el-tree v-if="treeStatus" highlight-current :data="projectTreeData" :load="loadTreeNode" lazy :props="defaultProps" @node-click="handleNodeClick" @node-expand="handleNodeExpand" :expand-on-click-node="false" style="height:650px;overflow-y:auto;">
                <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
                  <!--nodeType={1:项目;2子项目;3:阶段;4:任务;模块6}-->
                  <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
                  <span>{{data.nodeName}}</span>
                </span>
              </el-tree>
            </el-row>
          </el-aside>
          <el-main style="height: 100%; width: 100%;padding: 0 0 0 29px">
            <el-row style="margin-bottom:20px;">
              <el-col :span="12" class="split-line" style="text-align:left;">
                列表展示
              </el-col>
              <el-col :span="12" style="text-align:right;">
                <el-button type="primary" size="small" @click="submitD">批量提交</el-button>
                <el-button type="primary" size="small" @click="publishBatch">批量催单</el-button>
              </el-col>
            </el-row>
            <el-table stripe highlight-current-row :data="dataList" ref="dataList" border lazy @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" max-height="600" style="width: 100%;">
              <el-table-column type="selection" width="50" align="center" :selectable="selectable"></el-table-column>
              <template v-for="(item, index) in titleDataList">
                <el-table-column v-if="item.code!='operate'" :key="index" :label="item.name" :width="getTableColumnWidth(item)" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="item.code!='orderStatus'" v-html="getTableColumnData(scope.row,item)"></span>
                    <template v-else>
                      <el-tag v-if="scope.row.orderStatus == 0" size="small" type="info" v-html="getTableColumnData(scope.row,item)"></el-tag>
                      <el-tag v-else-if="scope.row.orderStatus == 1" size="small" type="success" v-html="getTableColumnData(scope.row,item)"></el-tag>
                      <el-tag v-else-if="scope.row.orderStatus == 2" size="small" type="success" v-html="getTableColumnData(scope.row,item)"></el-tag>
                      <el-tag v-else-if="scope.row.orderStatus == 3" size="small" v-html="getTableColumnData(scope.row,item)"></el-tag>
                    </template>
                  </template>
                </el-table-column>
              </template>
              <el-table-column fixed="right" width="280" label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button @click="doTableOperate(item,scope.row)" :disabled="scope.row.orderStatus===2&&item==='1'||scope.row.orderStatus===2&&item==='2'" type="text" size="small" :key="index" v-for="(item, index) in scope.row.operate">
                    {{ $getDictLabel('orderManagementType',item) }}
                  </el-button>
                  <el-button @click="doReminderRecords(scope.row)" type="text" size="small">催单记录</el-button>
                  <el-button @click="doTableOperate('0',scope.row)" type="text" size="small">二级工单</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :current-page="page" :page-sizes="[10, 20, 50,50000]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
          </el-main>
        </el-container>
      </el-card>
    </el-col>
    <!-- 催单 -->
    <reminder v-if="reminderVisible" ref="reminder" @refreshDataList="getDataRe"></reminder>
    <!--催单记录-->
    <reminder-records :visible.sync="reminderRecords" ref="reminderRecords"></reminder-records>
    <!-- 工单日志 -->
    <journal v-if="journalVisible" ref="journal"></journal>
    <!--工单提交提示信息-->
    <workorder-tip-message :visible.sync="workorderTipMessage" ref="workorderTipMessage" @refreshDataList="getDataRe"></workorder-tip-message>
  </el-row>
</template>

<script>
import { getDictDataList } from '@/utils'
import mixinViewModule from '@/mixins/view-module'
import CtcProjectTaskTable from '@/components/project/ctc-project-task-table'
import { addDynamicRoute } from '@/router'
import reminder from './reminder'
import reminderRecords from './reminder-records'
import journal from './journal'
import WorkorderTipMessage from './workorder-tip-message'
export default {
  mixins: [mixinViewModule],
  name: 'WorkordermgrPage',
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      reminderVisible: false,
      reminderRecords: false,
      journalVisible: false,
      workorderTipMessage: false,
      nowHandlerData: [],
      orderTypesData: getDictDataList('workOrder.type').filter(function (item) {
        return item.dictValue !== '8'
      }),
      isOpen: false,
      nameFromProjectCase: '',
      dataForm: {
        orderId: '', // 工单id
        orderTypes: '', // 工单类型
        orderStatus: '', // 工单状态
        parentProjectId: '', // 项目id
        projectId: '', //  子项目id
        taskId: '', // 任务
        dealUser: '', // 处理人
        createDate: '', // 创建时间
        planEndTimes: '' // 计划完成时间

      },
      projectData: {
        // nodeType 1:项目2:子项目;3:阶段
        nodeType: '',
        projectId: '',
        projectName: ''
      },
      projectTreeData: [],
      treeStatus: true,
      defaultProps: {
        children: 'zones',
        label: 'nodeName',
        isLeaf: 'leaf'
      },
      dataListLoading: false,
      batchCheckAll: false,
      dataList: [],
      titleDataList: [
        {
          'code': 'orderId',
          'name': '工单编号'
        },
        {
          'code': 'orderTitle',
          'name': '工单标题'
        },
        {
          'code': 'orderType',
          'name': '工单类型'
        },
        {
          'code': 'orderStatus',
          'name': '工单状态'
        },
        {
          'code': 'parentProject',
          'name': '项目'
        },
        {
          'code': 'project',
          'name': '子项目'
        },
        { 'code': 'userName', 'name': '处理人' },
        {
          'code': 'createDate',
          'name': '创建时间'
        },
        {
          'code': 'planEndTime',
          'name': '计划完成'
        },
        {
          'code': 'updateDate',
          'name': '处理日期'
        }
      ]
    }
  },
  watch: {
    'dataForm.parentProjectId' (newVal, oldVal) {
      this.getDynamicInfoByProjectId()
    },
    'dataForm.projectId' (newVal, oldVal) {
      this.getDynamicInfoByProjectId()
    }
  },
  computed: {},
  activated () {
    this.getDataRe()
  },
  mounted () {
    this.getData()
  },
  methods: {
    selectable (data, index) {
      if (data.orderStatus === 2) {
        return false
      } else {
        return true
      }
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        return require('../../../../assets/img/icon_' + data.nodeType + '.png')
      } else {
        let mapInfo = { '1': '项目', '2': '子项目', '3': '阶段', '4': '任务', '6': '模块' }
        return mapInfo[data.nodeType] + '：' + data.nodeName
      }
    },
    getDynamicInfoByProjectId () {
      let parentProjectId = (this.dataForm.parentProjectId.indexOf('clear') !== -1) ? '' : this.dataForm.parentProjectId
      let projectId = (this.dataForm.projectId.indexOf('clear') !== -1) ? '' : this.dataForm.projectId
      let tprojectId = projectId || parentProjectId
      if (tprojectId !== '') {
        this.getNextHandler(tprojectId)
      }
    },
    // 获取下一个处理人
    getNextHandler (projectId) {
      let params = { 'projectId': projectId }
      this.$http.get('ctc/defect/base/next', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.nowHandlerData = res.data || []
        }
      }).catch(() => { })
    },
    getTableColumnWidth (item) {
      let width = 120
      if (['orderTitle', 'parentProject', 'project', 'userName', 'updateDate'].includes(item.code)) {
        width = 180
      } else if (['orderId'].includes(item.code)) {
        width = 210
      }
      return width
    },
    batchCheckAllChange (item) {
      if (item) {
        this.limit = 50000
      } else {
        this.limit = 10
      }
      this.page = 1
      this.getData()
    },
    handleSizeChange (val) {
      this.limit = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getData()
    },
    getDataRe () {
      this.page = 1
      this.getData()
    },
    getData () {
      this.dataListLoading = true
      let params = { page: this.page, limit: this.limit, ...this.dataForm }
      // 特殊处理工单类型
      params.orderTypes = params.orderTypes.join(',')
      // 特殊处理工单状态
      params.orderStatus = params.orderStatus.join(',')
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createStartDate = params.createDate[0]
        params.createEndDate = params.createDate[1]
        delete params['createDate']
      }
      if (params.planEndTimes.length > 0) {
        params.planStartTime = params.planEndTimes[0]
        params.planEndTime = params.planEndTimes[1]
        delete params['planEndTimes']
      }
      if (params.dealUser.length > 0) {
        params.dealUser = params.dealUser.join(',')
      }
      this.$http.get('/ctc/task/workOrder/pageList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.dataListLoading = false
          // this.titleDataList = res.data.head
          let list = res.data.data.list
          for (let i = 0; i < list.length; i++) {
            if (!list[i].parentProject) {
              list[i].parentProject = list[i].project
              list[i].project = ''
            }
          }
          this.dataList = list
          for (let i = 0; i < this.dataList.length; i++) {
            this.dataList[i].id = this.dataList[i].orderId + Math.random()
          }
          this.total = res.data.data.total
          // 判断是否批量全选
          if (this.batchCheckAll) {
            this.$refs.dataList.toggleAllSelection()
          }
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    subTableload (tree, treeNode, resolve) {
      console.log(tree)
      let params = { 'orderId': tree.orderId, 'orderDealId': tree.orderDealId }
      this.$http.get('/ctc/task/workOrder/subList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('获取子项目项目信息数据失败')
        } else {
          if (res.data.length === 0) {
            this.$message.info(tree.orderTitle + '，目前还没有建立子项目或直接挂载任务')
          } else {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].id = res.data[i].orderId + Math.random()
            }
          }
          resolve(res.data)
        }
      }).catch(() => {
      })
    },
    getSeachTreeData () {
      let thisvm = this
      let params = { 'nameFromProjectCase': thisvm.nameFromProjectCase }
      thisvm.$http.get('/ctc/project/projectDetail/listTreeRoot', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        let data = res.data
        thisvm.projectTreeData = data
      }).catch(() => {
        thisvm.projectTreeData = []
      })
    },
    // 获取项目-任务树的数据
    getProjectTaskTreeData (resolve) {
      let params = {}
      this.$http.get('/ctc/project/projectDetail/listTreeRoot', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        resolve(res.data)
        this.queryTaskCountList()
      }).catch(() => { })
    },
    loadTreeNode (node, resolve) {
      // nodeType 1:项目2:子项目;3:阶段
      if (node.level === 0) {
        this.getProjectTaskTreeData(resolve)
      } else {
        let params = { 'id': node.data.id, 'nodeType': node.data.nodeType }
        this.$http.get('/ctc/project/projectDetail/listTree', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            resolve(res.data)
          }
        }).catch(() => {
        })
      }
    },
    handleNodeClick (data) {
      // nodeType 1:项目2:子项目;3:阶段
      let nodeType = data.nodeType
      this.dataForm.parentProjectId = ''
      this.dataForm.projectId = ''
      this.dataForm.orderType = ''
      if (nodeType === 1) {
        this.dataForm.parentProjectId = data.id
      } else if (nodeType === 2) {
        this.dataForm.parentProjectId = data.pid
        this.dataForm.projectId = data.id
      } else if (nodeType === 3) {
        this.dataForm.projectId = data.pid
        this.dataForm.orderType = data.stageType
      }
      this.getDataRe()
    },
    handleNodeExpand (data) {
      if (data.nodeType === 1) {
        this.projectData.projectId = data.id
      } else if (data.nodeType === 2) {
        this.projectData.projectId = data.id
        this.projectData.parentProjectId = data.pid
      } else if (data.nodeType === 3) {
        this.projectData.projectStageId = data.id
      }
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'orderType') {
        columnValue = this.$getDictLabel('workOrder.type', row[item.code])
      } else if (item.code === 'orderStatus') {
        columnValue = this.$getDictLabel('dealStatus', row[item.code])
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    publishBatch () {
      if (this.dataListSelections.length === 0) {
        this.$message.warning('请选择需要催单的工单！！！')
      } else {
        console.log(this.dataListSelections)
        // let ids = []
        // for (let i = 0; i < this.dataListSelections.length; i++) {
        //   ids.push(this.dataListSelections[i].projectId)
        // }
        this.reminder(this.dataListSelections)
      }
    },
    doTableOperate (type, row) {
      let path = ''
      let title = ''
      let params = {}
      if (type === '2') { // 催单
        this.reminder([row])
      } else if (type === '3') { // 工单日志
        this.journal(row.orderId)
      } else if (type === '4') { // 查看
        if (row.orderStatus === 0) {
          this.setStatus(row.orderDealId, 1)
        }
        path = 'workbench/mytodo/toDealWith/requirementAnalysis'
        title = '我的工单'
        params.type = 'order' // order--去处理子路由判断进来的是什么类型
        params.rows = row
        // 特殊处理缺陷中心待办
        if (row.orderType === 8) {
          path = 'defectcenter/defect-mgr/defect-data-detail'
          params.defectId = row.defectId
        }
      } else if (type === '1') {
        // 提交
        this.$confirm('确认是否提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = {}
          ids.orderIds = []
          ids.orderDealIds = []
          if (row.orderDealId !== null) {
            ids.orderDealIds.push(row.orderDealId)
          } else {
            ids.orderIds.push(row.orderId)
          }
          this.sub(ids)
        }).catch(() => {
        })
      } else if (type === '0') {
        path = 'workbench/workorder-mgr/workordermgr-page-details'
        title = row.orderTitle
        params.type = 'order'
        params.rows = row
        params.dataTitle = this.titleDataList
      }
      this.customAddDynamicRoute(path, title, params)
    },
    // 工单催办记录
    doReminderRecords (row) {
      this.$refs.reminderRecords.orderId = row.orderId || ''
      this.$refs.reminderRecords.orderDealId = row.orderDealId || ''
      this.$refs.reminderRecords.init()
    },
    customAddDynamicRoute (path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {}
      }
      addDynamicRoute(routeParams, this.$router)
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getDataRe()
    },
    submitD () {
      if (this.dataListSelections.length === 0) {
        this.$message.warning('请选择需要提交的工单！！！')
      } else {
        console.log(this.dataListSelections)
        this.$confirm('将进行批量提交, 是否继续?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = {}
          ids.orderIds = []
          ids.orderDealIds = []
          for (let i = 0; i < this.dataListSelections.length; i++) {
            if (this.dataListSelections[i].orderDealId !== null) {
              ids.orderDealIds.push(this.dataListSelections[i].orderDealId)
            } else {
              ids.orderIds.push(this.dataListSelections[i].orderId)
            }
          }
          this.sub(ids)
        }).catch(() => { })
      }
    },
    sub (ids) {
      this.$ctcLoading.open()
      // let params = { 'ids': ids }
      this.$http.post('/ctc/task/orderHandle/submitList', ids).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let data = res.data || []
          if (data.length > 0) {
            this.$refs.workorderTipMessage.orderSubmitData = data
            this.$refs.workorderTipMessage.init()
          } else {
            this.$message.success('提交成功')
            this.getDataRe()
          }
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    setStatus (orderDealId, status) {
      let params = { orderDealId: orderDealId, status: status }
      this.$http.post('/ctc/task/workOrder/dealUp', params).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.getData()
        }
      }).catch(() => {
      })
    }
  },
  components: {
    reminder,
    reminderRecords,
    journal,
    CtcProjectTaskTable,
    WorkorderTipMessage
  }
}
</script>
<style lang="scss">
.project-task-mgr {
}
</style>
