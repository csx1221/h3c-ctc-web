<template>
  <el-dialog :visible.sync="innerVisible" :title="!dataForm.documentId ? $t('add') : $t('update')" width="60%" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否审批：" prop="ifAuth">
            <ctc-select v-model="dataForm.ifAuth" dict-type="yesOrNo" placeholder="请选择是否审批" :disabled="true"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="dataForm.ifAuth==1">
          <el-form-item label="审核方式：" prop="authMode">
            <ctc-select v-model="dataForm.authMode" dict-type="document.authMode" placeholder="请选择审核方式"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文档名称：" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入文档名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="dataForm.ifAuth==1">
          <el-form-item prop="handler" label="审核人名：">
            <ctc-project-document-handler v-model="dataForm.handler" placeholder="请选择审核人" :projectId.sync="dataForm.projectId" :echoDataForm.sync="echoDataForm" @watchChildPage="triggerParentPage" style="width:100%;"></ctc-project-document-handler>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="attachementId" label="附件信息：">
            <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.attachementId"></ctc-file-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="description" label="文档描述：">
            <el-input v-model="dataForm.description" placeholder="请输入文档描述" :autosize="{ minRows:8}" type="textarea"></el-input>
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
import CtcProjectDocumentHandler from '@/components/project/ctc-project-document-handler'
export default {
  components: {
    CtcProjectDocumentHandler
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        operationType: 'create0',
        parentProjectId: '',
        projectId: '',
        documentId: '',
        version: '',
        chooseIfAuth: '',
        ifAuth: '',
        authMode: '',
        name: '',
        description: '',
        handler: '',
        handlerName: '',
        attachementId: '',
        dirId: '',
        pathId: '',
        pathName: ''
      },
      echoDataForm: {
        handler: '',
        handlerName: ''
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
      return {
        name: [
          { required: true, message: '文档名称不允许为空', trigger: 'blur' },
          { required: true, message: '文档名称不允许为空', trigger: 'change' }
        ],
        ifAuth: [
          { required: true, message: '是否审核不允许为空', trigger: 'blur' },
          { required: true, message: '是否审核不允许为空', trigger: 'change' }
        ],
        authMode: [
          { required: true, message: '审核方式不允许为空', trigger: 'blur' },
          { required: true, message: '审核方式不允许为空', trigger: 'change' }
        ],
        handler: [
          { required: true, message: '审核人不允许为空', trigger: 'blur' },
          { required: true, message: '审核人不允许为空', trigger: 'change' }
        ],
        attachementId: [
          { required: true, message: '附件信息不允许为空', trigger: 'blur' },
          { required: true, message: '附件信息不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.ifAuth = this.dataForm.chooseIfAuth
        this.dataForm.authMode = ''
        this.echoDataForm.handler = 'clear_' + Math.random()
        // 默认初始化文件上传组件
        this.$refs.ctcFileUpload.echoInit('')
        this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 100, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.pdf', '.pptx', '.zip', '.rar'], 'checkFileSize': 1073741824 }
        this.$refs.ctcFileUpload.init()
        this.getDocumentInfo()
      })
    },
    triggerParentPage (message) {
      if (message.type === 'chooseHandler') {
        this.dataForm.handlerName = message.data
      }
    },
    getDocumentInfo () {
      let documentId = this.dataForm.documentId
      if (documentId) {
        let params = { 'documentId': documentId, 'version': this.dataForm.version }
        this.$http.get('/ctc/project/document/documentInfoById', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.dataForm = { ...this.dataForm, ...res.data }
            this.echoDataForm.handler = this.dataForm.handler
            this.echoDataForm.handlerName = this.dataForm.handlerName
            // 特殊处理，重新上传要清空附件编码
            if (this.dataForm.operationType === 'reloadUpdate') {
              this.dataForm.attachementId = ''
            }
            this.$refs.ctcFileUpload.echoInit(this.dataForm.attachementId)
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
          thisvm.dataForm.documentId = thisvm.dataForm.documentId
          let params = Object.assign({}, thisvm.dataForm)
          // 特殊处理文档描述换行符
          params.description = params.description.replace(/\n/g, '<br />')
          // 特殊处理文档保存，手动去除[创建人、问题状态]
          delete params['creator']
          delete params['creatorName']
          delete params['createDate']
          thisvm.$http[!params.documentId ? 'post' : 'put']('/ctc/project/document', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return thisvm.$message.error(res.msg)
            }
            thisvm.$message({
              message: thisvm.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                thisvm.handleDialogClose()
                thisvm.$emit('watchChildPage', { 'type': 'reloadTable', 'data': { 'ifAuth': params.ifAuth } })
              }
            })
          }).catch(() => { })
        })
      })
    }, 1500, { 'leading': true, 'trailing': false })
  }
}
</script>
