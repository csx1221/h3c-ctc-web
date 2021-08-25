<template>
  <el-container id="big-screen-area" class="big-screen-area" :style="autoClacHeight('all')">
    <el-header class="big-screen-header">
      <el-row>
        <el-col :span="24" class="header-title" @click.native="handleFullScreen()">云测试平台可视化中心</el-col>
        <el-col :span="24" class="header-date"></el-col>
        <div class="go-back" @click="doGoback()"><img src="../../../../assets/img/svg/go_back.svg" style="width:16px;height:16px;color:red;" /> 返回上一页</div>
      </el-row>
    </el-header>
    <el-main class="big-screen-body">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-col :span="24" class="module-base-info" :style="autoClacHeight('table')">
            <el-row>
              <el-col :span="24" class="alltitle" style="padding-left:8px;">{{provinceName}}</el-col>
            </el-row>
            <div class="boxfoot" style="padding:20px;height:95%;">
              <el-table stripe highlight-current-row :data="projectTableData" ref="projectTableData" :height="dataObject.clientHeight-150" style="width: 100%;">
                <el-table-column prop="name" label="项目名称" header-align="left" align="left" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <div @click="doProjectDrill(scope.row)" style="cursor:pointer;">{{scope.row.name}} </div>
                  </template>
                </el-table-column>
                <el-table-column prop="stageId" label="当前阶段" header-align="center" align="center">
                  <template slot-scope="scope">
                    <span>{{stageNameMap[scope.row.stageId]}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="projectStatus" label="项目状态" header-align="center" align="center">
                  <template slot-scope="scope">
                    <span>{{projectStatusMap[scope.row.projectStatus]}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="casePassedRate" label="项目质量" header-align="center" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.casePassedRate}}%</span>
                  </template>
                </el-table-column>
                <el-table-column prop="rank" label="排名" header-align="center" align="center" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.rank>0">{{scope.row.rank}}</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination background layout="total,prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" @current-change="pageSizeCurrentHandle" style="text-align:right;margin-top:15px;margin-right:-9px;">
              </el-pagination>
            </div>
          </el-col>
        </el-col>
        <el-col :span="15">
          <el-row :gutter="0">
            <el-col :span="24" class="module-base-info" :style="autoClacHeight('default')">
              <el-row>
                <el-col :span="24" class="alltitle">概况</el-col>
              </el-row>
              <el-row :gutter="20" :style="autoClacHeight('paddingTop')">
                <el-col :span="6" class="title">
                  全网排名
                </el-col>
                <el-col :span="6" class="counter">
                  {{dataObject.provinceSurvey && dataObject.provinceSurvey.rank}}<span class="title">名</span>
                </el-col>
                <el-col :span="6" class="title">
                  全网质量
                </el-col>
                <el-col :span="6" class="counter">
                  {{dataObject.provinceSurvey && dataObject.provinceSurvey.casePassedRate}}<span class="title">%</span>
                </el-col>
              </el-row>
              <div class="boxfoot"></div>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="12" style="padding-right:10px;">
              <el-col :span="24" class="module-base-info" :style="autoClacHeight('graph')">
                <el-row>
                  <el-col :span="24" class="alltitle">测试质量</el-col>
                </el-row>
                <div class="boxfoot">
                  <test-quality :dataObject="dataObject"></test-quality>
                </div>
              </el-col>
            </el-col>
            <el-col :span="12" style="padding-left:10px;">
              <el-col :span="24" class="module-base-info" :style="autoClacHeight('graph')">
                <el-row>
                  <el-col :span="24" class="alltitle">测试进度</el-col>
                </el-row>
                <div class="boxfoot">
                  <test-progress :dataObject="dataObject"></test-progress>
                </div>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="24" class="module-base-info" :style="autoClacHeight('default')">
              <el-row>
                <el-col :span="24" class="alltitle">项目状态统计</el-col>
              </el-row>
              <el-row :gutter="20" :style="autoClacHeight('paddingTop')">
                <el-col :span="4" class="title">
                  项目数
                </el-col>
                <el-col :span="4" class="counter">
                  {{dataObject.projectStatus && dataObject.projectStatus.projectCounts}}<span class="title">个</span>
                </el-col>
                <el-col :span="4" class="title">
                  正常在测
                </el-col>
                <el-col :span="4" class="counter">
                  {{dataObject.projectStatus && dataObject.projectStatus.testProjectCounts}}<span class="title">个</span>
                </el-col>
                <el-col :span="4" class="title">
                  正常完成
                </el-col>
                <el-col :span="4" class="counter">
                  {{dataObject.projectStatus && dataObject.projectStatus.completeProjectCounts}}<span class="title">个</span>
                </el-col>
              </el-row>
              <el-row :gutter="20" style="margin-top:3%;">
                <el-col :span="4" class="title">
                  延期率
                </el-col>
                <el-col :span="4" class="counter">
                  {{dataObject.projectStatus && dataObject.projectStatus.postPoneRate}}<span class="title">%</span>
                </el-col>
                <el-col :span="4" class="title">
                  延期在测
                </el-col>
                <el-col :span="4" class="counter">
                  {{dataObject.projectStatus && dataObject.projectStatus.postPoneTestCounts}}<span class="title">个</span>
                </el-col>
                <el-col :span="4" class="title">
                  延期完成
                </el-col>
                <el-col :span="4" class="counter">
                  {{dataObject.projectStatus && dataObject.projectStatus.postPoneCompleteCounts}}<span class="title">个</span>
                </el-col>
              </el-row>
              <div class="boxfoot"></div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script>
