<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
        <el-row>
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">{{title}}</span></el-divider>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="工单标题：" prop="title">
                        <el-input v-model="dataForm.title" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="applyList" label="附件信息：">
                        <!--                      type 1 批量申请 2批量变更-->
<!--                        {{dataForm.applyList}}-->
                        <account-batch ref="accountBatch" :type="'2'" :data.sync="dataForm.applyList"></account-batch>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="reason" label="申请原因：">
                        <el-input v-model="dataForm.reason" placeholder="请输入" :rows="5" type="textarea"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="提出人：" prop="name">
                        <el-input disabled v-model="name" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="附件：" prop="fileId">
                        <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.fileId"></ctc-file-upload>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="下一步处理人：" prop="handleUserId">
                        <!--                        urlType 1 为4A测管理员  2 为集测管理员  3当前登录用户所在项目组项目经理  4申请人所在项目组的项目经理 formData为传递的参数-->
<!--                        <ctc-next-step-handler v-model="dataForm.handleUserId" urlType="3" placeholder="请选择"></ctc-next-step-handler>-->
                        <ctc-next-step-handler ref="handleUser" v-model="dataForm.handleUserId" urlType="7" placeholder="请选择"></ctc-next-step-handler>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <div align="center">
            <el-button type="primary" size="small" @click="close">取消</el-button>
            <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
        </div>
    </el-card>
</template>

