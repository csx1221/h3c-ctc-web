<template>
  <div ref="intervalColunmnar" style="height:350px;"></div>
</template>

<script>
const echarts = require('echarts')
export default {
  props: {
    intervalProject: Object
  },
  data () {
    return {
      dateList: [],
      planList: [],
      actulList: [],
      optionNumber: 0
    }
  },
  mounted () {
  },
  watch: {
    'intervalProject': {
      handler: function (newVal, oldVal) {
        this.dateList = []
        this.planList = []
        this.actulList = []
        if (newVal.projectId !== this.optionNumber) {
          this.createdChart()
        }
      }
    }
  },
  methods: {
    _getDataList () {
      if (this.intervalProject.dealList) {
        for (var i = 0; i < this.intervalProject.dealList.length; i++) {
          this.dateList.push(this.intervalProject.dealList[i].date)
          this.planList.push(this.intervalProject.dealList[i].planCount)
          this.actulList.push(this.intervalProject.dealList[i].actulCount)
        }
      }
    },
    createdChart () {
      this._getDataList()
      const echartObj = echarts.init(this.$refs.intervalColunmnar)
      echartObj.clear()
      echartObj.showLoading()
      const option = {
        title: {
          text: '处理工单数',
          x: '0%',
          y: '8%',
          textStyle: {
            fontSize: 14
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          show: true,
          x: '85%',
          y: '8%'
        },
        grid: {
          left: '5%',
          right: '5%'
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 0
          },
          data: this.dateList
        },
        yAxis: {
          type: 'value',
          show: true
        },
        series: [{
          name: '计划',
          data: this.planList,
          type: 'bar',
          barWidth: 15,
          itemStyle: {
            borderColor: '#2196f3'
          },
          emphasis: {
            itemStyle: {
              borderColor: '#2196f3'
            }
          }
        },
        {
          name: '实际',
          data: this.actulList,
          barGap: '-100%',
          type: 'bar',
          barWidth: 20,
          itemStyle: {
            borderColor: '#45e9a5' // 同背景色一样
          },
          emphasis: {
            itemStyle: {
              borderColor: '#45e9a5'
            }
          }
        }]
      }
      echartObj.setOption(option)
      echartObj.hideLoading()
    }
  }
}
</script>
