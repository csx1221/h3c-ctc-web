<template>
  <el-row class="task-base-info">
    <el-col :span="24">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px" :disabled="taskData.readOnly==1">
        <el-row>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item prop="projectStageItemId" label="任务类型：">
              <el-select v-model="dataForm.projectStageItemId" value-key="projectStageId" placeholder="选择任务类型" @change="projectStageChange">
                <el-option v-for="data in projectStageData" :key="data.projectStageId" :label="data.name" :value="data"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item prop="taskName" label="任务名称：">
              <el-input v-model="dataForm.taskName" placeholder="请输入任务名称" maxlength="30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item prop="planStartTime" label="计划开始：">
              <el-date-picker v-model="dataForm.planStartTime" value-format="yyyy-MM-dd" type="date" :picker-options="pickerOptionsStart" placeholder="请选择计划开始日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="12" :xl="12">
            <el-form-item prop="planEndTime" label="计划结束：">
              <el-date-picker v-model="dataForm.planEndTime" value-format="yyyy-MM-dd" type="date" :picker-options="pickerOptionsEnd" placeholder="请选择计划结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24" :xl="24" v-if="showMemberType==1">
            <el-form-item prop="memberList" label="任务成员：">
              <el-checkbox-group style="display:none;" v-model="dataForm.memberList"></el-checkbox-group>
              <ctc-project-number-table v-model="dataForm.memberList" :task-id.sync="dataForm.taskId" :taskType="dataForm.taskType" :taskData="taskData" :numberData="numberData" placeholder="任务成员"></ctc-project-number-table>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24" :xl="24" v-if="showMemberType==2">
            <el-form-item prop="memberList" label="评审人员：">
              <ctc-tree-review-table v-model="dataForm.memberList" type="checkbox" title="评审人员" :id.sync="dataForm.taskId" :defaultDataFormProps="{name:'name'}" :baseOption="{getProjectUrl: '/ctc/task/member/member?taskType='+dataForm.taskType+'&projectStageId='+taskData.projectStageId+'&projectId='+taskData.projectId,
                      getOtherUrl: '/ctc/task/member/member?taskType='+dataForm.taskType+'&projectStageId='+taskData.projectStageId,
                      echoUrl: '/ctc/task/member/list?taskId='}" placeholder="评审人员" :taskData="taskData"></ctc-tree-review-table>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24" :xl="24" v-if="dataForm.taskType==7 &&  projectScope!=1">
            <el-form-item prop="participantList" label="参测对象：">
              <ctc-tree-object-table v-model="dataForm.participantList" :handleData.sync="participantList" type="checkbox" title="参测对象" :id.sync="dataForm.taskId" :defaultDataFormProps="{name:'name'}" :baseOption="{initUrl:'ctc/project/projectParticipant/servicebus/getParticipants?projectId='+taskData.projectId,getUrl: '/ctc/project/projectParticipant/tree?projectId='+taskData.projectId,echoUrl: '/ctc/task/participant/list?taskId='}" placeholder="请选择参测对象" sign="testObject" :taskData="taskData"></ctc-tree-object-table>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24" :xl="24" v-if="dataForm.taskType!=1">
            <el-form-item prop="taskId" label="关联任务：">
              <ctc-tree-task-table v-model="dataForm.taskId" type="checkbox" title="关联任务" :id.sync="dataForm.taskId" :pid.sync="taskData.projectId" :taskType="dataForm.taskType" :task-ids.sync="dataForm.taskRelevanceInfo.taskIds" :case-ids.sync="dataForm.taskRelevanceInfo.caseIds" :defaultDataFormProps="{name:'name',pid:'projectId'}" :baseOption="{getUrl: '/ctc/task/base/proTask?taskType='+dataForm.taskType,echoUrl: '/ctc/task/relation/show?taskId='}" placeholder="请选择关联任务" :taskData="taskData"></ctc-tree-task-table>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24" :xl="24">
            <el-form-item prop="associatedRequirements" label="关联需求：">
              <ctc-associated-requirements-table v-model="dataForm.taskRelevanceInfo.demandIds" :task-id.sync="dataForm.taskId" placeholder="关联需求" :taskData="taskData"></ctc-associated-requirements-table>
            </el-form-item>
          </el-col>
          <el-col :md="24" :lg="24" :xl="24" v-if="dataForm.taskType==5">
            <el-form-item prop="relaPlatformList" label="关联平台：">
              <el-select v-model="dataForm.relaPlatformList" value-key="applicationId" filterable clearable placeholder="请选择关联平台" :disabled="[1,2].includes(taskData.baseInfo.taskStatus)">
                <el-option v-for="item in relaPlatformData" :key="item.applicationId" :label="item.name" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="taskContent" label="任务内容：">
              <el-input v-model="dataForm.taskContent" placeholder="请输入项目内容" :rows="5" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
    <!--引入是否省份自测-->
    <province-test ref="provinceTest" :visible.sync="provinceTest" @watchChildPage="triggerParentMethod"></province-test>
  </el-row>
