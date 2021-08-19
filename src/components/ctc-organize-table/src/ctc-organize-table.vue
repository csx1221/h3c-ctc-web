<template>
  <div>
    <el-input v-model="showOrganizeName" :placeholder="placeholder" readonly :disabled="disabled">
      <el-button slot="append" icon="el-icon-search" clearable @click="organizeDialog" :disabled="disabled"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleOrganize" width="45%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-col :span="16">
          <el-input v-model="searchName" size="mini" placeholder="请输入机构名称" clearable />
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button type="primary" size="small" @click="getOrganizeList">查询</el-button>
        </el-col>
      </el-row>
      <el-table ref="tableObject" :data="organizeList" style="width: 100%;height:300px;">
        <el-table-column type="selection" header-align="center" align="center" width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="organizeRadio" @change.native="getChooseOrganizeRow(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="机构名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="机构类型" header-align="left" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$getDictLabel('organizeType', scope.row.type)}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getOrganizeList" style="text-align:left;">
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
  name: 'CtcOrganizeTable',
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
    organizeType: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    organizeType (newVal, oldVal) {
      this.getOrganizeList()
    },
    organizeId (newVal, oldVal) {
      this.echoOrganizeData()
    }
  },
  methods: {
    organizeDialog () {
      this.visibleOrganize = true
      this.searchName = ''
      this.showOrganizeName = ''
      this.organizeRadio = ''
      this.getOrganizeList()
    },
    getChooseOrganizeRow (index, row) {
      this.selectRowData = row
    },
    echoOrganizeData () {
      if (this.organizeId !== '' && this.organizeId.indexOf('clear') === -1) {
        this.showOrganizeName = ''
        this.$http.get(`/sys/organize/${this.organizeId}`).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.showOrganizeName = res.data.name
          }
        }).catch(() => { })
      } else {
        this.showOrganizeName = ''
        this.$emit('input', '')
      }
    },
    getOrganizeList () {
      this.showOrganizeName = ''
      return this.$http.get('/sys/organize/page', {
        params: {
          name: this.searchName,
          id: (this.organizeId.indexOf('clear') !== -1) ? '' : this.organizeId,
          type: ((this.organizeType || '').indexOf('clear') !== -1) ? '' : this.organizeType,
          page: this.page,
          limit: this.limit
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.organizeList = res.data.list
        this.total = res.data.total
      }).catch(() => { })
    },
    cancelHandle () {
      this.visibleOrganize = false
      this.organizeList = []
    },
    clearHandle () {
      this.$emit('input', '')
      this.$emit('update:organizeName', '')
      this.showOrganizeName = ''
      this.visibleOrganize = false
      this.organizeList = []
    },
    commitHandle () {
      const node = this.selectRowData
      if (!node && !(node.id)) {
        this.$message.warning('请选择所属机构')
        return
      }
      this.$emit('input', node.id)
      this.$emit('update:organizeName', node.name)
      this.$emit('watchChildPage', { 'type': 'chooseOrganize', 'data': node })
      this.showOrganizeName = node.name
      this.visibleOrganize = false
      this.organizeList = []
    }
  }
}
</script>
