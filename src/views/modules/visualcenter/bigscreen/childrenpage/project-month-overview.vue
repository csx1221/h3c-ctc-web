<template>
  <el-row class="project-month-overview">
    <el-col :span="24" class="data-text">
      <el-row>
        <el-col :span="6" v-for="(item,index) in dataObject.currMonthData" :key="index">
          <div class="title">{{item.name}}</div>
          <div class="split-center-line" :style="{'background': 'linear-gradient(to left, #252a5c,' +colorData[index]+', #252a5c)'}"></div>
          <div class="value" :style="{'color':colorData[index]}">{{item.totals}}</div>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="24" class="data-graph">
      <el-row>
        <el-col :span="8" class="graph-data-area" :style="{height:(dataObject.height-165)+'px'}">
          <img src="../../../../../assets/img/current_month_select.png" style="width:100%;height:100%;float:center;margin-top:10%;" />
        </el-col>
        <el-col :span="8" id="test-counts" class="graph-data-area" :style="{height:(dataObject.height-165)+'px'}">
        </el-col>
        <el-col :span="8" id="complete-counts" class="graph-data-area" :style="{height:(dataObject.height-165)+'px'}">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="title">{{activeName}}</div>
        </el-col>
        <el-col :span="8">
          <div class="title">在测数量</div>
        </el-col>
        <el-col :span="8">
          <div class="title">完成数量</div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
