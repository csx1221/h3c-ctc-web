<template>
  <el-row class="project-list">
    <el-col :span="24">
      <el-table stripe highlight-current-row :data="tableListData" ref="tableListData" row-key="projectId" border lazy :load="subTableload" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" height="570" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" label="项目名称" header-align="left" align="left" width="250" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectStatus" label="项目状态" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $getDictLabel('project.projectStatus', scope.row.projectStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="scope" label="项目范围" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $getDictLabel('project.scope', scope.row.scope) }}
          </template>
        </el-table-column>
        <el-table-column prop="planPeriod" label="计划周期" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.planStartTime}}~{{scope.row.planEndTime}}
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="center" align="center" label="操作" width="420">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="doSingleDeleteData(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="doDeleteDataByProjectId(scope.row,'task')">删除任务</el-button>
            <el-button type="text" size="small" @click="doDeleteDataByProjectId(scope.row,'workOrder')">删除工单</el-button>
            <el-button type="text" size="small" @click="doDeleteDataByProjectId(scope.row,'case')">删除用例设计</el-button>
            <el-button type="text" size="small" @click="doDeleteDataByProjectId(scope.row,'execCase')">删除执行用例</el-button>
            <el-button type="text" size="small" @click="doDeleteDataByProjectId(scope.row,'defect')">删除缺陷</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background :page-sizes="[10,15,20]" layout="total, sizes,prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @size-change="pageSizeChangeHandle" @current-change="currentPageChangeHandle">
      </el-pagination>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'ProjectList',
  components: {
  },
  data () {
    return {
      dataForm: {
        page: 1,
        limit: 10
      },
      refParams: {
      },
      total: 0,
      // operateType(1:项目;2:任务;3:工单;4:用例;5:缺陷)
      operateType: 1,
      tableListData: [],
      tableTreeMaps: {},
      tableOperateRows: []// 存放3级架构父项目编码
    }
  },
  computed: {},
  created () {
  },
  mounted () {
  },
  activated () {
  },
  methods: {
    getTableData (params, type) {
      // 判断type(goto:切换执行查询;btn:按钮点击查询)
      if (type === 'goto') {
        this.refParams = params
      } else {
        this.refParams = { ...this.refParams, ...params }
      }
      this.tableTreeMaps = {}
      this.tableOperateRows = []
      this.getTableListData()
    },
    currentPageChangeHandle (val) {
      this.getTableListData()
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getTableListData()
    },
    doBatchDeleteData () {
      let selectionData = this.$refs.tableListData.selection
      if (selectionData.length > 0) {
        this.doCheckDeleteAuth(selectionData)
      } else {
        this.$message.warning('没有选中【项目】任何操作记录')
      }
    },
    doSingleDeleteData (row) {
      let selectionData = [row]
      this.doCheckDeleteAuth(selectionData)
    },
    doCheckDeleteAuth (selectionData) {
      let thisvm = this
      let projectIds = []
      selectionData.forEach((row, index) => {
        thisvm.getProjectTaskAuth(row, function (auth) {
          if (auth) {
            projectIds.push(row.projectId)
            // 存放操作父项目Id，用来动态触发子项目查询
            if (!thisvm.tableOperateRows.includes(row.parentId)) {
              thisvm.tableOperateRows.push(row.parentId)
            }
          } else {
            thisvm.$message.warning('你没有权限操作')
          }
        })
      })
      thisvm.executeBatchDeleteOperate(projectIds)
    },
    executeBatchDeleteOperate (projectIds) {
      this.$confirm('确定删除【项目】操作，删除不可恢复，请谨慎操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'confirm-del-tip',
        type: 'warning'
      }).then(() => {
        let params = { 'operateType': this.operateType, 'projectIds': projectIds }
        this.$http.delete('/ctc/visualization/dataCleaning/deleteDataList', { data: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            this.getTableListData()
          }
        }).catch(() => { })
      }).catch(() => { })
    },
    doDeleteDataByProjectId (row, type) {
      let thisvm = this
      thisvm.getProjectTaskAuth(row, function (auth) {
        if (auth) {
          let data = {}
          data.projectId = row.projectId
          // 设置操作类型operateType(1:项目;2:任务;3:工单;4:用例;5:缺陷)
          if (type === 'task') {
            data.operateType = 2
          } else if (type === 'workOrder') {
            data.operateType = 3
            data.skipLevelType = 3
          } else if (type === 'case') {
            data.operateType = 4
            data.skipLevelType = 4
            data.orderType = 5
          } else if (type === 'execCase') {
            data.operateType = 4
            data.skipLevelType = 4
            data.orderType = 7
          } else if (type === 'defect') {
            data.operateType = 5
            data.skipLevelType = 5
          }
          thisvm.doGotoNextList(data)
          thisvm.$refs.tableListData.toggleRowSelection(row, true)
        } else {
          thisvm.$message.warning('你没有权限操作')
        }
      })
    },
    doGotoNextList (data) {
      // 循环触发数据
      this.$emit('watchChildMethod', { 'type': 'gotoNextList', 'data': data })
    },
    getProjectTaskAuth (row, callback) {
      // 特殊处理，校验父项目是否有权限操作
      let auth = true
      let parentId = row.parentId || ''
      if (parentId) {
        callback && callback(auth)
      } else {
        let params = { 'projectId': row.projectId }
        this.$http.get('/ctc/project/list/canEditProject', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            auth = res.data || false
            callback && callback(auth)
          }
        }).catch(() => {
          callback && callback(auth)
        })
      }
    },
    getTableListData () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { ...thisvm.dataForm, ...thisvm.refParams }
      params.operateType = this.operateType
      thisvm.$http.get('/ctc/visualization/dataCleaning/queryDataList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          thisvm.tableListData = res.data.list
          thisvm.total = res.data.total
          // 自动触发子项目加载
          thisvm.refreshLoadTree()
          thisvm.$ctcLoading.close()
        }
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    subTableload (tree, treeNode, resolve) {
      let params = { 'parentId': tree.projectId }
      params.operateType = this.operateType
      params.page = 1
      params.limit = 9999
      // 将当前选中节点数据存储到maps中
      this.tableTreeMaps[tree.projectId] = { tree, treeNode, resolve }
      this.$http.get('/ctc/visualization/dataCleaning/queryDataList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          resolve(res.data.list)
          if (res.data.length === 0) {
            this.$message.warning(tree.name + '，目前还没有建立子项目或直接挂载任务')
          }
        }
      }).catch(() => {
      })
    },
    refreshLoadTree () {
      let thisvm = this
      thisvm.tableOperateRows.forEach((parentId, index) => {
        // 根据父级id取出对应节点数据
        try {
          const { tree, treeNode, resolve } = thisvm.tableTreeMaps[parentId]
          if (tree) {
            thisvm.$set(thisvm.$refs.tableListData.store.states.lazyTreeNodeMap, parentId, [])
            thisvm.subTableload(tree, treeNode, resolve)
          }
        } catch (error) {
        }
      })
    }
  }
}
</script>
<style  lang="scss">
.project-list {
}
.confirm-del-tip .el-message-box__message{
  color:red;
}
</style>
