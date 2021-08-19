<template>
  <div ref="warnCircleNode" style="height: 250px;width:100%;"></div>
</template>

<script>
const echarts = require('echarts')
export default {
  props: {
    warnCircle: Object
  },
  data () {
    return {
      optionNumber: 0,
      provinceDataList: [],
      defectTypeData: []
    }
  },
  mounted () {
    this.defectTypeData = []
  },
  watch: {
    'warnCircle': {
      handler: function (newVal, oldVal) {
        this.provinceDataList = []
        if (newVal.projectId !== this.optionNumber) {
          this.optionNumber = newVal.projectId
          // 获取缺陷类型数据
          this.getDefectConfInfo(newVal.projectId)
        }
        this.dealProvinceData()
      }
    }
  },
  methods: {
    getDefectConfInfo (projectId) {
      let thisvm = this
      let params = {}
      params.projectId = projectId
      params.dictType = 'defectType'
      params.isAutoFill = true
      thisvm.$http.get('/ctc/defect/defectConfInfo/getDefectConfInfo', { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          thisvm.defectTypeData = res.data
        }
      }).catch(() => { })
    },
    // 处理数据
    dealProvinceData () {
      let thisvm = this
      let defectTypeDisMap = thisvm.warnCircle.defectSurvey.defectTypeDisMap || {}
      if (Object.keys(defectTypeDisMap).length > 0) {
        thisvm.defectTypeData.forEach((item, index) => {
          if (defectTypeDisMap[item.dictValue] > 0) {
            let obj = {}
            obj.name = item.dictLabel
            obj.value = defectTypeDisMap[item.dictValue]
            thisvm.provinceDataList.push(obj)
          }
        })
      } else {
        thisvm.defectTypeData.forEach((item, index) => {
          let obj = {}
          obj.name = item.dictLabel
          obj.value = defectTypeDisMap[item.dictValue] || 0
          thisvm.provinceDataList.push(obj)
        })
      }
      thisvm.createdCircle()
    },
    // 创建
    createdCircle () {
      var colorList = ['#f000ff', '#ff0100', '#ffa200', '#3991ff',
        '#4ecb73', '#a14eff', '#e3cf29', '#ec643e', '#00FF00', '#60ffc9']
      const chartObj = echarts.init(this.$refs.warnCircleNode)
      chartObj.clear()
      chartObj.showLoading()
      const option = {
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
