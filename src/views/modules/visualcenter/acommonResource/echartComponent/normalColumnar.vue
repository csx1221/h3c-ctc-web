<template>
  <div ref="normalValue" style="height: 350px;"></div>
</template>

<script>
const echarts = require('echarts')
export default {
  props: {
    normalColumnar: Array
  },
  data () {
    return {
      optionNumber: 0
    }
  },
  mounted () {
  },
  watch: {
    'normalColumnar': {
      handler: function (newVal, oldVal) {
        if (newVal.projectId !== this.optionNumber) {
          this.createdColumnar()
        }
      }
    }
  },
  methods: {
    createdColumnar () {
      var getNameList = this.normalColumnar.length > 6 ? ['已否决', '待修复', '已关闭', '挂起', '否决待确定', '待验证', '待发布'] : ['未执行', '通过用例数', '不通过用例数', '免测用例数', '测试受阻用例数', '无法测试用例数']
      const echartsObj = echarts.init(this.$refs.normalValue)
      echartsObj.clear()
      echartsObj.showLoading()
      const option = {
        color: ['#45e9a5'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: getNameList,
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          type: 'bar',
          barWidth: '15',
          data: this.normalColumnar
        }]
      }
      echartsObj.setOption(option)
      echartsObj.hideLoading()
    }
  }
}
</script>
