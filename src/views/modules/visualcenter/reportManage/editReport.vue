<template>
  <el-dialog :visible.sync="visibleEditReport" @close="closeToast" width="65%" title="编辑日报" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form max-height="480" label-position="left" :model="dataForm" :rules="dataRule" ref="dataForm" label-width="130px">
      <el-form-item prop="contactGroupId" label="联系组名称">
        <el-select v-model="dataForm.contactGroupId" placeholder="请选择联系组">
          <el-option v-for="data in contactGroupData" :key="data.contactGroupId" :label="data.contactGroupName" :value="data.contactGroupId">{{data.contactGroupName}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="businessSupplement" label="业务补充说明">
        <el-input type="textarea" :autosize="{ minRows: 4}" v-model="dataForm.businessSupplement" :placeholder="$t('params.paramValue')"></el-input>
      </el-form-item>
      <el-form-item prop="defectDescription" label="缺陷详述">
        <el-input type="textarea" :autosize="{ minRows: 4}" v-model="dataForm.defectDescription" :placeholder="$t('params.paramValue')"></el-input>
      </el-form-item>
      <el-form-item prop="attachementId" label="上传附件:">
        <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.attachementId" style="cursor:pointer;"></ctc-file-upload>
      </el-form-item>
      <el-form-item style="display: flex;justify-content: center;align-items: center;">
        <el-button size="small" @click="visibleEditReport = false">{{ $t('cancel') }}</el-button>
        <el-button size="small" type="primary" @click="dataFormSubmitHandle()">发送</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import debounce from 'lodash/debounce'
import { polishingOssHost } from '@/utils/validate'
export default {
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false,
        activatedIsNeed: false
      },
      visibleEditReport: false,
      dataForm: {
        projectId: '',
        contactGroupId: '',
        businessSupplement: '',
        defectDescription: '',
        attachementId: ''
      },
      contactGroupData: []
    }
  },
  components: {
  },
  computed: {
    dataRule () {
      return {
        contactGroupName: [
          { required: true, message: '联系组名称不允许为空', trigger: 'blur' },
          { required: true, message: '联系组名称不允许为空', trigger: 'change' }
        ],
        defectDescription: [
          { required: true, message: '缺陷详述不允许为空', trigger: 'blur' },
          { required: true, message: '缺陷详述不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visibleEditReport = true
      this.initFileUpload()
      this.getContactGroupData()
    },
    initFileUpload () {
      this.$nextTick(() => {
        // 校验上传文件大小(单位:字节)
        this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 10, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx', '.txt', '.png', '.jpeg', '.jpg'], 'checkFileSize': 15728640 }
        this.$refs.ctcFileUpload.init()
      })
    },
    closeToast () {
      this.$refs['dataForm'].resetFields()
    },
    getContactGroupData () {
      this.$http.get('/ctc/visualization/report/contactGroupList').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.contactGroupData = res.data
        }
      }).catch(() => { })
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      let thisvm = this
      // 自动触发缺陷附件上传
      thisvm.$refs.ctcFileUpload.doFileUploadAction(function (attachmentId) {
        thisvm.d1 = thisvm.dataForm
        thisvm.$refs['dataForm'].validate((valid) => {
          if (valid) {
            thisvm.$ctcLoading.open()
            let params = Object.assign({}, thisvm.dataForm)
            // 特殊处理[业务补充说明]换行符
            params.businessSupplement = params.businessSupplement.replace(/\n/g, '<br />')
            // 特殊处理[缺陷详述]换行符
            params.defectDescription = params.defectDescription.replace(/\n/g, '<br />')
            // 设置文件服务器域名
            params.ossHost = polishingOssHost('#filePath#', 2)
            thisvm.$http.post('/ctc/visualization/report/dailySend', params).then(({ data: res }) => {
              thisvm.$ctcLoading.close()
              if (res.code !== 0) {
                return thisvm.$message.error(res.msg)
              }
              thisvm.$message({
                message: thisvm.$t('prompt.success'),
                type: 'success',
                duration: 500,
                onClose: () => {
                  thisvm.visibleEditReport = false
                  thisvm.$emit('refreshDataList')
                }
              })
            }).catch(() => {
              thisvm.$ctcLoading.close()
            })
          }
        })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
