<template>
  <div class="chart-list" v-if="visible">
    <el-row>
      <el-col :span="24" style="margin-top:24px;">
        <el-card shadow="never" class="aui-card--fill">
          <el-row>
            <el-col :span="24">
              <span class="el-col el-col-24" style="margin-bottom: 20px;text-align: center;width: 100%;">图表效果展示</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-for="(chartData,index) in chartDataList" :key="chartData.chartName">
              <div :id="'chart' + index" style="margin-bottom: 20px;text-align: center;width: 100%;height: 600px;"></div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
const echarts = require('echarts')
export default {
  name: 'ChartList',
  props: {
  },
  data () {
    return {
      templateData: '',
      chartDataList: [],
      echartsColor: ['#2EC7C9', '#B6A2DE', '#5AB1EF', '#FFB980', '#D87A80', '#8D98B3', '#E5CF0D', '#97B552', '#95706D', '#DC69AA', '#88c9c5', '#cbc5de', '#1397ef', '#ffe2c9', '#d8aaab', '#5a6ab3', '#e3e563', '#a4b57d', '#955850', '#dc8bc0', '#12c9c9', '#8663de', '#4bbeef', '#ffdf9e', '#d8828a', '#8585b3', '#e4e58d', '#b2b5a9', '#958474', '#d493dc'],
      chartObjs: [],
      visible: false
    }
  },
  watch: {
    templateData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.getChartDataList({})
      }
    }
  },
  computed: {
  },
  mounted () {
  },
  activated () {
  },
  methods: {
    getChartDataList (params) {
      params.templateId = this.templateData.templateId
      this.chartObjs = []
      this.$http.get('/ctc/visualization/chartStatistics/getChartStatisticsList', { params: params }, { emulateJSON: true }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.chartDataList = res.data
        if (this.chartDataList.length > 0) {
          this.visible = true
        } else {
          this.visible = false
        }
        this.$nextTick(() => {
          for (let i = 0; i < this.chartDataList.length; i++) {
            let chartObj = echarts.init(document.getElementById('chart' + i))
            chartObj.showLoading()
            let chartType = this.chartDataList[i].chartType
            let chartName = this.chartDataList[i].chartName
            let maxValue = this.chartDataList[i].maxValue ? this.chartDataList[i].maxValue : 0
            let minValue = this.chartDataList[i].minValue ? this.chartDataList[i].minValue : 0
            let isShow = !!this.chartDataList[i].isShow
            if (chartType === '0') {
              let series = []
              let legendNameArray = this.chartDataList[i].legendNameArray
              let yList = this.chartDataList[i].yList
              let xList = this.chartDataList[i].xList
              for (let j = 0; j < legendNameArray.length; j++) {
                series.push({ name: legendNameArray[j], type: 'bar', data: yList[j] })
              }
              let echartsOption = {
                color: this.echartsColor,
                title: {
                  text: chartName,
                  left: 'center'
                },
                toolbox: {
                  show: true,
                  feature: {
                    saveAsImage: {
                      title: '导出'
                    }
                  },
                  right: '8%'
                },
                grid: {
                  bottom: '8%',
                  containLabel: true
                },
                legend: {
                  data: legendNameArray,
                  bottom: '0%',
                  padding: [
                    5,
                    10,
                    5,
                    150
                  ],
                  type: 'scroll'
                },
                xAxis: {
                  type: 'category',
                  data: xList,
                  axisLabel: {
                    interval: 0,
                    rotate: -45,
                    margin: 30,
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
                yAxis: {
                  type: 'value',
                  show: isShow,
                  max: function (value) {
                    return maxValue > value.max ? maxValue : value.max
                  },
                  min: function (value) {
                    return minValue < value.min ? minValue : value.min
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
                  bottom: '10%',
                  showDetail: false
                }],
                series: series
              }
              chartObj.setOption(echartsOption)
              chartObj.hideLoading()
            } else if (chartType === '1') {
              let pieChartList = this.chartDataList[i].pieChartList
              let echartsOption = {
                color: this.echartsColor,
                title: {
                  text: chartName,
                  left: 'center'
                },
                toolbox: {
                  trigger: 'item',
                  show: true,
                  feature: {
                    saveAsImage: {
                      title: '导出'
                    }
                  },
                  right: '8%'
                },
                legend: {
                  top: '8%',
                  left: 'center'
                },
                series: [
                  {
                    type: 'pie',
                    radius: '50%',
                    data: pieChartList,
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
              chartObj.setOption(echartsOption)
              chartObj.hideLoading()
            } else if (chartType === '2') {
              let series = []
              let legendNameArray = this.chartDataList[i].legendNameArray
              let yList = this.chartDataList[i].yList
              let xList = this.chartDataList[i].xList
              for (let j = 0; j < legendNameArray.length; j++) {
                series.push({ name: legendNameArray[j], type: 'line', data: yList[j] })
              }
              let echartsOption = {
                color: this.echartsColor,
                title: {
                  text: chartName,
                  left: 'center'
                },
                toolbox: {
                  show: true,
                  feature: {
                    saveAsImage: {
                      title: '导出'
                    }
                  },
                  right: '8%'
                },
                grid: {
                  bottom: '8%',
                  containLabel: true
                },
                legend: {
                  data: legendNameArray,
                  bottom: '0%',
                  padding: [
                    5,
                    10,
                    5,
                    150
                  ],
                  type: 'scroll'
                },
                xAxis: {
                  type: 'category',
                  data: xList,
                  axisLabel: {
                    interval: 0,
                    rotate: -45,
                    margin: 30,
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
                yAxis: {
                  type: 'value',
                  show: isShow,
                  max: function (value) {
                    return maxValue > value.max ? maxValue : value.max
                  },
                  min: function (value) {
                    return minValue < value.min ? minValue : value.min
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
                  bottom: '10%',
                  showDetail: false
                }],
                series: series
              }
              chartObj.setOption(echartsOption)
              chartObj.hideLoading()
            } else {
              let series = []
              let chartName = this.chartDataList[i].chartName
              let legendNameArray = this.chartDataList[i].legendNameArray
              let yList = this.chartDataList[i].yList
              let xList = this.chartDataList[i].xList
              for (let j = 0; j < legendNameArray.length; j++) {
                series.push({ name: legendNameArray[j], type: 'bar', stack: 'total', label: { show: true }, emphasis: { focus: 'series' }, data: yList[j] })
              }
              let echartsOption = {
                color: this.echartsColor,
                title: {
                  text: chartName,
                  left: 'center'
                },
                legend: {
                  data: legendNameArray,
                  bottom: '0%',
                  padding: [
                    5,
                    10,
                    5,
                    150
                  ],
                  type: 'scroll'
                },
                toolbox: {
                  show: true,
                  feature: {
                    saveAsImage: {
                      title: '导出'
                    }
                  },
                  right: '8%'
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '8%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  data: xList,
                  axisLabel: {
                    interval: 0,
                    rotate: -45,
                    margin: 30,
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
                yAxis: {
                  type: 'value',
                  show: isShow,
                  max: function (value) {
                    return maxValue > value.max ? maxValue : value.max
                  },
                  min: function (value) {
                    return minValue < value.min ? minValue : value.min
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
                  bottom: '10%',
                  showDetail: false
                }],
                series: series
              }
              chartObj.setOption(echartsOption)
              chartObj.hideLoading()
            }
            this.chartObjs.push(chartObj)
          }
        })
      }).catch(() => { })
    }
  }
}
</script>
<style lang="scss">
</style>