<script>
import { removeCurrentTabsHandle } from '@/router'
import mixinViewModule from '@/mixins/view-module'
import { isEmail, isIDCard, isMobile } from '@/utils/validate'
import accountBatch from '@/views/modules/accountOperationManagement4A/pubilcModule/accountBatch'
export default {
  name: 'workOrderApplication',
  mixins: [mixinViewModule],
  components: {
    accountBatch
  },
  watch: {
    // 项目组
    'dataForm.applyList' (newVal, oldVal) {
      console.log(newVal)
      if (newVal.length > 0) {
        this.checkData()
      } else {
        this.dataForm.handleUserId = ''
      }
    }
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      formData: '',
      title: '',
      name: this.$store.state.user.realName,
      afterSelectData: {},
      dataForm: {
        title: '', // 工单标题
        applyList: [],
        reason: '', // 申请原因
        fileId: '',
        handleUserId: ''// 下一步处理人
      },
      dataForms: {
        loginName: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        title: [
          { required: true, message: '请输入', trigger: 'blur' },
          { required: true, message: '最多输入128个字', trigger: 'blur', min: 1, max: 128 }
        ],
        applyList: [
          { required: true, message: '请上传账号', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        handleUserId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    },
    dataRules () {
      let validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.email') })))
        }
        callback()
      }
      let validateID = (rule, value, callback) => {
        if (!isIDCard(value)) {
          return callback(new Error(this.$t('validate.format', { 'attr': '身份证号码' })))
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
        radio: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        cardValue: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateID, trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        acctType: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        canLoginWay: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        isGfort: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.initFileUpload()

    // 1为新增 2为编辑
    console.log(this.$route.params)
    if (this.$route.params.type === '1') {
      this.title = this.$route.meta.title
    } else {
      this.title = this.$route.meta.title
      this.getEchoData(this.$route.params.recordId) // 获取工单信息
    }
  },
  methods: {
    checkData () {
      let dataForm = this.dataForm
      let orgId = ''
      let loginNameList = []
      if (dataForm.applyList.length > 0 && dataForm.applyList[0].orgId) {
        orgId = Array.isArray(dataForm.applyList[0].orgId) ? dataForm.applyList[0].orgId[dataForm.applyList[0].orgId.length - 1] : dataForm.applyList[0].orgId
        for (let i = 0; i < dataForm.applyList.length; i++) {
          loginNameList.push(dataForm.applyList[i].loginName)
        }
        this.$refs.handleUser.getProjectInfo({
          orgId: orgId,
          loginNameList: loginNameList
        })
      } else {
        this.$refs.handleUser.getProjectInfo()
      }
    },
    // 移除
    removeNode (index, node) {
      let _this = this
      _this.dataForm.accountList.splice(_this.dataForm.accountList.findIndex(item => item.loginName === node.loginName), 1)
    },
    removeNodeAll () {
      let _this = this
      _this.dataForm.accountList.splice(0, _this.dataForm.accountList.length)
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'status') {
        columnValue = this.$getDictLabel('accState', row[item.code])
      } else if (item.code === 'approvalStatus') {
        columnValue = this.$getDictLabel('approvalResult', row[item.code])
      } else if (item.code === 'canLoginWay') {
        columnValue = this.$getDictLabel('VPNPermission', row[item.code])
      } else if (item.code === 'isGfort') {
        columnValue = this.$getDictLabel('isGfort', row[item.code])
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    close () {
      removeCurrentTabsHandle(this)
    },
    submitResult (res) {
      let thisvm = this
      thisvm.$refs.dataForm.validate((valid) => {
        if (valid) {
          thisvm.$refs.ctcFileUpload.doFileUploadAction(function () {
            thisvm.$refs.accountBatch.submitResult(function () {
              thisvm.submitData()
            })
          })
        } else {
          return false
        }
      })
    },
    submitData (val) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params
      let url
      let data = JSON.parse(JSON.stringify(thisvm.dataForm))
      delete data.applyList
      let applyList = JSON.parse(JSON.stringify(thisvm.dataForm.applyList))
      for (let i = 0; i < applyList.length; i++) {
        applyList[i].orgId = Array.isArray(this.dataForm.applyList[i].orgId) ? this.dataForm.applyList[i].orgId[this.dataForm.applyList[i].orgId.length - 1] : applyList[i].orgId
        applyList[i].organizeFrom = { serviceId: applyList[i].organId }

        // applyList[i].serviceOrg = []
        // let serviceId = applyList[i].serviceId.split(';') || []
        // for (let j = 0; j < serviceId.length; j++) {
        //   applyList[i].serviceOrg.push({
        //     serviceId: serviceId[j]
        //   })
        // }
      }

      if (this.$route.params.type === '1') {
        url = '/account4a/update/account/create/batch'
        params = { ...data, updateList: applyList }
      } else if (this.$route.params.type === '2') {
        url = '/account4a/update/account/edit'
        params = { ...data, updateList: applyList, recordId: thisvm.$route.params.recordId }
      }
      thisvm.$http.post(url, params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg, duration: 8000 })
        }
        thisvm.$message.success('提交成功')
        thisvm.close()
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    getEchoData (id) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { recordId: id }
      thisvm.$http.get('/account4a/update/account/info', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg })
        }
        // 信息处理
        if (res.data) {
          let data = res.data
          this.dataForm.title = data.title
          // this.dataForm.applyList = data.applyList
          this.dataForm.reason = data.reason
          this.dataForm.fileId = data.fileId
          // this.dataForm.handleUserId = data.handleUserId

          let newApplyList = data.applyList
          let applyList = []
          for (let i = 0; i < newApplyList.length; i++) {
            let node = {}
            // node.type = newApplyList[i].type
            node.loginName = newApplyList[i].loginName
            node.name = newApplyList[i].name
            node.mobile = newApplyList[i].mobile
            node.email = newApplyList[i].email
            node.cardValue = newApplyList[i].cardValue
            node.orgId = newApplyList[i].orgId
            node.orgName = newApplyList[i].orgName
            node.isGfort = newApplyList[i].isGfort
            node.canLoginWay = newApplyList[i].canLoginWay
            node.sysAcctType = newApplyList[i].sysAcctType
            node.hasSubAcct = newApplyList[i].hasSubAcct
            node.organId = newApplyList[i].organId
            node.organName = newApplyList[i].organName
            node.organizeFrom = { organId: newApplyList[i].organId }
            // //
            let serviceIdList = newApplyList[i].serviceOrg ? JSON.parse(newApplyList[i].serviceOrg) : []
            let serviceId = []
            for (let j = 0; j < serviceIdList.length; j++) {
              serviceId.push(serviceIdList[j].serviceId)
            }
            node.serviceId = serviceId.join(';')
            node.serviceOrg = newApplyList[i].serviceOrg ? JSON.parse(newApplyList[i].serviceOrg) : []
            node.serviceName = newApplyList[i].serviceOrgName
            node.roles = newApplyList[i].roleNames ? newApplyList[i].roleNames.replace(/,/g, ';') : ''
            node.roleIds = newApplyList[i].roleIds.split(',')
            node.isException = false
            node.exception = {}

            applyList.push(node)
          }
          console.log(applyList)
          thisvm.$refs.accountBatch.dataList = applyList

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
    .noLoginForm{
        .el-form-item{
            margin-bottom: 22px!important;
        }
    }
</style>
