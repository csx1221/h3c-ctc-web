<template>
  <el-row class="whole-network-project-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="name" label="项目名称">
                <el-input v-model="dataForm.name" placeholder="请输入项目名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="projectStatus" label="项目状态">
                <ctc-select v-model="dataForm.projectStatus" dict-type="project.projectStatus" placeholder="请选择项目状态"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="managerId" label="项目经理">
                <el-select v-model="dataForm.managerId" filterable placeholder="请选择项目经理">
                  <el-option v-for="item in managerData" :key="item.id" :label="item.realName" :value="item.id">
                    <span style="color: #8492a6; font-size: 13px" :title="item.username">{{ item.realName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="text-align:right;">
              <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
              <el-button type="primary" size="small" @click="getProjectInfo()">查询</el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
            </el-col>
          </el-row>
          <el-row v-if="isOpen">
            <el-col :span="6">
              <el-form-item prop="createDate" label="创建时间">
                <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill">
        <el-row>
          <el-col :span="24" class="split-line" style="text-align:left;">
            项目列表
          </el-col>
        </el-row>
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
          <el-table-column header-align="center" align="center" label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click="doTableOperate('1',scope.row)" type="text" size="small">项目人员</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background :page-sizes="[10,100,500,1000]" layout="total, sizes,prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @size-change="pageSizeChangeHandle" @current-change="currentPageChangeHandle">
        </el-pagination>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import { addDynamicRoute } from '@/router'
export default {
  name: 'WholeNetworkProjectPage',
  components: {
  },
  data () {
    return {
      radio: '',
      isOpen: false,
      dataForm: {
        name: '', // 项目名称
        projectStatus: '',
        createDate: '',
        managerId: '',
        page: 1,
        limit: 10
      },
      total: 0,
      projectTableData: [],
      tableTreeMaps: {},
      tableOperateRows: [], // 存放3级架构父项目编码
      managerData: []
    }
  },
  computed: {
  },
  mounted () {
    this.getManagerData()
    this.getProjectInfo()
  },
  activated () {
  },
  methods: {
    triggerParentMethod (message) {
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
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createDateStart = params.createDate[0]
        params.createDateEnd = params.createDate[1]
        delete params['createDate']
      }
      thisvm.$http.get('/ctc/project/projectBase/page', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          thisvm.projectTableData = res.data.list || []
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
      params.page = 1
      params.limit = 9999
      // 将当前选中节点数据存储到maps中
      this.tableTreeMaps[tree.projectId] = { tree, treeNode, resolve }
      this.$http.get('/ctc/project/projectBase/page', { 'params': params }).then(({ data: res }) => {
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
    doTableOperate (type, row) {
      let path = ''
      let title = ''
      let params = { 'parentId': row.parentId || '', 'projectId': row.projectId || '', 'projectName': row.name, 'type': row.type, 'scope': row.scope }
      // 兼容其他功能父项目键值不统一
      params.parentProjectId = params.parentId || params.projectId
      // 组装当前路径参数
      let pagePathParams = { 'pageName': '全网项目', 'id': '', 'type': '' }
      // 判断项目是否创建完成
      if (row.projectStatus === -1 && ['11', '18', '19'].includes(type)) {
        this.$message.warning('项目还未配置完成，请继续配置！')
        return
      }
      // 记录操作选中行数据
      if (params.type === 1) {
        if (!this.tableOperateRows.includes(params.parentProjectId)) {
          this.tableOperateRows.push(params.parentProjectId)
        }
      }
      // 项目人员(1L)
      if (type === '1') {
        path = 'projects/whole-network-project/children/project-member-info'
        title = '项目人员'
      }
      params.pagePathParams = pagePathParams
      this.customAddDynamicRoute(path, title, params)
    },
    getManagerData () {
      let params = { 'page': 1, 'limit': 999999999 }
      this.$http.get('/sys/project/select/manager', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.managerData = res.data.list
        }
      }).catch(() => {
      })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getProjectInfo()
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
<style lang="scss">
.whole-network-project-page {
}
</style>
<style lang="scss" scoped>
</style>
