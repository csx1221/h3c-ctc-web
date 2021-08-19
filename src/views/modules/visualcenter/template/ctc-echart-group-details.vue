<template>
  <div class="ctc-echarts-group">
    <el-dialog :visible.sync="visible" @close="cancelHandle" width="50%" :modal="false" title="图表设置" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="dataForm" ref="dataForm">
        <el-row>
          <el-col :span="12">
            <div ref="echartsValue" style="height: 400px;width: 100%;"></div>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="chartType" label="图表类型">
                  <el-radio-group v-model="dataForm.chartType" disabled>
                    <el-radio :label="0">柱状图</el-radio>
                    <el-radio :label="1">饼图</el-radio>
                    <el-radio :label="2">折线图</el-radio>
                    <el-radio :label="3">堆积图</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="属性设置">
                  <el-collapse v-model="activeNames">
                    <el-collapse-item title="标题" name="1">
                      <el-form-item prop="chartName" label="标题名称">
                        <el-input v-model="dataForm.chartName" readonly maxlength="32"></el-input>
                      </el-form-item>
                    </el-collapse-item>
                    <el-collapse-item title="X轴" name="2">
                      <el-form-item prop="legendName" label="图例">
                        <el-input v-model="dataForm.legendName" readonly></el-input>
                      </el-form-item>
                      <el-form-item prop="dataValueName" label="数据值">
                        <el-input v-model="dataForm.dataValueName" readonly></el-input>
                      </el-form-item>
                    </el-collapse-item>
                    <el-collapse-item title="Y轴" name="3" :disabled="disabled">
                      <el-form-item prop="maxValue" label="最大值">
                        <el-input v-model="dataForm.maxValue" readonly></el-input>
                      </el-form-item>
                      <el-form-item prop="minValue" label="最小值">
                        <el-input v-model="dataForm.minValue" readonly></el-input>
                      </el-form-item>
                      <el-form-item prop="isShow" label="是否显示">
                        <el-checkbox v-model="dataForm.isShow" disabled></el-checkbox>
                      </el-form-item>
                    </el-collapse-item>
                  </el-collapse>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
