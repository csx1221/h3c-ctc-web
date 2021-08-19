<template>
  <el-row class="project-el-container">
    <ctc-page-path ref="ctcPagePath"></ctc-page-path>
    <el-col :span="24" class="project-el-header">
      <el-button-group style="width:100%;">
        <template v-for="(item,index) in projectStepData">
          <el-button :key="index" @click.native="faskNavStep(item.activeIndex)" :class="[getStepButtonStyle(1,index)]" :style="getStepButtonStyle(2,index)">
            {{item.title}}
            <i class="el-icon-arrow-right el-icon--right" v-if="index<projectStepData.length-1"></i>
          </el-button>
        </template>
      </el-button-group>
      <el-divider content-position="left">{{activeName}}</el-divider>
    </el-col>
    <el-col :span="24" class="project-el-middle">
      <component :is="componentName" :projectData="projectData" ref="projectData"></component>
    </el-col>
    <el-col :span="24" class="project-el-bottom">
      <el-button v-if="activeIndex>0" type="primary" size="small" @click="doStep(1)">上一步</el-button>
      <el-button v-if="activeIndex<projectStepData.length" type="primary" size="small" @click="doStep(2)">{{nextBtnTxt}}</el-button>
    </el-col>
  </el-row>
</template>
<script>
import debounce from 'lodash/debounce'
import BaseinfoStepPage from './create-child-project-step/baseinfo-step-page'
import SetstageStepPage from './create-child-project-step/setstage-step-page'
import FinishStepPage from './create-child-project-step/finish-step-page'
export default {
  name: 'CreateChildProjectPage',
  components: {
    BaseinfoStepPage, SetstageStepPage, FinishStepPage
  },
  data () {
    return {
      componentName: '',
      activeIndex: -1, // 当前激活状态
      activeName: '', // 当前激活状态名称
      nextBtnTxt: '下一步',
      projectStepData: [],
      projectData: {
        projectId: '',
        type: '0',
        // 基础信息
        baseInfo: {
          name: ''
        },
        triggerObject: {
          // 触发类型(1:保存;)
          type: -1,
          random: -1
        },
        resultObject: {
          // 返回触发类型(1:保存成功;0:保存失败)
          type: -1,
          random: -1
        }
      }
    }
  },
  watch: {
    'projectData.type' (newVal, oldVal) {
      this.changeProjectStepData(newVal)
    },
    // 步骤索引变化
    activeIndex (newVal, oldVal) {
      this.executeProjectStepInfo()
    },
    projectData: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (newVal.resultObject.type === 1) {
          // 重置默认状态
          newVal.resultObject.type = -1
          this.activeIndex = this.activeIndex + 1
        }
        // console.info('watch-new:' + JSON.stringify(newVal))
      }
    }
  },
  computed: {
  },
  mounted () {
    // 父项目id
    let parentId = this.$route.params.parentId || ''
    // 子项目id
    let projectId = this.$route.params.projectId || ''
    let operationType = this.$route.params.operationType || 'add'
    let activeIndex = this.$route.params.activeIndex || 0
    // 0:编辑模式;1:只读模式
    let readOnly = this.$route.params.readOnly || 0
    let pagePathParams = this.$route.params.pagePathParams || {}
    let searchProjectId = ''
    if (operationType === 'add') {
      searchProjectId = parentId
    } else {
      searchProjectId = projectId
    }
    // 显示页面路径地址
    this.$refs.ctcPagePath.init(pagePathParams)
    // 设置父项目Id
    this.projectData.parentId = parentId
    this.projectData.operationType = operationType
    this.projectData.readOnly = readOnly
    this.projectData.baseInfo.parentId = parentId
    if (searchProjectId !== '') {
      this.$http.get('/ctc/project/projectBase/' + searchProjectId).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('获取项目基本信息失败')
        } else {
          let data = res.data
          // 重新賦值父项目id
          data.parentId = data.parentId || parentId
          // 判断一下是否是新增
          if (operationType === 'add') {
            this.projectData.projectId = ''
            data.projectId = ''
            data.name = ''
            data.projectStatus = '-1'
          } else {
            this.projectData.projectId = projectId
          }
          this.projectData.type = data.type + ''
          this.projectData.baseInfo = { ...this.projectData.baseInfo, ...data }
          // 设置跳转步骤
          this.activeIndex = activeIndex
        }
      }).catch(() => { })
    }
  },
  methods: {
    getStepButtonStyle (type, index) {
      let stepLen = this.projectStepData.length
      if (type === 1) {
        let className = ''
        if (index < this.activeIndex) {
          className = 'el-buttom-greaterthan'
        } else if (index === this.activeIndex) {
          className = 'el-buttom-equalto'
        } else {
          className = 'el-buttom-lessthan'
        }
        if (this.activeIndex > stepLen - 1 && index === stepLen - 1) {
          className = 'el-buttom-last'
        }
        return className
      } else if (type === 2) {
        let style = {}
        style.width = 100 / stepLen + '%'
        return style
      }
    },
    executeProjectStepInfo () {
      let thisvm = this
      let activeIndex = thisvm.activeIndex
      let itemStepArr = thisvm.projectStepData.filter(function (item) {
        return item.activeIndex === activeIndex
      })
      if (itemStepArr.length > 0) {
        let itemStep = itemStepArr[0]
        thisvm.activeName = itemStep.title
        thisvm.componentName = itemStep.componentName
      }
      // 判断是否配置完成
      let stepLen = thisvm.projectStepData.length - 1
      if (stepLen === activeIndex) {
        this.nextBtnTxt = '完成'
      } else {
        this.nextBtnTxt = '下一步'
        if (stepLen < activeIndex) {
          thisvm.activeName = '配置完成'
          thisvm.componentName = 'FinishStepPage'
          this.doSubmit()
        }
      }
    },
    changeProjectStepData (type) {
      let projectStepData = []
      projectStepData.push({ 'title': '填写子项目信息', 'activeIndex': 0, 'componentName': 'BaseinfoStepPage' })
      projectStepData.push({ 'title': '设置子项目阶段', 'activeIndex': 1, 'componentName': 'SetstageStepPage' })
      this.projectStepData = projectStepData
    },
    faskNavStep (activeIndex) {
      if (this.projectData.projectId === '') {
        this.$message.warning('项目基本信息还未配置，不允许进行快捷导航操作')
      } else {
        this.activeIndex = activeIndex
      }
    },
    doSubmit () {
      if (this.projectData.readOnly === 0) {
        this.$http.get('/ctc/project/projectBase/submitProject/' + this.projectData.projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('提交失败')
          }
          this.projectData.triggerObject.type = 3
          this.projectData.triggerObject.random = Math.random()
          this.$handTriggerReLoadEvent('projectReload')
        }).catch(() => {
        })
      }
    },
    doStep: debounce(function (type) {
      if (type === 1) {
        // 上一步
        this.activeIndex = this.activeIndex - 1
      } else if (type === 2) {
        // 下一步(特殊处理第二步，自动触发保存)
        if (this.activeIndex === 0 && this.projectData.readOnly === 0) {
          this.projectData.triggerObject.type = 2
          this.projectData.triggerObject.random = Math.random()
        } else {
          this.activeIndex = this.activeIndex + 1
        }
      }
      // 特殊处理提交进度条
      if (type !== 4) {
        let thisvm = this
        thisvm.$ctcLoading.open()
        setTimeout(function () { thisvm.$ctcLoading.close() }, 1200)
      }
    }, 1200, { 'leading': true, 'trailing': false })
  }
}
</script>
<style lang="scss">
.project-el-container {
  .project-el-header {
    .el-icon-arrow-right.el-icon--right {
      float: right;
    }
    .el-button {
      font-size: 17px;
      height: 45px;
    }
    .el-button:after {
      position: absolute;
      top: 0px;
      right: -22px;
      width: 43px;
      height: 43px;
      transform: scale(0.707) rotate(45deg);
      z-index: 1;
      border-radius: 0 5px 0 50px;
      box-sizing: content-box;
      content: '';
      transition: all 0.3s ease-in-out;
      -webkit-transition: all 0.3s ease-in-out;
      -ms-transition: all 0.3s ease-in-out;
    }
    .el-buttom-greaterthan {
      background-color: #26c6da;
      color: #fff;
    }
    .el-buttom-greaterthan:after {
      background-color: #26c6da;
    }
    .el-buttom-equalto {
      background-color: #4190f7;
      color: #fff;
    }
    .el-buttom-equalto:after {
      background-color: #4190f7;
    }
    .el-buttom-lessthan {
      background-color: #ebeef5;
      color: #999;
    }
    .el-buttom-lessthan:after {
      background-color: #ebeef5;
    }
    .el-buttom-last {
      background-color: #26c6da;
      color: #fff;
    }
  }
}
</style>
<style lang="scss" scoped>
.project-el-container {
  height: 100%;
  padding: 24px;
  background: #ffffff;
  .project-el-header {
    height: 100px;
    margin-top: 20px;
    margin-bottom: 20px;
    .el-divider__text.is-left {
      color: #17b3a3;
      font-size: 20px;
    }
  }
  .project-el-middle {
    height: 80%;
    min-height: 580px;
    margin-bottom: 50px;
  }
  .project-el-bottom {
    text-align: center;
    position: fixed;
    background: #ffffff;
    right: 15px;
    bottom: 0px;
    z-index: 10;
    width: 90%;
    .el-button {
      margin: 12px 50px 50px 50px;
    }
  }
}
</style>
