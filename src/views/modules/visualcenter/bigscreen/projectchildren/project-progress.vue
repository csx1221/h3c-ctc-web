<template>
  <el-row class="project-progress">
    <el-col :span="24">
      <el-row>
        <el-col :span="24" class="title">项目总进度</el-col>
        <el-col :span="24" class="graph-data-area" :style="{height:(dataObject.height-140)*0.6+'px'}">
          <el-row>
            <el-col :span="5" class="graph-data-area" style="height:120px;">
              <div class="name">{{projectStatusName}}</div>
              <div class="name" :style="getStyle()">{{extensionRiskName}}</div>
            </el-col>
            <el-col :span="19" class="graph-data-area" style="height:120px;" id="project-progress-info"></el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="graph-data-area" id="project-stage-info" :style="{height:(dataObject.height-140)*0.6-145+'px'}"></el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row v-if="scope!=1">
        <el-col :span="24" class="title">工单处理情况</el-col>
        <el-col :span="24" id="project-order-deal" class="graph-data-area" :style="{height:(dataObject.height-120)*0.4+'px'}"></el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
const echarts = require('echarts')
export default {
  name: 'ProjectProgress',
  props: {
    dataObject: Object
  },
  data () {
    return {
      projectStatusMap: { '-1': '配置中', '0': '未开始', '1': '正常在测', '2': '正常完成', '3': '延期在测', '4': '延期完成' },
      extensionRiskMap: { '0': '无延期风险', '1': '有延期风险', '2': '已延期' },
      projectStatusName: '',
      extensionRiskName: '',
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
    getStyle () {
      let style = {}
      let extensionRisk = Number((this.dataObject.projectProgress && this.dataObject.projectProgress.extensionRisk) || '0')
      style.marginTop = '28px'
      style.fontSize = '16px'
      if (extensionRisk === 0) {
        style.color = '#00e095'
      } else if (extensionRisk === 1) {
        style.color = '#f4a527'
      } else if (extensionRisk === 2) {
        style.color = '#ff0000'
      } else {
        style.color = '#00e095'
      }
      return style
    },
    draw () {
      let thisvm = this
      thisvm.$nextTick(() => {
        if (thisvm.dataObject.projectProgress) {
          // 项目总进度
          thisvm.projectStatusName = thisvm.projectStatusMap[thisvm.dataObject.projectProgress.projectStatus || '0']
          thisvm.extensionRiskName = thisvm.extensionRiskMap[thisvm.dataObject.projectProgress.extensionRisk || '0']
          let planProgressRate = thisvm.dataObject.projectProgress.planProgressRate
          planProgressRate = parseFloat(planProgressRate).toFixed(0)
          let realityProgressRate = thisvm.dataObject.projectProgress.realityProgressRate
          realityProgressRate = parseFloat(realityProgressRate).toFixed(0)
          let projectProgressInfoObj = echarts.init(document.getElementById('project-progress-info'))
          projectProgressInfoObj.clear()
          projectProgressInfoObj.setOption(thisvm.getOption(planProgressRate, realityProgressRate))
          // 项目阶段
          let stageName = ['需求分析', '需求评审', '方案设计', '方案评审', '用例设计', '用例评审', '用例执行']
          let stageData = ['', '', '', '', '', '', '']
          thisvm.dataObject.projectStageProgress.forEach((item, index) => {
            let idx = Number(item.stageId) - 1
            stageData[idx] = item.stageProgressRate
          })
          let projectStageInfoObj = echarts.init(document.getElementById('project-stage-info'))
          projectStageInfoObj.clear()
          projectStageInfoObj.setOption(thisvm.getStageOption(stageName, stageData))
        }
        if (thisvm.dataObject.projectOrderData) {
          // 工单处理情况
          // 特殊处日期格式
          let projectOrderData = thisvm.dataObject.projectOrderData
          let dateDim = []
          projectOrderData.dateDim.forEach((item, index) => {
            if (item.indexOf('\n') === -1) {
              item = item.replace('月', '月\n')
            }
            dateDim.push(item)
          })
          // 判断是否有数据
          if (dateDim.length === 0) {
            thisvm.scope = 1
          }
          projectOrderData.dateDim = dateDim
          let projectOrderDealObj = echarts.init(document.getElementById('project-order-deal'))
          projectOrderDealObj.clear()
          projectOrderDealObj.setOption(thisvm.getOrderOption(projectOrderData))
        }
      })
    },
    getOrderOption (projectOrderData) {
      let maxValue = Math.max.apply(Math, projectOrderData.dealOrderData)
      maxValue = maxValue + parseInt(maxValue * 0.4)
      let option = {
        legend: {
          data: ['处理数量'],
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
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#9581F5'
            }
          },
          splitArea: {
            // show: true,
            color: '#f00',
            lineStyle: {
              color: '#f00'
            }
          },
          axisLabel: {
            color: '#fff'
          },
          splitLine: {
            show: false
          },
          boundaryGap: false,
          data: projectOrderData.dateDim
        }],
        yAxis: [{
          type: 'value',
          min: 0,
          max: maxValue,
          splitNumber: 4,
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#9581F5'
            }
          },
          axisLabel: {
            show: true,
            margin: 20,
            textStyle: {
              color: '#d1e6eb'
            },
            formatter: '{value}个'
          },
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '处理数量',
          type: 'line',
          smooth: true, // 是否平滑
          showAllSymbol: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            normal: {
              color: '#0585a0',
              shadowColor: 'rgba(0, 0, 0, 0)',
              shadowBlur: 0,
              shadowOffsetY: 5,
              shadowOffsetX: 5
            }
          },
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#01d9f1'
            }
          },
          itemStyle: {
            color: '#00df95',
            borderColor: '#fff',
            borderWidth: 3,
            shadowColor: 'rgba(0, 0, 0, .3)',
            shadowBlur: 0,
            shadowOffsetY: 2,
            shadowOffsetX: 2
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(5,133,160,0.3)'
              },
              {
                offset: 1,
                color: 'rgba(5,133,160,0)'
              }
              ], false),
              shadowColor: 'rgba(5,133,160, 0.9)',
              shadowBlur: 20
            }
          },
          data: projectOrderData.dealOrderData
        }
        ],
        dataZoom: [{
          type: 'slider', // 图表下方的伸缩条
          show: true, // 是否显示
          height: 20,
          bottom: 5,
          showDetail: false,
          realtime: true, // 拖动时，是否实时更新系列的视图
          start: 0, // 伸缩条开始位置（1-100），可以随时更改
          end: 90 // 伸缩条结束位置（1-100），可以随时更改
        }]
      }
      return option
    },
    getStageOption (stageName, stageData) {
      let maxData = 100
      let option = {
        tooltip: {},
        xAxis: {
          max: maxData,
          splitLine: {
            show: false
          },
          offset: 10,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        yAxis: {
          data: stageName,
          inverse: true,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              color: '#fff',
              fontSize: 16
            }
          }
        },
        grid: {
          top: 'center',
          height: 200,
          left: '18%',
          right: '13%'
        },
        series: [
          {
            type: 'pictorialBar',
            symbol: 'rect',
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: '#5fd6ef'
              }
            },
            symbolRepeat: 'fixed',
            symbolMargin: '5%',
            symbolClip: true,
            symbolSize: 12,
            symbolBoundingData: maxData,
            data: stageData,
            z: 99999999,
            animationEasing: 'elasticOut',
            animationDelay: function (dataIndex, params) {
              return params.index * 30
            }
          }, {
            type: 'pictorialBar',
            itemStyle: {
              normal: {
                color: 'rgba(0,53,108,0.85)'
              }
            },
            label: {
              normal: {
                show: true,
                formatter: function (params) {
                  return params.value + '% '
                },
                position: 'right',
                offset: [5, 0],
                textStyle: {
                  color: '#fff',
                  fontSize: 14
                }
              }
            },
            animationDuration: 0,
            symbolRepeat: 'fixed',
            symbolMargin: '5%',
            symbol: 'rect',
            symbolSize: 12,
            symbolBoundingData: maxData,
            data: stageData,
            z: 99999,
            animationEasing: 'elasticOut',
            animationDelay: function (dataIndex, params) {
              return params.index * 30
            }
          }
        ]
      }
      return option
    },
    getOption (planProgressRate, realityProgressRate) {
      let option = {
        xAxis: {
          show: false,
          max: 100,
          splitLine: { show: false },
          offset: 10,
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            margin: 10
          }
        },
        yAxis: {
          show: false,
          data: ['计划', '实际'],
          inverse: true,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            margin: 2,
            color: '#999',
            fontSize: 16
          }
        },
        grid: {
          top: '5%',
          height: 100,
          left: '3%',
          right: '25%'
        },
        color: '#3eb177',
        series: [{
          type: 'pictorialBar',
          symbol: 'rect',
          itemStyle: {
            barBorderRadius: 5
          },
          symbolRepeat: 'fixed',
          symbolMargin: '40%',
          symbolClip: true,
          color: '#000',
          symbolBoundingData: 100,
          data: [{
            color: 'rgba(0,224,149,0.8)',
            value: planProgressRate,
            itemStyle: {
              normal: {
                show: false,
                color: 'rgba(0,224,149,1)',
                barBorderRadius: [10, 10, 10, 10]
              }
            }
          }, {
            color: 'rgba(0,224,149,0.8)',
            value: realityProgressRate,
            itemStyle: {
              normal: {
                show: false,
                color: 'rgba(0,224,149,1)',
                barBorderRadius: [10, 10, 10, 10]
              }
            }
          }],
          symbolSize: [6, 25],
          z: 10
        }, {
          type: 'pictorialBar',
          symbol: 'rect',
          itemStyle: {
            barBorderRadius: 5
          },
          label: {
            show: true,
            formatter: function (params) {
              return params.value + '% ' + params.name
            },
            position: 'right',
            offset: [5, 0],
            color: '#fff',
            fontSize: 14
          },
          animationDuration: 0,
          symbolRepeat: 'fixed',
          symbolMargin: '40%',
          symbolSize: [6, 25],
          color: '#105879',
          symbolBoundingData: 100,
          data: [{
            color: 'black',
            value: planProgressRate,
            itemStyle: {
              normal: {
                show: true,
                color: '#1e5169',
                barBorderRadius: [10, 15, 10, 15]
              }
            }
          }, {
            color: 'black',
            value: realityProgressRate,
            itemStyle: {
              normal: {
                show: true,
                color: '#1e5169',
                barBorderRadius: [10, 15, 10, 15]
              }
            }
          }],
          z: 5
        }]
      }
      return option
    }
  }
}
</script>
<style lang="scss" scoped>
.project-progress {
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
  .name {
    width: 100%;
    color: #fff;
    margin-top: 25px;
    text-align: center;
    font-size: 18px;
  }
  .graph-data-area {
    margin-top: 10px;
    height: 100px;
  }
}
</style>
