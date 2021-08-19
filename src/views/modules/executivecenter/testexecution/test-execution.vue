<template>
  <el-row class="project-mgr-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill project-task-mgr">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="工单名称" prop="orderId">
                <el-input v-model="dataForm.orderId" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工单状态" prop="dealStatus">
                <ctc-select v-model="dataForm.dealStatus" dict-type="dealStatus" placeholder="请选择"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="关联平台" prop="platformId">
                <el-select v-model="dataForm.platformId" placeholder="请选择关联平台">
                  <el-option v-for="(item,index) in relaPlatformData" :key="index" :label="item.name" :value="item.applicationId">{{item.name}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
              <el-button type="primary" size="small" @click="getDataRe()">查询</el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
            </el-col>
          </el-row>
          <el-row v-if="isOpen">
            <el-col :span="6">
              <el-form-item label="执行类型" prop="caseType">
                <ctc-select v-model="dataForm.caseType" dict-type="executionMethod" placeholder="请选择"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间" prop="createDate">
                <el-date-picker v-model="dataForm.createDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
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
              <el-input placeholder="项目\子项目\任务名称" v-model="nameFromProjectCase" @keyup.enter.native="getSeachTreeData()" clearable class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getSeachTreeData"></el-button>
              </el-input>
            </el-row>
            <el-row>
              <el-tree v-if="treeStatus" highlight-current :data="projectTreeData" :load="loadTreeNode" lazy :props="defaultProps" @node-click="handleNodeClick" @node-expand="handleNodeExpand" :expand-on-click-node="false" style="height:580px;overflow-y:auto;">
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
                列表内容<span style="color:#4190f7;padding-left:24px;">说明：默认不加载数据，请先点击左侧项目树</span>
              </el-col>
            </el-row>
            <el-table stripe row-key="id" :data="dataList" border lazy :load="subTableload" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
              <el-table-column type="selection" width="50" align="center"></el-table-column>
              <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
              <template v-for="(item, index) in titleDataList">
                <el-table-column v-if="item.code!='operate'" :key="index" :label="item.name" header-align="center" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="item.code!='dealStatus'" v-html="getTableColumnData(scope.row,item)"></span>
                    <template v-else>
                      <el-tag v-if="scope.row.dealStatus === 0" size="small" type="info" v-html="getTableColumnData(scope.row,item)"></el-tag>
                      <el-tag v-else-if="scope.row.dealStatus === 1" size="small" type="success" v-html="getTableColumnData(scope.row,item)"></el-tag>
                      <el-tag v-else-if="scope.row.dealStatus === 2" size="small" type="success" v-html="getTableColumnData(scope.row,item)"></el-tag>
                      <el-tag v-else-if="scope.row.dealStatus === 3" size="small" v-html="getTableColumnData(scope.row,item)"></el-tag>
                    </template>
                  </template>
                </el-table-column>
              </template>
              <el-table-column fixed="right" width="100" label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button @click="doTableOperate(0,scope.row)" type="text" size="small">去处理</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
          </el-main>
        </el-container>
      </el-card>
    </el-col>
    <job-details v-if="jobDetailsVisible" ref="jobDetails" @init="jobDetailsVisible = false"></job-details>
  </el-row>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import jobDetails from '@/views/modules/executivecenter/testexecution/job-details'
import ctcUtils from '@/utils/ctc-utils.js'
import { addDynamicRoute } from '@/router'
export default {
  mixins: [mixinViewModule],
  name: 'test-execution',
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      jobDetailsVisible: false,
      isOpen: false,
      dataForm: {
        orderId: '', // 项目名称
        // scope: '', // 全网测试
        dealStatus: '', // 工单状态
        platformId: '', // 执行平台
        testType: '', // 测试类型
        caseType: '', // 执行方法
        createDate: '' // 创建时间
      },
      relaPlatformData: [],
      relaPlatformDataMap: {},
      projectData: {
        // nodeType 1:项目2:子项目;3:阶段
        nodeType: '',
        projectId: '',
        projectName: ''
      },
      nameFromProjectCase: '',
      projectTreeData: [],
      treeStatus: true,
      defaultProps: {
        children: 'zones',
        label: 'nodeName',
        isLeaf: 'leaf'
      },
      dataListLoading: false,
      dataList: [],
      titleDataList: [
        {
          'code': 'orderTitle',
          'name': '工单名称'
        },
        {
          'code': 'caseCount',
          'name': '用例总数'
        },
        {
          'code': 'execCount',
          'name': '已执行'
        },
        {
          'code': 'notExecCount',
          'name': '未执行'
        },
        {
          'code': 'passRate',
          'name': '通过率'
        },
        {
          'code': 'platformId',
          'name': '关联平台'
        },
        {
          'code': 'dealStatus',
          'name': '工单状态'
        },
        {
          'code': 'createDate',
          'name': '创建时间'
        },
        {
          'code': 'planEndTime',
          'name': '计划完成'
        }
      ]
    }
  },
  computed: {},
  mounted () {
    // 加载关联平台数据
    this.getRelevanceData()
  },
  methods: {
    getTreeIcon (type, data) {
      if (type === 'src') {
        return require('../../../../assets/img/icon_' + data.nodeType + '.png')
      } else {
        let mapInfo = { '1': '项目', '2': '子项目', '3': '阶段', '4': '任务', '6': '模块' }
        return mapInfo[data.nodeType] + '：' + data.nodeName
      }
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
    getRelevanceData () {
      this.$http.get('/ctc/project/relaPlatform/list', {
        params: {}
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let defaultData = [{ 'applicationId': '-1', 'name': '执行中心', 'code': 'ZXZX' }]
          let data = defaultData.concat(res.data)
          this.relaPlatformDataMap = {}
          data.forEach((item, index) => {
            this.relaPlatformDataMap[item.applicationId] = item.name
          })
          this.relaPlatformData = data
        }
      }).catch(() => { })
    },
    getData () {
      this.dataListLoading = true
      let params = { page: this.page, limit: this.limit, ...this.dataForm }
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createStartDate = params.createDate[0]
        params.createEndDate = params.createDate[1]
        delete params['createDate']
      }
      this.$http.get('/ctc/exec/order/exec/pageList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.dataListLoading = false
          this.dataList = res.data.data.list
          for (let i = 0; i < this.dataList.length; i++) {
            this.dataList[i].id = this.dataList[i].orderId + Math.random()
          }
          this.total = res.data.data.total
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    subTableload (tree, treeNode, resolve) {
      console.log(tree)
      let params = { 'orderId': tree.orderId, 'orderDealId': tree.orderDealId }
      this.$http.get('/ctc/exec/order/exec/subList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('获取子项目项目信息数据失败')
        } else {
          if (res.data.length === 0) {
            this.$message.info(tree.name + '，目前还没有建立子项目或直接挂载任务')
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
        if (node.data.childNodeType === 2) {
          let params = { 'id': node.data.id, 'nodeType': node.data.nodeType }
          this.$http.get('/ctc/project/projectDetail/listTree', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            } else {
              resolve(res.data)
            }
          }).catch(() => {
          })
        } else if (node.data.childNodeType === 3) {
          let params = { 'id': node.data.id, 'taskType': 7 }
          this.$http.get('/ctc/task/taskQuery/listTaskTree', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            } else {
              resolve(res.data)
            }
          }).catch(() => {
          })
        }
      }
    },
    handleNodeClick (data) {
      this.dataForm.taskId = ''
      if (data.nodeType === 4) {
        this.dataForm.taskId = data.id
        this.dataForm.projectId = data.pid
        this.dataForm.parentProjectId = data.parentProjectId
      } else {
        this.dataForm.projectId = data.id
        this.dataForm.parentProjectId = data.pid
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
      if (item.code === 'testType') {
        columnValue = this.$getDictLabel('testType', row[item.code])
      } else if (item.code === 'dealStatus') {
        columnValue = this.$getDictLabel('dealStatus', row[item.code])
      } else if (item.code === 'platformId') {
        columnValue = this.relaPlatformDataMap[row[item.code]] || '执行中心'
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    doTableOperate (type, row) {
      if (type === 0) { // 详情
        if (row.dealStatus === 0) {
          this.setStatus(row.orderDealId, 1)
        }
        // 详情
        let params = {}
        let path = 'executivecenter/testexecution/case-list'
        let title = row.orderTitle
        params.type = 'details' //  子路由判断进来的是什么类型
        params.rows = row
        this.customAddDynamicRoute(path, title, params)
      }
    },
    setStatus (orderDealId, status) {
      let params = { orderDealId: orderDealId, status: status }
      this.$http.post('/ctc/task/workOrder/dealUp', params).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.getProjectInfo()
        }
      }).catch(() => {
      })
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
        let ids = {}
        ids.orderIds = []
        ids.orderDealIds = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          if (this.dataListSelections[i].orderDealId !== null) {
            ids.orderDealIds.push(Number(this.dataListSelections[i].orderDealId))
          } else {
            ids.orderIds.push(Number(this.dataListSelections[i].orderId))
          }
        }
        this.sub(ids)
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
          this.$message.success('提交成功')
          this.getDataRe()
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    doExport () {
      let data = { ...this.dataForm }
      let url = '/ctc/exec/order/exec/export'
      ctcUtils.customExportGet(url, data)
    }
  },
  components: {
    jobDetails
  }
}
</script>
<style lang="scss">
.project-task-mgr {
  .el-form-item__content .el-input-group--append {
    width: 200px;
  }
  .el-form-item__content .el-date-editor--date {
    width: 200px;
  }
  .el-form-item__content .el-date-editor--date {
    width: 200px;
  }
  .el-form-item__content .el-date-editor {
    width: 200px;
  }
  .el-date-editor .el-range__icon,
  .el-date-editor .el-range__close-icon {
    display: none;
  }
  .el-date-editor .el-range-input {
    width: 49%;
  }
  .el-date-editor .el-range-separator {
    width: 13%;
  }
}
</style>
