<template>
  <div>
    <el-input v-model="showOrganizeName" :placeholder="placeholder">
      <el-button slot="append" icon="el-icon-search" clearable @click="organizeDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleOrganize" width="45%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-col :span="16">
          <el-input v-model="searchName" size="mini" placeholder="请输入需求名称" clearable />
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button type="primary" size="small" @click="getOrganizeList">查询</el-button>
        </el-col>
      </el-row>
      <el-table ref="tableObject" :data="organizeList" style="width: 100%;height:300px;">
        <el-table-column type="selection" header-align="center" align="center" width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.demandId" v-model="organizeRadio" @change.native="getChooseOrganizeRow(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="demandName" label="需求名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="demandId" label="需求编码" header-align="left" align="left" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getOrganizeList" style="text-align:left;">
      </el-pagination>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <!--                <el-button type="info" @click="clearHandle()" size="mini">清除</el-button>-->
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ctc-associated-requirements',
  data () {
    return {
      visibleOrganize: false,
      organizeList: [],
      showOrganizeName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectRowData: {},
      organizeRadio: '',
      searchName: '',
      page: 1,
      limit: 5,
      total: 0
    }
  },
  props: {
    value: [Number, String],
    organizeId: String,
    placeholder: String
  },
  watch: {
    organizeId (newVal, oldVal) {
      this.echoOrganizeData()
    }
  },
  methods: {
    organizeDialog () {
      this.visibleOrganize = true
      this.searchName = ''
      // this.showOrganizeName = ''
      // this.organizeRadio = ''
      this.getOrganizeList()
    },
    getChooseOrganizeRow (index, row) {
      this.selectRowData = row
    },
    echoOrganizeData () {
      if (this.organizeId !== '' && this.organizeId.indexOf('clear') === -1) {
        this.$http.get(`/ctc/plan/demand/${this.organizeId}`).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.showOrganizeName = res.data.demandName
          }
        }).catch(() => { })
      } else {
        this.showOrganizeName = ''
      }
    },
    getOrganizeList () {
      return this.$http.get('/ctc/plan/demand/page', {
        params: {
          demandName: this.searchName,
          page: this.page,
          limit: this.limit
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.organizeList = res.data.data.list
        this.total = res.data.data.total
      }).catch(() => { })
    },
    cancelHandle () {
      this.visibleOrganize = false
      this.organizeList = []
    },
    clearHandle () {
      this.$emit('input', '0')
      this.$emit('update:organizeName', '')
      this.showOrganizeName = ''
      this.visibleOrganize = false
      this.organizeList = []
    },
    commitHandle () {
      const node = this.selectRowData
      if (!node && !(node.demandId)) {
        this.$message.warning('请选择需求名称')
        return
      }
      this.$emit('input', node.demandId)
      this.$emit('update:organizeName', node.demandName)
      this.$emit('watchChildPage', { 'type': 'chooseOrganize', 'data': node })
      this.showOrganizeName = node.demandName
      this.visibleOrganize = false
      this.organizeList = []
    }
  }
}
</script>
