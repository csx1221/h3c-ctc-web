<template>
  <div ref="scheduleColumnar" style="height: 360px;"></div>
</template>

<script>
const echarts = require('echarts')
export default {
  props: {
    schedulePro: {
      count: Array,
      projectId: String,
      dateCount: Array,
      dateList: Array,
      getLength: String,
      planEndTime: Array,
      planStartTime: Array,
      schedule: Array,
      stageName: Array
    }
  },
  data () {
    return {
      optionNumber: '0'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.createdColumnar()
    })
  },
  watch: {
    'schedulePro': {
      handler (newVal, oldVal) {
        if (newVal.projectId !== this.optionNumber) {
          this.createdColumnar()
        }
      }
    }
  },
  methods: {
    // 实际时间计算
    calculateDate (type, date, num) {
      var nowDate = null
      var strDate = ''
      num = parseInt(num)
      var seperator1 = '-'
      var seperator2 = ':'
      if (date === '') {
        nowDate = new Date()
      } else {
        nowDate = new Date(date)
      }
      if (type === 'Y') {
        nowDate.setFullYear(nowDate.getFullYear() + num)
      }
      if (type === 'M') {
        nowDate.setMonth(nowDate.getMonth() + num)
      }
      if (type === 'D') {
        nowDate.setDate(nowDate.getDate() + num)
      }
      if (type === 'A') {
        nowDate.setFullYear(nowDate.getFullYear() + num)
        nowDate.setMonth(nowDate.getMonth() + num)
        nowDate.setDate(nowDate.getDate() + num)
      }
      var year = nowDate.getFullYear()
      var month = nowDate.getMonth() + 1
      strDate = nowDate.getDate()
      var hours = nowDate.getHours()
      var minutes = nowDate.getMinutes()
      var seconds = nowDate.getSeconds()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      if (seconds >= 0 && seconds <= 9) {
        seconds = '0' + seconds
      }
      var dateStr = year + seperator1 + month + seperator1 + strDate + ' ' + hours + seperator2 + minutes + seperator2 + seconds
      return dateStr
    },
    createdColumnar () {
      const getDataList = this.schedulePro
      const planStartList = []
      const planEndList = []
      const realityList = []
      let calculateNumber = 0
      for (var k = 0; k < getDataList.getLength; k++) {
        planStartList.push(new Date(getDataList.planStartTime[k]))
        planEndList.push(new Date(getDataList.planEndTime[k]))
        // 间隔天数 * 百分比 + 开始时间 = 实际过程时间
        calculateNumber = parseFloat(getDataList.schedule[k] / 100) * getDataList.dateCount[k]
        let result = this.calculateDate('D', getDataList.planStartTime[k], calculateNumber)
        realityList.push(new Date(result))
      }
      var series = []
      series.push({
        name: '计划开始时间',
        type: 'bar',
        stack: '总量',
        barWidth: 14,
        itemStyle: {
          normal: {
            color: 'rgba(0,0,0,0)'
          }
        },
        data: planStartList
      },
      {
        name: '计划周期时间',
        type: 'bar',
        stack: '总量',
        barWidth: 14,
        itemStyle: {
          normal: {
            color: '#D3D3D3'
          }
        },
        data: planEndList
      },
      {
        name: '实际开始时间',
        type: 'bar',
        stack: '总量',
        barWidth: 14,
        itemStyle: {
          normal: {
            color: 'rgba(0,0,0,0)'
          }
        },
        data: planStartList
      },
      {
        name: '实际进度时间',
        type: 'bar',
        stack: '总量',
        barWidth: 14,
        itemStyle: {
          normal: {
            color: '#45e9a5'
          }
        },
        data: realityList
      })
      const chartObj = echarts.init(this.$refs.scheduleColumnar)
      chartObj.clear()
      chartObj.showLoading()
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let _params = params
            _params[3].schedule = getDataList.schedule
            var res = params[0].name + '</br>'
            for (var n = 0; n < getDataList.getLength; n++) {
              var startPlan = params[n].data
              var endPlan = params[1].data
              var startReal = params[2].data
              var endReal = params[3].data
              startPlan = startPlan.getFullYear() + '-' + (startPlan.getMonth() + 1) + '-' + startPlan.getDate()
              endPlan = endPlan.getFullYear() + '-' + (endPlan.getMonth() + 1) + '-' + endPlan.getDate()
              startReal = startReal.getFullYear() + '-' + (startReal.getMonth() + 1) + '-' + startReal.getDate()
              endReal = endReal.getFullYear() + '-' + (endReal.getMonth() + 1) + '-' + endReal.getDate()
              res += params[1].seriesName + ':' + startPlan + '~' + endPlan + '</br>' + params[3].seriesName + ':' +
              startReal + '~' + endReal + '</br>' + '实际进度' + ':' + _params[3].schedule[params[0].dataIndex] + '%'
              return res
            }
          }
        },
        title: {
          text: '阶段进度',
          textStyle: {
            color: '#333',
            fontWeight: 400,
            fontSize: 15
          },
          left: '5%',
          top: '8%'
        },
        legend: {
          data: ['计划周期时间', '实际进度时间']
        },
        yAxis: [{
          type: 'category',
          data: getDataList.stageName
        }],
        xAxis: [{
          type: 'time'
        }],
        series: series
      }
      chartObj.setOption(option, true)
      chartObj.hideLoading()
      series = []
    }
  }
}
</script>
