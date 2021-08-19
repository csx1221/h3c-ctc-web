<template>
  <div class="ctc-echarts-group">
    <el-button size="small" type="primary" @click="initDialog()">添加设置</el-button>
    <el-dialog :visible.sync="visible" width="50%" :modal="false" :title="placeholder" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm">
        <el-row>
          <el-col :span="12">
            <div ref="echartsValue" style="height: 400px;width: 100%;"></div>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="1">
                <el-form-item prop="UUID">
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-form-item prop="chartId">
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-form-item prop="templateId">
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="chartType" label="图表类型">
                  <el-radio-group v-model="dataForm.chartType" @change="chartTypeChange($event)">
                    <el-radio :label="0">柱状图</el-radio>
                    <el-radio :label="1">饼图</el-radio>
                    <el-radio :label="2">折线图</el-radio>
                    <el-radio :label="3">堆积图</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="属性设置">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="标题" name="1">
                      <el-form-item prop="chartName" label="标题名称">
                        <el-input v-model="dataForm.chartName" maxlength="32" v-on:input="chartNameChange"></el-input>
                      </el-form-item>
                    </el-collapse-item>
                    <el-collapse-item title="X轴" name="2">
                      <el-form-item prop="legend" label="图例">
                        <el-select v-model="dataForm.legend" filterable @change="legendChange()">
                          <el-option v-for="data in columnSelectListLegend" :label="data.normName" :key="data.normId"
                            :value="data.normId"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item v-show="multipleChoice" prop="multipleDataValue" label="数据值">
                        <el-select v-model="dataForm.multipleDataValue" filterable multiple @change="multipleDataValueChange()">
                          <el-option v-for="data in columnSelectListValue" :label="data.normName" :key="data.normId+1"
                            :value="data.normId"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item v-show="singleChoice" prop="singleDataValue" label="数据值">
                        <el-select v-model="dataForm.singleDataValue" filterable @change="singleDataValueChange()">
                          <el-option v-for="data in columnSelectListValue" :label="data.normName" :key="data.normId+2"
                            :value="data.normId"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-collapse-item>
                    <el-collapse-item title="Y轴" name="3" :disabled="disabled">
                      <el-form-item prop="maxValue" label="最大值">
                        <input class="el-input__inner" v-model="dataForm.maxValue" v-on:input="maxValueChange" @keyup=" $event.currentTarget.value = $event.currentTarget.value.replace(/[^\d]/g, '')">
                      </el-form-item>
                      <el-form-item prop="minValue" label="最小值">
                        <input class="el-input__inner" v-model="dataForm.minValue" v-on:input="minValueChange" @keyup=" $event.currentTarget.value = $event.currentTarget.value.replace(/[^\d]/g, '')">
                      </el-form-item>
                      <el-form-item prop="isShow" label="是否显示">
                        <el-checkbox v-model="dataForm.isShow" v-on:input="isShowChange"></el-checkbox>
                      </el-form-item>
                    </el-collapse-item>
                  </el-collapse>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">{{ $t('confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
