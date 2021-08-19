<template>
  <el-row class="project-increase-trend">
    <el-col :span="24" class="data-text">
      <el-row>
        <el-col :span="24" class="title" style="text-align:left;padding-left:20px;">
          {{currentMonth}} 新增项目数 {{addProjectTotals}}
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="24" id="project-increase-trend" class="graph-data-area" :style="{height:(dataObject.height-80)+'px'}" @mouseenter="enterOrLeave(1)" @mouseleave="enterOrLeave(2)"></el-col>
  </el-row>
</template>
<script>
const echarts = require('echarts')
export default {
  name: 'ProjectIncreaseTrend',
  props: {
    dataObject: Object
  },
  data () {
    return {
      recordReloadIndex: 0, // 记录重新加载次数
      switchIntervalDraw: 0,
      projectIncreaseTrend: '',
      currentMonth: 'XX',
      addProjectTotals: 0,
      dateDim: [],
      projectData: [],
      lineCurrentIndex: 0,
      lineEnterLeave: true

    }
  },
  watch: {
    'dataObject': {
      deep: true,
      handler: function (newVal, oldVal) {
        // console.info('newVal==ProjectIncreaseTrend==' + JSON.stringify(newVal))
        if (newVal.reloadIndex > this.recordReloadIndex) {
          this.recordReloadIndex = newVal.reloadIndex
          this.loadProjectTrendGraph()
        }
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    enterOrLeave (type) {
      if (type === 1) {
        this.lineEnterLeave = false
      } else {
        this.lineEnterLeave = true
      }
    },
    loadProjectTrendGraph () {
      let thisvm = this
      thisvm.$nextTick(() => {
        // 项目增长趋势
        let data = thisvm.dataObject.projectTrendData
        // 特殊处日期格式
        let dateDim = []
        data.dateDim.forEach((item, index) => {
          if (item.indexOf('\n') === -1) {
            item = item.replace('年', '年\n')
          }
          dateDim.push(item)
        })
        data.dateDim = dateDim
        thisvm.projectIncreaseTrend = echarts.init(document.getElementById('project-increase-trend'))
        thisvm.projectIncreaseTrend.clear()
        thisvm.projectIncreaseTrend.setOption(thisvm.getOption(data))
        thisvm.projectData = data.projectData
        thisvm.dateDim = data.dateDim
        thisvm.startSwitchIntervalDraw()
      })
    },
    startSwitchIntervalDraw () {
      let thisvm = this
      let time = thisvm.dataObject.bigScreenTime / Object.keys(thisvm.projectData).length
      time = time < 5000 ? 5000 : time
      time = time > 10000 ? 10000 : time
      clearInterval(thisvm.switchIntervalDraw)
      thisvm.switchIntervalDraw = setInterval(function () {
        if (thisvm.lineEnterLeave) {
          thisvm.showTip()
        }
      }, time)
      thisvm.showTip()
    },
    showTip () {
      let thisvm = this
      var dataLen = Object.keys(thisvm.projectData).length - 1
      // 取消之前高亮的图形
      if (thisvm.lineCurrentIndex > 0) {
        thisvm.projectIncreaseTrend.dispatchAction({
          type: 'hideTip',
          seriesIndex: 0,
          dataIndex: thisvm.lineCurrentIndex - 0
        })
      }
      let currentIndex = thisvm.lineCurrentIndex
      currentIndex = currentIndex >= dataLen ? 0 : currentIndex
      // 高亮当前图形
      thisvm.projectIncreaseTrend.dispatchAction({
        type: 'showTip',
        seriesIndex: 0, // 显示第几个series
        dataIndex: currentIndex // 显示第几个数据
      })
      // 显示对应标题数据
      thisvm.currentMonth = thisvm.dateDim[currentIndex]
      thisvm.addProjectTotals = thisvm.projectData[currentIndex]
      thisvm.lineCurrentIndex = currentIndex + 1
    },
    getOption (data) {
      let option = {
        tooltip: {
          show: true
        },
        legend: {
          icon: 'circle',
          data: ['项目数量', '任务数量'],
          left: 'right',
          top: '5%',
          textStyle: {
            color: 'fff'
          },
          itemWidth: 10,
          itemHeight: 10
        },
        grid: {
          left: '5%',
          right: '2%',
          bottom: '10%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.dateDim,
          axisLine: {
            lineStyle: {
              color: '#2dd8ff'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '数量(个)',
          axisLine: {
            lineStyle: {
              color: '#2dd8ff'
            }
          },
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        series: [{
          name: '项目数量',
          type: 'line',
          data: data.projectData,
          color: '#327efe',
          lineStyle: {
            normal: {
              width: 1.5
            }
          },
          symbolSize: 6,
          smooth: true
        },
        {
          name: '任务数量',
          type: 'line',
          color: '#2dd8ff',
          data: data.taskData,
          lineStyle: {
            normal: {
              width: 1.5
            }
          },
          symbolSize: 6,
          smooth: true
        }]
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
.project-increase-trend {
  .data-text {
    padding-top: 10px;
    .title {
      font-family: MicrosoftYaHeiLight;
      font-size: 15px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #ffffff;
      text-align: center;
    }
  }
  .graph-data-area {
    min-height: 150px;
  }
}
</style>
