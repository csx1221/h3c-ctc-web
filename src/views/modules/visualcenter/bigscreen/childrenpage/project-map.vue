<template>
  <el-row>
    <el-col :span="24">
      <div id="project-map" class="project-map" :style="{height:(dataObject.clientHeight)+'px'}" @mouseenter="enterOrLeave(1)" @mouseleave="enterOrLeave(2)"></div>
    </el-col>
  </el-row>
</template>
<script>
import china from './map/json/china.json'
const echarts = require('echarts')
echarts.registerMap('china', china)
let option = null
let barTopColor = ['rgba(240, 201, 95, 1)', 'rgba(160, 79, 251, 1)', 'rgb(50,126,254,1)']
export default {
  name: 'ProjectMap',
  props: {
    dataObject: Object
  },
  data () {
    return {
      recordReloadIndex: 0, // 记录重新加载次数
      switchIntervalDraw: 0,
      projectMapObj: null,
      mapCurrentIndex: 0, // map地图高亮索引值
      mapEnterLeave: true, // 鼠标移入移出
      // 中国地图省会坐标
      geoCoordMap: {
        '北京市': [116.5851, 42.4839],
        '天津市': [118.491041, 41.244857],
        '河北省': [114.811934, 39.058785],
        '山东省': [121.989563, 39.682589],
        '辽宁省': [123.225425, 44.819004],
        '黑龙江省': [129.90352, 50.758573],
        '吉林省': [126.322646, 45.871432],
        '河南省': [112.627458, 35.362387],
        '山西省': [112.543424, 40.887658],
        '安徽省': [117.793119, 33.87839],
        '江苏省': [119.499398, 35.545042],
        '上海市': [122.477611, 33.826174],
        '浙江省': [120.558498, 30.291092],
        '福建省': [117.807623, 28.068211],
        '广东省': [114.861811, 25.318408],
        '江西省': [115.62252, 30.99553],
        '湖北省': [110.605858, 32.805913],
        '湖南省': [112.53296, 30.036376],
        '广西壮族自治区': [108.826736, 25.824533],
        '海南省': [111.290648, 22.212453],
        '重庆市': [107.246798, 32.678004],
        '四川省': [103.063163, 32.667561],
        '陕西省': [109.945798, 38.296079],
        '内蒙古自治区': [109.694848, 44.336106],
        '宁夏回族自治区': [106.630594, 39.490587],
        '甘肃省': [97.434346, 42.772614],
        '贵州省': [106.261781, 27.409054],
        '云南省': [102.702913, 26.550202],
        '西藏自治区': [89.112616, 33.668426],
        '青海省': [95.778449, 36.625145],
        '新疆维吾尔自治区': [85.61023, 43.83845]
        // '台湾省': [121.511849, 25.060677],
        // '香港': [114.179376, 22.318339],
        // '澳门': [113.546969, 22.202741]
      },
      // [0]:在测项目数;[1]:用例通过率
      rawData: {}
    }
  },
  watch: {
    'dataObject': {
      deep: true,
      handler: function (newVal, oldVal) {
        // console.info('newVal==ProjectMap==' + JSON.stringify(newVal))
        if (newVal.reloadIndex > this.recordReloadIndex) {
          this.recordReloadIndex = newVal.reloadIndex
          this.rawData = newVal.projectMapData
          this.getProjectMap()
        }
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    enterOrLeave (type) {
      if (type === 1) {
        this.mapEnterLeave = false
      } else {
        this.mapEnterLeave = true
      }
    },
    getMapOption () {
      var optionMap = {
      }
      return optionMap
    },
    getProjectMap () {
      let thisvm = this
      thisvm.projectMapObj = echarts.init(document.getElementById('project-map'))
      option = {
        animation: false,
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let data = params[0]
            let currData = thisvm.rawData[data.seriesId]
            let inflationData = currData[1]
            let rankValue = currData[4]
            let datafmt = []
            datafmt.push('<span style="color:#fff;font-size:16px;">' + data.seriesId + '</span><span style="color:#fff;font-size:16px;margin-left:75px;">排名：' + rankValue + '</span>')
            datafmt.push('<span style="color:#a9ddee;font-size:15px;">在测项目数</span><span style="color:#a9ddee;font-size:15px;margin-left:45px;">用例通过率</span>')
            datafmt.push('<span style="color:#fff;font-size:20px;">' + currData[0] + '</span><span style="color:#fff;font-size:20px;margin-left:100px;">' + inflationData + '%</span>')
            return datafmt.join('<br/>')
          },
          backgroundColor: 'rgba(11,39,64,0.8)',
          // 额外附加的阴影
          extraCssText: 'box-shadow:0 0 4px rgba(11, 19, 43,0.8);'
        },
        visualMap: {
          bottom: 80,
          left: 20,
          textStyle: { color: '#fff' },
          pieces: [{
            gt: 80,
            lt: 100,
            label: '80%-100%',
            color: '#327efe'
          }, {
            gt: 60,
            lt: 80,
            label: '60%-79%',
            color: '#a04ffb'
          }, {
            gt: 1,
            lt: 60,
            label: '0%-59%',
            color: '#f0c95f'
          }]
        },
        geo: {
          map: 'china',
          roam: false,
          zoom: 1.25, // 地图初始大小
          label: {
            emphasis: {
              show: false,
              areaColor: '#fff'
            }
          },
          // 地区块儿颜色
          itemStyle: {
            normal: {
              areaColor: '#1d7fc4',
              borderColor: '#0fa7e1',
              borderWidth: 1.5,
              shadowColor: '#255a98',
              shadowBlur: 150
            },
            emphasis: {
              areaColor: '#46c4ff'
            }
          }
        },
        series: []
      }
      function renderEachCity () {
        var option = {
          xAxis: [],
          yAxis: [],
          grid: [],
          series: []
        }
        echarts.util.each(thisvm.rawData, function (dataItem, idx) {
          var geoCoord = thisvm.geoCoordMap[idx]
          if (geoCoord) {
            var coord = thisvm.projectMapObj.convertToPixel('geo', geoCoord)
            idx += ''
            let caseRate = dataItem[1]
            caseRate = caseRate < 10 ? 10 : caseRate
            option.xAxis.push({
              id: idx,
              gridId: idx,
              type: 'category',
              name: idx,
              nameLocation: 'middle',
              nameGap: 5,
              splitLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
              axisLine: {
                show: false,
                onZero: false,
                lineStyle: {
                  color: '#fff'
                }
              },
              data: ['用例通过率'],
              z: 100
            })
            option.yAxis.push({
              id: idx,
              gridId: idx,
              splitLine: { show: false },
              axisTick: { show: false },
              axisLabel: { show: false },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#1C70B6'
                }
              },
              z: 100
            })
            option.grid.push({
              id: idx,
              width: 10,
              height: 60,
              left: coord[0] - 15,
              top: coord[1] - 15,
              z: 100
            })
            option.series.push({
              type: 'bar',
              id: idx,
              xAxisId: idx,
              yAxisId: idx,
              barGap: 0,
              barWidth: 8,
              barCategoryGap: 0,
              data: [caseRate],
              z: 100,
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    position: 'top',
                    formatter: function (params) {
                      let currData = thisvm.rawData[params.seriesId]
                      let inflationData = currData[1]
                      return inflationData + '%'
                    },
                    color: '#fff'
                  },
                  color: function (params) {
                    let currData = thisvm.rawData[params.seriesId]
                    let value = currData[1]
                    let index = 0
                    if (value <= 59) {
                      index = 0
                    } else if (value <= 79) {
                      index = 1
                    } else if (value <= 100) {
                      index = 2
                    }
                    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: barTopColor[index] // 0% 处的颜色
                    }, {
                      offset: 0.6,
                      color: barTopColor[index] // 0% 处的颜色
                    }, {
                      offset: 1,
                      color: '#402664'// 100% 处的颜色
                    }], false)
                  },
                  barBorderRadius: [5, 5, 0, 0]
                }
              }
            })
          }
        })
        thisvm.projectMapObj.setOption(option)
        thisvm.startSwitchIntervalDraw()
      }
      thisvm.projectMapObj.setOption(option)
      thisvm.projectMapObj.on('click', function (params) {
        // 省份名称:[项目数量, 用例通过率, 省份编码, 机构数组, 排名]
        // 北京市:['100', '60', '123', '1,2,3,4', '1']
        let rawData = thisvm.rawData
        let data = rawData[params.seriesId]
        let provinceId = ''
        let provinceName = ''
        let organizeIds = ''
        if (data) {
          provinceId = data[2]
          provinceName = params.seriesId
          organizeIds = data[3]
        } else {
          for (let key in rawData) {
            if (key.includes(params.name)) {
              data = rawData[key]
              provinceName = key
            }
          }
          provinceId = data[2]
          organizeIds = data[3]
        }
        thisvm.$router.push({
          name: 'provincechildrenpage',
          params: { 'provinceId': provinceId, 'provinceName': provinceName, 'organizeIds': organizeIds, 'random': Math.random() }
        })
      })
      setTimeout(renderEachCity, 500)
    },
    startSwitchIntervalDraw () {
      let thisvm = this
      let time = thisvm.dataObject.bigScreenTime / Object.keys(thisvm.rawData).length
      time = time < 5000 ? 5000 : time
      time = time > 10000 ? 10000 : time
      clearInterval(thisvm.switchIntervalDraw)
      thisvm.switchIntervalDraw = setInterval(function () {
        if (thisvm.mapEnterLeave) {
          thisvm.showTip()
        }
      }, time)
      thisvm.showTip()
    },
    showTip () {
      let thisvm = this
      var dataLen = Object.keys(thisvm.rawData).length - 1
      // 取消之前高亮的图形
      if (thisvm.mapCurrentIndex > 0) {
        thisvm.projectMapObj.dispatchAction({
          type: 'hideTip',
          seriesIndex: thisvm.mapCurrentIndex - 0,
          dataIndex: 0
        })
      }
      let currentIndex = thisvm.mapCurrentIndex
      currentIndex = currentIndex >= dataLen ? 0 : currentIndex
      // 高亮当前图形
      thisvm.projectMapObj.dispatchAction({
        type: 'showTip',
        seriesIndex: currentIndex,
        dataIndex: 0
      })
      thisvm.mapCurrentIndex = currentIndex + 1
    }
  },
  destroyed () {
    clearInterval(this.switchIntervalDraw)
  }
}
</script>
<style  lang="scss" scoped>
.project-map {
  min-width: 300px;
  min-height: 500px;
}
</style>
