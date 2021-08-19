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
      <el-table ref="tableObject" :data="projectList" style="width: 100%;height:300px;">
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
        <el-table-column prop="organizeIdName" label="所属机构" header-align="left" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.organizeIdName}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getProjectList" style="text-align:left;">
      </el-pagination>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcProjectInfoTable',
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
      searchName: '',
      page: 1,
      limit: 5,
      total: 0
    }
  },
  props: {
    value: [Number, String],
    projectId: String,
    placeholder: String
  },
  watch: {
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
      this.$http.get('/ctc/project/list/pageProject', {
        params: {
          order: '',
          orderField: '',
          name: this.searchName,
          sidx: 1,
          page: this.page,
          limit: this.limit
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.projectList = res.data.data.list
        this.total = res.data.data.total
      }).catch(() => { })
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
