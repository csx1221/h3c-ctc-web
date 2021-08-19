<template>
  <el-row type="flex" justify="center" align="middle">
    <el-col :span="20">
      <div ref="columnar" style="height: 210px;width: 100%;"></div>
    </el-col>
    <el-col :span="4">
      <el-row>
        <el-col :span="24" class="scheduleView">计划进度: {{ projectSchedule.planSchedule || '0' }}%</el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="scheduleView">实际进度: {{ projectSchedule.aclSchedule || '0' }}%</el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="scheduleView">项目状态: {{ $getDictLabel('project.projectStatus', projectSchedule.status) }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24" class="scheduleView"
          :class="`${projectSchedule.postpone == 0 ?
          'Unpostpone' : projectSchedule.postpone == 1 ?
          'hadPostpone' : projectSchedule.postpone == 2 ?
          'postponed' : 'normalPostpone'}`">
          延期风险:
          {{ $getDictLabel('extensionRisk', projectSchedule.postpone) }}
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
const echarts = require('echarts')
export default {
  props: {
    projectSchedule: Object
  },
  data () {
    return {
      optionNumber: 0
    }
  },
  mounted () {
  },
  watch: {
    'projectSchedule': {
      handler: function (newVal, oldVal) {
        if (newVal.projectId !== this.optionNumber) {
          this.initColumnar()
        }
      }
    }
  },
  methods: {
    initColumnar () {
      // 初始化数据
      const getmydmc = ['计划', '实际']
      // 柱状图数据赋值拿来用
      const getmyd = [this.projectSchedule.planSchedule, this.projectSchedule.aclSchedule]
      // 柱状图格子
      var getmydzd = []
      for (let i = 0; i < getmyd.length; i++) {
        getmydzd.push(100)
      }
      // 先创建节点
      const chartObj = echarts.init(this.$refs.columnar)
      chartObj.clear()
      // 实现一个懒加载过程
      chartObj.showLoading()
      // 创建完节点之后把参数带入
      const option = {
        // 柱状图的间距大小
        grid: {
          left: '5%',
          right: '5%',
          bottom: '10%',
          top: '10%'
        },
        // 提示框的属性
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          formatter: function (datas) {
            var res = datas[0].name + '<br/>'
            var val = ''
            for (var i = 0, length = datas.length; i < length; i++) {
              val = (datas[i].value) + '%'
              res += datas[i].seriesName + '：' + val + '<br/>'
            }
            return res
          }
        },
        // x轴的属性
        xAxis: {
          type: 'value',
          position: 'top',
          axisLine: {
            onZero: false
          }
        },
        // y轴的属性
        yAxis: [{
          show: true,
          type: 'category',
          inverse: true,
          axisLabel: {
            // 左边的文字宽度样式
            formatter: function (value) {
              var ret = ''
              var maxLength = 5
              var valLength = value.length
              var rowN = Math.ceil(valLength / maxLength)
              if (rowN > 1) {
                var temp = ''
                var start = 0
                var end = maxLength
                temp = value.substring(start, end) + '\n' + value.substring(end, valLength)
                ret += temp
                return ret
              } else {
                return value
              }
            },
            // 文字色调和大小
            textStyle: {
              color: '#666666',
              fontSize: '15',
              lineHeight: 20
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          // 启动左边的边框
          axisLine: {
            show: true
          },
          // 柱状图的数值
          data: getmydmc
        },
        // 右边数据的显示，目前已经关闭
        {
          type: 'category',
          inverse: true,
          axisTick: true,
          axisLine: true,
          show: false,
          axisLabel: {
            textStyle: {
              color: '#333333',
              fontSize: '15'
            },
            formatter: '{value}%'
          },
          // 柱状图的数值
          data: getmyd
        }],
        // 柱状图的色调
        series: [{
          name: '进度',
          type: 'bar',
          zlevel: 1,
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = ['#2196f3', '#45e9a5']
                return colorList[params.dataIndex]
              },
              //  管理柱状图颜色和数值
              label: {
                show: true,
                formatter: function (params) {
                  var insideData = getmyd
                  return insideData[params.dataIndex] + '%'
                },
                position: ['50%', '35%'],
                textStyle: {
                  color: '#eee',
                  fontSize: 18
                }
              }
            }
          },
          barWidth: 40,
          data: getmyd
        }, {
          name: '总量',
          type: 'bar',
          barWidth: 40,
          barGap: '-100%',
          data: getmydzd,
          itemStyle: {
            normal: {
              color: 'rgba(215, 215, 215, 0.8)'
            }
          }
        }]
      }
      // 把属性放入组件中
      chartObj.setOption(option)
      // 隐藏加载
      chartObj.hideLoading()
    }
  }
}
</script>

<style scoped>
  .scheduleView {
    font-size: 18px;
    text-align: center;
    padding: 8px;
    text-align: left;
  }
  .Unpostpone {
    color: green;
  }
  .postponed {
    color: red;
  }
  .hadPostpone {
    color: orange;
  }
  .normalPostpone {
    color: '#59595A';
  }
</style>
