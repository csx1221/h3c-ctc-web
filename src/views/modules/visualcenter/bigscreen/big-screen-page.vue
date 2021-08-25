<template>
  <el-container id="big-screen-area" class="big-screen-area" :style="autoClacHeight('all')">
    <el-header class="big-screen-header">
      <el-row>
        <el-col :span="24" class="header-title" @click.native="handleFullScreen()">云测试平台可视化中心</el-col>
        <el-col :span="24" class="header-date">{{currDateTime}}</el-col>
        <div class="go-back" @click="doGoback()"><img src="../../../../assets/img/svg/go_back.svg" style="width:16px;height:16px;color:red;" /> 返回首页</div>
      </el-row>
    </el-header>
    <el-main class="big-screen-body">
      <el-row>
        <el-col :span="6">
          <el-col :span="24" class="module-base-info" :style="autoClacHeight('dataNumber')">
            <el-row>
              <el-col :span="24" class="alltitle">整体数据统计</el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="zhengti-data" :style="autoClacHeight('paddingTop')">
                <ul class="ul-clearfix">
                  <li class="pulll_left counter">{{dataObject.overallStatistics.totalProjectCounts}}</li>
                  <li class="pulll_left counter">{{dataObject.overallStatistics.testProjectCounts}}</li>
                </ul>
                <ul class="ul-clearfix">
                  <li class="pulll_left">
                    <div class="split-center-line"></div>
                    <div class="pulll_left title">总项目数</div>
                  </li>
                  <li class="pulll_left">
                    <div class="split-center-line"></div>
                    <div class="pulll_left title">在测项目数</div>
                  </li>
                </ul>
              </el-col>
            </el-row>
            <div class="boxfoot"></div>
          </el-col>
          <el-col :span="24" class="module-base-info" :style="autoClacHeight('default')">
            <el-row>
              <el-col :span="24" class="alltitle">项目分布</el-col>
            </el-row>
            <div class="boxfoot">
              <project-distribution :dataObject="dataObject"></project-distribution>
            </div>
          </el-col>
          <el-col :span="24" class="module-base-info" :style="autoClacHeight('default')">
            <el-row>
              <el-col :span="24" class="alltitle">项目质量进度管控</el-col>
            </el-row>
            <div class="boxfoot">
              <project-mass-plan :dataObject="dataObject"></project-mass-plan>
            </div>
          </el-col>
        </el-col>
        <el-col :span="12">
          <el-col :span="24" :style="autoClacHeight('map')">
            <project-map :dataObject="dataObject"></project-map>
          </el-col>
        </el-col>
        <el-col :span="6">
          <el-col :span="24" class="module-base-info" :style="autoClacHeight('dataNumber')">
            <el-row>
              <el-col :span=" 24" class="alltitle">整体数据统计</el-col>
            </el-row>
            <el-row>
              <el-col :span="24" class="zhengti-data" :style="autoClacHeight('paddingTop')">
                <ul class="ul-clearfix">
                  <li class="pulll_left counter">{{dataObject.overallStatistics.caseCounts}}</li>
                  <li class="pulll_left counter">{{dataObject.overallStatistics.defectCounts}}</li>
                </ul>
                <ul class="ul-clearfix">
                  <li class="pulll_left">
                    <div class="split-center-line"></div>
                    <div class="pulll_left title">用例数</div>
                  </li>
                  <li class="pulll_left">
                    <div class="split-center-line"></div>
                    <div class="pulll_left title">缺陷数</div>
                  </li>
                </ul>
              </el-col>
            </el-row>
            <div class="boxfoot"></div>
          </el-col>
          <el-col :span="24" class="module-base-info" :style="autoClacHeight('default')">
            <el-row>
              <el-col :span="24" class="alltitle">项目增长趋势</el-col>
            </el-row>
            <div class="boxfoot">
              <project-increase-trend :dataObject="dataObject"></project-increase-trend>
            </div>
          </el-col>
          <el-col :span="24" class="module-base-info" :style="autoClacHeight('default')">
            <el-row>
              <el-col :span="24" class="alltitle">当月项目概览</el-col>
            </el-row>
            <div class="boxfoot">
              <project-month-overview :dataObject="dataObject"></project-month-overview>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </el-main>
    <!--特效动画效果-->
    <div class="load" v-if="showLoadImg" :style="autoClacHeight('all')">
      <div class="load_img">
        <!-- 加载动画 -->
        <img class="jzxz1" src="../../../../assets/img/jzxz1.png">
        <img class="jzxz2" src="../../../../assets/img/jzxz2.png">
      </div>
    </div>
  </el-container>
