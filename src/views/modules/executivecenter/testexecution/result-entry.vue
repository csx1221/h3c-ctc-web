<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body :close-on-click-modal="false" class="resultEntry" custom-class="dialogWith">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="110px">
        <el-row>
          <el-col :span="8" v-if="type===1">
            <el-form-item label="用例ID" prop="caseId">
              <el-input v-model="dataForm.caseId" disabled clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="type===1">
            <el-form-item label="用例名称" prop="caseName">
              <el-input v-model="dataForm.caseName" disabled clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结果判定" prop="resultCode">
              <el-select v-if="resultBack.length>0" v-model="dataForm.resultCode" placeholder="请选择">
                <template v-for="item in resultList">
                  <el-option :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" v-if="resultBack.includes(item.dictValue)"></el-option>
                </template>
              </el-select>
              <ctc-select v-else v-model="dataForm.resultCode" dict-type="resultDetermination" placeholder="请选择"></ctc-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="testPhoneData.length>0">
            <el-form-item prop="testPhone" label="测试号码：">
              <el-select v-model="dataForm.testPhone" placeholder="请选择测试号码" filterable clearable style="width:100%;">
                <el-option v-for="(item,index) in testPhoneData" :key="index" :label="item.testPhone+'('+item.organizeName+')'" :value="item.testPhone">
                  <span style="float: left">{{ item.testPhone }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{item.organizeName}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--通过-->
      <el-form label-position="right" ref="dataForms.dataForm1" v-show="dataForm.resultCode==='1'" :rules="rules1" :model="dataForms.dataForm1" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="operateLog">
              <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForms.dataForm1.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--不通过-->
      <el-form label-position="right" ref="dataForms.dataForm2" :rules="rules2" :model="dataForms.dataForm2" label-width="110px">
        <el-row>
          <el-col :span="24" v-if="!isOpen">
            <el-form-item label="测试截图/附件" prop="testReportId">
              <ctc-file-upload ref="ctcFileUpload3" v-model="dataForms.dataForm2add.testReportId"></ctc-file-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="dataForm.resultCode==='2'">
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :autosize="{ minRows: 2}" placeholder="请输入" v-model="dataForms.dataForm2add.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="text-align: right;margin: 10px 0" v-show="dataForm.resultCode==='2'">
            <el-button type="primary" size="small" @click="enteringDefect()">录入缺陷</el-button>
          </el-col>
          <template v-if="isOpen">
            <el-col :span="8">
              <el-form-item label="缺陷名称：" prop="name">
                <el-input v-model="dataForms.dataForm2.name" placeholder="请输入缺陷名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="questionCauseType" label="原因分类：">
                <ctc-select v-model="dataForms.dataForm2.questionCauseType" dict-type="question.causeType" placeholder="请选择问题原因分类" style="width:100%;"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷级别：" prop="defectLevel">
                <ctc-select v-model="dataForms.dataForm2.defectLevel" dict-type="defectLevel" placeholder="请选择缺陷级别"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="defectSource" label="缺陷来源：">
                <el-select v-model="dataForms.dataForm2.defectSource" placeholder="请选择缺陷来源" style="width:100%;">
                  <el-option v-for="(item,index) in defectSourceData" :key="index" :label="item.dictLabel" :value="item.dictValue">{{item.dictLabel}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷环境：" prop="defectEnv">
                <el-select v-model="dataForms.dataForm2.defectEnv" placeholder="请选择缺陷环境" style="width:100%;">
                  <el-option v-for="(item,index) in defectEnvData" :key="index" :label="item.dictLabel" :value="Number(item.dictValue)">{{item.dictLabel}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="defectType" label="缺陷类型：">
                <el-select v-model="dataForms.dataForm2.defectType" placeholder="请选择缺陷类型" style="width:100%;" @change="defectTypeChange">
                  <el-option v-for="(item,index) in defectTypeData" :key="index" :label="item.dictLabel" :value="Number(item.dictValue)">{{item.dictLabel}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="defectQuestionType" label="问题类型：">
                <el-select v-model="dataForms.dataForm2.defectQuestionType" placeholder="请选择问题类型" filterable style="width:100%;">
                  <el-option v-for="(item,index) in defectQuestionTypeData" :key="index" :label="item.dictLabel" :value="item.dictValue">{{item.dictLabel}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期望修复：" prop="expectRepairDate">
                <el-date-picker v-model="dataForms.dataForm2.expectRepairDate" type="date" value-format="yyyy-MM-dd" :picker-options="expectRepairDateOptions" placeholder="请选择修复时间" style="width:100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="validTagShow('handler')">
              <el-form-item prop="nowHandler" label="处理人名：">
                <ctc-project-case-handler v-model="dataForms.dataForm2.nowHandler" placeholder="请选择处理人" :parentProjectId.sync="dataForms.dataForm2.parentProjectId" :projectId.sync="dataForms.dataForm2.projectId" :caseId.sync="dataForms.dataForm2.caseId" :echoDataForm.sync="dataForms.echoDataForm" @watchChildPage="triggerParentPage" style="width:100%;"></ctc-project-case-handler>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="缺陷描述：" prop="description">
                <el-input v-model="dataForms.dataForm2.description" placeholder="请输入缺陷描述" :autosize="{ minRows:8}" type="textarea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="修复说明：" prop="repairDescription">
                <el-input v-model="dataForms.dataForm2.repairDescription" placeholder="请输入修复情况说明" :autosize="{ minRows:3}" type="textarea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="attachementId" label="附件">
                <ctc-file-upload ref="ctcFileUpload" v-model="dataForms.dataForm2.attachementId"></ctc-file-upload>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <!--测试受阻-->
      <el-form label-position="right" ref="dataForms.dataForm3" v-if="dataForm.resultCode==='3'" :rules="rules3" :model="dataForms.dataForm3" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="原因" prop="remark">
              <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForms.dataForm3.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--无法测试-->
      <el-form label-position="right" ref="dataForms.dataForm4" v-if="dataForm.resultCode==='4'" :rules="rules4" :model="dataForms.dataForm4" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="原因" prop="remark">
              <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForms.dataForm4.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--免测-->
      <el-form label-position="right" ref="dataForms.dataForm5" v-if="dataForm.resultCode==='5'" :rules="rules5" :model="dataForms.dataForm5" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="原因" prop="remark">
              <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForms.dataForm5.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--延期再测-->
      <el-form label-position="right" ref="dataForms.dataForm6" v-if="dataForm.resultCode==='6'" :rules="rules6" :model="dataForms.dataForm6" label-width="110px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="原因" prop="remark">
              <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForms.dataForm6.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template slot="footer">
        <el-button size="small" @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" size="small" @click="submitResult(dataForm.resultCode)">{{ $t('confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import CtcProjectTaskTable from '@/components/project/ctc-project-task-table'
import CtcProjectCaseTable from '@/components/project/ctc-project-case-table'
import CtcProjectCaseHandler from '@/components/project/ctc-project-case-handler'
import { getDictDataList } from '@/utils'
export default {
  name: 'result-entry',
  components: {
    CtcProjectTaskTable, CtcProjectCaseTable, CtcProjectCaseHandler
  },
  data () {
    return {
      title: '结果录入',
      dialogVisible: false,
      dataForm: {
        id: this.$store.state.user.id,
        caseId: '',
        caseName: '',
        resultCode: '',
        testPhone: ''
      },
      resultList: getDictDataList('resultDetermination'),
      resultBack: [],
      nowHandlerData: [],
      testPhoneData: [],
      defectQuestionTypeData: [],
      defectEnvData: [],
      defectSourceData: [],
      defectTypeData: [],
      dataForms: {
        dataForm1: {
          passPercent: '', // 通过率
          testScreenShotId: '',
          testReportId: '', // 测试报告
          remark: '' // 备注
        },
        dataForm2add: {
          testReportId: '',
          remark: ''
        },
        dataForm2: {
          parentProjectId: '',
          projectId: '',
          taskId: '',
          caseId: '',
          name: '',
          defectType: '',
          defectQuestionType: '',
          defectEnv: '',
          defectSource: '',
          defectLevel: '',
          nowHandler: '',
          handlerName: '',
          expectRepairDate: '',
          attachementId: '',
          description: '',
          questionCauseType: '',
          repairDescription: ''
        },
        echoDataForm: {
          nowHandlerIds: '',
          handlerNames: ''
        },
        dataForm3: {
          remark: ''
        },
        dataForm4: {
          remark: ''
        },
        dataForm5: {
          remark: ''
        },
        dataForm6: {
          remark: ''
        }
      },
      rules: {
        resultCode: [
          { required: true, message: '请选择结果判定', trigger: 'change' }
        ]
      },
      rules1: {
      },
      rules2: {
        name: [
          { required: true, message: '缺陷名称不允许为空', trigger: 'blur' },
          { required: true, message: '缺陷名称不允许为空', trigger: 'change' }
        ],
        parentProjectId: [
          { required: true, message: '项目不允许为空', trigger: 'blur' },
          { required: true, message: '项目不允许为空', trigger: 'change' }
        ],
        defectLevel: [
          { required: true, message: '缺陷级别不允许为空', trigger: 'blur' },
          { required: true, message: '缺陷级别不允许为空', trigger: 'change' }
        ],
        defectType: [
          { required: true, message: '缺陷类型不允许为空', trigger: 'blur' },
          { required: true, message: '缺陷类型不允许为空', trigger: 'change' }
        ],
        nowHandler: [
          { required: true, message: '处理人不允许为空', trigger: 'blur' },
          { required: true, message: '处理人不允许为空', trigger: 'change' }
        ],
        description: [
          { required: true, message: '缺陷描述不允许为空', trigger: 'blur' },
          { required: true, message: '缺陷描述不允许为空', trigger: 'change' }
        ]
      },
      rules3: {
        remark: [
          { required: true, message: '原因不允许为空', trigger: 'blur' },
          { required: true, message: '原因不允许为空', trigger: 'change' }
        ]
      },
      rules4: {
        remark: [
          { required: true, message: '原因不允许为空', trigger: 'blur' },
          { required: true, message: '原因不允许为空', trigger: 'change' }
        ]
      },
      rules5: {
        remark: [
          { required: true, message: '原因不允许为空', trigger: 'blur' },
          { required: true, message: '原因不允许为空', trigger: 'change' }
        ]
      },
      rules6: {
        remark: [
          { required: true, message: '原因不允许为空', trigger: 'blur' },
          { required: true, message: '原因不允许为空', trigger: 'change' }
        ]
      },
      type: '',
      isOpen: false,
      expectRepairDateOptions: {
        disabledDate: time => {
          const dateVal = new Date().getTime()
          if (dateVal) {
            return time.getTime() < dateVal - 0
          }
        }
      }
    }
  },
  watch: {
    dialogVisible (newVal, oleVal) {
      if (!newVal) {
        this.$emit('init')
      }
    },
    'dataForm.resultCode' (newVal, oldVal) {
      this.resultCodeChange(newVal)
    }
  },
  mounted () {
  },
  methods: {
    init (type, caseId, row) {
      this.dialogVisible = true
      this.type = type
      this.dataForm.caseId = caseId
      this.dataForm.caseName = row.caseName
      this.$nextTick(() => {
        this.$refs.ctcFileUpload3.customUploadParams = { 'maxCount': 50, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.png', '.jpeg', '.jpg', '.zip', '.rar', '.mp4'] }
        this.$refs.ctcFileUpload3.init()
        this.dataForms.dataForm2.parentProjectId = row.parentProjectId
        this.dataForms.dataForm2.projectId = row.projectId
        this.dataForms.dataForm2.taskId = row.taskId
        this.dataForms.dataForm2.caseId = row.caseId
        this.dataForms.dataForm2.organizeId = row.organizeId
        // 结果判定结果值
        this.dataForms.dataForm2.resultDetermination = row.result
        this.dataForms.dataForm2.defectCount = row.defectCount
        this.getTestPhoneData()
        this.getResultList(row.parentProjectId || row.projectId)
      })
    },
    // 获取结果列表
    getResultList (projectId) {
      this.$http.get('/ctc/exec/result_config/project/' + projectId).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.resultBack = []
          if (res.data && res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              this.resultBack.push(res.data[i].toString())
            }
          }
        }
      }).catch(() => {
      })
    },
    triggerParentPage (message) {
      if (message.type === 'chooseHandler') {
        this.dataForms.dataForm2.handlerName = message.data
      }
    },
    validTagShow (type) {
      let bool = true
      if (type === 'handler') {
        bool = (this.dataForms.dataForm2.projectId || this.dataForms.dataForm2.parentProjectId) !== ''
      }
      return bool
    },
    // 获取缺陷状态数据
    getDefectListTableData (callback) {
      this.$ctcLoading.open()
      let params = { caseId: this.dataForms.dataForm2.caseId, limit: 9999999 }
      this.$http.get('/ctc/defect/base/list', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let defectData = []
          let data = res.data.data.list
          data.forEach((item, index) => {
            if ([1, 2].includes(item.defectStatus)) {
            } else {
              defectData.push(item.name)
            }
          })
          callback && callback(defectData)
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    getDefectdefaultHandler () {
      let projectId = this.dataForms.dataForm2.projectId || this.dataForms.dataForm2.parentProjectId || ''
      let taskId = this.dataForms.dataForm2.taskId || ''
      let caseId = this.dataForms.dataForm2.caseId || ''
      let params = {}
      if (projectId) {
        params.projectId = projectId
      }
      if (taskId) {
        params.taskId = taskId
      }
      if (caseId) {
        params.caseId = caseId
      }
      if (Object.keys(params).length > 0) {
        this.$http.get('ctc/project/projectMember/defect/defaultHandler', { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            let userId = res.data || []
            if (userId && userId.length > 0) {
              this.dataForms.echoDataForm.nowHandlerIds = userId.join(',')
              this.dataForms.echoDataForm.handlerNames = ''
            }
          }
        }).catch(() => { })
      }
    },
    doResultInputValid (item) {
      let thisvm = this
      let result = { 'isOK': true, 'message': '' }
      // 不通过，变通过
      if (item === '1') {
        let defectCount = thisvm.dataForms.dataForm2.defectCount
        if (defectCount > 0) {
          thisvm.getDefectListTableData(function (data) {
            if (data.length > 0) {
              result.isOK = false
              thisvm.$message.warning('用例已关联缺陷，缺陷状态存在除【已关闭、已否决】其他状态，不允许变更【通过】状态')
              thisvm.dataForm.resultCode = '0'
            }
          })
        }
      }
      return result
    },
    // 结果判定录入
    resultCodeChange (item) {
      // 结果不通过，才会触发后续校验
      if (this.dataForms.dataForm2.resultDetermination === '2') {
        this.doResultInputValid(item)
      }
    },
    getDynamicInfoByProjectId () {
      let parentProjectId = ((this.dataForms.dataForm2.parentProjectId || '').indexOf('clear') !== -1) ? '' : this.dataForms.dataForm2.parentProjectId
      let projectId = (this.dataForms.dataForm2.projectId.indexOf('clear') !== -1) ? '' : this.dataForms.dataForm2.projectId
      let tprojectId = parentProjectId || projectId
      if (tprojectId !== '') {
        this.getDefectConfInfo(tprojectId)
      }
    },
    defectTypeChange (dictValue) {
      let thisvm = this
      let projectId = thisvm.dataForms.dataForm2.parentProjectId || thisvm.dataForms.dataForm2.projectId || ''
      let dictType = 'questionType' + dictValue
      // 清空已配置缺陷类型
      thisvm.dataForms.dataForm2.defectQuestionType = ''
      // 加载缺陷问题类型
      thisvm.getParentProjectConfData(projectId, dictType, true).then(function (data) {
        thisvm.defectQuestionTypeData = data
      })
    },
    // 根据项目id，获取缺陷配置信息
    getDefectConfInfo (projectId) {
      let thisvm = this
      thisvm.dataForms.dataForm2.defectSource = ''
      thisvm.dataForms.dataForm2.defectEnv = ''
      thisvm.dataForms.dataForm2.defectType = ''
      // 加载缺陷来源
      thisvm.defectSourceDataByProjectId(projectId)
      // 加载缺陷环境
      thisvm.getParentProjectConfData(projectId, 'defectEnv', true).then(function (data) {
        thisvm.defectEnvData = data
        // 特殊处理，只配置一个缺陷环境默认填充
        if (thisvm.defectEnvData.length === 1) {
          thisvm.dataForm.defectEnv = Number(thisvm.defectEnvData[0].dictValue)
        }
      })
      // 加载缺陷类型
      thisvm.getParentProjectConfData(projectId, 'defectType', true).then(function (data) {
        thisvm.defectTypeData = data
      })
    },
    getParentProjectConfData (projectId, dictType, isAutoFill) {
      return new Promise((resolve, reject) => {
        let params = {}
        params.projectId = projectId
        params.dictType = dictType
        params.isAutoFill = isAutoFill
        this.$http.get('/ctc/defect/defectConfInfo/getDefectConfInfo', { params: params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            resolve(res.data)
          }
        }).catch(() => { })
      })
    },
    defectSourceDataByProjectId (projectId) {
      if (projectId) {
        this.$http.get('ctc/project/relaPlatform/getByPjectId', { params: { 'projectId': projectId } }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            // 缺陷来源
            let defaultData = [{ 'applicationId': '-1', 'name': '执行中心', 'code': 'ZXZX' }]
            let data = defaultData.concat(res.data)
            let newData = []
            data.forEach((item, index) => {
              newData.push({ 'dictLabel': item.name, 'dictValue': item.applicationId })
            })
            this.defectSourceData = newData
            // 特殊处理，只配置一个缺陷来源默认填充
            if (this.defectSourceData.length > 0) {
              this.dataForms.dataForm2.defectSource = this.defectSourceData[0].dictValue
            }
          }
        }).catch(() => { })
      }
    },
    enteringDefect () {
      // 校验是否批量录入
      let caseIdArr = (this.dataForm.caseId || '').split(',')
      if (caseIdArr.length === 1) {
        this.isOpen = !this.isOpen
        if (this.isOpen) {
          this.$nextTick(() => {
            this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 50, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.png', '.jpeg', '.jpg', '.zip', '.rar', '.mp4'] }
            this.$refs.ctcFileUpload.init()
            this.getDynamicInfoByProjectId()
            this.getDefectdefaultHandler()
            this.getExecCaseById()
          })
        }
      } else {
        this.$message.warning('暂不支持批量录入缺陷，如需录入，请针对单个用例操作！')
      }
    },
    getExecCaseById () {
      let caseId = this.dataForm.caseId
      if (caseId) {
        let params = {}
        this.$http.get('/ctc/exec/case/' + caseId, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.dataForms.dataForm2.defectSource = res.autoPlatformId || '-1'
          }
        }).catch(() => { })
      }
    },
    // 获取测试号码数据
    getTestPhoneData () {
      let thisvm = this
      let projectId = thisvm.dataForms.dataForm2.projectId
      let organizeId = this.dataForms.dataForm2.organizeId
      thisvm.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('获取项目基本信息失败')
        } else {
          let data = res.data
          let testPhoneCode = data.testPhoneCode || ''
          if (testPhoneCode) {
            organizeId = organizeId || data.organizeId
            let params = { 'testPhoneCode': testPhoneCode, 'organizeId': organizeId, 'page': 1, 'limit': 999999999999 }
            this.$http.get('ctc/project/projectTestPhone/page', { params: params }).then(({ data: res }) => {
              if (res.code !== 0) {
                return this.$message.error(res.msg)
              } else {
                this.testPhoneData = res.data.list
              }
            }).catch(() => { })
          }
        }
      }).catch(() => { })
    },
    handlePreview (file) {
      console.log(file)
    },
    httpRequest (data) {
      let _this = this
      let rd = new FileReader() // 创建文件读取对象
      let file = data.file
      rd.readAsDataURL(file) // 文件读取装换为base64类型
      rd.onloadend = function (e) {
        _this.dataForm.file = this.result // this指向当前方法onloadend的作用域
      }
    },
    submitResult (res) {
      let thisvm = this
      thisvm.$refs.dataForm.validate((valid) => {
        if (valid) {
          thisvm.$refs['dataForms.dataForm' + res].validate((valid) => {
            if (valid) {
              thisvm.$ctcLoading.open()
              let params = []
              let caseList = thisvm.dataForm.caseId.split(',')
              for (let i = 0; i < caseList.length; i++) {
                let node = ''
                if (res === '2') {
                  node = { caseId: caseList[i], resultCode: thisvm.dataForm.resultCode, testPhone: thisvm.dataForm.testPhone, creatorName: thisvm.$store.state.user.realName, ...thisvm.dataForms.dataForm2add }
                  if (thisvm.isOpen) {
                    node.defectInfoDTO = { ...thisvm.dataForms['dataForm' + res] }
                    // 特殊处理描述换行符
                    node.defectInfoDTO.description = node.defectInfoDTO.description.replace(/\n/g, '<br />')
                    node.defectInfoDTO.repairDescription = node.defectInfoDTO.repairDescription.replace(/\n/g, '<br />')
                  }
                } else {
                  if (!thisvm.dataForms['dataForm' + res].testReportId) {
                    thisvm.dataForms['dataForm' + res].testReportId = thisvm.dataForms.dataForm2add.testReportId
                  }
                  node = { caseId: caseList[i], resultCode: thisvm.dataForm.resultCode, testPhone: thisvm.dataForm.testPhone, creatorName: thisvm.$store.state.user.realName, ...thisvm.dataForms['dataForm' + res] }
                }
                params.push(node)
              }
              thisvm.$http.post('/ctc/exec/result', params).then(({ data: res }) => {
                thisvm.$ctcLoading.close()
                if (res.code !== 0) {
                  thisvm.$message.error(res.msg)
                } else {
                  console.log(res)
                  thisvm.dialogVisible = false
                  thisvm.$emit('refresh')
                }
              }).catch((res) => {
                thisvm.$ctcLoading.close()
              })
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
.resultEntry {
  @media screen and (max-width: 700px) {
    .dialogWith {
      width: 100%;
    }
  }
  @media screen and (min-width: 700px) {
    .dialogWith {
      width: 90%;
    }
  }
  @media screen and (min-width: 1000px) {
    .dialogWith {
      width: 80%;
    }
  }
  @media screen and (min-width: 1200px) {
    .dialogWith {
      width: 65%;
    }
  }
}
</style>
