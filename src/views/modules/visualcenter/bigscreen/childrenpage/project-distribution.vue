<template>
  <el-row class="project-distribution">
    <el-col :span="24" class="data-text">
      <el-row>
        <el-col :span="8">
          <div class="value">{{dataObject.projectDisData.organizeData && dataObject.projectDisData.organizeData[organizeActiveIndex].value}}</div>
          <div class="title">{{dataObject.projectDisData.organizeData && dataObject.projectDisData.organizeData[organizeActiveIndex].name}}</div>
        </el-col>
        <el-col :span="8">
          <div class="value">{{dataObject.projectDisData.projectScopeData && dataObject.projectDisData.projectScopeData[projectScopeActiveIndex].value}}</div>
          <div class="title">{{dataObject.projectDisData.projectScopeData && dataObject.projectDisData.projectScopeData[projectScopeActiveIndex].name}}</div>
        </el-col>
        <el-col :span="8">
          <div class="value">{{dataObject.projectDisData.projectLevelData && dataObject.projectDisData.projectLevelData[projectLevelActiveIndex].value}}</div>
          <div class="title">{{dataObject.projectDisData.projectLevelData && dataObject.projectDisData.projectLevelData[projectLevelActiveIndex].name}}</div>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="24" class="data-graph">
      <el-row>
        <el-col :span="8" id="project-organize-info" class="graph-data-area" :style="{height:(dataObject.height-120)+'px'}">
        </el-col>
        <el-col :span="8" id="project-scope-info" class="graph-data-area" :style="{height:(dataObject.height-120)+'px'}">
        </el-col>
        <el-col :span="8" id="project-level-info" class="graph-data-area" :style="{height:(dataObject.height-120)+'px'}">
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
const echarts = require('echarts')
export default {
  name: 'ProjectDistribution',
  props: {
    dataObject: Object
  },
  data () {
    return {
      recordReloadIndex: 0, // 记录重新加载次数
      switchIntervalDraw: 0,
      organizeActiveIndex: 0,
      projectScopeActiveIndex: 0,
      projectLevelActiveIndex: 0,
      projectOrganizeInfoObj: null,
      projectScopeInfoObj: null,
      projectLevelInfoObj: null
    }
  },
  watch: {
    'dataObject': {
      deep: true,
      handler: function (newVal, oldVal) {
        // console.info('newVal==ProjectDistribution==' + JSON.stringify(newVal))
        if (newVal.reloadIndex > this.recordReloadIndex) {
          this.recordReloadIndex = newVal.reloadIndex
          this.loadProjectGraph()
        }
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    getDataLen () {
      let maxLen = 0
      if (Object.keys(this.dataObject.projectDisData).length > 0) {
        let organizeData = this.dataObject.projectDisData.organizeData
        let projectScopeData = this.dataObject.projectDisData.projectScopeData
        let projectLevelData = this.dataObject.projectDisData.projectLevelData
        maxLen = maxLen < organizeData.length ? organizeData.length : maxLen
        maxLen = maxLen < projectScopeData.length ? projectScopeData.length : maxLen
        maxLen = maxLen < projectLevelData.length ? projectLevelData.length : maxLen
      }
      return maxLen
    },
    loadProjectGraph () {
      let thisvm = this
      thisvm.$nextTick(() => {
        clearInterval(thisvm.switchIntervalDraw)
        let dataLen = thisvm.getDataLen()
        if (dataLen > 0) {
          let time = thisvm.dataObject.bigScreenTime / dataLen
          time = time < 5000 ? 5000 : time
          time = time > 10000 ? 10000 : time
          // 先初始化
          thisvm.init()
          thisvm.switchIntervalDraw = setInterval(function () {
            // 索引值加1
            thisvm.organizeActiveIndex = thisvm.organizeActiveIndex + 1
            thisvm.projectScopeActiveIndex = thisvm.projectScopeActiveIndex + 1
            thisvm.projectLevelActiveIndex = thisvm.projectLevelActiveIndex + 1

            // 归属机构
            let organizeData = thisvm.dataObject.projectDisData.organizeData
            thisvm.organizeActiveIndex = thisvm.organizeActiveIndex >= organizeData.length ? 0 : thisvm.organizeActiveIndex
            // 项目范围
            let projectScopeData = thisvm.dataObject.projectDisData.projectScopeData
            thisvm.projectScopeActiveIndex = thisvm.projectScopeActiveIndex >= projectScopeData.length ? 0 : thisvm.projectScopeActiveIndex
            // 项目级别
            let projectLevelData = thisvm.dataObject.projectDisData.projectLevelData
            thisvm.projectLevelActiveIndex = thisvm.projectLevelActiveIndex >= projectLevelData.length ? 0 : thisvm.projectLevelActiveIndex
            // 开始渲染动画
            thisvm.draw()
          }, time)
        }
      })
    },
    init () {
      let thisvm = this
      thisvm.organizeActiveIndex = 0
      thisvm.projectScopeActiveIndex = 0
      thisvm.projectLevelActiveIndex = 0
      thisvm.draw()
    },
    draw () {
      let thisvm = this
      thisvm.$nextTick(() => {
        // 按机构类型分布
        thisvm.projectOrganizeInfoObj = echarts.init(document.getElementById('project-organize-info'))
        thisvm.projectOrganizeInfoObj.clear()
        let tdata1 = {}
        tdata1.data = thisvm.dataObject.projectDisData.organizeData
        tdata1.text = '归属\n机构'
        thisvm.projectOrganizeInfoObj.setOption(thisvm.getOption(tdata1))
        thisvm.projectOrganizeInfoObj.dispatchAction({ type: 'highlight', eriesIndex: 0, dataIndex: thisvm.organizeActiveIndex })

        // 按项目范围分布
        thisvm.projectScopeInfoObj = echarts.init(document.getElementById('project-scope-info'))
        thisvm.projectScopeInfoObj.clear()
        let tdata2 = {}
        tdata2.data = thisvm.dataObject.projectDisData.projectScopeData
        tdata2.text = '项目\n范围'
        thisvm.projectScopeInfoObj.setOption(thisvm.getOption(tdata2))
        thisvm.projectScopeInfoObj.dispatchAction({ type: 'highlight', eriesIndex: 0, dataIndex: thisvm.projectScopeActiveIndex })

        // 按项目级别分布
        thisvm.projectLevelInfoObj = echarts.init(document.getElementById('project-level-info'))
        thisvm.projectLevelInfoObj.clear()
        let tdata3 = {}
        tdata3.data = thisvm.dataObject.projectDisData.projectLevelData
        tdata3.text = '项目\n级别'
        thisvm.projectLevelInfoObj.setOption(thisvm.getOption(tdata3))
        thisvm.projectLevelInfoObj.dispatchAction({ type: 'highlight', eriesIndex: 0, dataIndex: thisvm.projectLevelActiveIndex })
      })
    },
    getOption (data) {
      let option = {
        tooltip: {
          trigger: 'item',
          position: 'right',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        graphic: [{
          type: 'text',
          left: 'center',
          top: 'middle',
          style: {
            text: data.text,
            textAlign: 'center',
            fill: '#fff',
            width: 30,
            height: 30,
            fontSize: 15
          }
        }],
        color: ['#007dca', '#9900f5', '#00ecc2', '#fbee00', '#4CD1E0', '#31C971', '#C1BEBF', '#907EEC', '#FFC107', '#F56D8D', '#4EABF5'],
        series: [
          {
            name: '项目分布',
            type: 'pie',
            radius: ['50%', '60%'],
            silent: false,
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'inner'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '12'
              }
            },
            labelLine: {
              show: false
            },
            data: data.data,
            roundCap: 1
          }
        ]
      }
      return option
    }
  },
  destroyed () {
    clearInterval(this.switchIntervalDraw)
  }
}
</script>
<style lang="scss" scoped>
.project-distribution {
  .data-text {
    padding-top: 10px;
    .value {
      font-family: MicrosoftYaHei;
      font-size: 25px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 1px;
      color: #ffffff;
      text-align: center;
    }
    .title {
      padding-top: 10px;
      font-family: MicrosoftYaHeiLight;
      font-size: 15px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #ffffff;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .data-graph {
    .graph-data-area {
      min-height: 100px;
    }
  }
}
</style>
