<template>
  <el-row>
    <el-col :span="12" :id="'testTypePie'+testTypeData.projectId" style="height: 400px;border:1px solid #ebeef5;border-right:none;">
    </el-col>
    <el-col :span="12" style="height: 400px;">
      <el-table stripe highlight-current-row :data="tableData" ref="tableData" border height="400" style="width: 100%;">
        <el-table-column prop="name" label="测试类型" header-align="center" align="center" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="value" label="缺陷个数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="proVal" label="缺陷占比" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.proVal?scope.row.proVal*100+'%':'--'}}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="24" :id="'testTypeProvinceBar'+testTypeData.projectId" style="height: 500px;border:1px solid #ebeef5;border-top:none;">
    </el-col>
    <el-col :span="12" :id="'defectLevelProvincePie'+testTypeData.projectId" style="height: 450px;border:1px solid #ebeef5;border-top:none;"></el-col>
    <el-col :span="12" :id="'defectLevelProvince'+testTypeData.projectId" style="height: 450px;padding-top:2%;border:1px solid #ebeef5;border-top:none;">
      <template v-for="(item,index) in defectProvinceData">
        <div :key="index" class="defect-province-div">
          {{index+1}}、{{item.typeName}}（{{item.provinceInfo.length}}个）：{{item.provinceInfo.length>0?item.provinceInfo.join('、'):'无'}}
        </div>
      </template>
    </el-col>
  </el-row>
</template>
<script>
const echarts = require('echarts')
export default {
  name: 'TestType',
  props: {
    testTypeData: Object
  },
  data () {
    return {
      tableData: [],
      defectProvinceData: []
    }
  },
  mounted () {
  },
  watch: {
    testTypeData: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.$nextTick(() => {
          this.loadEchartData()
          this.loadEchartTestProvinceData()
          this.loadEchartProvinceData()
        })
      }
    }
  },
  methods: {
    loadEchartData () {
      let echartData = this.testTypeData.testType || []
      let defectCountSum = 0
      echartData.forEach((item, index) => {
        defectCountSum = defectCountSum + parseInt(item.value)
      })
      let tableData = Object.assign([], echartData)
      // 设置占比值
      tableData.map((item, index) => {
        item.proVal = Math.round(item.value / defectCountSum * 100) / 100
      })
      // 特殊处理，增加汇总值
      if (tableData.length > 0) {
        tableData.push({ 'name': '汇总值', 'value': defectCountSum, 'proVal': 1 })
      }
      this.tableData = tableData
      const colorList = ['#ff4319', '#ffa200', '#f7e600', '#00e095', '#5b94ff', '#58D5FF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A', '#9E87FF']
      const option = {
        tooltip: {
          trigger: 'item'
        },
        series: [{
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['25%', '40%'],
          minAngle: 10,
          avoidLabelOverlap: true,
          hoverOffset: 15,
          itemStyle: {
            color: (params) => {
              return colorList[params.dataIndex]
            }
          },
          label: {
            show: true,
            position: 'outer',
            alignTo: 'labelLine',
            height: 0,
            lineHeight: 0,
            distanceToLabelLine: 0, // 圆点到labelline距离
            borderRadius: 2.5,
            padding: [2.5, -2.5, 2.5, -2.5],
            formatter: ' {b}：{c}个 {d}%',
            rich: {
              a: {
                padding: [0, 0, 0, 10]
              },
              b: {
                padding: [0, 10, 0, 0]
              }
            }
          },
          data: echartData
        }]
      }
      if (this.testTypeData.projectId) {
        let divId = 'testTypePie' + this.testTypeData.projectId
        let testTypePieObj = echarts.init(document.getElementById(divId))
        testTypePieObj.clear()
        testTypePieObj.setOption(option)
        testTypePieObj.hideLoading()
        if (echartData.length === 0) {
          testTypePieObj.showLoading({
            text: '暂无数据',
            color: '#ffffff',
            textColor: '#8a8e91',
            maskColor: 'rgba(255, 255, 255, 0.8)'
          })
        }
      }
    },
    loadEchartTestProvinceData () {
      let testTypeProvince = this.testTypeData.testTypeProvince || {}
      let data = {}
      data.area = testTypeProvince.provinceName || []
      data.legend = testTypeProvince.legend || []
      data.data = testTypeProvince.provinceData || []
      var option = {
        title: {
          text: '缺陷省份分布图',
          x: '2%',
          textStyle: {
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: 'normal'
          }
        },
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
      if (this.testTypeData.projectId) {
        let divId = 'testTypeProvinceBar' + this.testTypeData.projectId
        let testTypeProvinceBarObj = echarts.init(document.getElementById(divId))
        testTypeProvinceBarObj.clear()
        testTypeProvinceBarObj.setOption(option)
        testTypeProvinceBarObj.hideLoading()
        if (data.legend.length === 0) {
          testTypeProvinceBarObj.showLoading({
            text: '暂无数据',
            color: '#ffffff',
            textColor: '#8a8e91',
            maskColor: 'rgba(255, 255, 255, 0.8)'
          })
        }
      }
    },
    loadEchartProvinceData () {
      let data = this.testTypeData.defectLevelProvince || {}
      let defectLevel = data.defectLevel || []
      this.defectProvinceData = data.defectProvinceData || []
      let option = {
        title: {
          text: '缺陷等级对应省份分布',
          x: '2%',
          textStyle: {
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: 'normal'
          }
        },
        color: ['#ff4319', '#ffa200', '#f7e600', '#00e095', '#5b94ff', '#58D5FF', '#73ACFF', '#FDD56A', '#FDB36A', '#FD866A', '#9E87FF'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}个 ({d}%)'
        },
        toolbox: {
          show: true
        },
        legend: {
          right: '10%',
          orient: 'vertical',
          align: 'left',
          top: 'middle',
          textStyle: {
            color: '#8C8C8C'
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: [0, 140],
            center: ['35%', '50%'],
            data: defectLevel,
            label: {
              normal: {
                formatter: '{font|{b} {c}个}\n{hr|}\n{font|{d}%}',
                rich: {
                  font: {
                    fontSize: 13,
                    padding: [2, 0]
                  },
                  hr: {
                    height: 0,
                    borderWidth: 1,
                    width: '100%'
                  }
                }
              }
            }
          }
        ]
      }
      if (this.testTypeData.projectId) {
        let divId = 'defectLevelProvincePie' + this.testTypeData.projectId
        let testTypeProvinceBarObj = echarts.init(document.getElementById(divId))
        testTypeProvinceBarObj.clear()
        testTypeProvinceBarObj.setOption(option)
        testTypeProvinceBarObj.hideLoading()
        if (defectLevel.length === 0) {
          testTypeProvinceBarObj.showLoading({
            text: '暂无数据',
            color: '#ffffff',
            textColor: '#8a8e91',
            maskColor: 'rgba(255, 255, 255, 0.8)'
          })
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.defect-province-div {
  padding: 0px 24px;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 2px;
}
</style>
