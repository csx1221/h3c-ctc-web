<template>
  <div ref="circleValue" style="height: 180px;width:100%;"></div>
</template>

<script>
const echarts = require('echarts')
export default {
  props: {
    circleData: Object
  },
  data () {
    return {
      optionNumber: 0,
      provinceDataList: []
    }
  },
  mounted () {
  },
  watch: {
    'circleData': {
      handler: function (newVal, oldVal) {
        this.provinceDataList = []
        if (newVal.projectId !== this.optionNumber) {
          this.createdCircle()
        }
      }
    }
  },
  methods: {
    // 处理数据
    dealProvinceData () {
      if (this.circleData.caseSurvey) {
        var listName = ['已完成省份', '进行中省份', '未开始']
        var listValue = [this.circleData.caseSurvey.completeProvince,
          this.circleData.caseSurvey.doIngProvince, this.circleData.caseSurvey.notStartProvince]
        for (var m = 0; m < 3; m++) {
          let obj = {}
          obj.name = listName[m]
          obj.value = listValue[m]
          this.provinceDataList.push(obj)
        }
        return JSON.parse(JSON.stringify(this.provinceDataList))
      }
    },
    // 创建
    createdCircle () {
      this.dealProvinceData()
      var colorList = ['#2be705', '#ffa200', '#ff3800']
      const chartObj = echarts.init(this.$refs.circleValue)
      chartObj.clear()
      chartObj.showLoading()
      const option = {
        title: {
          text: '所有省份：' + `${this.circleData.caseSurvey.allProvince || 0}`,
          x: '19%',
          y: 'center',
          textStyle: {
            fontSize: 13,
            color: '#3991ff'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        grid: {
          left: '-5%'
        },
        legend: {
          orient: 'vertical',
          left: '60%', // 图例距离左的距离
          y: 'center', // 图例上下居中
          data: this.provinceDataList
        },
        series: [{
          type: 'pie',
          showVal: true,
          center: ['28%', '50%'],
          radius: ['45%', '70%'],
          clockwise: true,
          avoidLabelOverlap: true,
          hoverOffset: 10,
          itemStyle: {
            normal: {
              color: function (params) {
                return colorList[params.dataIndex]
              }
            }
          },
          label: {
            normal: {
              position: 'inner',
              show: false
            }
          },
          labelLine: {
            normal: {
              length: 20,
              length2: 30,
              lineStyle: {
                width: 1
              }
            }
          },
          data: this.provinceDataList
        }]
      }
      chartObj.setOption(option)
      chartObj.hideLoading()
    }
  }
}
</script>
