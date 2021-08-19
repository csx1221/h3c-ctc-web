<template>
  <el-dialog :visible.sync="visible" @close="closeToast" width="70%" :title="!dataForm.templateId ? $t('add')+'报表模板' : $t('update')+'报表模板'" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form max-height="480" label-position="right" :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" label-width="220px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="templateName" label="报表名称：">
            <el-input v-model="dataForm.templateName" maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="reportMode" label="报表模式：">
            <el-select v-model="dataForm.reportMode" filterable @change="reportModeChange($event)" placeholder="请选择报表模式">
              <el-option label="请选择报表模式" value=""></el-option>
              <el-option label="项目组模式(项目组内成员可见)" value="1"></el-option>
              <el-option label="私有模式(仅自己可见)" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="projectTeamFlag">
          <el-form-item prop="projectTeam">
            <el-select v-model="dataForm.projectTeam" filterable multiple placeholder="请选择项目组">
              <el-option v-for="data in projectTeamList" :label="data.nodeName" :key="data.id" :value="data.id">{{data.nodeName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="firstClassification" label="指标分类：">
            <el-select v-model="dataForm.firstClassification" filterable @change="firstClassificationChange($event)" placeholder="请选择一级分类">
              <el-option label="" value="">请选择一级分类</el-option>
              <el-option v-for="data in firstClassificationList" :label="data" :key="data" :value="data">{{data}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="twoClassification">
            <el-select v-model="dataForm.twoClassification" filterable @change="twoClassificationChange($event)" placeholder="请选择二级分类">
              <el-option label="" value="">请选择二级分类</el-option>
              <el-option v-for="data in twoClassificationList" :label="data" :key="data" :value="data">{{data}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="statisticalDimension" label="统计维度：">
            <ctc-select v-model="dataForm.statisticalDimension" dict-type="support_dimensions" @input="statisticalDimensionChange($event)" placeholder="请选择"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="reportDataColumnDTOList" label="报表数据列：">
            <el-table v-if="columnTableFlag" stripe highlight-current-row border max-height="680" ref="dataList" :data="dataForm.reportDataColumnDTOList">
              <el-table-column prop="normName" label="指标名称" width="180" show-overflow-tooltip></el-table-column>
              <el-table-column prop="calculationFormulaId" label="计算公式" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.calculationFormulaId" style="width:100%">
                    <el-option @mouseover.native="overEnter($event)" @mouseout.native="overLeave()" v-for="item in scope.row.formulas" :key="item.calculationFormulaId" :label="item.calculationFormula === null ? '无' : item.calculationFormula" :value="item.calculationFormulaId"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
            <ctc-checkbox-button-group :statisticalDimension="dataForm.statisticalDimension" :buttonGroupList="columnButtonGroupList" :buttonGroupValue="columnButtonGroupValue" buttonType="1" placeholder="数据列设置" @watchCheckboxButtonData="changeCheckBoxButtonData"></ctc-checkbox-button-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="reportQueryConditionsDTOList" label="查询条件：">
            <el-tag v-if="queryTagFlag" v-for="item in dataForm.reportQueryConditionsDTOList" :key="item.queryItem" :type="item.type" effect="dark"> {{ item.normName }} </el-tag>
            <ctc-checkbox-button-group :buttonGroupList="columnSelectList" buttonType="2" :buttonGroupValue="queryTagValue" placeholder="查询条件设置" @watchCheckboxButtonData="changeCheckBoxButtonData"></ctc-checkbox-button-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="reportChartSettingDTOList" label="图表设置：">
            <el-button v-if="echartsButtonFlag" v-for="item in echartsGroupList" :key="item.chartName" :type="item.type" @click="setChartsHandle(item.DATA)">{{ item.chartName }}</el-button>
            <ctc-echart-group placeholder="图表设置" ref="ctcEchartGroupSet" :columnButtonGroupValue="columnButtonGroupValue" :columnSelectListLegend="columnSelectByChartsListLegend" :columnSelectListValue="columnSelectByChartsListValue" @watchEchartsData="changeEchartsData"></ctc-echart-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="display: flex;justify-content: center;align-items: center;">
        <el-button size="small" type="primary" @click="dataFormSubmitHandle()">提交</el-button>
        <el-button size="small" @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import ctcCheckboxButtonGroup from '@/views/modules/visualcenter/template/ctc-checkbox-button-group'
import ctcEchartGroup from '@/views/modules/visualcenter/template/ctc-echart-group'
import debounce from 'lodash/debounce'
export default {
  mixins: [],
  data () {
    return {
      visible: false,
      dataForm: {
        templateId: '',
        templateName: '',
        reportMode: '',
        projectTeam: '',
        firstClassification: '',
        twoClassification: '',
        statisticalDimension: '',
        reportDataColumnDTOList: [],
        reportQueryConditionsDTOList: [],
        reportChartSettingDTOList: []
      },
      temporaryReportChartSettingDTOList: [],
      projectTeamFlag: false,
      projectTeamList: [],
      firstClassificationList: [],
      twoClassificationList: [],
      columnButtonGroupList: [],
      columnButtonGroupValue: [],
      columnTableFlag: false,
      columnSelectList: [],
      columnSelectByChartsListLegend: [],
      columnSelectByChartsListValue: [],
      queryTagFlag: false,
      queryTagValue: [],
      echartsGroupList: [],
      echartsButtonFlag: false,
      calculationFormulaValue: [],
      elTooltipStyle: {}
    }
  },
  watch: {
  },
  components: {
    ctcCheckboxButtonGroup, ctcEchartGroup
  },
  created () {
  },
  computed: {
    dataRule () {
      return {
        templateName: [
          { required: true, message: '请输入报表名称' }
        ],
        reportMode: [
          { required: true, message: '请选择报表模式' }
        ],
        statisticalDimension: [
          { required: true, message: '请选择统计维度' }
        ],
        reportDataColumnDTOList: [
          { required: true, message: '请选择报表数据列' }
        ],
        projectTeam: [
          { required: true, message: '请选择项目组' }
        ]
      }
    }
  },
  methods: {
    overEnter (e) {
      let children
      let index = 0
      let offsetLeft = 0
      let offsetTop = 0
      if (e.target.nodeName === 'LI') {
        offsetLeft = e.target.offsetParent.offsetParent.offsetLeft
        offsetTop = e.target.offsetParent.offsetParent.offsetTop - 68
        children = e.target.parentNode.children
        for (let i = 0; i < children.length; i++) {
          if (children[i] === e.target) {
            index = i + 1
            break
          }
        }
      } else {
        offsetLeft = e.target.offsetParent.offsetParent.offsetParent.offsetLeft
        offsetTop = e.target.offsetParent.offsetParent.offsetParent.offsetTop - 68
        children = e.target.parentNode.parentNode.children
        for (let i = 0; i < children.length; i++) {
          if (children[i] === e.target.offsetParent) {
            index = i + 1
            break
          }
        }
      }
      this.elTooltipStyle = { left: (offsetLeft + 'px'), top: (offsetTop + (34 * index) + 'px') }
      this.$ctcSelectTooltip({ title: e.target.innerText, elTooltipStyle: this.elTooltipStyle })
    },
    overLeave (e) {
      this.$ctcSelectTooltip({ title: '关闭浮窗' })
    },
    reportModeChange (val) {
      if (val === '1') {
        this.listTreeRoot()
        this.projectTeamFlag = true
      } else {
        this.projectTeamFlag = false
        this.projectTeamList = []
      }
    },
    firstClassificationChange (val) {
      this.dataForm.twoClassification = ''
      this.getTwoNorm()
      this.cleanChildren()
      this.getIndexLibraryList()
    },
    twoClassificationChange (val) {
      this.cleanChildren()
      this.getIndexLibraryList()
    },
    statisticalDimensionChange (val) {
      this.cleanChildren()
      this.getIndexLibraryList()
    },
    cleanChildren () {
      this.dataForm.reportDataColumnDTOList = []
      this.columnTableFlag = false
      this.columnButtonGroupValue = []
      this.dataForm.reportQueryConditionsDTOList = []
      this.queryTagFlag = false
      this.queryTagValue = []
      this.columnSelectList = []
      this.echartsButtonFlag = false
      this.echartsGroupList = []
      this.columnSelectByChartsListLegend = []
      this.columnSelectByChartsListValue = []
      this.dataForm.reportChartSettingDTOList = []
      this.temporaryReportChartSettingDTOList = []
    },
    setChartsHandle (data) {
      this.$refs.ctcEchartGroupSet.updateDialog({ ...data })
    },
    init () {
      this.visible = true
      this.projectTeamFlag = false
      this.projectTeamList = []
      this.twoClassificationList = []
      this.dataForm.reportDataColumnDTOList = []
      this.columnTableFlag = false
      this.columnButtonGroupValue = []
      this.dataForm.reportQueryConditionsDTOList = []
      this.queryTagFlag = false
      this.queryTagValue = []
      this.columnSelectList = []
      this.echartsButtonFlag = false
      this.echartsGroupList = []
      this.columnSelectByChartsListLegend = []
      this.columnSelectByChartsListValue = []
      this.dataForm.reportChartSettingDTOList = []
      this.temporaryReportChartSettingDTOList = []
      this.$nextTick(() => {
        this.getFirstNorm()
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.templateId) {
          this.getInfo()
        } else {
          this.getIndexLibraryList()
          this.dataForm.templateName = ''
        }
      })
    },
    changeCheckBoxButtonData (message) {
      if (message.buttonType === '1') {
        this.columnSelectList = []
        this.dataForm.reportDataColumnDTOList = []
        this.columnSelectByChartsListLegend = []
        this.columnSelectByChartsListValue = []
        if (message.buttonGroupValue.length === 0) {
          this.columnTableFlag = false
        } else {
          this.columnTableFlag = true
        }
        this.columnButtonGroupValue = message.buttonGroupValue
        for (let j = 0; j < message.buttonGroupValue.length; j++) {
          for (let i = 0; i < this.columnButtonGroupList.length; i++) {
            if (this.columnButtonGroupList[i].normId === message.buttonGroupValue[j]) {
              this.columnSelectList.push({ normId: this.columnButtonGroupList[i].normId, normName: this.columnButtonGroupList[i].normName })
              if (this.columnButtonGroupList[i].isStatistics === 1) {
                this.columnSelectByChartsListLegend.push({ normId: this.columnButtonGroupList[i].normId, normName: this.columnButtonGroupList[i].normName })
              }
              if (this.columnButtonGroupList[i].isDataValue === 1) {
                this.columnSelectByChartsListValue.push({ normId: this.columnButtonGroupList[i].normId, normName: this.columnButtonGroupList[i].normName })
              }
            }
          }
        }
        for (let i = 0; i < this.columnSelectList.length; i++) {
          let formulas = []
          this.dataForm.reportDataColumnDTOList.push({ normId: this.columnSelectList[i].normId, normName: this.columnSelectList[i].normName, formulas: [], calculationFormulaId: '' })
          this.$http.get(`/ctc/visualization/templateSetting/getCalculationFormulaByNormId/${this.columnSelectList[i].normId}`).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            for (let j = 0; j < res.data.length; j++) {
              if (res.data[j].isDefault === 0) {
                formulas.push({ calculationFormulaId: res.data[j].calculationFormulaId, calculationFormula: res.data[j].defaultCalculationDetail })
              } else {
                formulas.push({ calculationFormulaId: res.data[j].calculationFormulaId, calculationFormula: res.data[j].calculationFormula })
              }
            }
            this.dataForm.reportDataColumnDTOList[i].formulas = formulas
            if (message.calculationFormulaIds) {
              this.dataForm.reportDataColumnDTOList[i].calculationFormulaId = message.calculationFormulaIds[i]
            } else {
              this.dataForm.reportDataColumnDTOList[i].calculationFormulaId = formulas[0].calculationFormulaId
            }
          }).catch(() => { })
        }
        if (this.columnSelectList.length === 0) {
          this.dataForm.reportQueryConditionsDTOList = []
          this.queryTagValue = []
          this.queryTagFlag = false
        }
        if (this.columnSelectByChartsListLegend.length === 0 || this.columnSelectByChartsListValue.length === 0) {
          this.temporaryReportChartSettingDTOList = []
          this.echartsGroupList = []
          this.echartsButtonFlag = false
        }
      } else {
        this.queryTagValue = []
        this.dataForm.reportQueryConditionsDTOList = []
        this.queryTagValue = message.buttonGroupValue
        if (message.buttonGroupValue.length === 0) {
          this.queryTagFlag = false
        } else {
          this.queryTagFlag = true
        }
        for (let j = 0; j < message.buttonGroupValue.length; j++) {
          if (message.buttonGroupValue[j] === '111111') {
            this.dataForm.reportQueryConditionsDTOList.push({ normName: '项目经理', queryItem: '111111', type: '' })
            continue
          } else if (message.buttonGroupValue[j] === '222222') {
            this.dataForm.reportQueryConditionsDTOList.push({ normName: '项目创建人', queryItem: '222222', type: '' })
            continue
          } else if (message.buttonGroupValue[j] === '333333') {
            this.dataForm.reportQueryConditionsDTOList.push({ normName: '统计时间', queryItem: '333333', type: '' })
            continue
          } else {
            for (let i = 0; i < this.columnSelectList.length; i++) {
              if (this.columnSelectList[i].normId === message.buttonGroupValue[j]) {
                this.dataForm.reportQueryConditionsDTOList.push({ normName: this.columnSelectList[i].normName, queryItem: this.columnSelectList[i].normId, type: '' })
                continue
              }
            }
          }
        }
      }
    },
    changeEchartsData (message) {
      let changeEchartsFlag = false
      let index = ''
      if (this.temporaryReportChartSettingDTOList.length > 0) {
        for (let i = 0; i < this.echartsGroupList.length; i++) {
          if (this.echartsGroupList[i].chartName === message.chartName && this.echartsGroupList[i].DATA.UUID !== message.UUID) {
            this.$message({
              message: '当前标题名称已经存在，请更换',
              type: 'warning'
            })
            return
          }
        }
        for (let i = 0; i < this.temporaryReportChartSettingDTOList.length; i++) {
          if (this.temporaryReportChartSettingDTOList[i].UUID === message.UUID) {
            changeEchartsFlag = true
            index = i
            break
          }
        }
      }
      message.dataValue = message.chartType === 1 ? message.singleDataValue : message.multipleDataValue.toString()
      message.chartType === 1 ? message.multipleDataValue = [] : message.singleDataValue = ''
      message.isShow = message.isShow ? 1 : 0
      if (!changeEchartsFlag) {
        this.temporaryReportChartSettingDTOList.push({ UUID: message.UUID, DATA: message })
        this.echartsGroupList.push({ DATA: message, chartName: message.chartName, type: 'text' })
      } else {
        this.temporaryReportChartSettingDTOList[index].DATA = message
        this.echartsGroupList[index].chartName = message.chartName
        this.echartsGroupList[index].DATA = message
      }
      this.$refs.ctcEchartGroupSet.visible = false
      this.echartsButtonFlag = true
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/ctc/visualization/templateSetting/${this.dataForm.templateId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = { ...this.dataForm, ...res.data }
        if (this.dataForm.firstClassification) {
          this.getTwoNorm()
        }
        if (this.dataForm.projectTeam) {
          this.listTreeRoot()
          this.dataForm.projectTeam = this.dataForm.projectTeam.split(',')
          this.projectTeamFlag = true
        }
        this.$http.get(`/ctc/visualization/indexLibrary/getIndexLibraryList/`, { params: { firstNorm: this.dataForm.firstClassification, twoNorm: this.dataForm.twoClassification, supportDimensions: this.dataForm.statisticalDimension } }, { emulateJSON: true }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.columnButtonGroupList = res.data
          if (this.dataForm.reportDataColumnDTOList.length > 0) {
            let buttonGroupValue = []
            let calculationFormulaId = []
            this.dataForm.reportDataColumnDTOList.forEach(val => {
              buttonGroupValue.push(val.normId)
              calculationFormulaId.push(val.calculationFormulaId)
            })
            this.changeCheckBoxButtonData({ buttonType: '1', buttonGroupValue: buttonGroupValue, calculationFormulaIds: calculationFormulaId })
          }
          if (this.dataForm.reportQueryConditionsDTOList && this.dataForm.reportQueryConditionsDTOList.length > 0) {
            let buttonGroupValue = []
            this.dataForm.reportQueryConditionsDTOList.forEach(val => {
              if (val.queryItem === '111111') {
                buttonGroupValue.push('111111')
              } else if (val.queryItem === '222222') {
                buttonGroupValue.push('222222')
              } else if (val.queryItem === '333333') {
                buttonGroupValue.push('333333')
              } else {
                buttonGroupValue.push(val.normId)
              }
            })
            this.changeCheckBoxButtonData({ buttonType: '2', buttonGroupValue: buttonGroupValue })
          }
          if (this.dataForm.reportChartSettingDTOList && this.dataForm.reportChartSettingDTOList.length > 0) {
            this.dataForm.reportChartSettingDTOList.forEach(val => {
              let dataForm = {}
              if (val.chartType === '1') {
                dataForm = { UUID: val.chartId, chartId: val.chartId, templateId: val.templateId, chartType: Number(val.chartType), chartName: val.chartName, legend: val.legend, dataValue: val.dataValue, multipleDataValue: [], singleDataValue: val.dataValue }
              } else {
                dataForm = { UUID: val.chartId, chartId: val.chartId, templateId: val.templateId, chartType: Number(val.chartType), chartName: val.chartName, legend: val.legend, dataValue: val.dataValue, multipleDataValue: val.dataValue.split(','), singleDataValue: '', maxValue: val.maxValue, minValue: val.minValue, isShow: !!Number(val.isShow) }
              }
              this.changeEchartsData({ ...dataForm })
            })
          }
          this.dataForm.reportChartSettingDTOList = []
        }).catch(() => { })
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        for (let i = 0; i < this.temporaryReportChartSettingDTOList.length; i++) {
          this.dataForm.reportChartSettingDTOList.push(this.temporaryReportChartSettingDTOList[i].DATA)
        }
        if (this.dataForm.reportMode === '1') {
          this.dataForm.projectTeam = this.dataForm.projectTeam.toString()
        } else {
          this.dataForm.projectTeam = ''
        }
        this.$http[!this.dataForm.templateId ? 'post' : 'put'](!this.dataForm.templateId ? '/ctc/visualization/templateSetting' : '/ctc/visualization/templateSetting', this.dataForm).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.visible = false
              this.$emit('refreshDataList')
              this.$refs['dataForm'].resetFields()
              this.temporaryReportChartSettingDTOList = []
            }
          })
        }).catch(() => { })
      })
    }, 1000, { 'leading': true, 'trailing': false }),
    closeToast () {
      this.$refs['dataForm'].resetFields()
    },
    listTreeRoot () {
      this.$http.get(`/ctc/project/projectDetail/listTreeRoot`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.projectTeamList = res.data
      }).catch(() => { })
    },
    getFirstNorm () {
      this.$http.get(`/ctc/visualization/indexLibrary/getFirstNorm`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.firstClassificationList = res.data
      }).catch(() => { })
    },
    getTwoNorm () {
      this.$http.get(`/ctc/visualization/indexLibrary/getTwoNorm/`, { params: { firstNorm: this.dataForm.firstClassification } }, { emulateJSON: true }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.twoClassificationList = res.data
      }).catch(() => { })
    },
    getIndexLibraryList () {
      this.$http.get(`/ctc/visualization/indexLibrary/getIndexLibraryList/`, { params: { firstNorm: this.dataForm.firstClassification, twoNorm: this.dataForm.twoClassification, supportDimensions: this.dataForm.statisticalDimension } }, { emulateJSON: true }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.columnButtonGroupList = res.data
      }).catch(() => { })
    },
    resetForm () {
      this.cleanChildren()
      this.projectTeamFlag = false
      this.projectTeamList = []
      this.twoClassificationList = []
      this.$refs['dataForm'].resetFields()
      this.getIndexLibraryList()
    }
  }
}
</script>
<style lang="scss" >
.el-table td, .el-table th {
  padding: 5px 0;
}
.el-tag {
  margin-left: 8px;
  border-radius: 0px;
  width: 120px;
  text-align: center;
}
.el-tag:first-child {
  margin-left: 0px;
}
.el-select__tags {
  padding: 5px;
}
.el-select__tags .el-tag{
  width: auto;
}
.el-select-dropdown{
  max-width: 245px;
}
</style>
