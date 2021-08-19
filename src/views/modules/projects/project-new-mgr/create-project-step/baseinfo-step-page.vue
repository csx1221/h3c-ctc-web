<template>
  <el-row class="baseinfo-step-page">
    <el-col :span="24">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px" :disabled="projectData.readOnly==1">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="name" label="项目名称：">
              <el-input v-model="dataForm.name" placeholder="请输入项目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="organizeId" label="所属机构：">
              <ctc-tree-select-table-gy v-model="dataForm.organizeId" type="radio" title="所属机构" :id.sync="dataForm.organizeId" :defaultDataFormProps="{name:'name'}" :baseOption="{getUrl: '/sys/project/select/tree/organize',echoUrl: '/sys/project/select/organize?organizeId='}" placeholder="请选择所属机构" sign="organizeId" selectType="chooseOrganize" @afterSelectDo="triggerParentPage"></ctc-tree-select-table-gy>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="deptId" label="所属部门：">
              <ctc-tree-table-gy v-model="dataForm.deptId" default-expand-all type="radio" title="所属部门" :id.sync="echoDataForm.deptId" :pid.sync="dataForm.organizeId" :defaultDataFormProps="{name:'name',pid:'organizeId'}" :baseOption="{getUrl: '/sys/project/select/tree/dept',echoUrl: '/sys/project/select/dept?deptId='}" placeholder="请选择所属部门" sign="deptId"></ctc-tree-table-gy>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="managerId" label="项目经理：">
              <ctc-tree-table-gy v-model="dataForm.managerId" type="radio" title="项目经理" :id.sync="echoDataForm.managerId" :pid.sync="dataForm.organizeId" :defaultDataFormProps="{name:'name',pid:'organizeId'}" :baseOption="{getUrl: '/sys/project/select/tree/manager',echoUrl: '/sys/project/select/manager?userId='}" placeholder="请选择项目经理" sign="managerId"></ctc-tree-table-gy>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="category" label="项目类别：">
              <ctc-select v-model="dataForm.category" dict-type="project.category" placeholder="请选择项目类别"></ctc-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="level" label="项目级别：">
              <ctc-select v-model="dataForm.level" dict-type="project.level" placeholder="请选择项目级别"></ctc-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="requireSource" label="需求来源：">
              <ctc-select v-model="dataForm.requireSource" dict-type="sourceOfDemand" placeholder="请选择需求来源"></ctc-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="requireContacts" label="需求联系人：">
              <ctc-tree-table v-model="dataForm.requireContacts" type="radio" title="需求联系人" :id.sync="echoDataForm.requireContacts" :defaultDataFormProps="{name:'name'}" :baseOption="{getUrl: '/sys/organize/contact',echoUrl: '/sys/user/'}" placeholder="请选择需求联系人"></ctc-tree-table>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="scope" label="项目范围：">
              <el-select v-model="dataForm.scope" placeholder="请选择项目范围">
                <el-option v-for="data in scopeList" :key="data.dictValue" :label="data.dictLabel" :value="data.dictValue">{{data.dictLabel}}</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dataForm.scope!=='1'">
          <el-col :span="24">
            <el-form-item prop="testObject" label="参测对象：">
              <div class="el-input el-input-group el-input-group--append">
                <div class="el-input__inner">
                  <template v-for="(item,index) in testObjectData">
                    <el-tag v-if="getValidProjectStatus(2,item.organizeId)" class="eltag" :key="index" type="info">{{item.name}}</el-tag>
                    <el-tag v-else class="eltag" closable @close="doCloseProjectTestObject(item)" :key="index">{{item.name}}</el-tag>
                  </template>
                </div>
                <el-input v-model="dataForm.testObject" placeholder="请选择参测对象" style="display:none;"></el-input>
                <div class="el-input-group__append">
                  <el-button icon="el-icon-search" @click="doAddProjectTestObject" :disabled="getValidProjectStatus(1)"></el-button>
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
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="relaPlatformIds" label="关联平台：">
              <el-select v-model="dataForm.relaPlatformIds" multiple filterable placeholder="请选择关联平台" @remove-tag="removeRelaPlatformData">
                <el-option v-for="item in relaPlatformData" :key="item.applicationId" :label="item.name" :value="item.applicationId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="false">
            <el-form-item prop="relaSystem" label="关联系统：" v-if="dataForm.relaPlatformIds.length>0">
              <el-select v-model="dataForm.relaSystem" filterable clearable value-key="sysId" placeholder="请选择关联系统">
                <el-option v-for="item in relaSystemData" :key="item.sysId" :label="item.sysName" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="testPhoneCode" label="测试号码：">
              <el-button size="small" @click="doImportTestPhone()">{{dataForm.testPhoneCode?"修改号码":"导入号码"}}<i class="el-icon-mobile-phone el-icon--right"></i></el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="dataForm.type==0">
            <el-form-item prop="orderCode" label="配置工单：">
              <el-button size="small" @click="doOrderCodeConfig()">{{dataForm.orderCode?"修改工单":"配置工单"}}<i class="el-icon-tickets el-icon--right"></i></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="description" label="项目描述：">
              <el-input v-model="dataForm.description" placeholder="请输入项目描述" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
    <add-project-organize :visible.sync="addProjectOrganize" ref="addProjectOrganize" @watchChildMethod="triggerParentPage"></add-project-organize>
    <import-test-phone :visible.sync="importTestPhone" ref="importTestPhone" @watchChildMethod="triggerParentPage"></import-test-phone>
    <order-code-config :visible.sync="orderCodeConfig" ref="orderCodeConfig" @watchChildMethod="triggerParentPage"></order-code-config>
    <project-data-sync :visible.sync="projectDataSync" ref="projectDataSync" @watchChildMethod="triggerParentPage"></project-data-sync>
  </el-row>
