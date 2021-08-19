<template>
  <el-row class="baseinfo-step-page">
    <el-col :span="24">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px" :disabled="projectData.readOnly==1">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="name" label="子项目名称：">
              <el-input v-model="dataForm.name" placeholder="请输入子项目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="managerId" label="子项目经理：">
              <el-select v-model="dataForm.managerId" value-key="userId" filterable placeholder="请选择子项目经理" @change="managerChange">
                <el-option v-for="item in managerData" :key="item.userId" :label="item.realName" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="subProjectType" label="子项目类型：">
              <ctc-select v-model="dataForm.subProjectType" dict-type="project.subProjectType" multiple placeholder="请选择子项目类型"></ctc-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="childProjectMember" label="子项目成员：">
              <div class="el-input el-input-group el-input-group--append">
                <div v-show="childProjectMemberList.length>0" class="el-input__inner">
                  <template v-for="(item,index) in childProjectMemberList">
                    <el-tag v-if="projectData.readOnly==1" class="eltag" :key="index" :title="item.userName" type="info">{{item.realName}}</el-tag>
                    <el-tag v-else class="eltag" closable @close="doCloseChildProjectMember(item)" :key="index" :title="item.userName">{{item.realName}}</el-tag>
                  </template>
                </div>
                <el-input v-show="childProjectMemberList.length==0" v-model="dataForm.childProjectMember" placeholder="请选择子项目成员"></el-input>
                <div class="el-input-group__append">
                  <el-button icon="el-icon-search" @click="doAddChildProjectMember"></el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dataForm.scope!=='1'">
          <el-col :span="24">
            <el-form-item prop="testObject" label="参测对象：">
              <div class="el-input el-input-group el-input-group--append">
                <div class="el-input__inner" v-if="testObjectData.length>0">
                  <template v-for="(item,index) in testObjectData">
                    <el-tag v-if="getValidProjectStatus(2,item.organizeId)" class="eltag" :key="index" type="info">{{item.name}}</el-tag>
                    <el-tag v-else class="eltag" closable @close="doCloseChildProjectTestObject(item)" :key="index">{{item.name}}</el-tag>
                  </template>
                </div>
                <el-input v-else v-model="dataForm.testObject" placeholder="请选择参测对象"></el-input>
                <div class="el-input-group__append">
                  <el-button icon="el-icon-search" @click="doAddChildProjectTestObject" :disabled="getValidProjectStatus(1)"></el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="planStartTime" label="开始日期：">
              <el-date-picker v-model="dataForm.planStartTime" value-format="yyyy-MM-dd" type="date" :picker-options="pickerOptionsStart" placeholder="请选择计划开始日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="planEndTime" label="结束日期：">
              <el-date-picker v-model="dataForm.planEndTime" value-format="yyyy-MM-dd" type="date" :picker-options="pickerOptionsEnd" placeholder="请选择计划结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="testPhoneCode" label="测试号码：">
              <el-button size="small" @click="doImportTestPhone()">{{dataForm.testPhoneCode?"修改号码":"导入号码"}}<i class="el-icon-mobile-phone el-icon--right"></i></el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="orderCode" label="配置工单：">
              <el-button size="small" @click="doOrderCodeConfig()">{{dataForm.orderCode?"修改工单":"配置工单"}}<i class="el-icon-tickets el-icon--right"></i></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="relaPlatformData.length>0">
          <el-col :span="24">
            <el-form-item prop="relaPlatformIds" label="关联平台：">
              <el-select v-model="dataForm.relaPlatformIds" multiple filterable placeholder="请选择关联平台" @remove-tag="removeRelaPlatformData">
                <el-option v-for="item in relaPlatformData" :key="item.applicationId" :label="item.name" :value="item.applicationId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="description" label="子项目描述：">
              <el-input v-model="dataForm.description" placeholder="请输入子项目描述" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
    <add-child-project-member :visible.sync="addChildProjectMember" ref="addChildProjectMember" @watchChildMethod="triggerParentPage"></add-child-project-member>
    <add-child-project-organize :visible.sync="addChildProjectOrganize" ref="addChildProjectOrganize" @watchChildMethod="triggerParentPage"></add-child-project-organize>
    <import-test-phone :visible.sync="importTestPhone" ref="importTestPhone" @watchChildMethod="triggerParentPage"></import-test-phone>
    <order-code-config :visible.sync="orderCodeConfig" ref="orderCodeConfig" @watchChildMethod="triggerParentPage"></order-code-config>
    <project-data-sync :visible.sync="projectDataSync" ref="projectDataSync" @watchChildMethod="triggerParentPage"></project-data-sync>
  </el-row>
