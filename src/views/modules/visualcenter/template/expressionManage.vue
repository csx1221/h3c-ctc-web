<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__goods">
      <!-- There is el-form -->
      <el-form :select-on-indeterminate="true" :model="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="80px">
         <el-row>
          <el-col :span="6">
            <el-form-item label="指标名称">
               <el-input v-model="dataForm.normName" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <el-date-picker clearable unlink-panels value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期" v-model="dateTimeArr" align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-button size="small" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
            <el-button size="small" @click="resetSelectInfo()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row type="flex" align="middle">
        <el-col :span="12" class="split-line" style="text-align:left;">计算公式列表</el-col>
        <el-col :span="12" style="text-align: right;padding-right:10px;">
          <el-button type="primary" size="small" @click="expressionEditHandle()">{{ $t('add') }}</el-button>
        </el-col>
      </el-row>
      <el-table stripe highlight-current-row border v-loading="dataListLoading" :data="dataList">
        <el-table-column width="60" label="序号" type="index" header-align="center" align="center"></el-table-column>
        <el-table-column width="140" prop="normName" label="指标名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="calculationFormula" label="计算公式" header-align="left" align="left">
        </el-table-column>
        <el-table-column width="80" prop="isDefault" label="公式类型" header-align="center" align="center">
           <template slot-scope="scope">
             {{ scope.row.isDefault === 0 ? '默认' : '自定义' }}
           </template>
        </el-table-column>
        <el-table-column width="100" prop="creatorName" label="创建人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column  prop="createDate" label="创建时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="100" :label="$t('handle')" fixed="right" header-align="center" align="center">
          <template slot-scope="scope" v-if="scope.row.isDefault==1">
            <el-button type="text" size="small" @click="expressionEditHandle(scope.row.calculationFormulaId)" v-if="scope.row.isHaveEditPermission==1">编辑</el-button>
            <el-button type="text" size="small" @click="expressionDelHandle(scope.row.calculationFormulaId)" v-if="scope.row.isHaveRemovePermission==1">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <expressionEditComponent v-if="showExpressionEdit" @scroll.native="getScroll($event)" ref="expressionEdit" @refreshDataList="getDataList"></expressionEditComponent>
    </div>
  </el-card>
</template>

<script>
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
import expressionEditComponent from '@/views/modules/visualcenter/template/expression-add-or-update'
export default {
  mixins: [projectView],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/formula/formulaList',
        getDataListIsPage: true,
        deleteURL: '/ctc/servicebus/routedic'
      },
      dataForm: {
        normName: '',
        operateDateStart: '',
        operateDateEnd: ''
      },
      dateTimeArr: [],
      dataListLoading: false, // 数据列表，loading状态
      dataList: [], // 获取分页列表的数据
      showExpressionEdit: false
    }
  },
  components: {
    expressionEditComponent
  },
  watch: {
    dateTimeArr: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (this.dateTimeArr === '' || this.dateTimeArr === null) {
          this.dataForm.operateDateStart = ''
          this.dataForm.operateDateEnd = ''
        } else {
          this.dataForm.operateDateStart = this.dateTimeArr[0]
          this.dataForm.operateDateEnd = this.dateTimeArr[1]
        }
      }
    }
  },
  methods: {
    getScroll (e) {
      this.$refs.expressionEdit.scrollTop = e.target.scrollTop
    },
    expressionEditHandle (id) {
      this.showExpressionEdit = true
      this.$nextTick(() => {
        this.$refs.expressionEdit.dataForm.calculationFormulaId = id
        this.$refs.expressionEdit.init()
      })
    },
    expressionDelHandle (id) {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$http.delete('/ctc/visualization/formula/deleteFormula', { params: { calculationFormulaId: id } }, { emulateJSON: true }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.query()
            }
          })
        }).catch(() => { })
      }).catch(() => { })
    },
    resetSelectInfo () {
      this.$nextTick(() => {
        this.dataForm.normName = ''
        this.dateTimeArr = ''
        this.dataForm.operateDateStart = ''
        this.dataForm.operateDateEnd = ''
        this.getDataList()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-head {
  font-size: 14px !important;
}
/deep/ .el-select__tags {
  flex-wrap: unset;
  overflow: auto;
  margin: 0 1px;
}
</style>