var chartObj = ''
var echartsOption
const echarts = require('echarts')
export default {
  name: 'CtcEchartGroupDetails',
  data () {
    return {
      visible: false,
      dataForm: {
        UUID: '',
        chartType: 0,
        isShow: true,
        chartName: '',
        legendName: '',
        dataValueName: '',
        maxValue: '',
        minValue: ''
      },
      activeNames: ['1', '2', '3'],
      disabled: false,
      echartsColor: ['#2EC7C9', '#B6A2DE', '#5AB1EF', '#FFB980', '#D87A80', '#8D98B3', '#E5CF0D', '#97B552', '#95706D', '#DC69AA', '#88c9c5', '#cbc5de', '#1397ef', '#ffe2c9', '#d8aaab', '#5a6ab3', '#e3e563', '#a4b57d', '#955850', '#dc8bc0', '#12c9c9', '#8663de', '#4bbeef', '#ffdf9e', '#d8828a', '#8585b3', '#e4e58d', '#b2b5a9', '#958474', '#d493dc']
    }
  },
  props: {
  },
  watch: {
    'dataForm.chartType': {
      deep: true,
      handler: function (newVal, oldVal) {
        this.dataForm.chartType = Number(this.dataForm.chartType)
        this.createdEcharts()
      }
    }
  },
  computed: {
  },
  methods: {
    initDialog () {
      this.visible = true
      if (this.dataForm.chartType === 1) {
        this.activeNames = ['1', '2']
        this.disabled = true
      } else {
        this.activeNames = ['1', '2', '3']
        this.disabled = false
      }
    },
    cancelHandle () {
      this.visible = false
      this.$refs['dataForm'].resetFields()
    },
    random (min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    },
    createdEcharts () {
      this.$nextTick(() => {
        chartObj = echarts.init(this.$refs.echartsValue)
        chartObj.clear()
        chartObj.showLoading()
        let seriesData = []
        let dataValueName = this.dataForm.dataValueName.split(',')
        let xAxisData = []
        if (this.dataForm.chartType === 1) {
          for (let j = 0; j < 7; j++) {
            seriesData.push({ value: this.random(10, 200), name: '数据' + (j + 1) })
          }
        } else {
          for (let i = 0; i < dataValueName.length; i++) {
            let data = []
            for (let j = 0; j < 7; j++) {
              data.push(this.random(10, 200))
            }
            if (this.dataForm.chartType === 0) {
              seriesData.push({ name: dataValueName[i], data: data, type: 'bar' })
            } else if (this.dataForm.chartType === 2) {
              seriesData.push({ name: dataValueName[i], data: data, type: 'line' })
            } else {
              seriesData.push({ name: dataValueName[i], data: data, type: 'bar', stack: 'total', label: { show: true }, emphasis: { focus: 'series' } })
            }
          }
          for (let i = 0; i < 7; i++) {
            xAxisData.push('数据' + (i + 1))
          }
        }
        let maxValue = this.dataForm.maxValue ? this.dataForm.maxValue : 0
        let minValue = this.dataForm.minValue ? this.dataForm.minValue : 0
        if (this.dataForm.chartType === 0) {
          echartsOption = {
            color: this.echartsColor,
            title: {
              text: this.dataForm.chartName,
              left: 'center'
            },
            legend: {
              data: this.dataForm.dataValueName.split(','),
              bottom: 'bottom'
            },
            xAxis: {
              type: 'category',
              data: xAxisData
            },
            yAxis: {
              type: 'value',
              show: this.dataForm.isShow,
              max: function (value) {
                return maxValue > value.max ? maxValue : value.max
              },
              min: function (value) {
                return minValue < value.min ? minValue : value.min
              },
              axisLine: {
                show: true,
                onZero: false
              }
            },
            series: seriesData
          }
        } else if (this.dataForm.chartType === 1) {
          echartsOption = {
            color: this.echartsColor,
            title: {
              text: this.dataForm.chartName,
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              top: '8%',
              left: 'center'
            },
            series: [
              {
                type: 'pie',
                radius: '50%',
                data: seriesData,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }
        } else if (this.dataForm.chartType === 2) {
          echartsOption = {
            color: this.echartsColor,
            title: {
              text: this.dataForm.chartName,
              left: 'center'
            },
            legend: {
              data: this.dataForm.dataValueName.split(','),
              bottom: 'bottom'
            },
            xAxis: {
              type: 'category',
              data: xAxisData
            },
            yAxis: {
              type: 'value',
              show: this.dataForm.isShow,
              max: function (value) {
                return maxValue > value.max ? maxValue : value.max
              },
              min: function (value) {
                return minValue < value.min ? minValue : value.min
              },
              axisLine: {
                show: true,
                onZero: false
              }
            },
            series: seriesData
          }
        } else {
          echartsOption = {
            color: this.echartsColor,
            title: {
              text: this.dataForm.chartName,
              left: 'center'
            },
            legend: {
              data: this.dataForm.dataValueName.split(','),
              bottom: 'bottom'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '8%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: xAxisData
            },
            yAxis: {
              type: 'value',
              show: this.dataForm.isShow,
              max: function (value) {
                return maxValue > value.max ? maxValue : value.max
              },
              min: function (value) {
                return minValue < value.min ? minValue : value.min
              },
              axisLine: {
                show: true,
                onZero: false
              }
            },
            series: seriesData
          }
        }
        chartObj.setOption(echartsOption)
        chartObj.hideLoading()
      })
    }
  }
}
</script>
<style lang="scss" >
.ctc-echarts-group {
  .el-dialog {
    box-shadow: 0px 0px 25px rgba($color: #000000, $alpha: 0.3);
    .el-form-item__label {
      width: 120px!important;
    }
    .el-form-item__content {
      margin-left: 120px!important;
    }
    .el-collapse-item {
      .el-collapse-item__content {
        padding-bottom: 0px;
        .el-form-item {
          margin-bottom: 15px!important;
          .el-form-item__label {
            width: 100px!important;
          }
          .el-form-item__content {
            margin-left: 100px!important;
          }
        }
      }
    }
  }
  .el-dialog__body {
    padding: 0px 20px 30px;
  }
  .el-checkbox-button {
    margin-top: 15px;
    margin-left: 15px;
  }
  .el-checkbox-button__inner {
    border-radius: 0!important;
    width: auto;
    padding: 12px 10px;
    text-align: center;
    font-size: 13px;
    border: 1px solid #DCDFE6;
  }
}
</style>
