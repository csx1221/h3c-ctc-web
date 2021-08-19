<template>
  <el-card shadow="never" class="aui-card--fill  project-mgr-page">
    <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入项目名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="projectStatus" label="项目状态">
            <ctc-select v-model="dataForm.projectStatus" dict-type="project.projectStatus" placeholder="请选择项目状态"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="text-align:right;padding-top:5px;">
          <el-button type="primary" size="small" @click="getProjectInfo()">查询</el-button>
          <el-button size="small" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table stripe highlight-current-row :data="projectTableData" ref="projectTableData" row-key="projectId" border lazy :load="subTableload" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" @row-click="tableRowClick" style="width: 100%;">
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
      <el-table-column header-align="center" align="center" label="操作配置" width="250">
        <template slot-scope="scope">
          <el-button v-if="(scope.row.parentId || '')==''" @click="doTableOperate('defectSource','缺陷来源',scope.row)" type="text" size="small">缺陷来源</el-button>
          <el-button v-if="(scope.row.parentId || '')==''" @click="doTableOperate('defectEnv','缺陷环境',scope.row)" type="text" size="small">缺陷环境</el-button>
          <el-button v-if="(scope.row.parentId || '')==''" @click="doTableOperate('defectType','缺陷类型',scope.row)" type="text" size="small">缺陷类型</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :page-sizes="[10,100,500,1000]" layout="total, sizes,prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @size-change="pageSizeChangeHandle" @current-change="currentPageChangeHandle">
    </el-pagination>
  </el-card>
</template>
<script>
import { addDynamicRoute } from '@/router'
export default {
  name: 'DefectResultConfig',
  components: {
  },
  data () {
    return {
      dataForm: {
        name: '', // 项目名称
        projectStatus: '',
        page: 1,
        limit: 10
      },
      total: 0,
      projectTableData: [],
      tableTreeMaps: {},
      tableOperateRows: [] // 存放3级架构父项目编码
    }
  },
  computed: {},
  mounted () {
    this.getProjectInfo()
  },
  methods: {
    triggerParentProject () {
      this.getProjectInfo()
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getProjectInfo()
    },
    currentPageChangeHandle (val) {
      this.tableTreeMaps = {}
      this.tableOperateRows = []
      this.getProjectInfo()
    },
    pageSizeChangeHandle (val) {
      this.tableTreeMaps = {}
      this.tableOperateRows = []
      this.dataForm.limit = val
      this.getProjectInfo()
    },
    getProjectInfo () {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = Object.assign({}, thisvm.dataForm)
      thisvm.$http.get('/ctc/project/list/pageProject', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          thisvm.projectTableTitleData = res.data.head
          thisvm.projectTableData = res.data.data.list
          thisvm.total = res.data.data.total
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
      params.page = 1
      params.limit = 9999
      // 将当前选中节点数据存储到maps中
      this.tableTreeMaps[tree.projectId] = { tree, treeNode, resolve }
      this.$http.get('/ctc/project/list/subProject', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          resolve(res.data)
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
            thisvm.$set(thisvm.$refs.projectTableData.store.states.lazyTreeNodeMap, parentId, [])
            thisvm.subTableload(tree, treeNode, resolve)
          }
        } catch (error) {
        }
      })
    },
    tableRowClick (row, column, event) {
      let selection = this.$refs.projectTableData.selection
      let currSelectRows = selection.filter(function (item) {
        return item.projectId === row.projectId
      })
      if (currSelectRows.length === 1) {
        this.$refs.projectTableData.toggleRowSelection(row, false)
      } else {
        this.$refs.projectTableData.toggleRowSelection(row, true)
      }
    },
    doTableOperate (dictType, name, row) {
      let path = 'defectcenter/defect-result-config/defect-dict-data'
      let titel = name + '数据配置'
      let params = {}
      params.dictType = dictType
      params.parentId = row.parentId
      params.projectId = row.projectId
      this.customAddDynamicRoute(path, titel, params)
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
