<template>
  <div ref="defectCircle" style="height: 180px;"></div>
</template>

<script>
const echarts = require('echarts')
export default {
  props: {
    defectData: Array
  },
  data () {
    return {
      optionNumber: 0
    }
  },
  watch: {
    'defectData': {
      handler: function (newVal, oldVal) {
        if (newVal.projectId !== this.optionNumber) {
          this.createdCircle()
        }
      }
    }
  },
  mounted () {
    this.createdCircle()
  },
  methods: {
    createdCircle () {
      const echartObj = echarts.init(this.$refs.defectCircle)
      echartObj.clear()
      echartObj.showLoading()
      // 获取数据
      var data = this.defectData
      // 处理输出
      var titleArr = []
      var seriesArr = []
      var colors = [['#ff10f1', 'rgba(255,16,241,0.2)'], ['#3991ff', 'rgba(57,145,255,0.2)']]
      data.forEach(function (item, index) {
        titleArr.push({
          text: item.name,
          left: index * 46 + 26 + '%',
          top: '28%',
          textAlign: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: '16',
            color: colors[index][0],
            textAlign: 'center'
          }
        })
        seriesArr.push({
          name: item.name,
          type: 'pie',
          clockWise: false,
          radius: [60, 70],
          itemStyle: {
            normal: {
              color: colors[index][0],
              shadowColor: colors[index][0],
              shadowBlur: 0,
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          center: [index * 46 + 28 + '%', '50%'],
          data: [{
            value: item.value,
            label: {
              normal: {
                formatter: function (params) {
                  return params.value + '%'
                },
                position: 'center',
                show: true,
                textStyle: {
                  fontSize: '20',
                  fontWeight: 'bold',
                  color: colors[index][0]
                }
              }
            }
          },
          {
            value: 100 - item.value,
            name: 'invisible',
            itemStyle: {
              normal: {
                color: colors[index][1]
              },
              emphasis: {
                color: colors[index][1]
              }
            }
          }]
        })
      })
      const option = {
        title: titleArr,
        series: seriesArr
      }
      echartObj.setOption(option)
      echartObj.hideLoading()
    }
  }
}
</script>
