<template>
  <div>
    <el-input v-model="showProjectName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="projectDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleProject" width="50%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-col :span="16">
          <el-input v-model="searchName" size="mini" placeholder="请输入项目名称" clearable />
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button type="primary" size="small" @click="getProjectList">查询</el-button>
        </el-col>
      </el-row>
      <el-table ref="tableObject" :data="projectList" height="300" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.projectId" v-model="projectRadio" @change.native="getChooseProjectRow(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="项目名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectStatus" label="项目状态" header-align="left" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $getDictLabel('project.projectStatus', scope.row.projectStatus) }}
          </template>
        </el-table-column>
      </el-table>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcChildProjectInfoTable',
  data () {
    return {
      visibleProject: false,
      projectList: [],
      showProjectName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectRowData: {},
      projectRadio: '',
      searchName: ''
    }
  },
  props: {
    value: [Number, String],
    // 父项目ID
    parentId: String,
    projectId: String,
    placeholder: String
  },
  watch: {
    parentId (newVal, oldVal) {
      this.showProjectName = ''
    },
    projectId (newVal, oldVal) {
      this.echoProjectData()
    }
  },
  methods: {
    projectDialog () {
      this.visibleProject = true
      this.searchName = ''
      this.getProjectList()
    },
    getChooseProjectRow (index, row) {
      this.selectRowData = row
    },
    echoProjectData () {
      if (this.projectId !== '' && this.projectId.indexOf('clear') === -1) {
        this.$http.get('/ctc/project/projectBase/' + this.projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.showProjectName = res.data.name
          }
        }).catch(() => { })
      } else {
        this.showProjectName = ''
      }
    },
    getProjectList () {
      if (this.parentId !== '' && this.parentId.indexOf('clear') === -1) {
        this.$http.get('/ctc/project/list/subProject', {
          params: {
            parentId: this.parentId,
            name: this.searchName,
            page: this.page,
            limit: this.limit
          }
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.projectList = res.data
        }).catch(() => { })
      }
    },
    cancelHandle () {
      this.visibleProject = false
      this.projectList = []
    },
    commitHandle () {
      const node = this.selectRowData
      if (!node && !(node.projectId)) {
        this.$message.warning(this.placeholder)
        return
      }
      this.$emit('input', node.projectId)
      this.$emit('update:projectName', node.name)
      this.showProjectName = node.name
      this.visibleProject = false
      this.projectList = []
    }
  }
}
</script>
