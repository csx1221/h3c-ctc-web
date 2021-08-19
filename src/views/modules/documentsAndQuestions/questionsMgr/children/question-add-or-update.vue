<template>
  <el-dialog :visible.sync="innerVisible" :title="!dataForm.questionId ? $t('add') : $t('update')" width="70%" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="140px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="问题/任务标题：" prop="title">
            <el-input v-model="dataForm.title" placeholder="请输入问题/任务标题"  maxlength="30"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="问题/任务类型：" prop="type">
            <ctc-select v-model="dataForm.type" dict-type="question.type" placeholder="请选择问题/任务类型"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="问题/任务级别：" prop="level">
            <ctc-select v-model="dataForm.level" dict-type="question.level" placeholder="请选择问题/任务级别"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="planStartTime" label="计划开始日期：">
            <el-date-picker v-model="dataForm.planStartTime" value-format="yyyy-MM-dd" type="date" :picker-options="pickerOptionsStart" placeholder="请选择计划开始日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="planEndTime" label="计划结束日期：">
            <el-date-picker v-model="dataForm.planEndTime" value-format="yyyy-MM-dd" type="date" :picker-options="pickerOptionsEnd" placeholder="请选择计划结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="onlineTime" label="上线日期：">
            <el-date-picker v-model="dataForm.onlineTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择上线日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="测试人员名称：" prop="testName">
            <el-input v-model="dataForm.testName" placeholder="请输入测试人员名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="testCaseNum" label="测试用例数量：">
            <el-input-number v-model="dataForm.testCaseNum" :min="0" style="width:100%;"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="问题/任务流程：" prop="flow">
            <ctc-select v-model="dataForm.flow" dict-type="question.flow" placeholder="请选择问题/任务流程"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="handler" label="处理人：">
            <ctc-project-question-handler-v2 v-model="dataForm.handler" placeholder="处理人" :projectId.sync="dataForm.projectId" :echoDataForm.sync="echoDataForm" @watchChildPage="triggerParentPage" :disabled="handlerDisabled" style="width:100%;"></ctc-project-question-handler-v2>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="问题/任务描述：" prop="description">
            <!-- 富文本编辑器, 容器 -->
            <div id="J_quillEditor" style="height:400px"></div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="attachementId" label="附件信息：">
            <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.attachementId"></ctc-file-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template slot="footer">
      <el-button size="small" @click="handleDialogClose">关闭</el-button>
      <el-button size="small" type="primary" @click="dataFormSubmitHandle()">保存</el-button>
    </template>
  </el-dialog>
