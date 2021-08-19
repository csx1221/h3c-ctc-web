<template>
  <div class="report-list">
    <el-row>
      <el-col :span="24">
        <el-card shadow="never" class="aui-card--fill">
          <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="180px">
            <el-row>
              <el-col :span="8" v-for="(queryData, index) in queryDataList" :key="queryData.queryId" v-if="index < 3">
                <el-form-item v-if="queryData.queryItem === '111111'" prop="项目经理" label="项目经理">
                  <el-select v-model="dataForm['项目经理']" filterable multiple placeholder="请选择项目经理">
                    <el-option v-for="item in managerData" :key="item.id" :label="item.realName" :value="item.id">
                      <span style="color: #8492a6; font-size: 13px" :title="item.username">{{ item.realName }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="queryData.queryItem === '222222'" prop="项目创建人" label="项目创建人">
                  <ctc-person-liable v-model="dataForm['项目创建人']" placeholder="请选择创建人" :organizeId.sync="dataForm['项目创建人']"></ctc-person-liable>
                </el-form-item>
                <el-form-item v-if="queryData.queryItem === '333333'" prop="统计时间" label="统计时间">
                  <el-date-picker clearable unlink-panels value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="请选择开始日期" v-model="dataForm['统计时间']" end-placeholder="请选择结束日期" align="right">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-if="queryData.queryItemType === 0" :prop="queryData.normName" :label="queryData.normName">
                  <el-input v-model="dataForm[queryData.normName]"></el-input>
                </el-form-item>
                <el-form-item v-if="queryData.queryItemType === 1" :prop="queryData.normName" :label="queryData.normName">
                  <ctc-input v-model="dataForm[queryData.normName]"></ctc-input>
                </el-form-item>
                <el-form-item v-if="queryData.queryItemType === 2" :prop="queryData.normName" :label="queryData.normName">
                  <el-date-picker clearable unlink-panels value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="请选择开始日期" v-model="dataForm[queryData.normName]" end-placeholder="请选择结束日期" align="right">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-if="queryData.queryItemType === 3" :prop="queryData.normName" :label="queryData.normName">
                  <ctc-select v-if="queryData.normName === '项目状态'" v-model="dataForm[queryData.normName]" dict-type="project.projectStatus" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '子项目状态'" v-model="dataForm[queryData.normName]" dict-type="project.projectStatus" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '参测对象状态'" v-model="dataForm[queryData.normName]" dict-type="dealStatus" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '子项目类型'" v-model="dataForm[queryData.normName]" dict-type="project.subProjectType" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '用例状态'" v-model="dataForm[queryData.normName]" dict-type="reviewStatus" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '缺陷类型'" v-model="dataForm[queryData.normName]" dict-type="defectType" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '问题原因分类'" v-model="dataForm[queryData.normName]" dict-type="defectCategory" placeholder="请选择"></ctc-select>
                  <el-select v-if="queryData.normName === '是否人工分支'" v-model="dataForm[queryData.normName]" filterable placeholder="请选择">
                    <el-option label="请选择" value=""></el-option>
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                  <el-select v-if="queryData.normName === '初测结果'" v-model="dataForm[queryData.normName]" filterable placeholder="请选择">
                    <el-option label="请选择" value=""></el-option>
                    <el-option label="通过" value="通过"></el-option>
                    <el-option label="不通过" value="不通过"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="isOpen">
              <el-col :span="8" v-for="(queryData, index) in queryDataList" :key="queryData.queryId" v-if="index >= 3">
                <el-form-item v-if="queryData.queryItem === '111111'" prop="项目经理" label="项目经理">
                  <el-select v-model="dataForm['项目经理']" filterable multiple placeholder="请选择项目经理">
                    <el-option v-for="item in managerData" :key="item.id" :label="item.realName" :value="item.id">
                      <span style="color: #8492a6; font-size: 13px" :title="item.username">{{ item.realName }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="queryData.queryItem === '222222'" prop="项目创建人" label="项目创建人">
                  <ctc-person-liable v-model="dataForm['项目创建人']" placeholder="请选择创建人" :organizeId.sync="dataForm['项目创建人']"></ctc-person-liable>
                </el-form-item>
                <el-form-item v-if="queryData.queryItem === '333333'" prop="统计时间" label="统计时间">
                  <el-date-picker clearable unlink-panels value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="请选择开始日期" v-model="dataForm['统计时间']" end-placeholder="请选择结束日期" align="right">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-if="queryData.queryItemType === 0" :prop="queryData.normName" :label="queryData.normName">
                  <el-input v-model="dataForm[queryData.normName]"></el-input>
                </el-form-item>
                <el-form-item v-if="queryData.queryItemType === 1" :prop="queryData.normName" :label="queryData.normName">
                  <ctc-input v-model="dataForm[queryData.normName]"></ctc-input>
                </el-form-item>
                <el-form-item v-if="queryData.queryItemType === 2" :prop="queryData.normName" :label="queryData.normName">
                  <el-date-picker clearable unlink-panels value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="请选择开始日期" v-model="dataForm[queryData.normName]" end-placeholder="请选择结束日期" align="right">
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-if="queryData.queryItemType === 3" :prop="queryData.normName" :label="queryData.normName">
                  <ctc-select v-if="queryData.normName === '项目状态'" v-model="dataForm[queryData.normName]" dict-type="project.projectStatus" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '子项目状态'" v-model="dataForm[queryData.normName]" dict-type="project.projectStatus" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '参测对象状态'" v-model="dataForm[queryData.normName]" dict-type="dealStatus" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '子项目类型'" v-model="dataForm[queryData.normName]" dict-type="project.subProjectType" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '用例状态'" v-model="dataForm[queryData.normName]" dict-type="reviewStatus" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '缺陷类型'" v-model="dataForm[queryData.normName]" dict-type="defectType" placeholder="请选择"></ctc-select>
                  <ctc-select v-if="queryData.normName === '问题原因分类'" v-model="dataForm[queryData.normName]" dict-type="defectCategory" placeholder="请选择"></ctc-select>
                  <el-select v-if="queryData.normName === '是否人工分支'" v-model="dataForm[queryData.normName]" filterable placeholder="请选择">
                    <el-option label="请选择" value=""></el-option>
                    <el-option label="是" value="是"></el-option>
                    <el-option label="否" value="否"></el-option>
                  </el-select>
                  <el-select v-if="queryData.normName === '初测结果'" v-model="dataForm[queryData.normName]" filterable placeholder="请选择">
                    <el-option label="请选择" value=""></el-option>
                    <el-option label="通过" value="通过"></el-option>
                    <el-option label="不通过" value="不通过"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" style="text-align:right;">
                <el-button type="text" size="small" @click="isOpen = !isOpen" v-if="queryDataList.length > 3" v-html="isOpen?'收起':'更多'"></el-button>
                <el-button type="primary" size="small" @click="searchTableList()">查询</el-button>
                <el-button size="small" @click="resetForm()">重置</el-button>
                <el-button size="small" @click="exportHandle()">导出</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="24" style="margin-top:24px;">
        <el-card shadow="never" class="aui-card--fill">
          <el-row>
            <el-col :span="24">
              <span style="float: right;margin-bottom: 20px;;"><el-button  size="small" @click="columnSetUp()">列表设置</el-button></span>
            </el-col>
          </el-row>
          <el-table stripe highlight-current-row border v-loading="dataListLoading" :data="dataList" ref="dataList">
            <el-table-column width="60" label="序号" type="index" header-align="center" align="center"></el-table-column>
            <el-table-column v-for="data in tableHeadList" :prop="data.normName" :key="data.normId" :label="data.normName" :width="data.width" header-align="center" align="center" show-overflow-tooltip v-if="data.hideNorm === '1'">
              <template slot-scope="scope">
                {{ scope.row[data.normName] }}
                <el-button v-if="data.drillDown === 1" type="text" @click="clickSee(data.normName,scope.row.projectId,scope.row.organizeId)">点击查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :current-page="page" :page-sizes="[10, 100, 500,1000]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
          <checkbox-group v-if="showCheckboxGroup" ref="checkboxGroup" placeholder="列选择" :checkboxGroupList="columnSetUpDataList" :checkboxGroupValue="columnSetUpDataValue" @watchCheckboxGroupData="changeColumnSetUpDataValue"></checkbox-group>
          <echart-see v-if="showEchartSee" ref="echartSee"></echart-see>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import checkboxGroup from './checkbox-group'
import echartSee from './echart-see'
import ctcSelect from './ctc-select'
import ctcPersonLiable from '@/components/programmecntre/ctc-person-liable'
import ctcUtils from '@/utils/ctc-utils.js'
export default {
  name: 'ReportList',
  props: {
  },
  mixins: [],
  data () {
    return {
      dataForm: {
      },
      temporaryDataForm: {
      },
      templateData: '',
      managerData: [],
      page: 1,
      limit: 10,
      total: 0,
      dataListLoading: false,
      dataList: [],
      isOpen: false,
      showCheckboxGroup: false,
      showEchartSee: false,
      storageQueryDataList: [],
      queryDataList: [],
      columnSetUpDataValue: [],
      columnSetUpDataList: [],
      tableHeadList: []
    }
  },
  components: {
    checkboxGroup, echartSee, ctcPersonLiable, ctcSelect
  },
  watch: {
    templateData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.page = 1
        this.limit = 10
        this.$refs.dataForm.resetFields()
        this.getColumnSetUpAndQueryDataList()
        this.getTableList()
      }
    },
    dataList (valArr) {
      this.tableHeadList = this.tableHeadList.map(function (value) {
        let textLength = value.normName.length
        if (value.normName.indexOf('项目名称') !== -1) {
          value.width = 250
        } else if (value.normName.indexOf('数') !== -1 || value.normName.indexOf('比') !== -1 || value.normName.indexOf('率') !== -1) {
          value.width = textLength * 20
        } else {
          value.width = textLength * 20 + 10
        }
        return value
      })
    }
  },
  computed: {
  },
  mounted () {
  },
  created () {
  },
  activated () {
  },
  methods: {
    searchTableList () {
      let errorLength = document.getElementsByClassName('el-form-item__error').length
      if (errorLength > 0) {
        return this.$message.error('有起始数值大于截止数值，请重新输入')
      }
      this.page = 1
      this.getTableList()
      this.$emit('chartList', {
        ...this.dataForm
      })
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.page = 1
      this.getTableList()
      this.$emit('chartList', {
        ...this.dataForm
      })
    },
    pageSizeChangeHandle (val) {
      let errorLength = document.getElementsByClassName('el-form-item__error').length
      if (errorLength > 0) {
        return this.$message.error('有起始数值大于截止数值，请重新输入')
      }
      this.page = 1
      this.limit = val
      this.getTableList()
    },
    pageCurrentChangeHandle (val) {
      let errorLength = document.getElementsByClassName('el-form-item__error').length
      if (errorLength > 0) {
        return this.$message.error('有起始数值大于截止数值，请重新输入')
      }
      this.page = val
      this.getTableList()
    },
    getTableList () {
      this.dataListLoading = true
      let params = { ...this.dataForm }
      for (var val in params) {
        params[val] = params[val].toString()
      }
      params.page = this.page
      params.limit = this.limit
      params.templateId = this.templateData.templateId
      this.$http.get('/ctc/visualization/reportForm/getTableData', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.dataList = res.data.list
          this.total = res.data.total
        }
        this.dataListLoading = false
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    columnSetUp () {
      this.showCheckboxGroup = true
      this.$nextTick(() => {
        this.$refs.checkboxGroup.initDialog()
      })
    },
    getColumnSetUpAndQueryDataList () {
      this.$http.get(`/ctc/visualization/templateSetting/getDataColumnShowUserListByTemplateSettingId/${this.templateData.templateId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.columnSetUpDataValue = []
        this.columnSetUpDataList = [ ...res.data ]
        this.tableHeadList = [ ...res.data ]
        this.columnSetUpDataList.forEach(val => {
          if (val.hideNorm === '1') {
            this.columnSetUpDataValue.push(val.normId)
          }
        })
        this.queryDataList = []
        this.dataForm = {}
        this.$http.get(`/ctc/visualization/templateSetting/getQueryConditionListByTemplateSettingId/${this.templateData.templateId}`).then(({ data: res1 }) => {
          if (res1.code !== 0) {
            return this.$message.error(res1.msg)
          }
          this.storageQueryDataList = [ ...res1.data ]
          this.storageQueryDataList.forEach(val2 => {
            if (val2.queryItem === '111111') {
              this.queryDataList.push(val2)
              this.$set(this.dataForm, '项目经理', [])
            } else if (val2.queryItem === '222222') {
              this.queryDataList.push(val2)
              this.$set(this.dataForm, '项目创建人', '')
            } else if (val2.queryItem === '333333') {
              this.queryDataList.push(val2)
              this.$set(this.dataForm, '统计时间', [])
            } else {
              this.tableHeadList.forEach(val => {
                if (val.normId === val2.normId) {
                  if (val.hideNorm === '1') {
                    this.queryDataList.push(val2)
                    if (val2.queryItemType === 1 || val2.queryItemType === 2) {
                      this.$set(this.dataForm, val2.normName, [])
                    } else {
                      this.$set(this.dataForm, val2.normName, '')
                    }
                  }
                }
              })
            }
          })
        }).catch(() => { })
      }).catch(() => { })
    },
    changeColumnSetUpDataValue (message) {
      this.temporaryDataForm = { ...this.dataForm }
      this.queryDataList = []
      this.dataForm = {}
      this.tableHeadList.forEach(val => {
        val.hideNorm = message.columnSetUpDataValue.filter(item => item === val.normId).length > 0 ? '1' : '0'
      })
      this.storageQueryDataList.forEach(val2 => {
        if (val2.queryItem === '111111') {
          this.queryDataList.push(val2)
          this.$set(this.dataForm, '项目经理', [])
        } else if (val2.queryItem === '222222') {
          this.queryDataList.push(val2)
          this.$set(this.dataForm, '项目创建人', '')
        } else if (val2.queryItem === '333333') {
          this.queryDataList.push(val2)
          this.$set(this.dataForm, '统计时间', [])
        } else {
          this.tableHeadList.forEach(val => {
            if (val.normId === val2.normId) {
              if (val.hideNorm === '1') {
                this.queryDataList.push(val2)
                if (val2.queryItemType === 1 || val2.queryItemType === 2) {
                  this.$set(this.dataForm, val2.normName, [])
                } else {
                  this.$set(this.dataForm, val2.normName, '')
                }
              }
            }
          })
        }
      })
      this.columnSetUpDataValue = message.columnSetUpDataValue
      let tableHeadList = this.tableHeadList
      this.$refs.dataList.doLayout()
      this.$http.put('/ctc/visualization/templateSetting/updateReportDataColumnShowUserList', tableHeadList).then(({ data: res }) => {
        for (var val in this.temporaryDataForm) {
          this.dataForm[val] = this.temporaryDataForm[val]
        }
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          return this.$message.success('列表设置成功')
        }
      }).catch(() => { })
    },
    clickSee (normName, projectId, organizeId) {
      this.showEchartSee = true
      this.$nextTick(() => {
        this.$refs.echartSee.normName = normName
        this.$refs.echartSee.projectId = projectId
        this.$refs.echartSee.organizeId = organizeId
        this.$refs.echartSee.statisticalDimension = this.templateData.statisticalDimension
        this.$refs.echartSee.initDialog()
      })
    },
    exportHandle () {
      let params = { ...this.dataForm }
      for (var val in params) {
        params[val] = params[val].toString()
      }
      params.templateId = this.templateData.templateId
      params.fileName = this.templateData.templateName
      let url = '/ctc/visualization/reportForm/dataExport'
      ctcUtils.customExportGet(url, params)
    }
  }
}
</script>
<style lang="scss">
  .el-table__body .el-button {
    padding: 0px;
  }
</style>
