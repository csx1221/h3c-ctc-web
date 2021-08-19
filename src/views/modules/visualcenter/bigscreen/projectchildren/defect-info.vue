<template>
  <el-row class="defect-info">
    <el-col :span="24">
      <el-row>
        <el-col :span="24" class="title">缺陷数量统计</el-col>
        <el-col :span="24" id="defect-counts-info" class="graph-data-area" :style="{height:(dataObject.height-195)*0.2+'px'}">
          <el-row style="margin-top:3%;">
            <el-col :span="8">
              <div class="tvalue" style="color:#5fd6ef;">{{defectStatisticsData.allDefectCounts}}</div>
              <div class="split-center-line"></div>
              <div class="ttitle">总缺陷数</div>
            </el-col>
            <el-col :span="8">
              <div class="tvalue" style="color:#00e095;">{{defectStatisticsData.effectDefectCounts}}</div>
              <div class="split-center-line"></div>
              <div class="ttitle">有效缺陷数</div>
            </el-col>
            <el-col :span="8">
              <div class="tvalue" style="color:#ffe400;">{{defectStatisticsData.repairDefectCounts}}</div>
              <div class="split-center-line"></div>
              <div class="ttitle">修复缺陷数</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="title">缺陷级别分布</el-col>
        <el-col :span="24" :style="{height:(dataObject.height-195)*0.4+'px'}">
          <el-row>
            <el-col :span="24" class="graph-data-area" :style="{height:(dataObject.height-195)*0.4-20+'px'}" id="defect-level-info"></el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row v-if="scope!=1">
        <el-col :span="24" class="title">各省缺陷情况</el-col>
        <el-col :span="24" id="province-defect-info" class="graph-data-area" :style="{height:(dataObject.height-120)*0.4+'px'}"></el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
const echarts = require('echarts')
export default {
  name: 'DefectInfo',
  props: {
    dataObject: Object
  },
  data () {
    return {
      recordReloadIndex: 0, // 记录重新加载次数
      scope: 0,
      defectStatisticsData: {
        allDefectCounts: 0,
        effectDefectCounts: 0,
        repairDefectCounts: 0
      }
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
          this.defectStatisticsData = { ...this.defectStatisticsData, ...newVal.defectStatisticsData }
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
        // 项目缺陷分布数量
        let projectDefectData = this.dataObject.projectDefectData
        let defectLevelInfoObj = echarts.init(document.getElementById('defect-level-info'))
        defectLevelInfoObj.clear()
        defectLevelInfoObj.setOption(thisvm.getOption(projectDefectData))
        // 省份缺陷分布数量
        let provinceDefectData = this.dataObject.provinceDefectData || {}
        // 判断是否有数据
        if ((provinceDefectData.provinceName || []).length === 0) {
          thisvm.scope = 1
        }
        let provinceDefectInfoObj = echarts.init(document.getElementById('province-defect-info'))
        provinceDefectInfoObj.clear()
        provinceDefectInfoObj.setOption(thisvm.getDefectOption(provinceDefectData))
      })
    },
    getOption (data) {
      let option = {
        color: ['#ff4319', '#ffa200', '#f7e600', '#00e095', '#5b94ff'],
        tooltip: {
          show: true
        },
        series: [{
          type: 'pie',
          roseType: 'radius',
          radius: ['40%', '60%'],
          data: data,
          label: {
            normal: {
              formatter: '{font|{b}{c}}\n{hr|}\n{font|{d}%}',
              rich: {
                font: {
                  fontSize: 13,
                  padding: [2, 0],
                  color: '#fff'
                },
                hr: {
                  height: 0,
                  borderWidth: 1,
                  width: '100%',
                  borderColor: '#fff'
                }
              }
            }
          },
          labelLine: {
            lineStyle: {
              color: '#fff'
            },
            normal: {
              length: 2
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0,0,0,0.5)'
            }
          }
        }]
      }
      return option
    },
    getDefectOption (provinceDefectData) {
      let data = {}
      data.area = provinceDefectData.provinceName || []
      data.legend = provinceDefectData.legend || []
      data.data = provinceDefectData.provinceData || []
      var option = {
        color: ['#ff4319', '#ffa200', '#f7e600', '#00e095', '#5b94ff'],
        legend: {
          top: 10,
          right: 5,
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#ffffff'
          },
          data: data.legend
        },
        tooltip: {
          show: true
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '13%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#96A4F4'
          },
          axisLine: {
            lineStyle: {
              color: '#96A4F4'
            },
            width: 5
          },
          axisTick: {
            show: false
          },
          data: data.area
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#ffffff',
            formatter: '{value}个'
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#96A4F4'
            },
            width: 5
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(150, 164, 244, 0.3)'
            }
          }
        },
        series: [
        ],
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
      for (var i = 0; i < data.legend.length; i++) {
        option.series.push({
          name: data.legend[i],
          type: 'bar',
          stack: '数量',
          barWidth: '8px',
          label: {
            show: false,
            position: 'insideRight'
          },
          data: data.data[i]
        })
      }
      return option
    }
  }
}
</script>
<style lang="scss" scoped>
.defect-info {
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
  }
  .tvalue {
    font-family: MicrosoftYaHei;
    font-size: 30px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 1px;
    color: #ffffff;
    text-align: center;
  }
  .ttitle {
    font-family: MicrosoftYaHeiLight;
    font-size: 20px;
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
</style>
