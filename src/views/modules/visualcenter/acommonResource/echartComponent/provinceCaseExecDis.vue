<template>
  <div ref="provinceCaseExecDis" style="height: 500px;"></div>
</template>

<script>
const echarts = require('echarts')
export default {
  props: {
    provinceCaseExecDis: Object
  },
  data () {
    return {
      optionNumber: 0
    }
  },
  mounted () {
  },
  watch: {
    'provinceCaseExecDis': {
      handler: function (newVal, oldVal) {
        this.loadProvinceCaseExecDis(newVal)
      }
    }
  },
  methods: {
    loadProvinceCaseExecDis (provinceCaseExecDis) {
      let data = {}
      data.area = provinceCaseExecDis.provinceName || []
      data.legend = provinceCaseExecDis.legend || []
      data.data = provinceCaseExecDis.provinceData || []
      var option = {
        color: ['#ff4319', '#ffa200', '#f7e600', '#00e095', '#5b94ff', '#58D5FF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A', '#9E87FF'],
        legend: {
          top: 10,
          right: 5,
          icon: 'circle',
          itemWidth: 10,
          itemHeight: 10,
          data: data.legend
        },
        tooltip: {
          show: true
        },
        grid: {
          left: '0%',
          right: '0%',
          top: '5%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#96A4F4',
            interval: 0,
            rotate: 45
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
          end: 95 // 伸缩条结束位置（1-100），可以随时更改
        }]
      }
      for (var i = 0; i < data.legend.length; i++) {
        option.series.push({
          name: data.legend[i],
          type: 'bar',
          stack: '数量',
          barWidth: '15px',
          barCategoryGap: '5%',
          label: {
            show: false,
            position: 'insideRight'
          },
          data: data.data[i]
        })
      }
      let provinceCaseExecDisObj = echarts.init(this.$refs.provinceCaseExecDis)
      provinceCaseExecDisObj.clear()
      provinceCaseExecDisObj.setOption(option)
      provinceCaseExecDisObj.hideLoading()
      if (data.legend.length === 0) {
        provinceCaseExecDisObj.showLoading({
          text: '暂无数据',
          color: '#ffffff',
          textColor: '#8a8e91',
          maskColor: 'rgba(255, 255, 255, 0.8)'
        })
      }
    }
  }
}
</script>
