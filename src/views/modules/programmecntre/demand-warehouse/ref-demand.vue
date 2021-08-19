<template>
  <el-dialog title="引用需求" :visible.sync="innerVisible" :close-on-click-modal="false" width="55%" class="ref-case">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="taskName" label="任务名称：">
                <el-input v-model="dataForm.taskName" placeholder="请输入任务名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="childProjectMember" label="关联需求：">
                <div class="el-input el-input-group el-input-group--append">
                  <el-input v-model="dataForm.reqNames" placeholder="请关联需求"></el-input>
                  <div class="el-input-group__append">
                    <el-button icon="el-icon-search" @click="AddRequire"></el-button>
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="4" style="text-align:right;">
              <el-button type="primary" size="small" @click="getRefDemandData()">查询</el-button>
              <el-button size="small" @click="resetRefCaseData()">重置</el-button>
            </el-col>
          </el-row>
          <el-table :data="refDemandTableData" ref="refDemandTableData" border style="width: 100%;height:400px;overflow-y:auto;">
            <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
            <el-table-column prop="taskName" label="任务名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="reqNames" label="需求名称" header-align="center" align="center" width="150"></el-table-column>
            <el-table-column prop="createPerson" label="创建人" header-align="center" align="center"></el-table-column>
            <el-table-column prop="createOrgName" label="归属机构" header-align="center" align="center"></el-table-column>
            <el-table-column prop="subTaskStartDate" label="计划开始时间" header-align="center" align="center"></el-table-column>
            <el-table-column prop="subTaskEndDate" label="计划结束时间" header-align="center" align="center"></el-table-column>
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
        taskName: '',
        reqNames: '',
        reqCode: '',
        page: 1,
        limit: 5
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
        this.$http.post('/ctc/plan/demand/requireQuote', data).then(({ data: res }) => {
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