</template>
<script>
import ProjectMap from './childrenpage/project-map'
import ProjectDistribution from './childrenpage/project-distribution'
import ProjectIncreaseTrend from './childrenpage/project-increase-trend'
import ProjectMassPlan from './childrenpage/project-mass-plan'
import ProjectMonthOverview from './childrenpage/project-month-overview'
export default {
  name: 'BigScreenPage',
  components: {
    ProjectMap, ProjectDistribution, ProjectIncreaseTrend, ProjectMassPlan, ProjectMonthOverview
  },
  data () {
    return {
      clientHeight: 0,
      screenResolution: 4,
      fullscreen: false, // 是否全屏展示
      // 服务参数传递
      dataObject: {
        height: 0,
        clientHeight: 0,
        random: 0,
        reloadIndex: 0, // 刷新次数
        currDateTimeInterval: 0,
        bigScreenInterval: 0,
        bigScreenTime: 120000, // 单位毫秒(默认5分钟刷新一次)
        // 整体数据统计
        overallStatistics: {
          totalProjectCounts: 0,
          testProjectCounts: 0,
          caseCounts: 0,
          defectCounts: 0
        },
        // 项目分布
        projectDisData: {},
        // 项目地图
        projectMapData: {},
        // 项目增长趋势
        projectTrendData: {},
        // 当月项目概览数据
        currMonthData: [],
        // 项目质量进度
        projectPlanData: []
      },
      currDateTime: '',
      showLoadImg: true
    }
  },
  computed: {},
  created () {
  },
  mounted () {
    let thisvm = this
    thisvm.$nextTick(() => {
      thisvm.getClientHeight()
      thisvm.startBigScreenInterval()
    })
  },
  methods: {
    doGoback () {
      this.$router.push({
        name: 'home',
        params: { 'random': Math.random() }
      })
    },
    handleFullScreen () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
      this.getClientHeight()
    },
    getClientHeight () {
      let bigClientHeight = window.screen.height
      if (bigClientHeight <= 768) {
        this.screenResolution = 1
      } else if (bigClientHeight <= 900) {
        this.screenResolution = 2
      } else if (bigClientHeight <= 1050) {
        this.screenResolution = 3
      } else if (bigClientHeight <= 1080) {
        this.screenResolution = 4
      }
      this.clientHeight = bigClientHeight
    },
    autoClacHeight (type) {
      let height = window.screen.height
      height = height < 1000 ? 1000 : height
      let style = {}
      // 项目分布、项目增长、项目质量进度管控、当月项目概览
      if (type === 'default') {
        let hval = ((height - 190) * 0.375)
        style.height = hval + 'px'
        this.dataObject.height = hval
      } else if (type === 'map') {
        // 项目地图
        let hval = (height - 130)
        style.height = hval + 'px'
        this.dataObject.clientHeight = hval
      } else if (type === 'all') {
        // 整体页面空间
        let hval = height
        style.height = hval + 'px'
      } else if (type === 'dataNumber') {
        // 整体数据统计
        let hval = ((height - 190) * 0.25)
        style.height = hval + 'px'
      } else if (type === 'paddingTop') {
        if ([3, 4].includes(this.screenResolution)) {
          style.paddingTop = '40px'
        } else if ([1].includes(this.screenResolution)) {
          style.paddingTop = '0px'
        }
      }
      return style
    },
    startBigScreenInterval () {
      let thisvm = this
      thisvm.$nextTick(() => {
        clearInterval(thisvm.dataObject.bigScreenInterval)
        // 默认先获取大屏数据
        thisvm.getBigScreenData()
        thisvm.dataObject.bigScreenInterval = setInterval(function () {
          thisvm.getBigScreenData()
        }, thisvm.dataObject.bigScreenTime)
        // 开启当前大屏时间计数
        clearInterval(thisvm.dataObject.currDateTimeInterval)
        thisvm.dataObject.currDateTimeInterval = setInterval(() => {
          let myDate = new Date()
          let year = myDate.getFullYear()
          let month = myDate.getMonth() + 1
          let day = String(myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate.getDate())
          let hour = String(myDate.getHours() < 10 ? '0' + myDate.getHours() : myDate.getHours())
          let minutes = String(myDate.getMinutes() < 10 ? '0' + myDate.getMinutes() : myDate.getMinutes())
          let seconds = String(myDate.getSeconds() < 10 ? '0' + myDate.getSeconds() : myDate.getSeconds())
          let currDateTime = year + '/' + month + '/' + day + '   ' + hour + ':' + minutes + ':' + seconds
          thisvm.currDateTime = currDateTime
        }, 1000)
      })
    },
    dynamicLoadOverallStatistics (overallStatistics) {
      let thisvm = this
      let index = 1
      let loadCount = 15
      let data = Object.assign({}, overallStatistics)
      thisvm.dataObject.overallStatistics.totalProjectCounts = 1
      thisvm.dataObject.overallStatistics.testProjectCounts = 1
      thisvm.dataObject.overallStatistics.caseCounts = 1
      thisvm.dataObject.overallStatistics.defectCounts = 1
      let tmpInterval = setInterval(function () {
        if (index > loadCount) {
          clearInterval(tmpInterval)
          thisvm.dataObject.overallStatistics.totalProjectCounts = data.totalProjectCounts
          thisvm.dataObject.overallStatistics.testProjectCounts = data.testProjectCounts
          thisvm.dataObject.overallStatistics.caseCounts = data.caseCounts
          thisvm.dataObject.overallStatistics.defectCounts = data.defectCounts
        } else {
          let totalProjectCounts = thisvm.dataObject.overallStatistics.totalProjectCounts + Number((data.totalProjectCounts / loadCount).toFixed(0))
          totalProjectCounts = totalProjectCounts > data.totalProjectCounts ? data.totalProjectCounts : totalProjectCounts
          thisvm.dataObject.overallStatistics.totalProjectCounts = totalProjectCounts

          let testProjectCounts = thisvm.dataObject.overallStatistics.testProjectCounts + Number((data.testProjectCounts / loadCount).toFixed(0))
          testProjectCounts = testProjectCounts > data.testProjectCounts ? data.testProjectCounts : testProjectCounts
          thisvm.dataObject.overallStatistics.testProjectCounts = testProjectCounts

          let caseCounts = thisvm.dataObject.overallStatistics.caseCounts + Number((data.caseCounts / loadCount).toFixed(0))
          caseCounts = caseCounts > data.caseCounts ? data.caseCounts : caseCounts
          thisvm.dataObject.overallStatistics.caseCounts = caseCounts

          let defectCounts = thisvm.dataObject.overallStatistics.defectCounts + Number((data.defectCounts / loadCount).toFixed(0))
          defectCounts = defectCounts > data.defectCounts ? data.defectCounts : defectCounts
          thisvm.dataObject.overallStatistics.defectCounts = defectCounts
        }
        index++
      }, 150)
    },
    getBigScreenData () {
      let thisvm = this
      let params = {}
      thisvm.$http.get('/ctc/visualization/dashbord/getDashbordMain', { 'params': params }).then(({ data: res }) => {
        thisvm.dataObject = { ...thisvm.dataObject, ...res }
        thisvm.dynamicLoadOverallStatistics(thisvm.dataObject.overallStatistics)
        thisvm.dataObject.reloadIndex += 1
        // 隐藏加载动画
        setTimeout(() => {
          thisvm.showLoadImg = false
          // 非全屏模式，有进去全屏模式提示
          if (!thisvm.fullscreen) {
            thisvm.$notify({
              title: '操作提示',
              message: '点击【云测试平台可视化中心】标题，可进入全屏模式',
              type: 'info',
              duration: 6000
            })
          }
        }, 1500)
      }).catch(() => {
        thisvm.showLoadImg = false
      })
    }
  },
  destroyed () {
    clearInterval(this.dataObject.bigScreenInterval)
    clearInterval(this.dataObject.currDateTimeInterval)
  }
}
</script>
<style  lang="scss" scoped>
.big-screen-area {
  background: #1a4077 url('../../../../assets/img/big_screen_bg.png') no-repeat
    top center;
  background-size: cover;
  .big-screen-header {
    height: 94px !important;
    .header-title {
      text-align: center;
      font-family: MicrosoftYaHei;
      font-size: 40px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 15px;
      letter-spacing: 0px;
      color: #fefefe;
      margin-top: 35px;
      cursor: pointer;
    }
    .header-date {
      text-align: center;
      font-family: MicrosoftYaHei;
      font-size: 25px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 15px;
      letter-spacing: 0px;
      color: #fefefe;
      margin-top: 48px;
    }
    .go-back {
      color: #fff;
      cursor: pointer;
      position: absolute;
      top: 23px;
      right: 20px;
      height: 50px;
      line-height: 50px;
      vertical-align: middle;
    }
  }
  .big-screen-body {
    padding: 15px;
    .module-base-info {
      background: rgba(6, 30, 48, 0.3);
      border: solid 1px rgba(33, 132, 202, 0.1);
      background-size: 100% auto;
      position: relative;
      margin-top: 20px;
      padding: 20px;
      z-index: 10;
      .zhengti-data {
        .ul-clearfix {
          padding: 0%;
          margin: 0%;
        }
        .pulll_left {
          float: left;
        }
        .pulll_right {
          float: right;
        }
      }
      .alltitle {
        height: 26px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 25px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 15px;
        letter-spacing: 3px;
        color: #fefefe;
      }
    }
    .module-base-info:before,
    .module-base-info:after {
      position: absolute;
      width: 16px;
      height: 16px;
      content: '';
      border-top: 2px solid #0082cf;
      top: 0;
    }
    .module-base-info:before,
    .module-base-info .boxfoot:before {
      border-left: 2px solid #0082cf;
      left: 0;
    }
    .module-base-info:after,
    .module-base-info .boxfoot:after {
      border-right: 2px solid #0082cf;
      right: 0;
    }
    .module-base-info .boxfoot {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 80%;
      left: 0;
      z-index: -1;
    }
    .module-base-info .boxfoot:before,
    .module-base-info .boxfoot:after {
      position: absolute;
      width: 16px;
      height: 16px;
      content: '';
      border-bottom: 2px solid #0082cf;
      bottom: 0;
    }
    .module-base-info:before,
    .module-base-info .barbox:after {
      position: absolute;
      width: 16px;
      height: 16px;
      content: '';
    }
    .module-base-info .barbox:before {
      border-left: 2px solid #02a6b5;
      left: 0;
      border-top: 2px solid #02a6b5;
    }
    .module-base-info .barbox:after {
      border-right: 2px solid #02a6b5;
      right: 0;
      bottom: 0;
      border-bottom: 2px solid #02a6b5;
    }
    .module-base-info li,
    .module-base-info .barbox2 li {
      list-style-type: none;
      width: 50%;
      text-align: center;
      position: relative;
      height: 35px;
      line-height: 35px;
      vertical-align: middle;
    }

    .module-base-info .barbox {
      border: 1px solid rgba(25, 186, 139, 0.17);
      position: relative;
    }
    .module-base-info .pulll_left.counter {
      font-family: MicrosoftYaHei;
      font-size: 30px;
      font-weight: bold;
      letter-spacing: 2px;
      color: #ffe400;
    }
    .module-base-info .pulll_left.title {
      font-family: MicrosoftYaHei;
      font-size: 16px;
      font-weight: bold;
      letter-spacing: 2px;
      color: #fefefe;
      text-align: center;
      width: 100%;
    }
    .split-center-line {
      height: 1.8px;
      line-height: 1.8px;
      background: linear-gradient(to left, #252a5c, #7187ac, #252a5c);
    }
  }
  /* 加载旋转动画 */
  .load {
    width: 100%;
    height: 100%;
    position: absolute;
    background: url(../../../../assets/img/data08.png) no-repeat #061537;
    background-size: cover;
    top: 0;
    left: 0;
    opacity: 0.75;
    z-index: 999999999999999;
  }
  .load .load_img {
    position: absolute;
    left: calc(50% - 182px);
    top: calc(50% - 182px);
  }
  .load_img img {
    position: absolute;
    left: 0;
    top: 0;
  }
  .load_img .jzxz1 {
    animation: xz1 8s infinite linear;
  }
  @keyframes xz1 {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .load_img .jzxz2 {
    animation: xz2 7s infinite linear;
  }
  @keyframes xz2 {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(-180deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }
}
</style>