</template>
<script>
import CtcAssociatedRequirementsTable from '@/components/project/ctc-associated-requirements-table'
import CtcAssociatedTaskTable from '@/components/project/ctc-associated-task-table'
import CtcProjectNumberTable from '@/components/project/ctc-project-number-table'
import CtcProjectAssessorTable from '@/components/project/ctc-project-assessor-table'
import ProvinceTest from '../taskConfigure/province-test'
import { removeCurrentTabsHandle } from '@/router'
export default {
  name: 'TaskBaseInfoPage',
  components: {
    CtcAssociatedRequirementsTable, CtcAssociatedTaskTable, CtcProjectNumberTable, CtcProjectAssessorTable, ProvinceTest
  },
  props: {
    taskData: Object
  },
  data () {
    return {
      // 回显表单数据
      dataForm: {
        projectStageItemId: '',
        taskTypeName: '',
        taskName: '',
        memberList: [], // 任务成员与评审人员
        participantList: [], // 参测对象
        planStartTime: '',
        planEndTime: '',
        taskRelevanceInfo: { // 关联任务与关联需求
          caseIds: [], // 用例
          taskIds: [], // 任务
          demandIds: []// 需求
        },
        relaPlatformList: null,
        taskContent: '',
        projectStageId: '',
        taskType: 1
      },
      // 项目范围
      projectScope: -1,
      relaPlatformData: {}, // 关联平台
      participantData: [], // 参测对象
      projectStageData: [], // 项目阶段
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
      },
      isStartUp: false,
      participantList: [],
      numberData: [], // 任务成员返回数据--单独保存
      showMemberType: 1, // 1:任务成员;2评审成员
      provinceTest: false,
      dataRule: {
        projectStageItemId: [
          { required: true, message: '任务类型不允许为空', trigger: 'blur' },
          { required: true, message: '任务类型不允许为空', trigger: 'change' }
        ],
        taskName: [
          { required: true, message: '任务名称不允许为空', trigger: 'blur' },
          { required: true, message: '任务名称不允许为空', trigger: 'change' }
        ],
        planStartTime: [
          { required: true, message: '计划开始时间不允许为空', trigger: 'blur' },
          { required: true, message: '计划开始时间不允许为空', trigger: 'change' }
        ],
        planEndTime: [
          { required: true, message: '计划结束时间不允许为空', trigger: 'blur' },
          { required: true, message: '计划结束时间不允许为空', trigger: 'change' }
        ],
        memberList: [
          { required: true }
        ],
        taskId: [
          { validator: this.validatorTaskId, trigger: 'blur' },
          { validator: this.validatorTaskId, trigger: 'change' }
        ],
        caseType: [
          { required: true, message: '用例类型不允许为空', trigger: 'blur' },
          { required: true, message: '用例类型不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'dataForm.taskType' (newVal, oldVal) {
      this.validShowMember()
      this.$nextTick(() => {
        // 特殊判断处理，只有一个关联平台默认填充
        if (this.dataForm.taskType === 5 && this.relaPlatformData.length === 1 && this.dataForm.taskId === undefined) {
          this.dataForm.relaPlatformList = this.relaPlatformData[0]
        }
      })
    },
    'dataForm.projectStageItemId' (newVal, oldVal) {
      if (oldVal) {
        this.dataForm.taskName = ''
      }
    },
    'taskData': {
      deep: true,
      handler: function (newVal, oldVal) {
        let type = newVal.triggerObject.type
        if (type === 4) {
          // 完成
          this.isStartUp = false
          this.doSubmit(type)
        } else if (type === 5) {
          // 立即启动
          this.startUp(type)
        } else if (type === 6) {
          this.closePage() // 关闭取消
        }
      }
    }
  },
  computed: {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.relevanceData = []
        this.participantData = []
        this.dataForm = { ...this.dataForm, ...this.taskData.baseInfo }
        this.dataForm.taskTypeName = this.$getDictLabel('stageType', this.dataForm.taskType)
        // 获取项目关联平台
        this.getRelevanceData()
        // 获取项目阶段
        this.getProjectStageData()
        // 获取项目基本信息
        this.getProjectInfoByeId()
        this.validShowMember()
        if (this.taskData.operationType === 'add') {
          // 获取项目基本信息
          this.getTimeByeId()
        }
      })
    },
    validatorTaskId (rule, value, callback) {
      if (this.dataForm.taskType === 7 && (this.dataForm.taskRelevanceInfo.taskIds.length === 0)) {
        return callback(new Error('关联任务不允许为空，点击【完成、立即启动】按钮，才会继续触发校验'))
      } else {
        callback()
      }
    },
    validShowMember () {
      let taskType = this.dataForm.taskType
      // 1:任务成员;2评审成员
      if ([2, 4, 6].includes(taskType)) {
        this.showMemberType = 2
        this.dataRule.memberList = [
          { type: 'array', required: true, message: '请至少选择一个评审成员', trigger: 'blur' },
          { type: 'array', required: true, message: '请至少选择一个评审成员', trigger: 'change' }
        ]
      } else {
        this.showMemberType = 1
        this.dataRule.memberList = [
          { type: 'array', required: true, message: '请至少选择一个任务成员', trigger: 'blur' },
          { type: 'array', required: true, message: '请至少选择一个任务成员', trigger: 'change' }
        ]
      }
    },
    getTimeByeId () {
      let projectStageId = this.taskData.projectStageId
      if (projectStageId !== '') {
        this.$http.get('ctc/project/projectStage/' + projectStageId, {}).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.dataForm.planStartTime = res.data.planStartTime
            this.dataForm.planEndTime = res.data.planEndTime

            this.$emit('watchChildMethod', res)
          }
        }).catch(() => { })
      }
    },
    projectStageChange (item) {
      this.dataForm.taskType = parseInt(item.stageId)
      this.dataForm.taskTypeName = this.$getDictLabel('stageType', this.dataForm.taskType)
      this.taskData.projectStageId = item.projectStageId
      if (this.taskData.operationType === 'add') {
        // 获取项目基本信息
        this.getTimeByeId()
      }
    },
    getRelevanceData () {
      let parentProjectId = this.taskData.projectId || this.taskData.parentProjectId
      this.$http.get('ctc/project/relaPlatform/getByPjectId', { params: { 'projectId': parentProjectId } }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.relaPlatformData = res.data
        }
      }).catch(() => { })
    },
    // 获取项目基本系
    getProjectInfoByeId () {
      if (this.projectScope === -1) {
        let projectId = this.taskData.projectId
        this.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            let data = res.data
            this.projectScope = data.scope
          }
        }).catch(() => { })
      }
    },
    getParticipantData () {
      this.$http.get(`/ctc/project/projectParticipant/list`, {
        params: {
          projectId: this.taskData.projectId,
          page: 1,
          limit: 1000000
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.participantData = res.data
        }
      }).catch(() => { })
    },
    getProjectStageData () {
      let thisvm = this
      let projectStageId = this.dataForm.projectStageId
      let params = { 'projectId': this.taskData.projectId }
      thisvm.$http.get('/ctc/project/projectStage/list', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          thisvm.projectStageData = res.data
          if (projectStageId !== '') {
            let projectStageData = []
            thisvm.projectStageData.forEach((item, index) => {
              if (item.projectStageId === projectStageId) {
                projectStageData.push(item)
              }
            })
            thisvm.dataForm.projectStageItemId = projectStageData[0]
            thisvm.projectStageChange(projectStageData[0])
            thisvm.projectStageData = projectStageData
          }
        }
      }).catch(() => { })
    },
    backParams (type, taskType) {
      let node = {}
      let data = this.dataForm
      if (type === 'create') {
        return data
      } else {
        // if (taskType === 1) {
        node.projectStageItemId = data.projectStageItemId
        node.taskTypeName = data.taskTypeName
        node.taskName = data.taskName
        // node.memberList = data.memberList
        node.participantList = data.participantList
        node.planStartTime = data.planStartTime
        node.planEndTime = data.planEndTime
        // node.taskRelevanceInfo = data.taskRelevanceInfo
        node.relaPlatformList = data.relaPlatformList
        node.taskContent = data.taskContent
        node.projectStageId = data.projectStageId
        node.taskType = data.taskType
        node.taskId = data.taskId
        return node
        // }
      }
    },
    modifyMember (resolve, reject) {
      // 重新赋值任务ID
      let data = this.dataForm.memberList
      data.map((item, index) => {
        item.taskId = this.taskData.taskId
      })
      this.$http.post('/ctc/task/member', data).then(({ data: res }) => {
        if (res.code !== 0) {
          // this.$message.error('保存失败：' + res.msg)
          resolve(false)
        } else {
          resolve(true)
        }
      }).catch(() => { resolve(false) })
    },
    modifyCase (resolve, reject, relationObjType) {
      let selectionData = []
      if (relationObjType === 1) {
        selectionData = this.dataForm.taskRelevanceInfo.taskIds
      } else if (relationObjType === 2) {
        selectionData = this.dataForm.taskRelevanceInfo.demandIds
      } else if (relationObjType === 3) {
        selectionData = this.dataForm.taskRelevanceInfo.caseIds
      }
      let taskConfigData = []
      selectionData.forEach((item, index) => {
        if (item) {
          taskConfigData.push({ 'taskId': this.taskData.taskId, 'relationObjId': item, 'relationObjType': relationObjType })
        }
      })
      if (taskConfigData.length > 0) {
        this.$http.post('/ctc/task/relation', taskConfigData).then(({ data: res }) => {
          if (res.code !== 0) {
            resolve(false)
          } else {
            resolve(true)
          }
        }).catch(() => { resolve(false) })
      }
    },
    delectTask (resolve, reject, relationObjType) {
      let parmas = { taskId: this.dataForm.taskId, relationObjType: relationObjType }
      this.$http.delete('/ctc/task/relation', { data: parmas }).then(({ data: res }) => {
        if (res.code !== 0) {
          resolve(false)
        } else {
          resolve(true)
        }
      }).catch(() => { resolve(false) })
    },
    startUp (triggerType) {
      // 默认执行提交方法
      this.isStartUp = true
      this.doSubmit(triggerType)
    },
    doSubmit (triggerType) {
      let thisvm = this
      if (thisvm.dataForm.taskId) {
        thisvm.$refs['dataForm'].validate((valid) => {
          if (valid) {
            var p0 = new Promise((resolve, reject) => {
              thisvm.doSubmitModify(resolve, reject) // 修改任务 -- 基础信息
            })

            // 创建promise，在promise中调用axios then里使用resolve回调，catch里使用reject回调
            var p1 = new Promise((resolve, reject) => {
              if (thisvm.dataForm.memberList.length !== 0) {
                thisvm.modifyMember(resolve, reject) // 修改任务成员 与 评审人员
              } else {
                resolve(true)
              }
            })
            var p2 = new Promise((resolve, reject) => {
              if (thisvm.dataForm.taskRelevanceInfo.taskIds.length !== 0) {
                thisvm.modifyCase(resolve, reject, 1) // 关联任务
              } else {
                // resolve(true)
                thisvm.delectTask(resolve, reject, 1)
              }
            })
            var p3 = new Promise((resolve, reject) => {
              if (thisvm.dataForm.taskRelevanceInfo.demandIds.length !== 0) {
                thisvm.modifyCase(resolve, reject, 2) // 关联需求
              } else {
                thisvm.delectTask(resolve, reject, 2)
              }
            })
            var p4 = new Promise((resolve, reject) => {
              if (thisvm.dataForm.taskRelevanceInfo.caseIds.length !== 0) {
                thisvm.modifyCase(resolve, reject, 3) // 关联用例
              } else {
                thisvm.delectTask(resolve, reject, 3)
              }
            })
            thisvm.$ctcLoading.open()
            // 调用Promise.all().then(res=>{})
            Promise.all([p0, p1, p2, p3, p4]).then(res => {
              for (let i = 0; i < res.length; i++) {
                if (!res[i]) {
                  thisvm.$message.error('提交失败')
                  thisvm.$ctcLoading.close()
                  return
                }
              }
              if (thisvm.isStartUp) {
                let params = { 'type': '启动', 'postType': 'post', 'url': '/ctc/task/base/startTask', 'reload': false }
                let saveParams = { ...params, 'row': thisvm.taskData.baseInfo }
                thisvm.executeMethod(saveParams)
              } else {
                thisvm.$ctcLoading.close()
                thisvm.$message.success('提交成功')
                this.$handTriggerReLoadEvent('taskReload')
                removeCurrentTabsHandle(thisvm)
              }
            })
          } else {
          }
        }, 1000, { 'leading': true, 'trailing': false })
      } else {
        thisvm.doSubmitCreate(triggerType) // 创建任务
      }
    },
    doSubmitModify (resolve, reject) {
      // 重置触发类型,防止重复保存
      this.taskData.triggerObject.type = -1
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = this.backParams('modify', this.dataForm.taskType)
          let participantList = []
          this.participantList.forEach((item, index) => {
            participantList.push({ 'taskId': this.taskData.taskId, 'organizeId': item.organizeId, 'organizeName': item.organizeName })
          })
          params.participantList = participantList
          if (params.relaPlatformList !== null && params.relaPlatformList !== '') {
            let relaPlatformList = []
            relaPlatformList.push(params.relaPlatformList)
            params.relaPlatformList = relaPlatformList
          } else {
            delete params['relaPlatformList']
          }
          // 特殊处理项目阶段
          params.projectStageId = params.projectStageItemId.projectStageId
          // 特殊处理2级项目架构
          if (params.parentProjectId === params.projectId) {
            delete params['parentProjectId']
          }
          // 新增：post;修改：put;删除：delete
          this.$http.put('/ctc/task/base', params).then(({ data: res }) => {
            if (res.code !== 0) {
              // this.$message.error(res.msg)
              resolve(false)
            } else {
              // console.log(res)
              // this.$message.success('保存成功')
              resolve(true)
            }
          }).catch(() => { resolve(false) })
        } else {
        }
      }, 1000, { 'leading': true, 'trailing': false })
    },
    doSubmitCreate (triggerType) {
      // 重置触发类型,防止重复保存
      this.taskData.triggerObject.type = -1
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$ctcLoading.open()
          let params = this.backParams('create', this.dataForm.taskType)
          let participantList = []
          this.participantList.forEach((item, index) => {
            participantList.push({ 'taskId': this.taskData.taskId, 'organizeId': item.organizeId, 'organizeName': item.organizeName })
          })
          params.participantList = participantList
          if (params.relaPlatformList !== null && params.relaPlatformList !== '') {
            let relaPlatformList = []
            relaPlatformList.push(params.relaPlatformList)
            params.relaPlatformList = relaPlatformList
          } else {
            delete params['relaPlatformList']
          }
          // 特殊处理项目阶段
          params.projectStageId = params.projectStageItemId.projectStageId
          // 特殊处理2级项目架构
          if (params.parentProjectId === params.projectId) {
            delete params['parentProjectId']
          }
          // 新增：post;修改：put;删除：delete
          let type = this.taskData.taskId !== '' ? 'put' : 'post'
          this.$http[type]('/ctc/task/base/saveTask', params).then(({ data: res }) => {
            this.$ctcLoading.close()
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              // 设置项目ID
              if (type === 'post') {
                this.dataForm.taskId = res.data
                this.taskData.taskId = this.dataForm.taskId
                this.taskData.baseInfo = this.dataForm
                this.taskData.baseInfo.taskStatus = 0
              }
              if (this.isStartUp) {
                let params = { 'type': '启动', 'postType': 'post', 'url': '/ctc/task/base/startTask', 'reload': false }
                let saveParams = { ...params, 'row': this.taskData.baseInfo }
                this.executeMethod(saveParams)
              } else {
                this.$message.success('提交成功')
                removeCurrentTabsHandle(this)
              }
            }
          }).catch(() => { this.$ctcLoading.close() })
        } else {
        }
      }, 1000, { 'leading': true, 'trailing': false })
    },
    // 执行删除、启动服务
    executeMethod (message) {
      let data = {}
      // 判断是否有执行类型任务
      data.hasExecTask = false
      if (typeof message.row !== 'undefined') {
        if (message.type === '启动' && message.row.taskStatus !== 0) {
          return this.$message({
            message: '只有未开始的任务可以' + message.type,
            type: 'warning'
          })
        }
        data.data = [message.row.taskId]
        data.hasExecTask = (message.row.taskType === 7)
        // 项目范围是非集中化
        if (message.type === '启动' && data.hasExecTask && this.projectScope !== 1) {
          // 判断任务是否包含参测对象
          if (this.dataForm.participantList.length > 0) {
            this.executeTaskStart(message, data)
          } else {
            this.executeHttpsService(message, data)
          }
        } else {
          this.executeHttpsService(message, data)
        }
      }
    },
    executeTaskStart (message, data) {
      this.$refs.provinceTest.message = message
      this.$refs.provinceTest.executeParams = data
      this.$refs.provinceTest.init()
    },
    triggerParentMethod (message) {
      let mg = message.message
      let data = message.data
      this.executeHttpsService(mg, data)
    },
    executeHttpsService (message, data) {
      this.$ctcLoading.open()
      // 支持[put,post,delete]
      this.$http[message.postType](message.url, data).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message.success('启动成功')
          this.$handTriggerReLoadEvent('taskReload')
          removeCurrentTabsHandle(this)
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    closePage () {
      removeCurrentTabsHandle(this)
    }
  }
}
</script>
<style lang="scss" scoped>
.task-base-info {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
</style>