</template>
<script>
import AddProjectOrganize from './choose-dialog/add-project-organize'
import ImportTestPhone from '../import-test-phone'
import OrderCodeConfig from '../order-code-config'
import ProjectDataSync from './project-data-sync'
import { getDictDataList } from '@/utils'
export default {
  name: 'BaseinfoStepPage',
  components: {
    AddProjectOrganize, ImportTestPhone, OrderCodeConfig, ProjectDataSync
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
        level: '0',
        scope: '',
        category: '1',
        requireSource: '1',
        requireContacts: '',
        planStartTime: '',
        planEndTime: '',
        relaPlatformIds: [],
        relaSystem: {},
        moduleLevel: 5,
        caseProperty: [],
        description: '',
        testPhoneCode: '',
        orderCode: ''
      },
      addProjectOrganize: false,
      importTestPhone: false,
      orderCodeConfig: false,
      projectDataSync: false,
      // 关联平台
      relaPlatformData: [],
      // 关联系统
      relaSystemData: [],
      // 用例属性数据
      caseAttrData: getDictDataList('caseAttr'),
      projectScopeArr: getDictDataList('project.scope'),
      scopeList: [],
      testObjectData: [], // 参数对象
      projectDataSyncConfig: { 'subProjectIds': [], 'fullSync': false }, // 同步策略参数
      matchCacheData: {
        memeberDataMap: {},
        testObjectDataMap: {}
      },
      // 回显表单数据
      echoDataForm: {
        organizeId: '',
        deptId: '',
        managerId: '',
        requireContacts: ''
      },
      pickerOptionsStart: {
        disabledDate: time => {
          const dateVal = new Date().getTime()
          if (dateVal) {
            const endDateVal = new Date(this.dataForm.planEndTime).getTime()
            if (endDateVal) {
              return time.getTime() < dateVal - 86400000 || time.getTime() > endDateVal - 0
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
              return time.getTime() < dateVal - 86400000 || time.getTime() < beginDateVal - 86400000
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
          { required: true, message: '项目名称不允许为空', trigger: 'blur' },
          { required: true, message: '项目名称不允许为空', trigger: 'change' }
        ],
        managerId: [
          { required: true, message: '项目经理不允许为空', trigger: 'blur' },
          { required: true, message: '项目经理不允许为空', trigger: 'change' }
        ],
        organizeId: [
          { required: true, message: '所属机构不允许为空', trigger: 'blur' },
          { required: true, message: '所属机构不允许为空', trigger: 'change' }
        ],
        scope: [
          { required: true, message: '项目范围不允许为空', trigger: 'blur' },
          { required: true, message: '项目范围不允许为空', trigger: 'change' }
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
    this.dataForm.requireSource = this.dataForm.requireSource || ''
    // 特殊处理项目类别、项目级别、需求来源
    this.dataForm.level = (this.dataForm.level !== null && this.dataForm.level !== -1) ? this.dataForm.level : ''
    this.dataForm.category = (this.dataForm.category !== null && this.dataForm.category !== -1) ? this.dataForm.category : ''
    this.dataForm.requireSource = (this.dataForm.requireSource !== null && this.dataForm.requireSource !== -1) ? this.dataForm.requireSource : ''
    this.echoDataForm = { ...this.dataForm }
    this.getRelevanceData()
    this.getRelaSystemsData()
    this.getProjectTestObjectById()
    this.getScopeList()
  },
  methods: {
    triggerParentPage (message) {
      if (message.type === 'chooseOrganize') {
        this.dataForm.organizeType = message.data.type
        // 重置项目经理、项目范围
        this.dataForm.scope = ''
        this.echoDataForm.managerId = ''
        this.getScopeList()
      } else if (message.type === 'executeSaveTestObject') {
        this.testObjectData = message.data
        this.dataForm.testObject = this.testObjectData.length > 0 ? this.testObjectData.length : ''
        // 触发项目同步
        this.openProjectDataSync('projectParticipant')
      } else if (message.type === 'executeProjectSyncData') {
        this.projectDataSyncConfig = { ...this.projectDataSyncConfig, ...message.data }
      } else if (message.type === 'importTestPhone') {
        this.dataForm.testPhoneCode = message.data
      } else if (message.type === 'orderCodeConfig') {
        this.dataForm.orderCode = message.data
      }
    },
    getRelevanceData () {
      let thisvm = this
      thisvm.$http.get('/ctc/project/relaPlatform/list', {
        params: {}
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          let newData = res.data || []
          if (thisvm.projectData.type === '0') {
            newData = newData.filter(item => {
              return item.code !== 'JKLT'
            })
          }
          thisvm.relaPlatformData = newData
        }
      }).catch(() => { })
    },
    getRelaSystemsData () {
      this.$http.get('/ctc/project/projectBase/listRelaSystems', { params: {} }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.relaSystemData = res.data
        }
      }).catch(() => { })
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
      }
    },
    getScopeList () {
      this.scopeList = this.projectScopeArr
      // 默认选中一个
      this.dataForm.scope = this.dataForm.scope || this.scopeList[0].dictValue
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
    // 删除子项目参数对象f
    doCloseProjectTestObject (tag) {
      this.testObjectData.splice(this.testObjectData.indexOf(tag), 1)
      this.dataForm.testObject = this.testObjectData.length > 0 ? this.testObjectData.length : ''
    },
    // 添加子项目参数对象
    doAddProjectTestObject () {
      this.$refs.addProjectOrganize.parentId = ''
      this.$refs.addProjectOrganize.projectId = this.projectData.projectId
      this.$refs.addProjectOrganize.testObjectTableData = this.testObjectData
      this.$refs.addProjectOrganize.testObjectDataMap = this.matchCacheData.testObjectDataMap
      this.$refs.addProjectOrganize.matchValue = this.getValidProjectStatus(0)
      this.$refs.addProjectOrganize.init()
    },
    doImportTestPhone () {
      this.$refs.importTestPhone.dataForm.testPhoneCode = this.dataForm.testPhoneCode
      this.$refs.importTestPhone.init()
    },
    doOrderCodeConfig () {
      this.$refs.orderCodeConfig.dataForm.orderCode = this.dataForm.orderCode
      this.$refs.orderCodeConfig.init()
    },
    openProjectDataSync (syncType) {
      let projectStatus = Number(this.projectData.baseInfo.projectStatus)
      // '0': '未开始', '1': '正常在测',  '3': '延期在测'
      if ([0, 1, 3].includes(projectStatus)) {
        // syncType同步类型(projectParticipant:参测对象;projectMember:项目成员)
        this.$refs.projectDataSync.syncType = syncType
        this.$refs.projectDataSync.projectId = this.projectData.projectId
        this.$refs.projectDataSync.type = this.projectData.type
        this.$refs.projectDataSync.projectDataSyncConfig = this.projectDataSyncConfig
        this.$refs.projectDataSync.init()
      }
    },
    // 手动保存参数对象
    saveTestObject (operateFlag, type) {
      this.testObjectData.map((item, index) => {
        item.projectId = this.dataForm.projectId
      })
      if (this.testObjectData.length > 0) {
        let participantData = { ...this.projectDataSyncConfig }
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
      // 特殊处理项目类别、项目级别、需求来源
      params.level = params.level ? params.level : -1
      params.category = params.category ? params.category : -1
      params.requireSource = params.requireSource ? params.requireSource : -1
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
      // 特殊处理校验，关联平台选择【联调测试平台】，必须要配置关联系统
      let relaPlatformIds = thisvm.dataForm.relaPlatformIds || []
      if (relaPlatformIds.length > 0 && thisvm.dataForm.scope === '0') {
        let ifJKLTConfig = false
        thisvm.relaPlatformData.forEach((item, index) => {
          // 判断是否是：联调测试平台
          if (item.code === 'JKLT') {
            if (relaPlatformIds.includes(item.applicationId)) {
              ifJKLTConfig = true
            }
          }
        })
        if (ifJKLTConfig) {
          if (thisvm.dataForm.relaSystem && thisvm.dataForm.relaSystem.sysId) {
          } else {
            return thisvm.$message.warning('请选择一个关联系统！')
          }
          if (thisvm.dataForm.testObject) {
          } else {
            return thisvm.$message.warning('参测对象不允许为空！')
          }
        }
      }
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
