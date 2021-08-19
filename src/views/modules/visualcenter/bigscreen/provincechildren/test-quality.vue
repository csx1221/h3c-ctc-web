<template>
  <el-row class="test-quality">
    <el-col :span="24">
      <el-row>
        <el-col :span="12" class="title" style="text-align:left;padding-left:35px;">用例</el-col>
        <el-col :span="12" class="title">用例通过率</el-col>
      </el-row>
    </el-col>
    <el-col :span="24">
      <el-col :span="12" :style="{height:(dataObject.height-150)/2+'px'}">
        <el-row>
          <el-col :span="14" class="title" style="text-align:left;padding-left:45px;font-size:14px;">通过数</el-col>
          <el-col :span="10" class="value" style="color:#007eca;font-size:20px;">{{dataObject.testQuality.casePassCounts}}<span style="color:#fff;font-size:14px;padding-left:5px;">个</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="14" class="title" style="text-align:left;padding-left:45px;font-size:14px;">不通过数</el-col>
          <el-col :span="10" class="value" style="color:#ff6200;font-size:20px;">{{dataObject.testQuality.caseNoPassCounts}}<span style="color:#fff;font-size:14px;padding-left:5px;">个</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="14" class="title" style="text-align:left;padding-left:45px;font-size:14px;">阻塞数</el-col>
          <el-col :span="10" class="value" style="color:#fbee00;font-size:20px;">{{dataObject.testQuality.caseTestBlock}}<span style="color:#fff;font-size:14px;padding-left:5px;">个</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="14" class="title" style="text-align:left;padding-left:45px;font-size:14px;">无法测试数</el-col>
          <el-col :span="10" class="value" style="color:#fefefe;font-size:20px;">{{dataObject.testQuality.caseNotestCounts}}<span style="color:#fff;font-size:14px;padding-left:5px;">个</span></el-col>
        </el-row>
      </el-col>
      <el-col :span="12" id="case-pass-rate" class="graph-data-area" :style="{height:(dataObject.height-150)/2+'px'}"></el-col>
    </el-col>
    <el-col :span="24">
      <el-row>
        <el-col :span="12" class="title" style="text-align:left;padding-left:35px;">缺陷</el-col>
        <el-col :span="12" class="title">缺陷修复率</el-col>
      </el-row>
    </el-col>
    <el-col :span="24">
      <el-col :span="12" :style="{height:(dataObject.height-150)/2+'px'}">
        <el-row>
          <el-col :span="14" class="title" style="text-align:left;padding-left:45px;font-size:14px;">缺陷数</el-col>
          <el-col :span="10" class="value" style="color:#007eca;font-size:20px;">{{dataObject.testQuality.defectCounts}}<span style="color:#fff;font-size:14px;padding-left:5px;">个</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="14" class="title" style="text-align:left;padding-left:45px;font-size:14px;">未修复</el-col>
          <el-col :span="10" class="value" style="color:#ff6200;font-size:20px;">{{dataObject.testQuality.defectNoFixedCounts}}<span style="color:#fff;font-size:14px;padding-left:5px;">个</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="14" class="title" style="text-align:left;padding-left:45px;font-size:14px;">已修复</el-col>
          <el-col :span="10" class="value" style="color:#fbee00;font-size:20px;">{{dataObject.testQuality.defectFixedCounts}}<span style="color:#fff;font-size:14px;padding-left:5px;">个</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="14" class="title" style="text-align:left;padding-left:45px;font-size:14px;">已否决</el-col>
          <el-col :span="10" class="value" style="color:#fefefe;font-size:20px;">{{dataObject.testQuality.defectVetoCounts}}<span style="color:#fff;font-size:14px;padding-left:5px;">个</span></el-col>
        </el-row>
      </el-col>
      <el-col :span="12" id="defect-repair-rate" class="graph-data-area" :style="{height:(dataObject.height-150)/2+'px'}"></el-col>
    </el-col>
  </el-row>
</template>
<script>
const echarts = require('echarts')
export default {
  name: 'TestQuality',
  props: {
    dataObject: Object
  },
  data () {
    return {
      recordReloadIndex: 0 // 记录重新加载次数
    }
  },
  watch: {
    'dataObject': {
      deep: true,
      handler: function (newVal, oldVal) {
        // console.info('newVal==ProjectMonthOverview==' + JSON.stringify(newVal))
        if (newVal.reloadIndex > this.recordReloadIndex) {
          this.recordReloadIndex = newVal.reloadIndex
          this.draw()
        }
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    draw () {
      let thisvm = this
      thisvm.$nextTick(() => {
        // 用例通过率
        let casePassRate = thisvm.dataObject.testQuality.casePassRate || 0
        let casePassRateObj = echarts.init(document.getElementById('case-pass-rate'))
        casePassRateObj.clear()
        casePassRateObj.setOption(thisvm.getOption(0, casePassRate), true)
        // 缺陷修复率
        let defectRepairRate = thisvm.dataObject.testQuality.defectRepairRate || 0
        let defectRepairRateObj = echarts.init(document.getElementById('defect-repair-rate'))
        defectRepairRateObj.clear()
        defectRepairRateObj.setOption(thisvm.getOption(150, defectRepairRate), true)
      })
    },
    // 获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
    getCirlPoint (x0, y0, r, angle) {
      let x1 = x0 + r * Math.cos(angle * Math.PI / 180)
      let y1 = y0 + r * Math.sin(angle * Math.PI / 180)
      return {
        x: x1,
        y: y1
      }
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
  }
}
</script>
<style lang="scss" scoped>
.test-quality {
  padding: 0px;
  margin: 0px;
  .title {
    font-family: MicrosoftYaHeiLight;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 15px;
    letter-spacing: 2px;
    color: #fefefe;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    margin-top: 4%;
  }
  .value {
    font-family: MicrosoftYaHei;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 15px;
    letter-spacing: 2px;
    color: #007eca;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    margin-top: 4%;
  }
  .graph-data-area {
    min-height: 50px;
    text-align: center;
  }
}
</style>
