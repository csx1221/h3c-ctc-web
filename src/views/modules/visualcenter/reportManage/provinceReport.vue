<template>
  <el-dialog :visible.sync="visibleReport" @close="closeToast" width="80%" title="各省通过率变化趋势图" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row>
      <el-col :span="16"  style="height:250px;width:1300px" id="provinceReport"></el-col>
    </el-row>
  </el-dialog>
</template>

<script>
const echarts = require('echarts')
export default {
  name: 'provinceReport',
  data () {
    return {
      provinceReportUrl: '/ctc/visualization/report/participant/pass',
      visibleReport: false,
      isPasspate: false,
      seriesName: '',
      legendDate: [],
      dataForm: {
        projectId: '',
        startDate: '',
        endDate: '',
        labelId: ''
      }
    }
  },
  props: {
    dataForms: Object
  },
  mounted () {
  },
  methods: {
    init () {
      this.visibleReport = true
      this.getProvinceReportData()
    },
    getProvinceReportData () {
      let thisvm = this
      thisvm.$http.get(
        thisvm.provinceReportUrl,
        {
          params: {
            startDate: thisvm.dataForm.startDate,
            endDate: thisvm.dataForm.endDate,
            labelId: thisvm.dataForm.labelId,
            projectId: thisvm.dataForm.projectId,
            page: 1,
            limit: 999999
          }
        }
      ).then(({ data: res }) => {
        if (res.code !== 0) {
          this.total = 0
          return this.$message.error(res.msg)
        }

        let obj = {}
        obj.startData = []
        obj.iniPassRate = []
        obj.endData = []
        obj.averageData = []
        obj.xAxisData = []
        obj.seriesData = []
        if (res.data && res.data.list.length > 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            obj.xAxisData.push(res.data.list[i].organizeName)
            if (!res.data.list[i].passRateDTO.startDatePassRate) {
              obj.startData.push(0)
            } else {
              obj.startData.push(res.data.list[i].passRateDTO.startDatePassRate)
            }
            if (!res.data.list[i].passRateDTO.iniPassRate) {
              obj.iniPassRate.push(0)
            } else {
              obj.iniPassRate.push(res.data.list[i].passRateDTO.iniPassRate)
            }
            if (!res.data.list[i].passRateDTO.endDatePassRate) {
              obj.endData.push(0)
            } else {
              obj.endData.push(res.data.list[i].passRateDTO.endDatePassRate)
            }
            if (!res.data.list[i].avgPassRate) {
              obj.averageData.push(0)
            } else {
              obj.averageData.push(res.data.list[i].avgPassRate)
            }
          }
        }
        this.isPasspate = thisvm.dataForm.iniPassPateVisible
        if (this.isPasspate === true) {
          this.legendDate = [{
            name: '初始通过率',
            icon: 'triangle' }, { name: '结束日期通过率',
            icon: 'diamond' }]
          this.seriesName = '初始通过率'
          obj.seriesData = obj.iniPassRate
        } else {
          this.legendDate = [{ name: '起始日期通过率',
            icon: 'triangle' }, { name: '结束日期通过率',
            icon: 'diamond' }]
          this.seriesName = '起始日期通过率'
          obj.seriesData = obj.startData
        }
        obj.sizeData = []
        obj.seriesData.forEach((item, i) => {
          if (Number(item) === Number(obj.endData[i])) {
            obj.sizeData.push(12)
          } else {
            obj.sizeData.push(6)
          }
        })
        thisvm.loadProvinceReportGraph(obj)
      }).catch(() => {
      })
    },
    loadProvinceReportGraph (data) {
      let provinceReport = echarts.init(document.getElementById('provinceReport'))
      provinceReport.clear()
      provinceReport.setOption(this.getOption(data))
    },
    getOption (data) {
      let option = {
        tooltip: {
          show: true
        },
        legend: {
          icon: 'circle',
          data: this.legendDate,
          left: 'center',
          top: 'bottom',
          itemGap: 30,
          textStyle: {
            color: 'fff'
          },
          itemWidth: 10,
          itemHeight: 10
        },
        grid: {
          left: '5%',
          right: '20%',
          bottom: '10%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.xAxisData,
          axisLine: {
            lineStyle: {
              color: '#2dd8ff'
            }
          },
          axisLabel: {
            show: true,
            interval: 0,
            rotate: 50,
            textStyle: {
              color: '#909399'
            }
          },
          boundaryGap: ['10%', '30%']
        },
        yAxis: {
          type: 'value',
          scale: true,
          name: '通过率%',
          nameLocation: 'middle',
          nameGap: 30,
          splitNumber: 4,
          max: 100,
          min: 0
        },
        series: [{
          name: this.seriesName,
          type: 'line',
          data: data.seriesData,
          color: 'rgb(229,107,0)',
          symbol: 'triangle',
          lineStyle: {
            normal: {
              width: 1.5
            }
          },
          symbolSize: (value, params) => {
            console.log(data.sizeData)
            return data.sizeData[params.dataIndex]
          }
        },
        {
          name: '结束日期通过率',
          type: 'line',
          color: 'rgb(0,177,241)',
          data: data.endData,
          symbol: 'diamond',
          lineStyle: {
            normal: {
              width: 1.5
            }
          },
          symbolSize: 6
        },
        {
          name: '平均通过率',
          type: 'line',
          color: 'rgb(255,255,81)',
          symbol: 'none',
          data: data.averageData,
          lineStyle: {
            normal: {
              width: 1.5
            }
          },
          endLabel: {
            show: true,
            color: 'rgb(56,56,56)',
            formatter: '{a}: {c}%'
          },
          smooth: true
        }]
      }
      return option
    },
    closeToast () {
    }
  }
}
</script>