</template>
<script>
import debounce from 'lodash/debounce'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import CtcProjectQuestionHandlerV2 from '@/components/project/ctc-project-question-handler-v2'
export default {
  components: {
    CtcProjectQuestionHandlerV2
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      J_quillEditor: null,
      quillEditorToolbarOptions: [
        ['bold', 'italic', 'underline', 'strike'],
        // 先不支持图片编辑['image'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
      dataForm: {
        parentProjectId: '',
        projectId: '',
        questionId: '',
        version: 2,
        title: '',
        type: '0',
        level: '3',
        flow: '',
        description: '',
        planStartTime: '',
        planEndTime: '',
        onlineTime: '',
        testName: '',
        testCaseNum: 0,
        handler: '',
        handlerName: '',
        attachementId: ''
      },
      echoDataForm: {
        random: '',
        multiSelect: '1',
        flow: '0',
        type: '0',
        handler: '',
        handlerName: '',
        filterHandlerData: []
      },
      handlerDisabled: false,
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
    'dataForm.type' (newVal, oldVal) {
      if (newVal) {
        // 特殊处理（-1:表示只能选总部人员）
        this.echoDataForm.type = '-1'
        this.echoDataForm.random = 'clear_' + Math.random()
      }
    },
    'dataForm.flow' (newVal, oldVal) {
      if (newVal) {
        this.echoDataForm.flow = newVal + ''
        this.echoDataForm.random = 'clear_' + Math.random()
      }
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    },
    dataRule () {
      var validateDescription = (rule, value, callback) => {
        if (this.J_quillEditor.getLength() <= 1) {
          return callback(new Error('问题/任务描述不允许为空'))
        }
        callback()
      }
      return {
        title: [
          { required: true, message: '问题/任务标题不允许为空', trigger: 'blur' },
          { required: true, message: '问题/任务标题不允许为空', trigger: 'change' }
        ],
        level: [
          { required: true, message: '问题/任务级别不允许为空', trigger: 'blur' },
          { required: true, message: '问题/任务级别不允许为空', trigger: 'change' }
        ],
        type: [
          { required: true, message: '问题/任务类型不允许为空', trigger: 'blur' },
          { required: true, message: '问题/任务类型不允许为空', trigger: 'change' }
        ],
        flow: [
          { required: true, message: '问题/任务流程不允许为空', trigger: 'blur' },
          { required: true, message: '问题/任务流程不允许为空', trigger: 'change' }
        ],
        handler: [
          { required: true, message: '处理人不允许为空', trigger: 'blur' },
          { required: true, message: '处理人不允许为空', trigger: 'change' }
        ],
        planStartTime: [
          { required: true, message: '计划开始时间不允许为空', trigger: 'blur' },
          { required: true, message: '计划开始时间不允许为空', trigger: 'change' }
        ],
        planEndTime: [
          { required: true, message: '计划结束时间不允许为空', trigger: 'blur' },
          { required: true, message: '计划结束时间不允许为空', trigger: 'change' }
        ],
        description: [
          { required: true, validator: validateDescription, trigger: 'blur' },
          { required: true, validator: validateDescription, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        if (this.J_quillEditor) {
          this.J_quillEditor.deleteText(0, this.J_quillEditor.getLength())
        } else {
          this.quillEditorHandle()
        }
        this.handlerDisabled = false
        this.$refs['dataForm'].resetFields()
        this.echoDataForm.handler = ''
        this.echoDataForm.handlerName = ''
        this.echoDataForm.filterHandlerData = []
        this.echoDataForm.random = 'clear_' + Math.random()
        // 默认初始化文件上传组件
        this.$refs.ctcFileUpload.echoInit('')
        this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 50, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.png', '.jpeg', '.jpg', '.zip', '.rar'], 'checkFileSize': 104857600 }
        this.$refs.ctcFileUpload.init()
        this.getQuestionFlowByUser()
      })
    },
    triggerParentPage (message) {
      if (message.type === 'chooseHandler') {
        this.dataForm.handlerName = message.data
      }
    },
    // 富文本编辑器
    quillEditorHandle () {
      this.J_quillEditor = new Quill('#J_quillEditor', {
        modules: {
          toolbar: this.quillEditorToolbarOptions
        },
        theme: 'snow'
      })
      // 监听描述变化，动态赋值
      this.J_quillEditor.on('text-change', () => {
        this.dataForm.description = this.J_quillEditor.root.innerHTML
      })
    },
    getQuestionFlowByUser () {
      this.$http.get('/ctc/project/question/getQuestionFlowByUser').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.dataForm.flow = res.data + ''
          this.echoDataForm.flow = this.dataForm.flow
          // 特殊处理（-1:表示只能选总部人员）
          this.echoDataForm.type = '-1'
          this.echoDataForm.random = 'clear_' + Math.random()
          this.getQuestionInfo()
        }
      }).catch(() => { })
    },
    getQuestionInfo () {
      let thisvm = this
      let questionId = thisvm.dataForm.questionId
      if (questionId) {
        thisvm.$http.get('/ctc/project/question/' + questionId).then(({ data: res }) => {
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          } else {
            thisvm.dataForm = { ...thisvm.dataForm, ...res.data }
            thisvm.handlerDisabled = true
            thisvm.echoDataForm.flow = thisvm.dataForm.flow + ''
            // 特殊处理（-1:表示只能选总部人员）
            thisvm.echoDataForm.type = '-1'
            thisvm.echoDataForm.handler = thisvm.dataForm.handler
            thisvm.echoDataForm.handlerName = thisvm.dataForm.handlerName
            thisvm.echoDataForm.random = 'clear_' + Math.random()
            // 问题/任务描述
            thisvm.J_quillEditor.root.innerHTML = thisvm.dataForm.description
            // 附件回显
            thisvm.$refs.ctcFileUpload.echoInit(thisvm.dataForm.attachementId)
          }
        }).catch(() => { })
      }
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      let thisvm = this
      // 自动触发附件上传
      thisvm.$refs.ctcFileUpload.doFileUploadAction(function (attachmentId) {
        thisvm.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          }
          thisvm.dataForm.questionId = thisvm.dataForm.questionId
          let params = Object.assign({}, thisvm.dataForm)
          params.systemUrl = location.origin
          // 特殊处理问题/任务保存，手动去除[创建人、问题/任务状态]
          delete params['creator']
          delete params['creatorName']
          delete params['createDate']
          delete params['questionStatus']
          thisvm.$http[!params.questionId ? 'post' : 'put']('/ctc/project/question', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return thisvm.$message.error(res.msg)
            }
            thisvm.$message({
              message: thisvm.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                thisvm.handleDialogClose()
                thisvm.$emit('watchChildPage', { 'type': 'reloadTable', 'data': {} })
              }
            })
          }).catch(() => { })
        })
      })
    }, 1500, { 'leading': true, 'trailing': false })
  }
}
</script>
