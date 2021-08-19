<template>
  <div>
    <el-input v-model="showDeptName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="deptDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleDept" width="45%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-col :span="16">
          <el-input v-model="searchName" size="mini" placeholder="请输入部门名称" clearable />
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button type="primary" size="small" @click="getDeptList">查询</el-button>
        </el-col>
      </el-row>
      <el-table ref="tableObject" :data="deptList" height="300" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="deptRadio" @change.native="getChooseDeptRow(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="部门名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="organizeName" label="所属机构" header-align="left" align="left" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getDeptList" style="text-align:left;">
      </el-pagination>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <!-- <el-button type="info" @click="clearHandle()" size="mini">清除</el-button> -->
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcDeptTable',
  data () {
    return {
      visibleDept: false,
      deptList: [],
      showDeptName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectRowData: {},
      deptRadio: '',
      searchName: '',
      page: 1,
      limit: 5,
      total: 0
    }
  },
  props: {
    value: [Number, String],
    organizeId: String,
    deptId: String,
    placeholder: String
  },
  watch: {
    // 动态根据组织机构过滤部门
    organizeId (newVal, oldVal) {
      this.getDeptList()
    },
    deptId (newVal, oldVal) {
      this.echoDeptData()
    }
  },
  methods: {
    deptDialog () {
      this.visibleDept = true
      this.searchName = ''
      this.deptRadio = ''
      this.getDeptList()
    },
    getChooseDeptRow (index, row) {
      this.selectRowData = row
    },
    echoDeptData () {
      if (this.deptId !== '' && this.deptId.indexOf('clear') === -1) {
        this.showDeptName = ''
        this.$http.get(`/sys/deptnew/${this.deptId}`).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.showDeptName = res.data.name
          }
        }).catch(() => { })
      } else {
        this.showDeptName = ''
        this.$emit('input', '')
      }
    },
    getDeptList () {
      let organizeId = ''
      if (this.organizeId !== '' && this.organizeId !== undefined) {
        organizeId = (this.organizeId.indexOf('clear') !== -1) ? '' : this.organizeId
      }
      this.showDeptName = ''
      return this.$http.get('sys/deptnew/page', {
        params: {
          name: this.searchName,
          organizeId: organizeId,
          sidx: 1,
          page: this.page,
          limit: this.limit
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.deptList = res.data.list
        this.total = res.data.total
      }).catch(() => { })
    },
    cancelHandle () {
      this.visibleDept = false
      this.deptList = []
    },
    clearHandle () {
      this.$emit('input', '0')
      this.$emit('update:deptName', '')
      this.showDeptName = ''
      this.visibleDept = false
      this.deptList = []
    },
    commitHandle () {
      const node = this.selectRowData
      if (!node && !(node.id)) {
        this.$message.warning('请选择所属部门')
        return
      }
      this.$emit('input', node.id)
      this.$emit('update:deptName', node.name)
      this.showDeptName = node.name
      this.visibleDept = false
      this.deptList = []
    }
  }
}
</script>
