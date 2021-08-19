<template>
  <div class="ctc-echarts-group">
    <el-dialog :visible.sync="visible" @close="cancelHandle" width="75%" :modal="false" :title="normName" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-col :span="24">
          <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="120px">
            <el-row>
              <el-col :span="12" v-if="showProjectType">
                <el-form-item label="子项目类型">
                  <el-select v-model="dataForm.subProjectType" placeholder="请选择">
                    <el-option v-for="data in subProjectTypeListNew" :key="data.dictValue||data.code" :label="data.dictLabel||data.state" :value="data.dictValue||data.code">{{data.dictLabel||data.state}}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" style="text-align:right;" v-if="showProjectType">
                <el-button type="primary" size="small" @click="createdEcharts()">查询</el-button>
                <el-button size="small" @click="resetForm()">重置</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="24">
          <div v-if="noData" style="height: 500px;width: 100%;text-align: center;line-height: 20;">
            暂无数据
          </div>
          <div v-if="!noData" style="height: 500px;width: 100%;font-size: 16px;">
            <div ref="echartsValue" style="height: 500px;width: 100%;"></div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getDictDataList } from '@/utils'
const echarts = require('echarts')
var chartObj = ''
var echartsOption = ''
var markLineData = []
export default {
  name: 'echartSee',
  data () {
    return {
      dataForm: {
        subProjectType: ''
      },
      visible: false,
      noData: false,
      normName: '',
      projectId: '',
      caseIdList: '',
      lengedLength: '',
      organizeId: '',
      statisticalDimension: '',
      showProjectType: false,
      subProjectTypeList: getDictDataList('project.subProjectType'),
      subProjectTypeListNew: [],
      echartsColor: ['#2EC7C9', '#B6A2DE', '#5AB1EF', '#FFB980', '#D87A80', '#8D98B3', '#E5CF0D', '#97B552', '#95706D', '#DC69AA', '#88c9c5', '#cbc5de', '#1397ef', '#ffe2c9', '#d8aaab', '#5a6ab3', '#e3e563', '#a4b57d', '#955850', '#dc8bc0', '#12c9c9', '#8663de', '#4bbeef', '#ffdf9e', '#d8828a', '#8585b3', '#e4e58d', '#b2b5a9', '#958474', '#d493dc']
    }
  },
  props: {
  },
  watch: {
  },
  computed: {
  },
  created () {
  },
  methods: {
    initDialog () {
      this.visible = true
      if (this.statisticalDimension === '2' || this.statisticalDimension === '5') {
        this.showProjectType = false
      } else {
        this.getSubProjectType()
        this.showProjectType = true
      }
      this.createdEcharts()
    },
    getSubProjectType () {
      this.subProjectTypeListNew = []
      let params = {}
      params.projectId = this.projectId
      if (this.statisticalDimension !== '1') {
        params.organizeId = this.organizeId
      }
      this.$http.get('ctc/visualization/dataAnalysis/getSubProjectType', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < this.subProjectTypeList.length; j++) {
              if (this.subProjectTypeList[j].dictValue === res.data[i] || this.subProjectTypeList[j].code === res.data[i]) {
                this.subProjectTypeListNew.push({ dictLabel: this.subProjectTypeList[j].dictLabel, dictValue: this.subProjectTypeList[j].dictValue, code: this.subProjectTypeList[j].code, state: this.subProjectTypeList[j].state })
                break
              }
            }
          }
        }
      }).catch(() => {
      })
    },
    resetForm () {
      this.dataForm.subProjectType = ''
      this.createdEcharts()
    },
    createdEcharts () {
      this.noData = false
      echartsOption = ''
      let params = { ...this.dataForm }
      for (var val in params) {
        params[val] = params[val].toString()
      }
      params.projectId = this.projectId
      params.type = this.statisticalDimension
      if (this.statisticalDimension === '4' || this.statisticalDimension === '5') {
        params.organizeId = this.organizeId
      } else {
        delete params['organizeId']
      }
      this.$nextTick(() => {
        chartObj = echarts.init(this.$refs.echartsValue)
        chartObj.clear()
        chartObj.showLoading()
        if (this.normName === '子项目通过率') {
          this.$http.get('/ctc/visualization/dataAnalysis/getSonProjectPassPercent', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              if (res.data.projectArray.length === 0 && res.data.firstPassCase.length === 0 && res.data.currentPassCase.length === 0 && res.data.finallyPassCase.length === 0) {
                this.noData = true
              } else {
                this.noData = false
                echartsOption = {
                  color: this.echartsColor,
                  legend: {
                    data: ['初测通过率', '当前通过率', '最终通过率'],
                    bottom: '0%',
                    selectedMode: false
                  },
                  tooltip: {
                    trigger: 'axis',
                    formatter: function (param) {
                      let one = '&nbsp;'
                      let four = '&nbsp;&nbsp;&nbsp;&nbsp;'
                      let tooltipHtml = param[0].axisValueLabel + '<br/>'
                      for (let i = 0; i < param.length; i++) {
                        if (param.length - 1 === i) {
                          tooltipHtml += (four + param[i].marker + param[i].seriesName + one + ':' + four + (param[i].value === '-0.00' ? '申请免测' : (param[i].value === '+0.00' ? '-' : param[i].value + '%')))
                        } else {
                          tooltipHtml += (four + param[i].marker + param[i].seriesName + one + ':' + four + (param[i].value === '-0.00' ? '申请免测' : (param[i].value === '+0.00' ? '-' : param[i].value + '%')) + '<br/>')
                        }
                      }
                      return tooltipHtml
                    }
                  },
                  xAxis: {
                    type: 'category',
                    data: res.data.projectArray,
                    axisLabel: {
                      interval: 0,
                      rotate: -40
                    }
                  },
                  yAxis: {
                    type: 'value',
                    axisLabel: {
                      formatter: '{value}%'
                    },
                    axisLine: {
                      show: true,
                      onZero: false
                    }
                  },
                  grid: {
                    bottom: '30%'
                  },
                  dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                  }, {
                    start: 0,
                    end: 100,
                    bottom: '10%',
                    showDetail: false
                  }],
                  series: [
                    {
                      name: '初测通过率',
                      type: 'line',
                      data: res.data.firstPassCase
                    },
                    {
                      name: '当前通过率',
                      type: 'line',
                      data: res.data.currentPassCase
                    },
                    {
                      name: '最终通过率',
                      type: 'line',
                      data: res.data.finallyPassCase
                    }
                  ]
                }
                chartObj.setOption(echartsOption)
                chartObj.hideLoading()
              }
            }
          }).catch(() => {
          })
        } else if (this.normName === '省侧通过率') {
          this.$http.get('/ctc/visualization/dataAnalysis/getProvinceProjectPassPercent', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              if (res.data.provinceArray.length === 0 && res.data.firstPassCase.length === 0 && res.data.currentPassCase.length === 0 && res.data.finallyPassCase.length === 0) {
                this.noData = true
              } else {
                this.noData = false
                echartsOption = {
                  color: this.echartsColor,
                  legend: {
                    data: ['初测通过率', '当前通过率', '最终通过率'],
                    top: 'top',
                    selectedMode: false
                  },
                  tooltip: {
                    trigger: 'axis',
                    formatter: function (param) {
                      let one = '&nbsp;'
                      let four = '&nbsp;&nbsp;&nbsp;&nbsp;'
                      let tooltipHtml = param[0].axisValueLabel + '<br/>'
                      for (let i = 0; i < param.length; i++) {
                        if (param.length - 1 === i) {
                          tooltipHtml += (four + param[i].marker + param[i].seriesName + one + ':' + four + (param[i].value === '-0.00' ? '申请免测' : (param[i].value === '+0.00' ? '-' : param[i].value + '%')))
                        } else {
                          tooltipHtml += (four + param[i].marker + param[i].seriesName + one + ':' + four + (param[i].value === '-0.00' ? '申请免测' : (param[i].value === '+0.00' ? '-' : param[i].value + '%')) + '<br/>')
                        }
                      }
                      return tooltipHtml
                    }
                  },
                  grid: {
                    bottom: '25%'
                  },
                  xAxis: {
                    type: 'category',
                    data: res.data.provinceArray,
                    axisLabel: {
                      interval: 0,
                      rotate: -45
                    }
                  },
                  yAxis: {
                    type: 'value',
                    axisLabel: {
                      formatter: '{value}%'
                    },
                    axisLine: {
                      show: true,
                      onZero: false
                    }
                  },
                  dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                  }, {
                    start: 0,
                    end: 100,
                    showDetail: false
                  }],
                  series: [
                    {
                      name: '初测通过率',
                      type: 'bar',
                      data: res.data.firstPassCase
                    },
                    {
                      name: '当前通过率',
                      type: 'bar',
                      data: res.data.currentPassCase
                    },
                    {
                      name: '最终通过率',
                      type: 'bar',
                      data: res.data.finallyPassCase
                    }
                  ]
                }
                chartObj.setOption(echartsOption)
                chartObj.hideLoading()
              }
            }
          }).catch(() => {
          })
        } else if (this.normName === '问题类型占比') {
          this.$http.get('/ctc/visualization/dataAnalysis/getQuestionDetail', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              if (res.data.firstLeaveQuestion.length === 0) {
                this.noData = true
              } else {
                this.noData = false
                let legendData = []
                let firstLeaveQuestion = res.data.firstLeaveQuestion
                let bigSeriesData = []
                for (let i = 0; i < firstLeaveQuestion.length; i++) {
                  legendData.push(firstLeaveQuestion[i].name)
                  bigSeriesData.push({ dictValue: firstLeaveQuestion[i].dictValue, value: firstLeaveQuestion[i].value, name: firstLeaveQuestion[i].name })
                }
                this.lengedLength = legendData.length
                echartsOption = {
                  color: this.echartsColor,
                  tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}个 占比{d}%'
                  },
                  legend: {
                    data: legendData,
                    top: '5%',
                    selectedMode: false,
                    padding: [
                      5,
                      10,
                      5,
                      150
                    ],
                    type: 'scroll'
                  },
                  series: [
                    {
                      type: 'pie',
                      radius: 100,
                      top: '10%',
                      label: {
                        formatter: '  {b|{b}：}{c|{c}个} \r\n {p|占比{d}%}  ',
                        backgroundColor: '#666',
                        borderColor: '#fff',
                        borderWidth: 1,
                        borderRadius: 4,
                        rich: {
                          b: {
                            color: '#fff',
                            fontSize: 12,
                            lineHeight: 33
                          },
                          c: {
                            color: '#fff',
                            fontSize: 12
                          },
                          p: {
                            color: '#fff',
                            padding: [3, 4]
                          }
                        }
                      },
                      data: bigSeriesData
                    }
                  ]
                }
                this.caseIdList = res.data.caseIdList
                chartObj.on('click', this.getSmallSeriesData)
                chartObj.setOption(echartsOption)
                chartObj.hideLoading()
              }
            }
          }).catch(() => {
          })
        } else if (this.normName === '厂商占比') {
          this.$http.get('/ctc/visualization/dataAnalysis/getFactoryPercent', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              if (res.data.smallPieChart.length === 0 && res.data.bigPieChart.length === 0) {
                this.noData = true
              } else {
                this.noData = false
                if (res.data.smallPieChart.length > 0) {
                  markLineData = []
                  let source = [
                    ['product', '1', '2']
                  ]
                  let bigPieChart = res.data.bigPieChart
                  for (let i = 0; i < bigPieChart.length; i++) {
                    source.push([bigPieChart[i].name, bigPieChart[i].value])
                  }
                  let smallPieChart = res.data.smallPieChart
                  let min
                  for (var i = 0; i < smallPieChart.length; i++) {
                    for (var j = i; j < smallPieChart.length; j++) {
                      if (Number(smallPieChart[i].value) > Number(smallPieChart[j].value)) {
                        min = smallPieChart[j].value
                        smallPieChart[j].value = smallPieChart[i].value
                        smallPieChart[i].value = min
                      }
                    }
                  }
                  for (let i = 0; i < smallPieChart.length; i++) {
                    source.push([smallPieChart[i].name, smallPieChart[i].value])
                  }
                  // 添加“其他”
                  this.addOtherData(source, smallPieChart.length)
                  echartsOption = {
                    color: this.echartsColor,
                    legend: {
                      selectedMode: false,
                      padding: [
                        5,
                        10,
                        5,
                        150
                      ],
                      type: 'scroll'
                    },
                    tooltip: {
                      trigger: 'item',
                      formatter: function (param) {
                        if (param.componentType === 'series') {
                          if (param.data.length === 2) {
                            return param.data[0] + ': ' + param.data[1] + ' (' + param.percent + '%)'
                          } else {
                            return param.data[0] + '(' + (param.data[3] ? ((param.data[2] / param.data[3]) * 100).toFixed(2) : 100) + '%)'
                          }
                        } else {
                          return ''
                        }
                      }
                    },
                    dataset: {
                      source: source
                    },
                    series: [
                      {
                        type: 'pie',
                        radius: '50%',
                        center: ['25%', '50%'],
                        label: {
                          show: true,
                          formatter: function (param) {
                            return param.data[0] + '(' + param.percent + '%)'
                          }
                        },
                        startAngle: 45,
                        clockwise: false,
                        markLine: {
                          lineStyle: {
                            type: 'solid',
                            color: '#BFBFBF'
                          },
                          symbol: 'none',
                          data: markLineData
                        }
                      },
                      {
                        type: 'pie',
                        radius: '40%',
                        center: ['75%', '50%'],
                        startAngle: 90.001,
                        encode: {
                          itemName: 'product',
                          value: '2'
                        },
                        label: {
                          show: true,
                          formatter: function (param) {
                            return param.data[0] + '(' + (param.data[3] ? ((param.data[2] / param.data[3]) * 100).toFixed(2) : 100) + '%)'
                          }
                        }
                      }
                    ]
                  }
                } else {
                  let legendData = []
                  let bigPieChart = res.data.bigPieChart
                  let seriesData = []
                  for (let i = 0; i < bigPieChart.length; i++) {
                    legendData.push(bigPieChart[i].name)
                    seriesData.push({ value: bigPieChart[i].value, name: bigPieChart[i].name })
                  }
                  echartsOption = {
                    color: this.echartsColor,
                    tooltip: {
                      trigger: 'item',
                      formatter: function (param) {
                        return param.data.name + ': ' + param.data.value + '(' + param.percent + '%)'
                      }
                    },
                    legend: {
                      data: legendData,
                      top: '5%',
                      selectedMode: false
                    },
                    series: [
                      {
                        type: 'pie',
                        radius: '50%',
                        data: seriesData,
                        label: {
                          formatter: function (param) {
                            return param.data.name + ': ' + param.data.value + '(' + param.percent + '%)'
                          }
                        }
                      }
                    ]
                  }
                }
                chartObj.setOption(echartsOption)
                chartObj.hideLoading()
              }
            }
          }).catch(() => {
          })
        } else if (this.normName === '厂商执行用例') {
          this.$http.get('/ctc/visualization/dataAnalysis/getFactoryExectCase', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              if (res.data.companyNameList.length === 0 && res.data.projectNameList.length === 0) {
                this.noData = true
              } else {
                this.noData = false
                let series = []
                let projectNameList = res.data.projectNameList
                for (let i = 0; i < projectNameList.length; i++) {
                  series.push({ name: projectNameList[i], type: 'bar', stack: 'total', label: { show: true }, emphasis: { focus: 'series' }, data: res.data[projectNameList[i]] })
                }
                echartsOption = {
                  color: this.echartsColor,
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'shadow'
                    }
                  },
                  legend: {
                    data: projectNameList,
                    bottom: '0%',
                    selectedMode: false,
                    padding: [
                      5,
                      10,
                      5,
                      150
                    ],
                    type: 'scroll'
                  },
                  grid: {
                    left: '8%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'value',
                    axisLine: {
                      show: true,
                      onZero: false
                    }
                  },
                  yAxis: {
                    type: 'category',
                    data: res.data.companyNameList,
                    axisLabel: {
                      interval: 0,
                      rotate: 45
                    }
                  },
                  dataZoom: [{
                    type: 'inside',
                    yAxisIndex: 0,
                    start: 0,
                    end: 100
                  }, {
                    yAxisIndex: 0,
                    start: 0,
                    end: 100,
                    showDetail: false
                  }],
                  series: series
                }
                chartObj.setOption(echartsOption)
                chartObj.hideLoading()
              }
            }
          }).catch(() => {
          })
        } else if (this.normName === '厂商通过率') {
          this.$http.get('/ctc/visualization/dataAnalysis/getFactoryPassPercent', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              if (res.data.companyNameList.length === 0 && res.data.passPercent.length === 0) {
                this.noData = true
              } else {
                this.noData = false
                echartsOption = {
                  color: this.echartsColor,
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'shadow'
                    },
                    formatter: function (param) {
                      let two = '&nbsp;&nbsp;'
                      return param[0].axisValueLabel + '<br/>' + param[0].marker + two + param[0].value + '%'
                    }
                  },
                  grid: {
                    bottom: '25%'
                  },
                  xAxis: {
                    type: 'category',
                    data: res.data.companyNameList,
                    axisLabel: {
                      interval: 0,
                      rotate: -45
                    }
                  },
                  yAxis: {
                    type: 'value',
                    axisLabel: {
                      formatter: '{value}%'
                    },
                    axisLine: {
                      show: true,
                      onZero: false
                    }
                  },
                  dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                  }, {
                    start: 0,
                    end: 100,
                    showDetail: false
                  }],
                  series: [
                    {
                      type: 'bar',
                      data: res.data.passPercent,
                      label: {
                        show: true,
                        formatter: '{c}%'
                      }
                    }
                  ]
                }
                chartObj.setOption(echartsOption)
                chartObj.hideLoading()
              }
            }
          }).catch(() => {
          })
        } else if (this.normName === '跨厂商建设省份数') {
          this.$http.get('/ctc/visualization/dataAnalysis/getAcrossFactory', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              if (this.statisticalDimension === '1') {
                if (res.data.acrossNums.length === 0 && res.data.projectNameList.length === 0) {
                  this.noData = true
                } else {
                  this.noData = false
                  let series = []
                  let acrossNums = res.data.acrossNums
                  for (let i = 0; i < acrossNums.length; i++) {
                    series.push({ name: acrossNums[i], type: 'bar', stack: 'total', label: { show: true }, emphasis: { focus: 'series' }, data: res.data[acrossNums[i]] })
                  }
                  echartsOption = {
                    color: this.echartsColor,
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'shadow'
                      }
                    },
                    legend: {
                      data: acrossNums,
                      bottom: '0%',
                      selectedMode: false
                    },
                    grid: {
                      left: '5%',
                      right: '4%',
                      bottom: '10%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'value',
                      axisLine: {
                        show: true,
                        onZero: false
                      }
                    },
                    yAxis: {
                      type: 'category',
                      data: res.data.projectNameList,
                      axisLabel: {
                        interval: 0,
                        rotate: 45,
                        margin: 15,
                        formatter: function (value) {
                          var ret = ''
                          var maxLength = 10
                          var valLength = value.length
                          var rowN = Math.ceil(valLength / maxLength)
                          if (rowN > 1) {
                            for (var i = 0; i < rowN; i++) {
                              var temp = ''
                              var start = i * maxLength
                              var end = start + maxLength
                              temp = value.substring(start, end) + '\n'
                              ret += temp
                            }
                            return ret
                          } else {
                            return value
                          }
                        }
                      }
                    },
                    dataZoom: [{
                      type: 'inside',
                      yAxisIndex: 0,
                      start: 0,
                      end: 100
                    }, {
                      yAxisIndex: 0,
                      start: 0,
                      end: 100,
                      showDetail: false
                    }],
                    series: series
                  }
                }
              } else {
                if (JSON.stringify(res.data) === '{}') {
                  this.noData = true
                } else {
                  this.noData = false
                  let acrossNums = res.data.acrossNums
                  let acrossValue = res.data.acrossValue
                  echartsOption = {
                    color: this.echartsColor,
                    tooltip: {
                      trigger: 'axis',
                      axisPointer: {
                        type: 'shadow'
                      }
                    },
                    grid: {
                      left: '5%',
                      right: '4%',
                      bottom: '10%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'value',
                      axisLine: {
                        show: true,
                        onZero: false
                      }
                    },
                    yAxis: {
                      type: 'category',
                      data: acrossNums,
                      axisLabel: {
                        interval: 0,
                        rotate: 45,
                        margin: 15,
                        formatter: function (value) {
                          var ret = ''
                          var maxLength = 10
                          var valLength = value.length
                          var rowN = Math.ceil(valLength / maxLength)
                          if (rowN > 1) {
                            for (var i = 0; i < rowN; i++) {
                              var temp = ''
                              var start = i * maxLength
                              var end = start + maxLength
                              temp = value.substring(start, end) + '\n'
                              ret += temp
                            }
                            return ret
                          } else {
                            return value
                          }
                        }
                      }
                    },
                    dataZoom: [{
                      type: 'inside',
                      yAxisIndex: 0,
                      start: 0,
                      end: 100
                    }, {
                      yAxisIndex: 0,
                      start: 0,
                      end: 100,
                      showDetail: false
                    }],
                    series: [{
                      type: 'bar',
                      data: acrossValue
                    }]
                  }
                }
              }
              chartObj.setOption(echartsOption)
              chartObj.hideLoading()
            }
          }).catch(() => {
          })
        } else if (this.normName === '子项目参测厂商数') {
          this.$http.get('/ctc/visualization/dataAnalysis/getSubProjectFactory', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              if (res.data.projectCompanys.length === 0 && res.data.projectNames.length === 0) {
                this.noData = true
              } else {
                this.noData = false
                echartsOption = {
                  color: this.echartsColor,
                  grid: {
                    left: '5%',
                    right: '6%',
                    bottom: '10%',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'value',
                    axisLine: {
                      show: true,
                      onZero: false
                    }
                  },
                  yAxis: {
                    type: 'category',
                    data: res.data.projectNames,
                    axisLabel: {
                      interval: 0,
                      rotate: 45,
                      margin: 15,
                      formatter: function (value) {
                        var ret = ''
                        var maxLength = 10
                        var valLength = value.length
                        var rowN = Math.ceil(valLength / maxLength)
                        if (rowN > 1) {
                          for (var i = 0; i < rowN; i++) {
                            var temp = ''
                            var start = i * maxLength
                            var end = start + maxLength
                            temp = value.substring(start, end) + '\n'
                            ret += temp
                          }
                          return ret
                        } else {
                          return value
                        }
                      }
                    }
                  },
                  dataZoom: [{
                    type: 'inside',
                    yAxisIndex: 0,
                    start: 0,
                    end: 100
                  }, {
                    yAxisIndex: 0,
                    start: 0,
                    end: 100,
                    showDetail: false
                  }],
                  series: [
                    {
                      type: 'bar',
                      data: res.data.projectCompanys,
                      label: {
                        show: true
                      }
                    }
                  ]
                }
                chartObj.setOption(echartsOption)
                chartObj.hideLoading()
              }
            }
          }).catch(() => {
          })
        } else if (this.normName === '省份参测厂商数') {
          this.$http.get('/ctc/visualization/dataAnalysis/getOrganizeFactory', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              if (res.data.provinceList.length === 0 && res.data.provinceCompanys.length === 0) {
                this.noData = true
              } else {
                this.noData = false
                echartsOption = {
                  color: this.echartsColor,
                  xAxis: {
                    type: 'category',
                    data: res.data.provinceList,
                    axisLabel: {
                      interval: 0,
                      rotate: -45
                    }
                  },
                  yAxis: {
                    type: 'value',
                    axisLine: {
                      show: true,
                      onZero: false
                    }
                  },
                  grid: {
                    bottom: '25%'
                  },
                  dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 100
                  }, {
                    start: 0,
                    end: 100,
                    showDetail: false
                  }],
                  series: [
                    {
                      type: 'bar',
                      data: res.data.provinceCompanys,
                      label: {
                        show: true
                      }
                    }
                  ]
                }
                chartObj.setOption(echartsOption)
                chartObj.hideLoading()
              }
            }
          }).catch(() => {
          })
        } else if (this.normName === '中台服务占比') {
          this.$http.get('/ctc/visualization/dataAnalysis/getNakadaiServicePercent', { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              if (res.data.nakadaiServiceTotal.length === 0 && res.data.nakadaiServicePercent.length === 0 && res.data.nakadaiServiceType.length === 0 && res.data.testServicePercent.length === 0 && res.data.testServiceTotal.length === 0) {
                this.noData = true
              } else {
                this.noData = false
                echartsOption = {
                  color: this.echartsColor,
                  title: [
                    {
                      text: '中台服务数',
                      left: '23%'
                    },
                    {
                      text: '中台服务占比',
                      right: '21%'
                    }
                  ],
                  legend: [
                    {
                      data: ['中台服务总数', '参测服务数'],
                      top: '10%',
                      left: '18%',
                      selectedMode: false
                    },
                    {
                      data: ['中台服务总数占比', '参测服务数占比'],
                      top: '10%',
                      right: '13%',
                      selectedMode: false
                    }
                  ],
                  tooltip: {},
                  xAxis: [
                    { type: 'category', gridIndex: 0, data: res.data.nakadaiServiceType },
                    { type: 'category', gridIndex: 1, data: res.data.nakadaiServiceType }
                  ],
                  yAxis: [
                    { gridIndex: 0, axisLine: { show: true, onZero: false } },
                    { gridIndex: 1, type: 'value', axisLabel: { formatter: '{value}%' }, axisLine: { show: true, onZero: false } }
                  ],
                  grid: [
                    { right: '55%', top: '20%' },
                    { left: '55%', top: '20%' }
                  ],
                  series: [{
                    name: '中台服务总数',
                    data: res.data.nakadaiServiceTotal,
                    type: 'bar',
                    label: {
                      show: true
                    }
                  },
                  {
                    name: '参测服务数',
                    data: res.data.testServiceTotal,
                    type: 'bar',
                    label: {
                      show: true
                    }
                  },
                  {
                    name: '中台服务总数占比',
                    data: res.data.nakadaiServicePercent,
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    label: {
                      show: true,
                      formatter: '{c}%'
                    }
                  },
                  {
                    name: '参测服务数占比',
                    data: res.data.testServicePercent,
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    label: {
                      show: true,
                      formatter: '{c}%'
                    }
                  }]
                }
                chartObj.setOption(echartsOption)
                chartObj.hideLoading()
              }
            }
          }).catch(() => {
          })
        }
      })
    },
    getSmallSeriesData (param) {
      if (param.componentIndex === 0) {
        let params = { 'dictValue': param.data.dictValue, 'caseIdList': this.caseIdList }
        this.$http.post('/ctc/visualization/dataAnalysis/getQuestionDetailOfSecond', params).then(({ data: res }) => {
          echartsOption.legend.data.splice(this.lengedLength, echartsOption.legend.length)
          echartsOption.series.splice(1, 1)
          if (res.data.secondLeaveQuestion.length > 0) {
            echartsOption.series[0].center = ['25%', '50%']
            let secondLeaveQuestion = res.data.secondLeaveQuestion
            let smallSeriesData = []
            for (let i = 0; i < secondLeaveQuestion.length; i++) {
              echartsOption.legend.data.push(secondLeaveQuestion[i].name)
              smallSeriesData.push({ value: secondLeaveQuestion[i].value, name: secondLeaveQuestion[i].name })
            }
            echartsOption.series.push({ type: 'pie', radius: 70, center: ['75%', '50%'], top: '10%', label: { formatter: '  {b|{b}：}{c|{c}个} \r\n {p|占比{d}%}  ', backgroundColor: '#666', borderColor: '#fff', borderWidth: 1, borderRadius: 4, rich: { b: { color: '#fff', fontSize: 12, lineHeight: 33 }, c: { color: '#fff', fontSize: 12 }, p: { color: '#fff', padding: [3, 4] } } }, data: smallSeriesData })
          } else {
            delete echartsOption.series[0]['center']
          }
          chartObj.setOption(echartsOption, true)
        }).catch(() => {
        })
      }
    },
    getMarkLineData (percent) {
      // 1.获取画布 width,height
      let height = chartObj.getHeight()
      let width = chartObj.getWidth()
      // 2.  根据 series[0].center 获取圆心坐标
      let x0 = width * 0.25 // 圆心x轴坐标
      // 3.圆边上点坐标
      // let x1   =   x0   +   r   *   cos(ao   *   3.14   /180   )
      // let y1   =   y0   +   r   *   sin(ao   *   3.14   /180   )
      // “其他” 终点坐标series[0].startAngle 45
      let x1 = x0 + (height / 4) * Math.cos(45 * 3.14 / 180)
      let y1 = (height * 0.5) - (height / 4) * Math.sin(45 * 3.14 / 180)
      let ao = 360 * (percent / 100) // 扇形角度
      let ao1 = (ao === 360 ? 270 : ((ao <= 45) ? (45 - ao) : (360 - (ao - 45)))) // 用来计算的坐标角度
      if (ao1 < 270 && ao1 > 45) ao1 = 270 // 角度当270用，要不样式不好看
      let x2 = 0
      let y2 = 0
      x2 = x0 + (height / 4) * Math.cos(ao1 * 3.14 / 180)
      y2 = (height * 0.5) - (height / 4) * Math.sin(ao1 * 3.14 / 180)
      return [ [ { x: x1, y: y1 }, { x: '75%', y: '30%' } ], [ { x: x2, y: y2 }, { x: '75%', y: '70%' } ] ]
    },
    addOtherData (datasetSource, len) {
      let percent = 0
      let sum = 0 // 总计
      datasetSource.forEach((data, rowIndex) => {
        if (rowIndex > 0) { // 第一行数据不算
          let count = 0
          for (let key of data) {
            let value = isNaN(key) ? 0 : Number(key)
            if (count === 1) sum += value
            count++
          }
        }
      })
      let endData = datasetSource.slice(datasetSource.length - len)
      let other = ['其他']
      for (let i = 0; i < endData.length; i++) {
        let j = 0
        for (let key of endData[i]) {
          let value = isNaN(key) ? 0 : Number(key)
          if (j)other[j] ? (other[j] += value) : other.push(value)
          j++
        }
        endData[i].splice(1, 0, '')
        endData[i].push(sum)
      }
      if (datasetSource.length - len === 1) {
        datasetSource.splice(1, 0, other)
      } else {
        datasetSource.push(other)
      }
      // "其他"占比
      percent = sum ? ((other[1] / sum) * 100).toFixed(2) : 100
      markLineData = this.getMarkLineData(percent)
    },
    cancelHandle () {
      this.dataForm.subProjectType = ''
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
}
</style>
