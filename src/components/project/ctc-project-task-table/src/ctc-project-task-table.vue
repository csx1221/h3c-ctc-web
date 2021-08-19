<template>
  <div>
    <el-input v-model="showUserName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="projectTaskDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleUser" width="55%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-col :span="16">
          <el-input v-model="searchName" size="mini" placeholder="请输入任务名称" clearable />
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button type="primary" size="small" @click="getProjectTaskList">查询</el-button>
        </el-col>
      </el-row>
      <el-table ref="tableObject" :data="projectTaskList" style="width: 100%;height:300px;">
        <el-table-column type="selection" header-align="center" align="center" width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.taskId" v-model="projectTaskRadio" @change.native="getChooseUserRow(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creatorName" label="创建人" header-align="left" align="left" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getProjectTaskList" style="text-align:left;">
      </el-pagination>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button type="info" @click="clearHandle()" size="mini">清除</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcProjectTaskTable',
  data () {
    return {
      visibleUser: false,
      projectTaskList: [],
      showUserName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectRowData: {},
      projectTaskRadio: '',
      searchName: '',
      page: 1,
      limit: 5,
      total: 0
    }
  },
  props: {
    value: [Number, String],
    parentProjectId: String,
    projectId: String,
    taskId: String,
    placeholder: String
  },
  watch: {
    taskId (newVal, oldVal) {
      this.echoUserData()
    }
  },
  methods: {
    projectTaskDialog () {
      this.visibleUser = true
      this.searchName = ''
      this.getProjectTaskList()
    },
    getChooseUserRow (index, row) {
      this.selectRowData = row
    },
    echoUserData () {
      if (this.taskId !== '' && this.taskId !== '0' && this.taskId !== null && this.taskId.indexOf('clear') === -1) {
        let params = {}
        this.$http.get('/ctc/task/base/' + this.taskId, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.showUserName = res.data.taskName || ''
          }
        }).catch(() => { })
      } else {
        this.showUserName = ''
      }
    },
    getProjectTaskList () {
      let params = { taskName: this.searchName, page: this.page, limit: this.limit }
      let parentProjectId = (this.parentProjectId.indexOf('clear') !== -1) ? '' : this.parentProjectId
      let projectId = (this.projectId.indexOf('clear') !== -1) ? '' : this.projectId
      if (parentProjectId !== '' || projectId !== '') {
        params.projectId = projectId || parentProjectId
      }
      if (parentProjectId !== '' || projectId !== '') {
        this.$http.get('ctc/defect/base/task', {
          params: params
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.projectTaskList = res.data.data.list
          this.total = res.data.data.total
        }).catch(() => { })
      } else {
        this.$message.warning('请先选择项目信息')
      }
    },
    cancelHandle () {
      this.visibleUser = false
      this.projectTaskList = []
    },
    clearHandle () {
      this.$emit('input', '0')
      this.$emit('update:projectTaskName', '')
      this.showUserName = ''
      this.visibleUser = false
      this.projectTaskList = []
    },
    commitHandle () {
      const node = this.selectRowData
      if (!node && !(node.taskId)) {
        this.$message.warning(this.placeholder)
        return
      }
      this.$emit('input', node.taskId)
      this.$emit('update:projectTaskName', node.taskName)
      this.showUserName = node.taskName
      this.visibleUser = false
      this.projectTaskList = []
    }
  }
}
</script>
