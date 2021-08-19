<template>
  <el-card shadow="never" class="aui-card--fill  auth-operate-mgr">
    <el-form :model="dataForm" ref="dataForm" :inline="false" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="name" label="过滤名称">
            <el-input v-model="dataForm.name" placeholder="支持按项目名称、任务名称、工单名称、用例名称、缺陷名称过滤"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align:right;">
          <el-button type="primary" size="small" @click="doLoadTableData()">查询</el-button>
          <el-button size="small" @click="doReLoadTableData()">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-bottom:10px;">
      <el-col :span="24" style="text-align:right;">
        <el-button type="danger" size="small" @click="doBatchDeleteData()">删除</el-button>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="项目列表" name="1">
        <project-list ref="childrenComponent1" @watchChildMethod="triggerParentMethod"></project-list>
      </el-tab-pane>
      <el-tab-pane label="任务列表" name="2" v-if="showTabPane(2)">
        <task-list ref="childrenComponent2" @watchChildMethod="triggerParentMethod"></task-list>
      </el-tab-pane>
      <el-tab-pane label="工单列表" name="3" v-if="showTabPane(3)">
        <workorder-list ref="childrenComponent3" @watchChildMethod="triggerParentMethod"></workorder-list>
      </el-tab-pane>
      <el-tab-pane label="用例[设计|执行]列表" name="4" v-if="showTabPane(4)">
        <case-list ref="childrenComponent4" @watchChildMethod="triggerParentMethod"></case-list>
      </el-tab-pane>
      <el-tab-pane label="缺陷列表" name="5" v-if="showTabPane(5)">
        <defect-list ref="childrenComponent5" @watchChildMethod="triggerParentMethod"></defect-list>
      </el-tab-pane>
    </el-tabs>
    <el-row>
      <el-col :span="24">
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import ProjectList from './children/project-list'
import TaskList from './children/task-list'
import WorkorderList from './children/workorder-list'
import CaseList from './children/case-list'
import DefectList from './children/defect-list'
export default {
  name: 'AuthOperateMgr',
  components: {
    ProjectList, TaskList, WorkorderList, CaseList, DefectList
  },
  data () {
    return {
      dataForm: {
        name: ''
      },
      activeName: '1',
      // operateType(1:项目;2:任务;3:工单;4:用例;5:缺陷)
      operateType: 1,
      skipLevelType: -1, // 跨级跳切换
      breadcrumbData: [
        { 'name': '项目列表' }, { 'name': '' }, { 'name': '' }, { 'name': '' }, { 'name': '' }
      ]
    }
  },
  computed: {},
  created () {
  },
  mounted () {
    this.doLoadTableData()
  },
  activated () {
  },
  methods: {
    triggerParentMethod (message) {
      if (message.type === 'gotoNextList') {
        this.gotoNextList(message.data)
      }
    },
    gotoNextList (data) {
      // 设置tab切激活名称
      this.activeName = data.operateType + ''
      // 设置操作类型
      this.operateType = data.operateType
      // 设置跨级跳类型
      this.skipLevelType = data.skipLevelType || -1
      this.dataForm.name = ''
      this.$nextTick(() => {
        let params = data
        this.$refs[this.getComName()].getTableData(params, 'goto')
      })
    },
    showTabPane (type) {
      let isShowFlag = false
      // 判断是否存在跨级跳转
      if (this.skipLevelType === -1) {
        if (type === 2) {
          isShowFlag = this.operateType >= 2
        } else if (type === 3) {
          isShowFlag = this.operateType >= 3
        } else if (type === 4) {
          isShowFlag = this.operateType >= 4
        } else if (type === 5) {
          isShowFlag = this.operateType >= 5
        }
      } else {
        if (this.skipLevelType === type) {
          isShowFlag = true
        }
      }
      return isShowFlag
    },
    handleClick (tab, event) {
    },
    getComName () {
      let comName = 'childrenComponent' + this.activeName
      return comName
    },
    doReLoadTableData () {
      this.$refs.dataForm.resetFields()
      this.doLoadTableData()
    },
    doLoadTableData () {
      this.$refs[this.getComName()].getTableData(this.dataForm, 'btn')
    },
    doBatchDeleteData () {
      this.$refs[this.getComName()].doBatchDeleteData()
    }
  }
}
</script>
<style  lang="scss">
.auth-operate-mgr {
}
</style>
