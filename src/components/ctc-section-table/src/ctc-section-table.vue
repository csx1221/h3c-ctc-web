<template>
  <div>
    <el-input v-model="showSectionName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="sectionDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleSection" width="45%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-col :span="16">
          <el-input v-model="searchName" size="mini" placeholder="请输入科室名称" clearable />
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button type="primary" size="small" @click="getSectionList">查询</el-button>
        </el-col>
      </el-row>
      <el-table ref="tableObject" :data="sectionList" height="300" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="sectionRadio" @change.native="getChooseSectionRow(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="科室名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptName" label="部门名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getSectionList" style="text-align:left;">
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
  name: 'CtcSectionTable',
  data () {
    return {
      visibleSection: false,
      sectionList: [],
      showSectionName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectRowData: {},
      sectionRadio: '',
      searchName: '',
      page: 1,
      limit: 5,
      total: 0
    }
  },
  props: {
    value: [Number, String],
    deptId: String,
    organizeId: String,
    sectionId: String,
    placeholder: String
  },
  watch: {
    // 动态根据组织机构过滤科室
    organizeId (newVal, oldVal) {
      this.getSectionList()
    },
    deptId (newVal, oldVal) {
      this.getSectionList()
    },
    sectionId (newVal, oldVal) {
      this.echoSectionData()
    }
  },
  methods: {
    sectionDialog () {
      this.visibleSection = true
      this.searchName = ''
      this.sectionRadio = ''
      this.getSectionList()
    },
    getChooseSectionRow (index, row) {
      this.selectRowData = row
    },
    echoSectionData () {
      if (this.sectionId !== '' && this.sectionId.indexOf('clear') === -1) {
        this.showSectionName = ''
        this.$http.get(`/sys/section/${this.sectionId}`).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.showSectionName = res.data.name
          }
        }).catch(() => { })
      } else {
        this.showSectionName = ''
        this.$emit('input', '')
      }
    },
    getSectionList () {
      let deptId = ''
      let organizeId = ''
      if (this.deptId !== '' && this.deptId !== null) {
        deptId = (this.deptId.indexOf('clear') !== -1) ? '' : this.deptId
      }
      if (this.organizeId !== '' && this.organizeId !== null) {
        organizeId = (this.organizeId.indexOf('clear') !== -1) ? '' : this.organizeId
      }
      this.showSectionName = ''
      return this.$http.get('sys/section/page', {
        params: {
          name: this.searchName,
          organizeId: organizeId,
          deptId: deptId,
          sidx: 1,
          page: this.page,
          limit: this.limit
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.sectionList = res.data.list
        this.total = res.data.total
      }).catch(() => { })
    },
    cancelHandle () {
      this.visibleSection = false
      this.sectionList = []
    },
    clearHandle () {
      this.$emit('input', '0')
      this.$emit('update:sectionName', '')
      this.showSectionName = ''
      this.visibleSection = false
      this.sectionList = []
    },
    commitHandle () {
      const node = this.selectRowData
      if (!node && !(node.id)) {
        this.$message.warning('请选择所属科室')
        return
      }
      this.$emit('input', node.id)
      this.$emit('update:sectionName', node.name)
      this.showSectionName = node.name
      this.visibleSection = false
      this.sectionList = []
    }
  }
}
</script>