var chartObj = ''
var echartsOptionBar
var echartsOptionPie
var echartsOptionLine
var echartsOptionBars
const echarts = require('echarts')
export default {
  name: 'CtcEchartGroup',
  data () {
    return {
      visible: false,
      dataForm: {
        UUID: '',
        chartId: '',
        templateId: '',
        chartType: 0,
        isShow: true,
        chartName: '',
        legend: '',
        dataValue: '',
        multipleDataValue: [],
        singleDataValue: '',
        maxValue: '',
        minValue: ''
      },
      activeNames: ['1', '2', '3'],
      disabled: false,
      multipleChoice: true,
      singleChoice: false,
      echartsColor: ['#2EC7C9', '#B6A2DE', '#5AB1EF', '#FFB980', '#D87A80', '#8D98B3', '#E5CF0D', '#97B552', '#95706D', '#DC69AA', '#88c9c5', '#cbc5de', '#1397ef', '#ffe2c9', '#d8aaab', '#5a6ab3', '#e3e563', '#a4b57d', '#955850', '#dc8bc0', '#12c9c9', '#8663de', '#4bbeef', '#ffdf9e', '#d8828a', '#8585b3', '#e4e58d', '#b2b5a9', '#958474', '#d493dc'],
      seriesData: [],
      dataValueName: ['默认'],
      xAxisData: []
    }
  },
  props: {
    placeholder: String,
    columnSelectListLegend: Array,
    columnSelectListValue: Array,
    columnButtonGroupValue: Array
  },
  watch: {
  },
  computed: {
    dataRule () {
      return {
        chartName: [{
          required: true,
          message: '请输入标题名称'
        }],
        legend: [{
          required: true,
          message: '请选择图例'
        }],
        multipleDataValue: [{
          required: true,
          message: '请选择数据值'
        }],
        singleDataValue: [{
          required: true,
          message: '请选择数据值'
        }]
      }
    }
  },
  methods: {
    chartTypeChange (val) {
      if (this.dataForm.chartType === 1) {
        this.activeNames = ['1', '2']
        this.disabled = true
        this.multipleChoice = false
        this.singleChoice = true
      } else {
        this.activeNames = ['1', '2', '3']
        this.disabled = false
        this.multipleChoice = true
        this.singleChoice = false
      }
      this.$nextTick(() => {
        let UID = this.dataForm.UUID
        this.$refs['dataForm'].resetFields()
        this.dataForm.chartType = val
        this.dataForm.UUID = UID
      })
      this.createdEchartsOption()
      this.createdEcharts(0)
    },
    chartNameChange () {
      if (this.dataForm.chartType === 0) {
        echartsOptionBar.title.text = this.dataForm.chartName
        chartObj.setOption(echartsOptionBar)
      } else if (this.dataForm.chartType === 1) {
        echartsOptionPie.title.text = this.dataForm.chartName
        chartObj.setOption(echartsOptionPie)
      } else if (this.dataForm.chartType === 2) {
        echartsOptionLine.title.text = this.dataForm.chartName
        chartObj.setOption(echartsOptionLine)
      } else if (this.dataForm.chartType === 3) {
        echartsOptionBars.title.text = this.dataForm.chartName
        chartObj.setOption(echartsOptionBars)
      }
    },
    legendChange () {
      this.xAxisData = []
      if (this.dataForm.chartType === 0) {
        for (let i = 0; i < 7; i++) {
          this.xAxisData.push('数据' + (i + 1))
        }
        echartsOptionBar.xAxis.data = this.xAxisData
        chartObj.setOption(echartsOptionBar)
      } else if (this.dataForm.chartType === 1) {
        let data = []
        for (let i = 0; i < 7; i++) {
          data.push({
            value: this.random(10, 200),
            name: '数据' + (i + 1)
          })
        }
        echartsOptionPie.series[0].data = data
        chartObj.setOption(echartsOptionPie)
      } else if (this.dataForm.chartType === 2) {
        for (let i = 0; i < 7; i++) {
          this.xAxisData.push('数据' + (i + 1))
        }
        echartsOptionLine.xAxis.data = this.xAxisData
        chartObj.setOption(echartsOptionLine)
      } else if (this.dataForm.chartType === 3) {
        for (let i = 0; i < 7; i++) {
          this.xAxisData.push('数据' + (i + 1))
        }
        echartsOptionBars.yAxis.data = this.xAxisData
        chartObj.setOption(echartsOptionBars)
      }
    },
    multipleDataValueChange () {
      this.dataValueName = []
      this.seriesData = []
      let obj = {}
      let value = this.dataForm.multipleDataValue
      for (let i = 0; i < value.length; i++) {
        obj = this.columnSelectListValue.find(function (item) {
          return item.normId === value[i]
        })
        this.dataValueName.push(obj.normName)
      }
      if (this.dataForm.chartType === 0) {
        for (let i = 0; i < this.dataValueName.length; i++) {
          let data = []
          for (let j = 0; j < 7; j++) {
            data.push(this.random(10, 200))
          }
          this.seriesData.push({
            name: this.dataValueName[i],
            data: data,
            type: 'bar'
          })
        }
        echartsOptionBar.series = this.seriesData
        echartsOptionBar.legend.data = this.dataValueName
        chartObj.clear()
        chartObj.setOption(echartsOptionBar)
      } else if (this.dataForm.chartType === 2) {
        for (let i = 0; i < this.dataValueName.length; i++) {
          let data = []
          for (let j = 0; j < 7; j++) {
            data.push(this.random(10, 200))
          }
          this.seriesData.push({
            name: this.dataValueName[i],
            data: data,
            type: 'line'
          })
        }
        echartsOptionLine.series = this.seriesData
        echartsOptionLine.legend.data = this.dataValueName
        chartObj.clear()
        chartObj.setOption(echartsOptionLine)
      } else {
        for (let i = 0; i < this.dataValueName.length; i++) {
          let data = []
          for (let j = 0; j < 7; j++) {
            data.push(this.random(10, 200))
          }
          this.seriesData.push({
            name: this.dataValueName[i],
            data: data,
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            }
          })
        }
        echartsOptionBars.series = this.seriesData
        echartsOptionBars.legend.data = this.dataValueName
        chartObj.clear()
        chartObj.setOption(echartsOptionBars)
      }
    },
    singleDataValueChange () {
      if (this.dataForm.singleDataValue === 1) {
        let data = []
        for (let i = 0; i < 7; i++) {
          data.push({
            value: this.random(10, 200),
            name: '数据' + (i + 1)
          })
        }
        echartsOptionPie.series[0].data = data
        chartObj.setOption(echartsOptionPie)
      }
    },
    maxValueChange () {
      if (this.dataForm.chartType === 0) {
        echartsOptionBar.yAxis.max = this.dataForm.maxValue
        chartObj.setOption(echartsOptionBar)
      } else if (this.dataForm.chartType === 1) {
      } else if (this.dataForm.chartType === 2) {
        echartsOptionLine.yAxis.max = this.dataForm.maxValue
        chartObj.setOption(echartsOptionLine)
      } else if (this.dataForm.chartType === 3) {
        echartsOptionBars.yAxis.max = this.dataForm.maxValue
        chartObj.setOption(echartsOptionBars)
      }
    },
    minValueChange () {
      if (this.dataForm.chartType === 0) {
        echartsOptionBar.yAxis.min = this.dataForm.minValue
        chartObj.setOption(echartsOptionBar)
      } else if (this.dataForm.chartType === 1) {
      } else if (this.dataForm.chartType === 2) {
        echartsOptionLine.yAxis.min = this.dataForm.minValue
        chartObj.setOption(echartsOptionLine)
      } else if (this.dataForm.chartType === 3) {
        echartsOptionBars.yAxis.min = this.dataForm.minValue
        chartObj.setOption(echartsOptionBars)
      }
    },
    isShowChange () {
      if (this.dataForm.chartType === 0) {
        echartsOptionBar.yAxis.show = this.dataForm.isShow
        chartObj.setOption(echartsOptionBar)
      } else if (this.dataForm.chartType === 1) {
      } else if (this.dataForm.chartType === 2) {
        echartsOptionLine.yAxis.show = this.dataForm.isShow
        chartObj.setOption(echartsOptionLine)
      } else if (this.dataForm.chartType === 3) {
        echartsOptionBars.yAxis.show = this.dataForm.isShow
        chartObj.setOption(echartsOptionBars)
      }
    },
    initDialog () {
      if (this.columnButtonGroupValue.length === 0) {
        this.$alert('请先选择报表数据列再进行图表设置', '提示', {
          confirmButtonText: '关闭'
        })
      } else {
        if (this.columnSelectListLegend.length !== 0 && this.columnSelectListValue.length !== 0) {
          this.visible = true
          this.activeNames = ['1', '2', '3']
          this.disabled = false
          this.multipleChoice = true
          this.singleChoice = false
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
          this.createdEchartsOption()
          this.createdEcharts(0)
        } else {
          if (this.columnSelectListLegend.length === 0) {
            this.$alert('您选择的报表数据列无法做为图表设置的图例', '提示', {
              confirmButtonText: '关闭'
            })
          } else {
            this.$alert('您选择的报表数据列无法做为图表设置的数据值', '提示', {
              confirmButtonText: '关闭'
            })
          }
        }
      }
    },
    updateDialog (data) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm = { ...this.dataForm, ...data }
        if (this.dataForm.chartType !== 1) {
          this.dataForm.isShow = !!this.dataForm.isShow
        }
        this.createdEchartsOption()
        this.createdEcharts(1)
      })
    },
    cancelHandle () {
      Object.assign(this.$data.dataForm, this.$options.data().dataForm)
      this.visible = false
    },
    commitHandle () {
      if (this.dataForm.chartType === 1) {
        this.dataForm.multipleDataValue = [0]
      } else {
        this.dataForm.singleDataValue = '0'
      }
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        if (this.dataForm.UUID === '') {
          this.dataForm.UUID = this.guid2()
        }
        this.$emit('watchEchartsData', {
          ...this.dataForm
        })
      })
    },
    random (min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    },
    createdEchartsOption () {
      echartsOptionBar = {
        color: this.echartsColor,
        title: {
          text: '',
          left: 'center'
        },
        legend: {
          data: ['默认'],
          bottom: 'bottom'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value',
          show: true,
          max: 'dataMax',
          min: 'dataMin',
          axisLine: {
            show: true,
            onZero: false
          }
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }
        ]
      }
      echartsOptionPie = {
        color: this.echartsColor,
        title: {
          text: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '8%',
          left: 'center'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '数据1' },
              { value: 735, name: '数据2' },
              { value: 580, name: '数据3' },
              { value: 484, name: '数据4' },
              { value: 300, name: '数据5' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      echartsOptionLine = {
        color: this.echartsColor,
        title: {
          text: '',
          left: 'center'
        },
        legend: {
          data: ['默认'],
          bottom: 'bottom'
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value',
          show: true,
          max: 'dataMax',
          min: 'dataMin',
          axisLine: {
            show: true,
            onZero: false
          }
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      }
      echartsOptionBars = {
        color: this.echartsColor,
        title: {
          text: '',
          left: 'center'
        },
        legend: {
          data: ['Direct', 'Mail Ad'],
          bottom: 'bottom'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['数据1', '数据2', '数据3', '数据4', '数据5', '数据6', '数据7']
        },
        yAxis: {
          type: 'value',
          show: true,
          max: 'dataMax',
          min: 'dataMin',
          axisLine: {
            show: true,
            onZero: false
          }
        },
        series: [
          {
            name: 'Direct',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: 'Mail Ad',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          }
        ]
      }
    },
    createdEcharts (type) {
      this.$nextTick(() => {
        chartObj = echarts.init(this.$refs.echartsValue)
        chartObj.clear()
        chartObj.showLoading()
        if (this.dataForm.chartType === 0) {
          chartObj.setOption(echartsOptionBar)
        } else if (this.dataForm.chartType === 1) {
          chartObj.setOption(echartsOptionPie)
        } else if (this.dataForm.chartType === 2) {
          chartObj.setOption(echartsOptionLine)
        } else {
          chartObj.setOption(echartsOptionBars)
        }
        chartObj.hideLoading()
        if (type === 1) {
          this.chartNameChange()
          this.legendChange()
          if (this.dataForm.chartType === 1) {
            this.activeNames = ['1', '2']
            this.disabled = true
            this.multipleChoice = false
            this.singleChoice = true
            this.singleDataValueChange()
          } else {
            this.activeNames = ['1', '2', '3']
            this.disabled = false
            this.multipleChoice = true
            this.singleChoice = false
            this.multipleDataValueChange()
            if (this.dataForm.maxValue) {
              this.maxValueChange()
            }
            if (this.dataForm.minValue) {
              this.minValueChange()
            }
            this.isShowChange()
          }
        }
      })
    },
    guid2 () {
      return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4())
    },
    S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
  }
}
</script>
<style lang="scss">
.ctc-echarts-group {
  .el-dialog {
    box-shadow: 0px 0px 25px rgba($color: #000000, $alpha: 0.3);
    .el-form-item__label {
      width: 120px !important;
    }
    .el-form-item__content {
      margin-left: 120px !important;
    }
    .el-collapse-item {
      .el-collapse-item__content {
        padding-bottom: 0px;
        .el-form-item {
          margin-bottom: 15px !important;
          .el-form-item__label {
            width: 100px !important;
          }
          .el-form-item__content {
            margin-left: 100px !important;
          }
        }
      }
    }
  }
  .el-dialog__body {
    padding: 0px 20px 30px;
  }
  .el-checkbox-button {
    margin-top: 15px;
    margin-left: 15px;
  }
  .el-checkbox-button__inner {
    border-radius: 0 !important;
    width: auto;
    padding: 12px 10px;
    text-align: center;
    font-size: 13px;
    border: 1px solid #DCDFE6;
  }
  .el-select__tags {
    padding: 5px;
  }
}
</style>
