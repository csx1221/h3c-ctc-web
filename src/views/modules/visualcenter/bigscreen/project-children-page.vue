<template>
  <el-container id="big-screen-area" class="big-screen-area" :style="autoClacHeight('all')">
    <el-header class="big-screen-header">
      <el-row>
        <el-col :span="24" class="header-title" @click.native="handleFullScreen()">{{projectName}}</el-col>
        <el-col :span="24" class="header-date"></el-col>
        <div class="go-back" @click="doGoback()"><img src="../../../../assets/img/svg/go_back.svg" style="width:16px;height:16px;color:red;" /> 返回上一页</div>
      </el-row>
    </el-header>
    <el-main class="big-screen-body">
      <el-row :gutter="0">
        <el-col :span="24" class="module-base-info" :style="autoClacHeight('top')">
          <el-row>
            <el-col :span="24" class="alltitle">项目概况</el-col>
          </el-row>
          <el-row style="margin-top:1%;">
            <el-col :span="3" class="title">
              项目进度
            </el-col>
            <el-col :span="3" class="counter">
              {{dataObject.projectOverview && (dataObject.projectOverview.projectProgress || '0')}}<span class="title">%</span>
            </el-col>
            <el-col :span="3" class="title">
              项目质量
            </el-col>
            <el-col :span="3" class="counter">
              {{dataObject.projectOverview && (dataObject.projectOverview.projectQuality || '0')}}<span class="title">%</span>
            </el-col>
            <el-col :span="3" class="title">
              执行进度
            </el-col>
            <el-col :span="3" class="counter">
              {{dataObject.projectOverview && (dataObject.projectOverview.caseExecPassRate || '0')}}<span class="title">%</span>
            </el-col>
            <el-col :span="3" class="title">
              用例数量
            </el-col>
            <el-col :span="3" class="counter">
              {{dataObject.projectOverview && dataObject.projectOverview.cases }}<span class="title">个</span>
            </el-col>
          </el-row>
          <div class="boxfoot"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-col :span="24" class="module-base-info" :style="autoClacHeight('middle')">
            <el-row>
              <el-col :span="24" class="alltitle" style="padding-left:10px;">项目阶段概况</el-col>
            </el-row>
            <project-progress :dataObject="dataObject"></project-progress>
            <div class="boxfoot"></div>
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="24" class="module-base-info" :style="autoClacHeight('middle')">
            <el-row>
              <el-col :span="24" class="alltitle" style="padding-left:10px;">用例及执行情况</el-col>
            </el-row>
            <case-execute :dataObject="dataObject"></case-execute>
            <div class="boxfoot"></div>
          </el-col>
        </el-col>
        <el-col :span="8">
          <el-col :span="24" class="module-base-info" :style="autoClacHeight('middle')">
            <el-row>
              <el-col :span="24" class="alltitle" style="padding-left:10px;">项目缺陷概况</el-col>
            </el-row>
            <defect-info :dataObject="dataObject"></defect-info>
            <div class="boxfoot"></div>
          </el-col>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import ProjectProgress from './projectchildren/project-progress'
