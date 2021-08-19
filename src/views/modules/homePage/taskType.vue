<template>
    <div class="bcw taskType">
        <el-row class="taskTypeFix">
            <el-col :span="12" class="split-line" style="text-align:left;">
                任务类型
            </el-col>
        </el-row>
        <el-row class="taskTypeCol">
            <el-col :span="24" class="taskTitle">
                <div class="taskTitle-left">类型</div>
                <div class="taskTitle-right">
                    <span style="width: 100px">名称</span>
                    <span>数量</span>
                </div>
            </el-col>
            <el-col id="test" :span="24"></el-col>
        </el-row>
    </div>
</template>

<script>
const echarts = require('echarts')
export default {
  name: 'taskType',
  mounted () {
    this.getView()
    window.onresize = function () {
      echarts.init(document.getElementById('test')).resize()
    }
  },
  methods: {
    getView () {
      let defectStatusChart = echarts.init(document.getElementById('test'))
      defectStatusChart.clear()
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          top: 'center',
          itemGap: 20,
          formatter: function (name) {
            var target = ''
            var data = option.series[0].data
            for (var i = 0, l = data.length; i < l; i++) {
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            return '{a|' + name + '}{b|' + target + '}'
          },
          textStyle: {
            rich: {
              a: {
                width: 100
              },
              b: {

              }
            }
          },
          right: '10%'
          // data: ['测试需求分析', '测试方案设计', '用例设计', '测试执行', '缺陷任务', '可配置新增任务']
        },
        color: [
          '#3498DB', '#455C73', '#9B59B6', '#26B99A', '#3FBFCA', '#44E9A6'
        ],
        series: [
          {
            name: '任务类型',
            type: 'pie',
            radius: ['50%', '65%'],
            center: ['50%', '50%'],
            // left: '-30%',
            width: '50%',
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold',
                formatter: '{b}' + '\n ' + '{b|{d}}' + '{c|%}',
                rich: {
                  b: {
                    fontSize: '30',
                    height: 50,
                    verticalAlign: 'bottom'
                  },
                  c: {
                    fontSize: '12',
                    height: 40,
                    verticalAlign: 'bottom'
                  }
                }
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: '测试需求分析' },
              { value: 310, name: '测试方案设计' },
              { value: 234, name: '用例设计' },
              { value: 135, name: '测试执行' },
              { value: 1548, name: '缺陷任务' },
              { value: 1548, name: '可配置新增任务' }
            ]
          }
        ]
      }
      defectStatusChart.setOption(option)
    }
  }
}
</script>

<style scoped lang="scss">
    .taskType{
        display: flex;
        flex-flow: column;
        .taskTypeCol{
            flex: 1;
        }
        #test{
            height: 100%;
        }
    }
    .taskTitle{
        color: #cccccc;
        .taskTitle-left{
            display: inline-block;
            margin-left: 22%;
        }
        .taskTitle-right{
            display: inline-block;
            margin-right: 12%;
            float: right;
            span{
                display: inline-block;
            }
        }
    }
</style>