import TestQuality from './provincechildren/test-quality'
import TestProgress from './provincechildren/test-progress'
export default {
  name: 'ProvinceChildrenPage',
  components: {
    TestQuality, TestProgress
  },
  data () {
    return {
      clientHeight: 0,
      screenResolution: 4,
      fullscreen: false, // 是否全屏展示
      stageNameMap: { '1': '需求分析', '2': '需求评审', '3': '方案设计', '4': '方案评审', '5': '用例设计', '6': '用例评审', '7': '用例执行' },
      projectStatusMap: { '-1': '配置中', '0': '未开始', '1': '正常在测', '2': '正常完成', '3': '延期在测', '4': '延期完成', '5': '已归档' },
      projectTableData: [],
      page: 1,
      limit: 15,
      total: 0,
      dataObject: {
        height: 0,
        clientHeight: 0,
        random: 0,
        reloadIndex: 0, // 刷新次数
        // 测试质量
        testQuality: {},
        // 测试进度
        testProgress: {},
        // 项目状态统计、项目概况
        projectStatisticsData: {}
      },
      provinceId: '',
      provinceName: '',
      organizeIds: ''
    }
  },
  computed: {},
  created () {
  },
  mounted () {
    let thisvm = this
    thisvm.$nextTick(() => {
      let params = this.$route.params
      if (Object.keys(params).length === 0) {
        let cacheProvinceInfo = window.localStorage.getItem('cacheProvinceInfo') || '{}'
        params = JSON.parse(cacheProvinceInfo)
      }
      if (Object.keys(params).length > 0) {
        window.localStorage.setItem('cacheProvinceInfo', JSON.stringify(params))
        thisvm.provinceId = params.provinceId || ''
        thisvm.provinceName = params.provinceName || ''
        thisvm.organizeIds = params.organizeIds || ''
        thisvm.getClientHeight()
        thisvm.getProvinceProjectView()
        thisvm.getStatisticsData()
      }
    })
  },
  methods: {
    doGoback () {
      this.$router.push({
        name: 'bigscreenpage',
        params: { 'random': Math.random() }
      })
    },
    doProjectDrill (item) {
      this.$router.push({
        name: 'projectchildrenpage',
        params: { 'projectId': item.projectId, 'projectName': item.name, 'provinceId': this.provinceId, 'provinceName': this.provinceName, 'organizeIds': this.organizeIds, 'pageSource': 2, 'random': Math.random() }
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
      if (type === 'default') {
        let hval = ((height - 190) * 0.25)
        style.height = hval + 'px'
      } else if (type === 'table') {
        // 省份表格
        let hval = (height - 150)
        style.height = hval + 'px'
        this.dataObject.clientHeight = hval
      } else if (type === 'all') {
        // 整体页面空间
        let hval = height
        style.height = hval + 'px'
      } else if (type === 'graph') {
        // 测试质量、测试进度
        let hval = ((height - 190) * 0.5)
        this.dataObject.height = hval
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
    pageSizeCurrentHandle (val) {
      this.page = val
      this.getProvinceProjectView()
    },
    getStatisticsData () {
      let params = {}
      params.provinceId = this.provinceId
      params.organizeIds = this.organizeIds
      this.$http.get('/ctc/visualization/dashbord/getProvinceMain', { 'params': params }).then(({ data: res }) => {
        this.dataObject = { ...this.dataObject, ...res }
        this.dataObject.reloadIndex += 1
      }).catch(() => { })
    },
    getProvinceProjectView () {
      let params = { page: this.page, limit: this.limit }
      params.organizeIds = this.organizeIds
      params.provinceId = this.provinceId
      this.$http.get('/ctc/visualization/dashbord/getProvinceProjectView', { 'params': params }).then(({ data: res }) => {
        this.projectTableData = res.records
        this.total = Number(res.total)
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
  .el-pagination.is-background {
    .el-pagination__total {
      color: #fff;
    }
    .btn-prev,
    .btn-next {
      background: #17395f;
      box-shadow: inset 0px 0px 5px 0px rgba(23, 165, 245, 0.97);
      border-radius: 2px;
      border: solid 1px #42caf3;
      opacity: 0.75;
      color: #fff;
    }
    .el-pager li {
      background: #17395f;
      box-shadow: inset 0px 0px 5px 0px rgba(23, 165, 245, 0.97);
      border-radius: 2px;
      border: solid 1px #42caf3;
      opacity: 0.75;
      color: #fff;
    }
    .el-pager li.active {
      background: #1dbfff;
      opacity: 0.85;
    }
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
    .split-center-line {
      height: 1.8px;
      line-height: 1.8px;
      background: linear-gradient(to left, #252a5c, #7187ac, #252a5c);
    }
  }
}
</style>
