<template>
  <el-row class="project-el-container">
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
import FrameworkStepPage from './create-project-step/framework-step-page'
import BaseinfoStepPage from './create-project-step/baseinfo-step-page'
import SetmemberStepPage from './create-project-step/setmember-step-page'
import SetstageStepPage from './create-project-step/setstage-step-page'
import FinishStepPage from './create-project-step/finish-step-page'
export default {
  name: 'CreateProjectPage',
  components: {
    FrameworkStepPage, BaseinfoStepPage, SetmemberStepPage, SetstageStepPage, FinishStepPage
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
    let projectId = this.$route.params.projectId || ''
    let operationType = this.$route.params.operationType || 'add'
    let activeIndex = this.$route.params.activeIndex || 1
    // 0:编辑模式;1:只读模式
    let readOnly = this.$route.params.readOnly || 0
    this.projectData.operationType = operationType
    this.projectData.readOnly = readOnly
    // 初始化项目创建步骤
    this.changeProjectStepData('0')
    if (projectId) {
      this.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('获取项目基本信息失败')
        } else {
          let data = res.data
          this.projectData.projectId = projectId
          this.projectData.type = data.type + ''
          this.projectData.baseInfo = { ...data }
        }
        // 设置跳转步骤
        this.activeIndex = activeIndex
      }).catch(() => { })
    } else {
      // 特殊处理自动填充机构信息
      let userInfo = this.$store.state.user
      // 02:平台项目经理;03:总部项目经理;08:专业公司项目经理;09:省项目项目经理
      if (['02', '03', '08', '09'].includes(userInfo.roleType)) {
        this.projectData.baseInfo.organizeId = userInfo.organizeId
        this.projectData.baseInfo.managerId = userInfo.id
      }
      this.activeIndex = 0
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
      if (type === '1') {
        // 三级架构
        projectStepData.push({ 'title': '选择项目架构', 'activeIndex': 0, 'componentName': 'FrameworkStepPage' })
        projectStepData.push({ 'title': '填写项目信息', 'activeIndex': 1, 'componentName': 'BaseinfoStepPage' })
        projectStepData.push({ 'title': '设置项目成员', 'activeIndex': 2, 'componentName': 'SetmemberStepPage' })
      } else {
        // 二级架构
        projectStepData.push({ 'title': '选择项目架构', 'activeIndex': 0, 'componentName': 'FrameworkStepPage' })
        projectStepData.push({ 'title': '填写项目信息', 'activeIndex': 1, 'componentName': 'BaseinfoStepPage' })
        projectStepData.push({ 'title': '设置项目成员', 'activeIndex': 2, 'componentName': 'SetmemberStepPage' })
        projectStepData.push({ 'title': '设置项目阶段', 'activeIndex': 3, 'componentName': 'SetstageStepPage' })
      }
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
        if (this.activeIndex === 1 && this.projectData.readOnly === 0) {
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
    .el-button:hover {
      border: 0px;
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
