<template>
  <el-row class="case-execute">
    <el-col :span="24">
      <el-row>
        <el-col :span="24" class="title">{{dataObject.scope}}用例执行情况</el-col>
        <el-col :span="24" id="case-execute-info" class="graph-data-area" :style="{height:(dataObject.height-140)*0.6+'px'}"></el-col>
      </el-row>
      <el-row v-if="scope!=1">
        <el-col :span="24" class="title">各省通过率情况</el-col>
        <el-col :span="24" id="province-rate-info" class="graph-data-area" :style="{height:(dataObject.height-120)*0.4+'px'}"></el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
const echarts = require('echarts')
export default {
  name: 'CaseExecute',
  props: {
    dataObject: Object
  },
  data () {
    return {
      recordReloadIndex: 0, // 记录重新加载次数
      scope: 0
    }
  },
  watch: {
    'dataObject': {
      deep: true,
      handler: function (newVal, oldVal) {
        // console.info('newVal==ProjectMonthOverview==' + JSON.stringify(newVal))
        if (newVal.reloadIndex > this.recordReloadIndex) {
          this.recordReloadIndex = newVal.reloadIndex
          this.scope = newVal.scope
          this.draw()
        }
      }
    }
  },
  computed: {},
  mounted () { },
  methods: {
    draw () {
      let thisvm = this
      thisvm.$nextTick(() => {
        if (thisvm.dataObject.caseExecuteData) {
          // 用例执行情况
          let caseExecuteData = thisvm.dataObject.caseExecuteData
          let caseExecuteInfoObj = echarts.init(document.getElementById('case-execute-info'))
          caseExecuteInfoObj.clear()
          caseExecuteInfoObj.setOption(thisvm.getOption(caseExecuteData))
        }
        if (thisvm.dataObject.provinceCasePass) {
          // 各省通过率
          let provinceCasePass = thisvm.dataObject.provinceCasePass
          let provinceRateInfoObj = echarts.init(document.getElementById('province-rate-info'))
          provinceRateInfoObj.clear()
          provinceRateInfoObj.setOption(thisvm.getProvinceOption(provinceCasePass))
        }
      })
    },
    getProvinceOption (provinceCasePass) {
      let option = {
        legend: {
          data: ['通过率'],
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          right: '5',
          top: '2%',
          textStyle: {
            color: '#ffffff'
          }
        },
        tooltip: {
          show: true
        },
        grid: {
          top: '5%',
          right: '2%',
          left: '12%',
          bottom: '20%'
        },
        xAxis: [{
          type: 'category',
          data: provinceCasePass.provinceName,
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.12)'
            }
          },
          axisLabel: {
            margin: 10,
            color: '#e2e9ff',
            textStyle: {
              fontSize: 14
            }
          }
        }],
        yAxis: [{
          splitNumber: 3,
          axisLabel: {
            show: true,
            margin: 20,
            textStyle: {
              color: '#d1e6eb'
            },
            formatter: '{value}%'
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#233e64'
            }
          }
        }],
        series: [{
          name: '通过率',
          type: 'bar',
          data: provinceCasePass.provinceData,
          barWidth: '8px',
          itemStyle: {
            normal: {
              label: {
                show: false, // 开启显示
                position: 'top', // 在上方显示
                textStyle: { // 数值样式
                  color: '#00F4FF',
                  fontSize: 14
                }
              },
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0,244,255,1)' // 0% 处的颜色
              }, {
                offset: 1,
                color: 'rgba(0,77,167,1)' // 100% 处的颜色
              }], false),
              barBorderRadius: [30, 30, 0, 0],
              shadowColor: 'rgba(0,160,221,1)',
              shadowBlur: 4
            }
          }
        }],
        dataZoom: [{
          type: 'slider', // 图表下方的伸缩条
          show: true, // 是否显示
          height: 20,
          bottom: 5,
          showDetail: false,
          realtime: true, // 拖动时，是否实时更新系列的视图
          start: 0, // 伸缩条开始位置（1-100），可以随时更改
          end: 75 // 伸缩条结束位置（1-100），可以随时更改
        }]
      }
      return option
    },
    getOption (data) {
      let caseExecMap = { '0': '未执行', '1': '通过', '2': '不通过', '3': '测试受阻', '4': '无法测试', '5': '免测', '6': '延期补测' }
      let colorMap = { '1': '#00e095', '2': '#ff6600', '5': '#5b94ff', '3': '#9900f5', '4': '#5c5c5c' }
      let m2R2Data = data
      m2R2Data.forEach((item, index) => {
        item.itemStyle = { color: colorMap[item.type] }
        item.name = caseExecMap[item.type]
      })
      let option = {
        legend: {
          orient: 'vertical',
          left: '2%',
          top: '0%',
          align: 'left',
          itemWidth: 20,
          itemHeight: 10,
          textStyle: {
            color: '#8C8C8C'
          }
        },
        tooltip: {
          show: true
        },
        series: [
          {
            name: '用例执行',
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['0%', '55%'],
            clockwise: false, // 饼图的扇区是否是顺时针排布
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'outter',
                formatter: function (parms) {
                  return parms.data.value + '，' + parms.percent + '%'
                }
              }
            },
            labelLine: {
              normal: {
                length: 30,
                length2: 20,
                smooth: false,
                lineStyle: {
                  width: 2
                }
              }
            },
            data: m2R2Data
          },
          {
            type: 'pie',
            zlevel: 1,
            silent: true,
            radius: ['65%', '66%'],
            hoverAnimation: false,
            color: '#22528d',
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: [1]
          }
        ]
      }
      return option
    }
  }
}
</script>
<style lang="scss" scoped>
.case-execute {
  .title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 15px;
    letter-spacing: 2px;
    color: #fefefe;
    padding-left: 10px;
    margin-top: 10px;
  }
  .graph-data-area {
    margin-top: 10px;
    height: 100px;
    width: 100%;
  }
}
</style>
