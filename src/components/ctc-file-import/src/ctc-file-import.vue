<template>
  <!--文件导入-->
  <el-dialog title="数据导入" :visible.sync="innerVisible" :close-on-click-modal="false" width="40%" class="file-import-dialog" append-to-body>
    <div class="file-import-data">
      <el-row :gutter="0">
        <el-col :span="24">
          <el-button class="download-template" @click="downFileTemplate">下载模板</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="24">
          <el-upload ref="file-upload" class="upload-file upload-demo" :action="triggerFileUploadUrl()" :headers="paramsHeaders" :data="paramsData" :on-success="uploadHandleSuccess" :on-error="uploadHandleError" :before-upload="beforeUploadHandle" :file-list="fileList" accept=".xls,.xlsx">
            <el-button size="small" type="primary">上传文件</el-button>
            <div slot="tip" class="el-upload__tip">文件格式只支持：xls，xlsx（备注：用例模板仅支持无格式的excel，请确保单元格属性为“值”）</div>
          </el-upload>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import Cookies from 'js-cookie'
import qs from 'qs'
import md5 from 'js-md5'
import ctcUtils from '@/utils/ctc-utils.js'
export default {
  name: 'CtcFileImport',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fileList: [],
      fileImportParams: {
        templateUrl: '',
        // template:文件模板下载参数
        templateData: {
        },
        uploadUrl: '',
        // upload:文件上传参数
        uploadData: {
        }
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
    paramsHeaders () {
      let paramsHeaders = this.getPaiWei('post', {})
      return paramsHeaders
    },
    paramsData () {
      let paramsData = this.fileImportParams.uploadData
      return paramsData
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.fileList = []
      })
    },
    // 获取加密排位
    getPaiWei (type, data) {
      data = data || {}
      let convData = ''
      if (type === 'get') {
        convData = qs.stringify(data, { arrayFormat: 'repeat' })
      } else {
        convData = (Object.keys(data).length === 0) ? '' : JSON.stringify(data)
      }
      // 进行md5秘钥加密(token+userId+param)
      let token = Cookies.get('token') || ''
      let url = this.fileImportParams.uploadUrl
      let secretKey = token + '|' + url + '|' + convData
      let paiWeiMap = { 'panWei': md5(secretKey) }
      return paiWeiMap
    },
    triggerFileUploadUrl () {
      let fileImportParams = this.fileImportParams
      let uploadUrl = `${window.SITE_CONFIG['apiURL']}${fileImportParams.uploadUrl}`
      uploadUrl += '?token=' + Cookies.get('token')
      return uploadUrl
    },
    downFileTemplate () {
      let fileImportParams = this.fileImportParams
      let url = fileImportParams.templateUrl
      let data = fileImportParams.templateData
      ctcUtils.customExportGet(url, data)
    },
    // 文件上传成功
    uploadHandleSuccess (response, file, fileList) {
      if (response.code !== 0) {
        let msg = ctcUtils.strReplace(response.msg, '\r', '<br/>')
        this.$message({
          dangerouslyUseHTMLString: true,
          message: msg,
          showClose: true,
          duration: 15000,
          type: 'error'
        })
      } else {
        this.$message.success('上传成功，' + response.msg)
        this.$emit('watchChildImport', { type: 'reloadTable', 'data': response.data })
        this.innerVisible = false
      }
      this.$refs['file-upload'].clearFiles()
    },
    // 文件上传失败
    uploadHandleError (err, file, fileList) {
      this.$message.error(err)
    },
    // 文件上传格式校验
    beforeUploadHandle (file) {
      let FileExt = file.name.replace(/.+\./, '')
      if (['xls', 'xlsx'].indexOf(FileExt.toLowerCase()) === -1) {
        this.$message.error('文件格式只支持：xls,xlsx')
        return false
      }
      return true
    }
  }
}
</script>
<style lang="scss">
.file-import-dialog {
  .download-template {
    width: 100%;
  }
  .upload-file {
    .el-upload.el-upload--text {
      width: 100%;
    }
    .el-button.el-button--primary {
      margin-top: 10px;
      width: 100%;
      height: 40px;
    }
  }
}
</style>
