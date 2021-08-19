<template>
  <el-row class="setmember-setp-page">
    <el-row style="margin-bottom:10px;">
      <el-col :span="4">
        <el-input placeholder="请输入成员名称" v-model="searchname" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getMemberTableData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="14" style="padding-top:10px;padding-left:5px;">
        <span style="color:#4190f7;">说明：项目组成员可参与项目的各个阶段，参测对象成员只能参与项目的用例执行阶段</span>
      </el-col>
      <el-col :span="6" style="text-align:right;" v-if="projectData.readOnly==0">
        <el-button type="blue" size="small" v-if="btnTaskAuth  && activeGroup==1" @click="doAddUserClick(1,'addMember')">添加成员</el-button>
        <el-button type="blue" size="small" v-if="btnTaskAuth && activeGroup==1" @click="doAddUserClick(2,'addRefMemberGroup')">引用成员</el-button>
        <el-button type="blue" size="small" :disabled="getValidProjectStatus(1)" v-if="activeGroup==2" @click="doAddOrganize">添加机构</el-button>
        <el-button type="blue" size="small" :disabled="[3].includes(getValidProjectStatus(0))" v-if="activeGroup==2" @click="doImportInterfaceUser">上传接口人</el-button>
      </el-col>
    </el-row>
    <el-col :span="24" class="el-tabls-group">
      <el-tabs v-model="activeGroup" type="border-card" @tab-click="handleSwitchGroupClick">
        <el-tab-pane label="项目组成员" name="1">
          <el-radio-group v-model="projectMemberView" size="small" style="margin-bottom:5px;" @change="projectMemberViewChange">
            <el-radio-button label="1">列表视图</el-radio-button>
            <el-radio-button label="2">概览视图</el-radio-button>
          </el-radio-group>
          <el-table stripe :data="projectTableData" border height="500" v-if="activeGroup==1 && projectMemberView==1">
            <el-table-column prop="userName" label="成员账号" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="realName" label="成员姓名" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="projectRoleName" label="成员角色" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="organizeName" label="所属机构" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="deptName" label="所属部门" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="mobile" label="手机号码" header-align="center" align="center" v-if="audit4ASw==0" show-overflow-tooltip></el-table-column>
            <el-table-column prop="email" label="Email" header-align="center" align="center" v-if="audit4ASw==0" show-overflow-tooltip></el-table-column>
            <el-table-column fixed="right" label="操作" width="150" v-if="projectData.readOnly==0">
              <template slot-scope="scope">
                <el-button @click="handleRemoveClick(scope.row)" v-if="scope.row.manager==0" type="text" size="small">移除</el-button>
                <el-button @click="handleSetRoleClick(scope.row)" v-if="scope.row.manager==0" :disabled="scope.row.canChangeProjectRole" type="text" size="small">角色赋权</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-col :span="24" v-if="activeGroup==1 && projectMemberView==2" style="height: 500px;overflow-y:auto;padding-top:15px;">
            <template v-for="(value,key) in overviewDataMap">
              <div :key="key" class="defect-province-div">
                {{key}}（{{value.length}}个）：{{value.length>0?value.join('、'):''}}
              </div>
            </template>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="参测对象成员" name="2" v-if="projectData.baseInfo.scope!=1">
          <el-table stripe :data="testObjectTableData" border height="500" v-if="activeGroup==2">
            <el-table-column prop="organizeName" label="机构名称" header-align="left" align="left" show-overflow-tooltip></el-table-column>
            <el-table-column prop="organizeType" label="机构类型" header-align="left" align="left" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.organizeType==6">业务平台</span>
                <span v-else> {{ $getDictLabel('organizeType', scope.row.organizeType) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="participantInterfaceUsers" label="接口人" header-align="left" align="left" show-overflow-tooltip width="600">
              <template slot-scope="scope">
                <span v-html="getParticipantInterfaceUsers(scope.row.participantInterfaceUsers)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="projectParticipantMembers" label="机构成员" header-align="left" align="left" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-html="getProjectParticipantMembers(scope.row.projectParticipantMembers)"></span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180" v-if="projectData.readOnly==0">
              <template slot-scope="scope">
                <el-button @click="handleSetUserClick(scope.row)" type="text" size="small" :disabled="[3].includes(getValidProjectStatus(0))">指定接口人</el-button>
                <el-button @click="doAddTestObjectUserClick(scope.row)" type="text" size="small" :disabled="[3].includes(getValidProjectStatus(0))">添加成员</el-button>
                <el-button @click="handleRemoveTestObjectClick(scope.row)" type="text" size="small" :disabled="[3].includes(getValidProjectStatus(0))">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <set-role :visible.sync="setRole" ref="setRole" @watchChildMethod="triggerParentMethod"></set-role>
    <add-member :visible.sync="addMember" ref="addMember" @watchChildMethod="triggerParentMethod"></add-member>
    <add-ref-member-group :visible.sync="addRefMemberGroup" ref="addRefMemberGroup" @watchChildMethod="triggerParentMethod"></add-ref-member-group>
    <this-user :visible.sync="thisUser" ref="thisUser" @watchChildMethod="triggerParentMethod"></this-user>
    <add-organize :visible.sync="addOrganize" ref="addOrganize" @watchChildMethod="triggerParentMethod"></add-organize>
    <add-test-object-member :visible.sync="addTestObjectMember" ref="addTestObjectMember" @watchChildMethod="triggerParentMethod"></add-test-object-member>
    <ctc-file-import ref="ctcFileImport" :visible.sync="ctcFileImport" @watchChildImport="triggerParentMethod"></ctc-file-import>
    <project-data-sync :visible.sync="projectDataSync" ref="projectDataSync" @watchChildMethod="triggerParentMethod"></project-data-sync>
  </el-row>
</template>
<script>
import Cookies from 'js-cookie'
import SetRole from './choose-dialog/set-role'
import AddMember from './choose-dialog/add-member'
import AddRefMemberGroup from './choose-dialog/add-ref-member-group'
import ThisUser from './choose-dialog/this-user'
import AddOrganize from './choose-dialog/add-organize'
import AddTestObjectMember from './choose-dialog/add-testobject-member'
import ProjectDataSync from './project-data-sync'
export default {
  name: 'SetmemberStepPage',
  components: {
    SetRole, AddMember, AddRefMemberGroup, ThisUser, AddOrganize, AddTestObjectMember, ProjectDataSync
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      audit4ASw: Cookies.get('audit4ASw'), // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
      searchname: '',
      activeGroup: '1',
      addMember: false, // 添加成员
      addRefMemberGroup: false, // 添加引用成员组
      setRole: false, // 设置角色
      thisUser: false, // 指定接口人
      projectMemberView: '1', // 项目成员视图切换
      addOrganize: false, // 添加机构
      addTestObjectMember: false, // 添加参测对象成员
      ctcFileImport: false, // 设置接口人文件导入
      projectDataSync: false, // 项目通知机制
      overviewDataMap: {},
      projectTableData: [], // 项目组成员
      testObjectTableData: [], // 参测对象成员
      tmpExecuteData: {}, // 临时执行数据
      projectDataSyncConfig: { 'subProjectIds': [], 'fullSync': true }, // 同步策略参数
      btnTaskAuth: false,
      matchCacheData: {
        memeberDataMap: {},
        testObjectDataMap: {}
      }
    }
  },
  computed: {},
  mounted () {
    this.getMemberTableData()
    this.getProjectTaskAuth()
  },
  methods: {
    triggerParentMethod (message) {
      // 判断是否是函数执行
      if (message.type === 'execute') {
        // 项目成员保存、参测对象保存
        if (message.executeType === 'projectMember' || message.executeType === 'projectParticipant') {
          this.openProjectDataSync(message)
        } else {
          this.executeMethod(message)
        }
      } else if (message.type === 'executeProjectSyncData') {
        this.projectDataSyncConfig = { ...this.projectDataSyncConfig, ...message.data }
        let data = { ...this.tmpExecuteData.data, ...this.projectDataSyncConfig }
        this.tmpExecuteData.data = data
        let tmpMessage = this.tmpExecuteData

        this.executeMethod(tmpMessage)
      } else if (message.type === 'reloadTable') {
        this.getMemberTableData()
      }
    },
    openProjectDataSync (message) {
      // 加工数据
      if (message.executeType === 'projectMember') {
        let data = { ...this.projectDataSyncConfig, 'projectId': this.projectData.projectId, 'projectMembers': message.data }
        message.data = data
      } else if (message.executeType === 'projectParticipant') {
        let data = { ...this.projectDataSyncConfig, 'projectId': this.projectData.projectId, 'projectParticipants': message.data }
        message.data = data
      }
      let projectStatus = Number(this.projectData.baseInfo.projectStatus)
      // '0': '未开始', '1': '正常在测',  '3': '延期在测'
      if ([0, 1, 3].includes(projectStatus)) {
        // syncType同步类型(projectParticipant:参测对象;projectMember:项目成员)
        // 把数据先缓存起来
        this.tmpExecuteData = message
        // syncType同步类型(projectParticipant:参测对象;projectMember:项目成员)
        this.$refs.projectDataSync.syncType = message.executeType
        this.$refs.projectDataSync.projectId = this.projectData.projectId
        this.$refs.projectDataSync.type = this.projectData.type
        this.$refs.projectDataSync.projectDataSyncConfig = this.projectDataSyncConfig
        this.$refs.projectDataSync.init()
      } else {
        this.executeMethod(message)
      }
    },
    getProjectTaskAuth () {
      let projectId = this.projectData.projectId
      if (projectId) {
        let params = { 'projectId': projectId }
        this.$http.get('/ctc/project/list/canEditProject', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.btnTaskAuth = res.data || false
          }
        }).catch(() => { })
      }
    },
    // 执行服务
    executeMethod (message) {
      if (message.postType === 'get') {
        this.$http.get(message.url, { params: { ...message.data } }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            if (message.data.reload) {
              this.getMemberTableData()
            }
          }
        }).catch(() => {
        })
      } else {
        // 支持[put,post,delete]
        this.$http[message.postType](message.url, message.data).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            if (message.reload) {
              this.getMemberTableData()
            }
          }
        }).catch(() => {
        })
      }
    },
    projectMemberViewChange (item) {
      // 概览视图
      if (item === '2') {
        let overviewDataMap = {}
        let overviewData = Object.assign([], this.projectTableData)
        overviewData.forEach((item, index) => {
          let key = item.projectRoleName || '其他'
          if (!overviewDataMap.hasOwnProperty(key)) {
            overviewDataMap[key] = []
          }
          overviewDataMap[key].push(item.realName)
        })
        this.overviewDataMap = overviewDataMap
      }
    },
    // 获取项目成员数据
    getMemberTableData () {
      this.$ctcLoading.open()
      let params = { 'projectId': this.projectData.projectId, 'userName': this.searchname, 'realName': this.searchname }
      let url = '/ctc/project/projectMember/list'
      if (this.activeGroup === '2') {
        url = '/ctc/project/projectParticipant/list'
        params.organizeName = this.searchname
        delete params['userName']
      }
      this.$http.get(url, { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('查询成员数据失败：' + res.msg)
        } else {
          let dataMap = {}
          let data = res.data
          if (this.activeGroup === '1') {
            data.forEach((item, index) => {
              dataMap[item.userId] = item
            })
            this.projectTableData = data
            this.matchCacheData.memeberDataMap = dataMap
          } else {
            data.forEach((item, index) => {
              dataMap[item.organizeId] = item
            })
            this.testObjectTableData = data
            this.matchCacheData.testObjectDataMap = dataMap
          }
        }
        this.$nextTick(() => {
          this.$ctcLoading.close()
        })
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    getParticipantInterfaceUsers (participantInterfaceUsers) {
      let dataHtml = []
      participantInterfaceUsers = participantInterfaceUsers || []
      participantInterfaceUsers.forEach((item, index) => {
        let data = item.interfaceUserName + '（手机：' + (item.interfaceUserMobile || '--') + '，邮箱：' + (item.interfaceUserEmail || '--') + '）'
        dataHtml.push(data)
      })
      return dataHtml.join('<br/>')
    },
    getProjectParticipantMembers (projectParticipantMembers) {
      let dataHtml = []
      projectParticipantMembers = projectParticipantMembers || []
      projectParticipantMembers.forEach((item, index) => {
        dataHtml.push(item.participantUserName)
      })
      return dataHtml.join('，')
    },
    // type:(0:获取具体匹配值;1:项目;2:参测对象;3:项目成员)
    getValidProjectStatus (type, elId) {
      let matchValue = 1
      let projectStatus = this.projectData.baseInfo.projectStatus
      // matchValue(1:增删改;2:只能增;3:不可增删改)
      if ([-1, 0].includes(projectStatus)) {
        // '-1': '配置中', '0': '未开始'
        matchValue = 1
      } else if ([1, 3].includes(projectStatus)) {
        // '1': '正常在测',  '3': '延期在测',
        matchValue = 2
      } else if ([2, 4].includes(projectStatus)) {
        // '2': '正常完成',  '4': '延期完成'
        matchValue = 3
      }
      let disabled = true
      if (type === 0) {
        disabled = matchValue
      } else if (type === 1) {
        disabled = matchValue === 3
      } else if (type === 2) {
        if ([2, 3].includes(matchValue)) {
          if (this.matchCacheData.testObjectDataMap[elId]) {
            disabled = true
          } else {
            disabled = false
          }
        } else {
          disabled = false
        }
      } else if (type === 3) {
        if ([2, 3].includes(matchValue)) {
          if (this.matchCacheData.memeberDataMap[elId]) {
            disabled = true
          } else {
            disabled = false
          }
        } else {
          disabled = false
        }
      }
      return disabled
    },
    doAddUserClick (type, refsType) {
      this.$refs[refsType].projectId = this.projectData.projectId
      this.$refs[refsType].init()
    },
    handleRemoveClick (row) {
      this.$confirm('确定进行[删除]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {}
        data.data = [row.memberId]
        let params = { 'type': 'execute', 'postType': 'delete', 'url': '/ctc/project/projectMember', 'reload': true }
        let saveParams = { ...params, 'data': data }
        this.executeMethod(saveParams)
      }).catch(() => {
      })
    },
    handleRemoveTestObjectClick (row) {
      this.$confirm('确定进行[删除]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {}
        data.data = [row.participantId]
        let params = { 'type': 'execute', 'postType': 'delete', 'url': '/ctc/project/projectParticipant', 'reload': true }
        let saveParams = { ...params, 'data': data }
        this.executeMethod(saveParams)
      }).catch(() => {
      })
    },
    handleSetRoleClick (row) {
      this.$refs.setRole.projectId = this.projectData.projectId
      this.$refs.setRole.memberId = row.memberId
      this.$refs.setRole.init()
    },
    handleSetUserClick (row) {
      this.$refs.thisUser.projectId = this.projectData.projectId
      this.$refs.thisUser.participantId = row.participantId
      this.$refs.thisUser.organizeId = row.organizeId
      this.$refs.thisUser.organizeType = row.organizeType
      this.$refs.thisUser.participantInterfaceUsers = row.participantInterfaceUsers || []
      this.$refs.thisUser.init()
    },
    doAddTestObjectUserClick (row) {
      this.$refs.addTestObjectMember.projectId = this.projectData.projectId
      this.$refs.addTestObjectMember.participantId = row.participantId
      this.$refs.addTestObjectMember.organizeId = row.organizeId
      this.$refs.addTestObjectMember.organizeType = row.organizeType
      this.$refs.addTestObjectMember.init()
    },
    doAddOrganize () {
      this.$refs.addOrganize.projectId = this.projectData.projectId
      this.$refs.addOrganize.testObjectTableData = this.testObjectTableData
      this.$refs.addOrganize.testObjectDataMap = this.matchCacheData.testObjectDataMap
      this.$refs.addOrganize.matchValue = this.getValidProjectStatus(0)
      this.$refs.addOrganize.init()
    },
    doImportInterfaceUser () {
      let uploadData = { 'projectId': this.projectData.projectId }
      let templateData = { 'fileName': '接口人模板下载', 'projectId': this.projectData.projectId }
      let fileImportParams = { 'templateData': templateData, 'uploadData': uploadData }
      fileImportParams.templateUrl = '/ctc/project/projectParticipant/exportInterfaceUserData'
      fileImportParams.uploadUrl = '/ctc/project/projectParticipant/importInterfaceUserData'
      this.$refs.ctcFileImport.fileImportParams = { ...this.$refs.ctcFileImport.fileImportParams, ...fileImportParams }
      this.$refs.ctcFileImport.init()
    },
    handleSwitchGroupClick (tab, event) {
      this.getMemberTableData()
    }
  }
}
</script>
<style lang="scss" scoped>
.setmember-setp-page {
  .el-tabls-group {
    .el-tab-pane {
      padding: 10px;
    }
  }
  .defect-province-div {
    padding: 0px 15px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 650;
    line-height: 20px;
    letter-spacing: 2px;
  }
}
</style>