import CaseExecute from './projectchildren/case-execute'
import DefectInfo from './projectchildren/defect-info'
export default {
  name: 'ProjectChildrenPage',
  components: {
    ProjectProgress, CaseExecute, DefectInfo
  },
  data () {
    return {
      clientHeight: 0,
      screenResolution: 4,
      fullscreen: false, // 是否全屏展示
      projectTableData: [],
      page: 1,
      limit: 15,
      total: 0,
      dataObject: {
        height: 0,
        clientHeight: 0,
        random: 0,
        reloadIndex: 0, // 刷新次数
        projectOverview: {
          projectName: 'XXXX项目',
          projectProgress: 0.00,
          projectQuality: 0.00,
          executeProgress: 0.00,
          caseCounts: 0
        }
      },
      projectId: '',
      projectName: 'XXXX项目',
      provinceId: '',
      provinceName: '',
      organizeIds: '',
      pageSource: 1 // 1:首页大屏;2:省份下钻
    }
  },
  computed: {},
  created () {
  },
  mounted () {
    let thisvm = this
    thisvm.$nextTick(() => {
      thisvm.getClientHeight()
      let params = this.$route.params
      if (Object.keys(params).length === 0) {
        let cacheProjectInfo = window.localStorage.getItem('cacheProjectInfo') || '{}'
        params = JSON.parse(cacheProjectInfo)
      }
      if (Object.keys(params).length > 0) {
        window.localStorage.setItem('cacheProjectInfo', JSON.stringify(params))
        thisvm.projectId = params.projectId
        thisvm.projectName = params.projectName || 'XXXX项目'
        thisvm.provinceId = params.provinceId || ''
        thisvm.provinceName = params.provinceName || ''
        thisvm.organizeIds = params.organizeIds || ''
        thisvm.pageSource = params.pageSource || ''
        thisvm.getBidScreenData()
      }
    })
  },
  methods: {
    doGoback () {
      let name = this.pageSource === 1 ? 'bigscreenpage' : 'provincechildrenpage'
      this.$router.push({
        name: name,
        params: { 'provinceId': this.provinceId, 'provinceName': this.provinceName, 'organizeIds': this.organizeIds, 'random': Math.random() }
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
      //  概况、项目状态统计
      if (type === 'top') {
        let hval = ((height - 180) * 0.15)
        style.height = hval + 'px'
      } else if (type === 'middle') {
        // 测试质量、测试进度
        let hval = ((height - 180) * 0.85)
        this.dataObject.height = hval
        style.height = hval + 'px'
      } else if (type === 'all') {
        // 整体页面空间
        let hval = height
        style.height = hval + 'px'
      } else if (type === 'paddingTop') {
        if ([3, 4].includes(this.screenResolution)) {
          style.paddingTop = '50px'
        } else if ([1].includes(this.screenResolution)) {
          style.paddingTop = '0px'
        }
      }
      return style
    },
    getBidScreenData () {
      let params = {}
      params.projectId = this.projectId
      this.$http.get('/ctc/visualization/dashbord/getDashbordProject', { 'params': params }).then(({ data: res }) => {
        this.dataObject = { ...this.dataObject, ...res }
        this.dataObject.reloadIndex += 1
      }).catch(() => { })
    }
  },
  destroyed () {
  }
}
</script>
<style  lang="scss">
.big-screen-body {
  .el-table {
    background: transparent;
  }
  .el-table::before {
    height: 0px;
  }
  .el-table th {
    background: #3c8ed8 !important;
    color: #fff !important;
    opacity: 0.75;
    border-bottom: 1px solid #1d5a92;
  }
  .el-table tr {
    background-color: #082b4d !important;
    color: #fff;
  }
  .el-table__body tr:hover > td {
    background-color: rgba(27, 185, 255, 0.73);
  }
  .el-table tr.el-table__row--striped td {
    background-color: #17395f !important;
    color: #fff;
  }
  .el-table tr.el-table__row--striped td:hover {
    background-color: #17395f !important;
    color: #fff;
  }
  .el-table td {
    border-bottom: 1px solid #1d5a92;
    box-shadow: inset 0px 0px 2px 0px rgba(27, 185, 255, 0.73);
  }
}
</style>

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
      padding: 24px;
      z-index: 10;
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
      .title {
        font-family: MicrosoftYaHei;
        font-size: 20px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 15px;
        letter-spacing: 2px;
        color: #fefefe;
        text-align: center;
      }
      .counter {
        font-family: MicrosoftYaHei;
        font-size: 40px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 15px;
        letter-spacing: 4px;
        color: #ffe400;
        text-align: center;
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
      height: 85%;
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
    .tvalue {
      font-family: MicrosoftYaHei;
      font-size: 30px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 1px;
      color: #ffffff;
      text-align: center;
    }
    .ttitle {
      font-family: MicrosoftYaHeiLight;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #ffffff;
      text-align: center;
    }
    .split-center-line {
      height: 1.8px;
      line-height: 1.8px;
      background: linear-gradient(to left, #252a5c, #7187ac, #252a5c);
    }
  }
}
</style>