</template>
<script>
import AddChildProjectMember from './choose-dialog/add-child-project-member'
import AddChildProjectOrganize from './choose-dialog/add-child-project-organize'
import ImportTestPhone from '../import-test-phone'
import OrderCodeConfig from '../order-code-config'
import ProjectDataSync from '../create-project-step/project-data-sync'
export default {
  name: 'BaseinfoStepPage',
  components: {
    AddChildProjectMember, AddChildProjectOrganize, ImportTestPhone, OrderCodeConfig, ProjectDataSync
  },
  props: {
    projectData: Object
  },
  data () {
    return {
      dataForm: {
        name: '',
        managerId: '',
        organizeId: '',
        organizeType: '',
        deptId: '',
        level: '',
        scope: '',
        category: '',
        requireSource: '',
        requireContacts: '',
        planStartTime: '',
        planEndTime: '',
        maxPlanEndTime: '',
        relaPlatformIds: [],
        relaSystem: {},
        moduleLevel: 5,
        caseProperty: [],
        description: '',
        testPhoneCode: '',
        parentTestPhoneCode: '',
        orderCode: '',
        childProjectMember: '',
        subProjectType: ['0']
      },
      addChildProjectMember: false,
      addChildProjectOrganize: false,
      importTestPhone: false,
      orderCodeConfig: false,
      projectDataSync: false,
      projectMemberDataSyncConfig: { 'subProjectIds': [], 'fullSync': false }, // 项目成员同步策略参数
      projectParticipantDataSyncConfig: { 'subProjectIds': [], 'fullSync': false }, // 项目参测同步策略参数
      // 子项目成员
      childProjectMemberList: [],
      // 关联平台
      relaPlatformData: [],
      testObjectData: [], // 参数对象
      managerData: [], // 子项目经理
      matchCacheData: {
        memeberDataMap: {},
        testObjectDataMap: {}
      },
      // 回显表单数据
      echoDataForm: {
        managerId: '',
        requireContacts: ''
      },
      pickerOptionsStart: {
        disabledDate: time => {
          const dateVal = new Date().getTime()
          if (dateVal) {
            const endDateVal = new Date(this.dataForm.planEndTime).getTime()
            if (endDateVal) {
              const maxEndDateVal = new Date(this.dataForm.maxPlanEndTime).getTime()
              if (maxEndDateVal) {
                return time.getTime() < dateVal - 86400000 || time.getTime() > endDateVal - 0 || time.getTime() > maxEndDateVal
              } else {
                return time.getTime() < dateVal - 86400000 || time.getTime() > endDateVal - 0
              }
            } else {
              return time.getTime() < dateVal - 86400000
            }
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          const dateVal = new Date().getTime()
          if (dateVal) {
            const beginDateVal = new Date(this.dataForm.planStartTime).getTime()
            if (beginDateVal) {
              const maxEndDateVal = new Date(this.dataForm.maxPlanEndTime).getTime()
              if (maxEndDateVal) {
                return time.getTime() < dateVal - 86400000 || time.getTime() < beginDateVal - 86400000 || time.getTime() > maxEndDateVal
              } else {
                return time.getTime() < dateVal - 86400000 || time.getTime() < beginDateVal - 86400000
              }
            } else {
              return time.getTime() < dateVal - 86400000
            }
          }
        }
      }
    }
  },
  watch: {
    'projectData': {
      deep: true,
      handler: function (newVal, oldVal) {
        let type = newVal.triggerObject.type
        if (type === 1) {
          // 手动触发保存
          this.doSubmit(type)
        } else if (type === 2) {
          // 自动触发保存
          this.doSubmit(type)
        }
      }
    }
  },
  computed: {
    dataRule () {
      return {
        name: [
          { required: true, message: '子项目名称不允许为空', trigger: 'blur' },
          { required: true, message: '子项目名称不允许为空', trigger: 'change' }
        ],
        managerId: [
          { required: true, message: '子项目经理不允许为空', trigger: 'blur' },
          { required: true, message: '子项目经理不允许为空', trigger: 'change' }
        ],
        childProjectMember: [
          { required: true, message: '子项目成员不允许为空', trigger: 'blur' },
          { required: true, message: '子项目成员不允许为空', trigger: 'change' }
        ],
        planStartTime: [
          { required: true, message: '计划开始时间不允许为空', trigger: 'blur' },
          { required: true, message: '计划开始时间不允许为空', trigger: 'change' }
        ],
        planEndTime: [
          { required: true, message: '计划结束时间不允许为空', trigger: 'blur' },
          { required: true, message: '计划结束时间不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.$refs.dataForm.resetFields()
    // 自动映射基本信息
    this.dataForm = { ...this.dataForm, ...this.projectData.baseInfo }
    this.dataForm.scope = this.dataForm.scope + ''
    this.dataForm.managerId = (this.dataForm.managerId === '-1') ? '' : this.dataForm.managerId
    // 特殊处理子项目类型
    if (this.dataForm.subProjectType) {
      this.dataForm.subProjectType = this.dataForm.subProjectType.split(',')
    } else {
      this.dataForm.subProjectType = []
    }
    this.echoDataForm = { ...this.dataForm }
    this.getParentProject()
    this.getRelevanceData()
    this.getProjectMemberById()
    this.getProjectTestObjectById()
    this.getProjectTestPhoneById()
  },
  methods: {
    triggerParentPage (message) {
      if (message.type === 'executeSaveMember') {
        this.childProjectMemberList = message.data
        // 自动追加项目经理
        let bool = true
        let data = this.dataForm.managerId
        this.childProjectMemberList.forEach((item, index) => {
          if (item.userId === data.userId) {
            item.manager = 1
            bool = false
          } else {
            item.manager = 0
          }
        })
        if (bool) {
          data.memberId = ''
          data.manager = 1
          data.projectId = this.projectData.projectId
          data.realName = data.realName || data.userName
          this.childProjectMemberList.push(data)
        }
        this.dataForm.childProjectMember = this.childProjectMemberList.length > 0 ? this.childProjectMemberList.length : ''
        // 触发项目同步
        this.openProjectDataSync('projectMember')
      } else if (message.type === 'executeSaveTestObject') {
        this.testObjectData = message.data
        this.dataForm.testObject = this.testObjectData.length > 0 ? this.testObjectData.length : ''
        // 触发项目同步
        this.openProjectDataSync('projectParticipant')
      } else if (message.type === 'executeProjectSyncData') {
        // syncType同步类型(projectParticipant:参测对象;projectMember:项目成员)
        if (message.syncType === 'projectMember') {
          this.projectMemberDataSyncConfig = { ...this.projectMemberDataSyncConfig, ...message.data }
        } else {
          this.projectParticipantDataSyncConfig = { ...this.projectParticipantDataSyncConfig, ...message.data }
        }
      } else if (message.type === 'importTestPhone') {
        this.dataForm.testPhoneCode = message.data
      } else if (message.type === 'orderCodeConfig') {
        this.dataForm.orderCode = message.data
      }
    },
    getParentProject () {
      let projectId = this.dataForm.parentId
      if (projectId) {
        this.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('获取项目基本信息失败')
          } else {
            this.dataForm.maxPlanEndTime = res.data.planEndTime
          }
        }).catch(() => { })
      }
    },
    openProjectDataSync (syncType) {
      let projectStatus = Number(this.projectData.baseInfo.projectStatus)
      // '0': '未开始', '1': '正常在测',  '3': '延期在测'
      if ([0, 1, 3].includes(projectStatus)) {
        // syncType同步类型(projectParticipant:参测对象;projectMember:项目成员)
        if (syncType === 'projectMember') {
          this.$refs.projectDataSync.projectDataSyncConfig = this.projectMemberDataSyncConfig
        } else {
          this.$refs.projectDataSync.projectDataSyncConfig = this.projectParticipantDataSyncConfig
        }
        this.$refs.projectDataSync.syncType = syncType
        this.$refs.projectDataSync.projectId = this.projectData.projectId
        this.$refs.projectDataSync.type = this.projectData.type
        this.$refs.projectDataSync.init()
      }
    },
    managerChange (data) {
      // 自动去除之前追加项目经理
      let childProjectMemberList = []
      this.childProjectMemberList.forEach((item, index) => {
        if (item.userId !== data.userId) {
          item.manager = 0
          childProjectMemberList.push(item)
        }
      })
      data.memberId = ''
      data.manager = 1
      data.projectId = this.projectData.projectId
      data.realName = data.realName || data.userName
      childProjectMemberList.push(data)
      this.childProjectMemberList = childProjectMemberList
      this.dataForm.childProjectMember = this.childProjectMemberList.length > 0 ? this.childProjectMemberList.length : ''
    },
    getManagerData () {
      let projectId = this.projectData.parentId || this.projectData.projectId
      this.$http.get('/ctc/project/projectMember/listSubProjectSelectableManagers', {
        params: { 'parentId': projectId }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.managerData = res.data
          // 设置默认选中
          res.data.forEach((item, index) => {
            if (item.userId === this.dataForm.managerId) {
              this.dataForm.managerId = item
              this.managerChange(item)
            }
          })
        }
      }).catch(() => { })
    },
    getRelevanceData () {
      let projectId = this.projectData.parentId || this.projectData.projectId
      this.$http.get('ctc/project/relaPlatform/getByPjectId', {
        params: { 'projectId': projectId }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.relaPlatformData = res.data
        }
      }).catch(() => { })
    },
    getProjectMemberById () {
      let params = { 'projectId': this.projectData.projectId }
      if (params.projectId !== '') {
        this.$http.get('/ctc/project/projectMember/list', { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('查询项目成员数据失败')
          } else {
            let memeberDataMap = {}
            let data = res.data
            data.map((item, index) => {
              memeberDataMap[item.userId] = item
            })
            this.matchCacheData.memeberDataMap = memeberDataMap
            this.childProjectMemberList = data
            this.dataForm.childProjectMember = this.childProjectMemberList.length > 0 ? this.childProjectMemberList.length : ''
            // 自动关联映射项目经理
            this.getManagerData()
          }
        }).catch(() => { })
      } else {
        let params = { 'projectId': this.projectData.parentId, 'page': 1, 'limit': 999999 }
        // 缺省自动填充项目成员
        this.$http.get('/ctc/project/projectMember/listSubProjectSelectableMembers', { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('自动填充父项目成员数据失败')
          } else {
            let newData = []
            res.data.forEach((item, index) => {
              item.memberId = ''
              item.projectId = this.projectData.projectId
              newData.push(item)
            })
            this.childProjectMemberList = newData
            this.dataForm.childProjectMember = this.childProjectMemberList.length > 0 ? this.childProjectMemberList.length : ''
            // 自动关联映射项目经理
            this.getManagerData()
          }
        }).catch(() => { })
      }
    },
    getProjectTestObjectById () {
      let params = { 'projectId': this.projectData.projectId }
      if (params.projectId !== '') {
        this.$http.get('/ctc/project/projectParticipant/list', { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('查询项目参测对象数据失败')
          } else {
            let testObjectDataMap = {}
            let data = res.data
            data.map((item, index) => {
              item.name = item.organizeName
              testObjectDataMap[item.organizeId] = item
            })
            this.matchCacheData.testObjectDataMap = testObjectDataMap
            this.testObjectData = data
            this.dataForm.testObject = this.testObjectData.length > 0 ? this.testObjectData.length : ''
          }
        }).catch(() => { })
      } else {
        // 缺省，自动填充参测对象
        let params = { 'parentId': this.projectData.parentId }
        this.$http.get('/ctc/project/projectParticipant/subProjectSelectableParticipant', { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('自动填充父项目 参测对象数据失败')
          } else {
            let newData = []
            res.data.forEach((item, index) => {
              item.list.forEach((titem, tindex) => {
                newData.push({ 'projectId': this.projectData.projectId, 'organizeId': titem.id, 'organizeType': titem.type, 'organizeName': titem.name, 'name': titem.name })
              })
            })
            this.testObjectData = newData
            this.dataForm.testObject = this.testObjectData.length > 0 ? this.testObjectData.length : ''
          }
        }).catch(() => { })
      }
    },
    getProjectTestPhoneById () {
      // 继承同步父项目号码
      let operationType = this.projectData.operationType
      let testPhoneCode = this.projectData.baseInfo.testPhoneCode || ''
      if (operationType === 'add' && testPhoneCode) {
        this.dataForm.testPhoneCode = '-1'
        this.dataForm.parentTestPhoneCode = testPhoneCode
      }
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
      // 判断是否是只读模式
      if (this.projectData.readOnly === 1) {
        disabled = true
      }
      return disabled
    },
    // 监听删除关联平台，判断是否可以删除
    removeRelaPlatformData (applicationId) {
      if (this.projectData.projectId) {
        let params = { 'projectId': this.projectData.projectId, 'applicationId': applicationId }
        this.$http.get('/ctc/task/task/platform/projectAutoPlatformDeleteCheck', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('关联平台删除校验：' + res.msg)
            this.dataForm.relaPlatformIds.push(applicationId)
          }
        }).catch(() => { })
      }
    },
    doImportTestPhone () {
      let testPhoneCode = this.dataForm.testPhoneCode || ''
      if (testPhoneCode === '-1') {
        testPhoneCode = this.projectData.baseInfo.testPhoneCode || ''
      }
      this.$refs.importTestPhone.dataForm.testPhoneCode = testPhoneCode
      this.$refs.importTestPhone.init()
    },
    doOrderCodeConfig () {
      this.$refs.orderCodeConfig.dataForm.orderCode = this.dataForm.orderCode
      this.$refs.orderCodeConfig.init()
    },
    // 添加子项目成员
    doAddChildProjectMember () {
      this.$refs.addChildProjectMember.parentId = this.projectData.parentId
      this.$refs.addChildProjectMember.projectId = this.projectData.projectId
      this.$refs.addChildProjectMember.childProjectMemberList = this.childProjectMemberList
      this.$refs.addChildProjectMember.init()
    },
    // 删除子项目成员
    doCloseChildProjectMember (tag) {
      this.childProjectMemberList.splice(this.childProjectMemberList.indexOf(tag), 1)
      this.dataForm.childProjectMember = this.childProjectMemberList.length > 0 ? this.childProjectMemberList.length : []
    },
    // 添加子项目参数对象
    doAddChildProjectTestObject () {
      this.$refs.addChildProjectOrganize.parentId = this.projectData.parentId
      this.$refs.addChildProjectOrganize.projectId = this.projectData.projectId
      this.$refs.addChildProjectOrganize.testObjectTableData = this.testObjectData
      this.$refs.addChildProjectOrganize.testObjectDataMap = this.matchCacheData.testObjectDataMap
      this.$refs.addChildProjectOrganize.matchValue = this.getValidProjectStatus(0)
      this.$refs.addChildProjectOrganize.init()
    },
    // 删除子项目参数对象
    doCloseChildProjectTestObject (tag) {
      this.testObjectData.splice(this.testObjectData.indexOf(tag), 1)
      this.dataForm.testObject = this.testObjectData.length > 0 ? this.testObjectData.length : ''
    },
    saveChildProjectMember () {
      this.childProjectMemberList.map((item, index) => {
        item.projectId = this.dataForm.projectId
      })
      if (this.childProjectMemberList.length > 0) {
        let projectMemberSaveData = { ...this.projectMemberDataSyncConfig }
        projectMemberSaveData.projectMembers = this.childProjectMemberList
        this.$http.post('/ctc/project/projectMember/saveSubProject', projectMemberSaveData).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('保存子项目成员失败：' + res.msg)
          }
          this.initStateMember()
        }).catch(() => { })
      }
    },
    initStateMember () {
      let params = { 'projectId': this.dataForm.projectId }
      this.$http.post('/ctc/project/projectStage/initDefaultStage', params).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('初始化项目阶段成员出错：', res.msg)
        }
      }).catch(() => { })
    },
    // 手动保存参数对象
    saveTestObject (operateFlag, type) {
      this.testObjectData.map((item, index) => {
        item.projectId = this.dataForm.projectId
      })
      if (this.testObjectData.length > 0) {
        let participantData = { ...this.projectParticipantDataSyncConfig }
        participantData.projectParticipants = this.testObjectData
        this.$http.post('/ctc/project/projectParticipant', participantData).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('保存参数对象失败：' + res.msg)
          } else {
            if (operateFlag === 'update') {
              this.saveProjectBaseInfo(operateFlag, type)
            }
          }
        }).catch(() => { })
      } else {
        this.$http.post('/ctc/project/projectParticipant/deleteSubProjectParticipantByProjectId',
          { 'projectId': this.dataForm.projectId }, { headers: { 'content-type': 'application/x-www-form-urlencoded' } }
        ).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error('清空参数对象失败：' + res.msg)
          } else {
            if (operateFlag === 'update') {
              this.saveProjectBaseInfo(operateFlag, type)
            }
          }
        }).catch(() => { })
      }
    },
    // 手动保存项目基本信息
    saveProjectBaseInfo (operateFlag, type) {
      let thisvm = this
      // 设置项目架构
      thisvm.dataForm.type = thisvm.projectData.type
      let params = Object.assign({}, thisvm.dataForm)
      // 设置项目用例属性
      params.caseProperty = (params.caseProperty || []).join(',')
      // 特殊处理子项目经理
      params.managerId = params.managerId.userId
      // 设置子项目类型
      params.subProjectType = (params.subProjectType || []).join(',')
      // 特殊处理用例保存，手动去除[创建人、创建日期、项目状态]
      delete params['creator']
      delete params['createDate']
      delete params['projectStatus']
      thisvm.$http.post('/ctc/project/projectBase', params).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error('保存失败：' + res.msg)
        } else {
          thisvm.$message.success('保存成功')
          // 设置项目ID
          thisvm.dataForm.projectId = res.data
          thisvm.projectData.projectId = thisvm.dataForm.projectId
          thisvm.projectData.baseInfo = thisvm.dataForm
          thisvm.projectData.baseInfo.projectStatus = (thisvm.projectData.baseInfo.projectStatus || '') + '' || '-1'
          if (operateFlag === 'add') {
            // 手动触发保存参测对象
            thisvm.saveTestObject(operateFlag, type)
          }
          // 手动触发保存子项目成员
          thisvm.saveChildProjectMember()
          // 自动触发保存，保存成功调用父类进入下一步
          if (type === 2) {
            thisvm.projectData.resultObject.type = 1
            thisvm.projectData.resultObject.random = Math.random()
          }
          thisvm.$handTriggerReLoadEvent('projectReload')
        }
      }).catch(() => { })
    },
    doSubmit (type) {
      let thisvm = this
      // 重置触发类型,防止重复保存
      thisvm.projectData.triggerObject.type = -1
      thisvm.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 先判断新增、修改
          let operateFlag = thisvm.dataForm.projectId ? 'update' : 'add'
          if (operateFlag === 'add') {
            thisvm.saveProjectBaseInfo(operateFlag, type)
          } else {
            thisvm.saveTestObject(operateFlag, type)
          }
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss" scoped>
.baseinfo-step-page {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
</style>
