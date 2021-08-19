<template>
  <el-dialog title="关联需求" :visible.sync="innerVisible" :close-on-click-modal="false" width="40%" class="add-require" append-to-body>
    <el-row>
      <el-col :span="24">
        <el-row>
          <el-col :span="24">
            <el-form label-position="right" :inline="true" ref="dataForm" :model="dataForm" label-width="90px">
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="reqNames" label=" 需求名称：">
                    <el-input v-model="dataForm.reqNames" placeholder="请输入需求名称" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" align="right">
                  <el-button type="primary" size="small" @click="getRequireTreeData()">查询</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="24">
            <el-table :data="requireData" ref="requireData" border style="width: 100%;height:400px;overflow-y:auto;">
              <el-table-column type="selection" header-align="center" align="center" width="60">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.reqCode" v-model="reqCodeRadio" @change.native="getChooseRequireRow(scope.$index,scope.row)">&nbsp;</el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="reqNames" label="需求名称" header-align="center" align="center" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column prop="reqPropser" label="需求提出人" header-align="center" align="center"></el-table-column>
              <el-table-column prop="reqOrgName" label="归属机构" header-align="center" align="center"></el-table-column>
              <el-table-column prop="reqCreateTime" label="创建时间" header-align="center" align="center"></el-table-column>
            </el-table>
            <el-pagination :current-page="dataForm.page" :page-size="dataForm.limit" :total="total" layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange">
            </el-pagination>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'AddRequire',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        page: 1,
        limit: 5,
        reqNames: ''
      },
      total: 0,
      requireData: [],
      reqCodeRadio: '',
      defaultProps: {
        children: 'list',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.getRequireTreeData()
      })
    },
    handleCurrentChange (val) {
      this.page = val
      this.getRequireTreeData()
    },
    getRequireTreeData () {
      let thisvm = this
      let params = thisvm.dataForm
      thisvm.$http.get('/ctc/plan/requirementTask/pageRequire', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        thisvm.requireData = res.data.list
        thisvm.total = res.data.total
      }).catch(() => {
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    getChooseRequireRow (index, row) {
      let params = { 'type': 'executeChooseRequire', 'data': row }
      this.$emit('watchChildMethod', params)
      this.handleDialogClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.add-require {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