const echarts = require('echarts')
export default {
  name: 'ProjectMonthOverview',
  props: {
    dataObject: Object
  },
  data () {
    return {
      recordReloadIndex: 0, // 记录重新加载次数
      colorData: ['#2dd8ff', '#327efe', '#b276f9', '#f0c95f'],
      activeName: '',
      activeIndex: 0,
      angle: 0, // 角度
      testCounts: 40, // 在测数据量
      completeCounts: 60, // 完成数据量
      switchIntervalDraw: 0 // 切换计时器
    }
  },
  watch: {
    'dataObject': {
      deep: true,
      handler: function (newVal, oldVal) {
        // console.info('newVal==ProjectMonthOverview==' + JSON.stringify(newVal))
        if (newVal.reloadIndex > this.recordReloadIndex) {
          this.recordReloadIndex = newVal.reloadIndex
          this.loadCurrMonthGraph()
        }
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    // 获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
    getCirlPoint (x0, y0, r, angle) {
      let x1 = x0 + r * Math.cos(angle * Math.PI / 180)
      let y1 = y0 + r * Math.sin(angle * Math.PI / 180)
      return {
        x: x1,
        y: y1
      }
    },
    loadCurrMonthGraph () {
      let thisvm = this
      thisvm.$nextTick(() => {
        clearInterval(this.switchIntervalDraw)
        let currMonthData = thisvm.dataObject.currMonthData
        let dataLen = currMonthData.length
        let time = thisvm.dataObject.bigScreenTime / dataLen
        time = time < 5000 ? 5000 : time
        time = time > 10000 ? 10000 : time
        // 先初始化
        thisvm.init()
        this.switchIntervalDraw = setInterval(function () {
          // 索引值加1
          thisvm.activeIndex = thisvm.activeIndex + 1
          thisvm.activeIndex = thisvm.activeIndex >= dataLen ? 0 : thisvm.activeIndex
          let currItem = currMonthData[thisvm.activeIndex]
          thisvm.activeName = currItem.name
          if (currItem.totals > 0) {
            thisvm.testCounts = ((currItem.testCounts / currItem.totals) * 100).toFixed(0)
            thisvm.completeCounts = ((currItem.completeCounts / currItem.totals) * 100).toFixed(0)
          } else {
            thisvm.testCounts = 0
            thisvm.completeCounts = 0
          }
          thisvm.angle += thisvm.activeIndex * 10
          // 开始渲染动画
          thisvm.draw()
        }, time)
      })
    },
    init () {
      this.activeIndex = 0
      let currMonthData = this.dataObject.currMonthData
      if (currMonthData.length > 0) {
        let currItem = currMonthData[this.activeIndex]
        this.activeName = currItem.name
        if (currItem.totals > 0) {
          this.testCounts = ((currItem.testCounts / currItem.totals) * 100).toFixed(0)
          this.completeCounts = ((currItem.completeCounts / currItem.totals) * 100).toFixed(0)
        } else {
          this.testCounts = 0
          this.completeCounts = 0
        }
        this.angle = 0
        this.draw()
      }
    },
    draw () {
      let thisvm = this
      thisvm.$nextTick(() => {
        // 在测数量
        let testCounts = echarts.init(document.getElementById('test-counts'))
        testCounts.clear()
        // 完成数量
        let completeCounts = echarts.init(document.getElementById('complete-counts'))
        completeCounts.clear()
        testCounts.setOption(thisvm.getOption(thisvm.angle, thisvm.testCounts), true)
        completeCounts.setOption(thisvm.getOption(thisvm.angle, thisvm.completeCounts), true)
      })
    },
    getOption (angle, value) {
      let thisvm = this
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        title: {
          text: '{a|' + value + '}{c|%}',
          x: 'center',
          y: 'center',
          textStyle: {
            rich: {
              a: {
                fontSize: 15,
                color: '#2cfffd'
              },
              c: {
                fontSize: 10,
                color: '#2cfffd'
              }
            }
          }
        },
        series: [{
          name: 'ring5',
          type: 'custom',
          coordinateSystem: 'none',
          renderItem: function (params, api) {
            return {
              type: 'arc',
              shape: {
                cx: api.getWidth() / 2,
                cy: api.getHeight() / 2,
                r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
                startAngle: (270 + -angle) * Math.PI / 180,
                endAngle: (40 + -angle) * Math.PI / 180
              },
              style: {
                stroke: '#0CD3DB',
                fill: 'transparent',
                lineWidth: 1.5
              },
              silent: true
            }
          },
          data: [0]
        }, {
          name: 'ring5',
          type: 'custom',
          coordinateSystem: 'none',
          renderItem: function (params, api) {
            return {
              type: 'arc',
              shape: {
                cx: api.getWidth() / 2,
                cy: api.getHeight() / 2,
                r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
                startAngle: (90 + -angle) * Math.PI / 180,
                endAngle: (220 + -angle) * Math.PI / 180
              },
              style: {
                stroke: '#0CD3DB',
                fill: 'transparent',
                lineWidth: 1.5
              },
              silent: true
            }
          },
          data: [0]
        }, {
          name: 'ring5',
          type: 'custom',
          coordinateSystem: 'none',
          renderItem: function (params, api) {
            let x0 = api.getWidth() / 2
            let y0 = api.getHeight() / 2
            let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65
            let point = thisvm.getCirlPoint(x0, y0, r, (90 + -angle))
            return {
              type: 'circle',
              shape: {
                cx: point.x,
                cy: point.y,
                r: 2
              },
              style: {
                stroke: '#0CD3DB',
                fill: '#0CD3DB'
              },
              silent: true
            }
          },
          data: [0]
        }, {
          name: 'ring5',
          type: 'custom',
          coordinateSystem: 'none',
          renderItem: function (params, api) {
            let x0 = api.getWidth() / 2
            let y0 = api.getHeight() / 2
            let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65
            let point = thisvm.getCirlPoint(x0, y0, r, (270 + -angle))
            return {
              type: 'circle',
              shape: {
                cx: point.x,
                cy: point.y,
                r: 2
              },
              style: {
                stroke: '#0CD3DB',
                fill: '#0CD3DB'
              },
              silent: true
            }
          },
          data: [0]
        }, {
          name: '吃猪肉频率',
          type: 'pie',
          radius: ['55%', '50%'],
          silent: true,
          clockwise: true,
          startAngle: 90,
          z: 0,
          zlevel: 0,
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [{
            value: value,
            name: '',
            itemStyle: {
              normal: {
                color: { // 完成的圆环的颜色
                  colorStops: [{
                    offset: 0,
                    color: '#4FADFD' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#28E8FA' // 100% 处的颜色
                  }]
                }
              }
            }
          },
          {
            value: 100 - value,
            name: '',
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#173164'
              }
            }
          }
          ]
        },
        {
          name: '',
          type: 'gauge',
          radius: '48%',
          center: ['50%', '50%'],
          startAngle: 0,
          endAngle: 359.9,
          splitNumber: 0,
          hoverAnimation: true,
          axisTick: {
            show: false
          },
          splitLine: {
            length: 0,
            lineStyle: {
              width: 3,
              color: '#061740'
            }
          },
          axisLabel: {
            show: false
          },
          pointer: {
            show: false
          },
          axisLine: {
            lineStyle: {
              opacity: 0
            }
          },
          detail: {
            show: false
          },
          data: [{
            value: 0,
            name: ''
          }]
        }
        ]
      }
      return option
    }
  },
  destroyed () {
    clearInterval(this.switchIntervalDraw)
  }
}
</script>
<style lang="scss" scoped>
.project-month-overview {
  .data-text {
    padding-top: 10px;
    .value {
      font-family: MicrosoftYaHei;
      font-size: 25px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 1px;
      color: #ffffff;
      text-align: center;
    }
    .title {
      font-family: MicrosoftYaHeiLight;
      font-size: 15px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #ffffff;
      text-align: center;
    }
    .split-center-line {
      height: 1.8px;
      margin-top: 5px;
      margin-bottom: 5px;
      background: linear-gradient(to left, #252a5c, #7187ac, #252a5c);
    }
  }
  .data-graph {
    .graph-data-area {
      min-height: 50px;
      text-align: center;
    }
    .title {
      font-family: MicrosoftYaHeiLight;
      font-size: 15px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #ffffff;
      text-align: center;
      height: 30px;
    }
  }
}
</style>
