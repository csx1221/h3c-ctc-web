<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
        <el-row>
<!--            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">{{title}}</span></el-divider>-->
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="工单标题：" prop="title">
                        <el-input v-model="dataForm.title" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="oderDesc" label="工单描述：">
                        <el-input v-model="dataForm.oderDesc" placeholder="请输入" :rows="5" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
<!--                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">-->
<!--                    <el-form-item label="附件：" prop="fileId">-->
<!--                        <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.fileId"></ctc-file-upload>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="申请人：" prop="applicant">
                        <el-input v-model="dataForm.applicant" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="邮箱：" prop="email">
                        <el-input v-model="dataForm.email" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="手机号码：" prop="mobile">
                        <el-input v-model="dataForm.mobile" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="工作单位：" prop="placeOfWork">
                        <el-input v-model="dataForm.placeOfWork" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="下一步处理人：" prop="handleUserId">
                        <!--                       // 1 为4A测管理员  2 为集测管理员  3当前登录用户所在项目组项目经理  4申请人所在项目组的项目经理 5免登录通用工单 -->
                        <ctc-next-step-handler v-model="dataForm.handleUserId" urlType="5" placeholder="请选择"></ctc-next-step-handler>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <div align="center">
            <el-button type="primary" size="small" @click="$emit('close')">取消</el-button>
            <el-button :disabled="isHasOrgId" type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
        </div>
    </el-card>
</template>

<script>
import { isEmail, isMobile } from '@/utils/validate'
export default {
  name: 'noLoginApplication',
  components: {
  },
  watch: {
  },
  data () {
    return {
      isHasOrgId: false,
      title: '', // 标题
      name: this.$store.state.user.realName,
      dataForm: {
        title: '', // 工单标题
        oderDesc: '', // 工单描述
        fileId: '', // 附件id
        applicant: '', // 申请人
        email: '',
        mobile: '',
        placeOfWork: '', // 工作单位
        handleUserId: ''// 下一步处理人
      }
    }
  },
  computed: {
    dataRule () {
      let validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.email') })))
        }
        callback()
      }
      let validateMobile = (rule, value, callback) => {
        if (!isMobile(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': '手机号码' })))
        }
        callback()
      }
      return {
        title: [
          { required: true, message: '请输入', trigger: 'blur' },
          { required: true, message: '最多输入128个字', trigger: 'blur', min: 1, max: 128 }
        ],
        oderDesc: [
          { required: true, message: '请输入', trigger: 'blur' },
          { required: true, message: '最多输入2000个字', trigger: 'blur', min: 1, max: 2000 }
        ],
        applicant: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        placeOfWork: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        handleUserId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    // this.initFileUpload()
    console.log(this.$route)
    // 1为新增 2为编辑 3为验证
    if (this.$route.params.type === '1') {
      this.title = '免登陆通用工单'
    } else {
      this.title = '免登陆通用工单'
      // this.getEchoData(this.$route.params.recordId) // 再次编辑数据回显
    }
  },
  methods: {
    submitResult (res) {
      let thisvm = this
      thisvm.$refs.dataForm.validate((valid) => {
        if (valid) {
          // thisvm.$refs.ctcFileUpload.doFileUploadAction(function () {
          thisvm.submitData()
          // })
        } else {
          return false
        }
      })
    },
    submitData (val) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { ...this.dataForm }
      thisvm.$http.post('/account4a/home/register/acct/currencyOrder', params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg, duration: 8000 })
        }
        thisvm.$message.success('提交成功')
        thisvm.$emit('close')
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    getEchoData (id) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { recordId: id }
      thisvm.$http.get('/account4a/currency/order/info', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg })
        }
        // 信息处理
        if (res.data) {
          let data = res.data
          this.dataForm.title = data.title
          this.dataForm.oderDesc = data.oderDesc
          this.dataForm.fileId = data.fileId
          // this.dataForm.handleUserId = data.handleUserId

          // 附件回显
          if (data.fileId) {
            setTimeout(() => {
              this.$refs.ctcFileUpload.echoInit(data.fileId)
            }, 1000)
          }
        }
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    initFileUpload () {
      // this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 1, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
      this.$refs.ctcFileUpload.init()
    }
  }
}
</script>

<style scoped lang="scss">
    .accStyle{
        .el-date-editor.el-input, .el-date-editor.el-input__inner{
            width: 100%;
        }
    }
    .isTips{
        color: red;
        span{
            display: block;
            line-height: 18px;
        }
    }
</style>
