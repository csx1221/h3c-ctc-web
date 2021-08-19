<template>
  <el-dialog title="引用需求" :visible.sync="innerVisible" :close-on-click-modal="false" width="65%" class="ref-case">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" ref="dataForm" label-width="145px">
          <el-row>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
              <el-form-item prop="firstReqCode" label="一级需求编号：">
                <el-input v-model="dataForm.firstReqCode" placeholder="请输入一级需求编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
              <el-form-item prop="firstReqName" label="一级需求名称：">
                <el-input v-model="dataForm.firstReqName" placeholder="请输入一级需求名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
              <el-form-item prop="secondReqCode" label="二级需求编号：">
                <el-input v-model="dataForm.secondReqCode" placeholder="请输入二级需求编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
              <el-form-item prop="secondReqName" label="二级需求名称：">
                <el-input v-model="dataForm.secondReqName" placeholder="请输入二级需求名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
              <el-form-item prop="deptId" label="提出部门：">
                <ctc-dept-table v-model="dataForm.deptId" placeholder="请选择提出部门" :deptId.sync="dataForm.deptId"></ctc-dept-table>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
              <el-form-item prop="personLiableName" label="提出人：">
                <el-input v-model="dataForm.personLiableName" placeholder="请输入提出人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
              <el-form-item prop="proposeDate" label="需求提出时间：">
                <el-date-picker v-model="dataForm.proposeDate" value-format="yyyy-MM-dd" type="date" unlink-panels></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="16" style="text-align:right;">
              <el-button type="primary" size="small" @click="getRefDemandData()">查询</el-button>
              <el-button size="small" @click="resetRefCaseData()">重置</el-button>
            </el-col>
          </el-row>
          <el-table :data="refDemandTableData" ref="refDemandTableData" border style="width: 100%;height:400px;overflow-y:auto;">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="firstReqCode" label="一级需求编号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="firstReqName" label="一级需求名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="secondReqCode" label="二级需求编号" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="secondReqName" label="二级需求名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deptName" label="提出部门" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="personLiableName" label="提出人" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="expectedOnlineTime" label="期望上线时间" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="proposeDate" label="需求提出时间" align="center" show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination :current-page="dataForm.page" :page-sizes="[5, 20, 50]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
          <add-require :visible.sync="addRequire" ref="addRequire" @watchChildMethod="triggerParentMethod"></add-require>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import AddRequire from './add-require'
export default {
  name: 'RefDemand',
  components: {
    AddRequire
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        firstReqCode: '',
        firstReqName: '',
        secondReqCode: '',
        secondReqName: '',
        deptId: '',
        personLiableName: '',
        proposeDate: ''
      },
      total: 0,
      refDemandTableData: [],
      addRequire: false
    }
  },
  watch: {
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
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.getRefDemandData()
      })
    },
    triggerParentMethod (message) {
      if (message.type === 'executeChooseRequire') {
        this.dataForm.reqCode = message.data.reqCode
        this.dataForm.reqNames = message.data.reqNames
        this.getRefDemandData()
      }
    },
    resetRefCaseData () {
      this.$refs.dataForm.resetFields()
      this.dataForm.reqCode = ''
      this.dataForm.reqNames = ''
      this.getRefDemandData()
    },
    getRefDemandData () {
      let params = Object.assign({}, this.dataForm)
      let url = '/ctc/plan/requirementTask/pageTask'
      this.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.refDemandTableData = res.data.list
          this.total = res.data.total
        }
      }).catch(() => {
      })
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getRefDemandData()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getRefDemandData()
    },
    AddRequire () {
      this.$refs.addRequire.init()
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let selection = this.$refs.refDemandTableData.selection
      if (selection.length > 0) {
        let data = []
        selection.forEach((item, index) => {
          data.push(item.id)
        })
        this.$http.post('/ctc/plan/demands/requireQuote', data).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            let params = { 'type': 'reloadTable', 'data': {} }
            this.$emit('watchChildPage', params)
            this.handleDialogClose()
          }
        }).catch(() => { })
      } else {
        this.$message.warning('没有选择任何记录!')
      }
    }
  }
}
</script>
<style lang="scss">
.ref-case {
  .el-form-item__content .el-input-group--append {
    width: 100% !important;
  }
  .el-form-item__content .el-date-editor--date {
    width: 100% !important;
  }
  .el-form-item__content .el-date-editor--date {
    width: 100% !important;
  }
  .el-form-item__content .el-date-editor {
    width: 100% !important;
  }
  .el-select {
    width: 100% !important;
  }
}
</style>
<style lang="scss" scoped>
.ref-case {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
