<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail">
        <el-row>
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">申请信息(带*为必填项)</span></el-divider>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="姓名：" prop="name">
                        <el-input v-model="dataForm.name" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="手机号码：" prop="mobile">
                        <el-input v-model="dataForm.mobile" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="邮箱：" prop="email">
                        <el-input v-model="dataForm.email" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="身份证：" prop="cardValue">
                        <el-input v-model="dataForm.cardValue" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="部门/项目组：" prop="orgId">
                        <ctc-project-team v-model="dataForm.orgId" :orgId="dataForm.orgId"></ctc-project-team>
                    </el-form-item>
                </el-col>
<!--                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">-->
<!--                    <el-form-item label="地域：" prop="areaId">-->
<!--                        <ctc-select :disabled="acctType==='6'" v-model="dataForm.areaId" dict-type="regionId" placeholder="请选择"></ctc-select>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">-->
<!--                    <el-form-item label="账号类型：" prop="accType">-->
<!--                        <ctc-select v-model="dataForm.accType" dict-type="accType" placeholder="请选择"></ctc-select>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="所属机构：">
                        <ctc-project-organize-table v-model="dataForm.organId" :organizeId.sync="organId" placeholder="请选择所属机构"></ctc-project-organize-table>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="VPN权限：" prop="canLoginWay">
                        <ctc-select v-model="dataForm.canLoginWay" dict-type="VPNPermission" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="图形堡垒权限：" prop="isGfort">
                  <ctc-select v-model="dataForm.isGfort" dict-type="isGfort" placeholder="请选择"></ctc-select>
                </el-form-item>
              </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="VPN生效时间：" prop="vpnEffectTime">
                        <el-date-picker :picker-options="pickerOptionsStart" :disabled="!vpnEffectTimeRequired" v-model="dataForm.vpnEffectTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="VPN失效时间：" prop="vpnExpireTime">
                        <el-date-picker :picker-options="pickerOptionsEnd" :disabled="!vpnExpireTimeRequired" v-model="dataForm.vpnExpireTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
<!--                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">-->
<!--                    <el-form-item label="审批附件：" prop="fileId">-->
<!--                      <div style="color:red;line-height: 1.8">-->
<!--                        <span>安全中心对审批附件有以下要求：</span><br>-->
<!--                        <span>1-信息技术中心人员申请4A主账号时，需部门领导知晓、同意</span><br>-->
<!--                        <span>2-其他移动机构申请4A主账号时，需局方直属领导，或局方分管领导，或局方部门领导知晓、同意</span><br>-->
<!--                        <span>请上传相关领导知晓、同意的审批材料，支持截图、邮件附件等形式。</span>-->
<!--                      </div>-->
<!--                        <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.fileId"></ctc-file-upload>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
            </el-form>
            <div align="center">
                <el-button type="primary" size="small" @click="$emit('close')">取消</el-button>
                <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
            </div>
        </el-row>
        <fix-message v-if="fixMessageVisible" ref="fixMessage" @init="fixMessageVisible = false,$emit('close', 'refresh')"></fix-message>
    </el-card>
</template>

<script>
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import mixinViewModule from '@/mixins/view-module'
import fixMessage from '@/views/modules/accountManagement4A/fixMessage'
import { isEmail, isIDCard, isMobile } from '@/utils/validate'
export default {
  name: 'accountApplication',
  mixins: [mixinViewModule],
  components: {
    CtcProjectOrganizeTable, fixMessage
  },
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/participant/pass',
        getDataListIsPage: true
      },
      organId: '',
      fixMessageVisible: false,
      dataForm: {
        loginName: '',
        name: '',
        mobile: '',
        email: '',
        cardValue: '',
        orgId: '',
        areaId: '',
        organId: '',
        canLoginWay: '',
        isGfort: '',
        vpnEffectTime: '',
        vpnExpireTime: '',
        fileId: ''
      },
      acctType: '',
      // dataRule: ,
      vpnEffectTimeRequired: true,
      vpnExpireTimeRequired: true,
      vpnEffectTime: '',
      pickerOptionsStart: {
        disabledDate: time => {
          const dateVal = new Date(this.vpnEffectTime).getTime()
          return time.getTime() < dateVal
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          // console.log(2)
          if (this.dataForm.vpnEffectTime) {
            let date = new Date(this.dataForm.vpnEffectTime)
            date.setMonth(date.getMonth() + 6)
            let beginDateVal = new Date(this.dataForm.vpnEffectTime).getTime()
            return time.getTime() > date.getTime() || time.getTime() < beginDateVal - 86400000
          } else {
            return false
          }
        }
      }
    }
  },
  props: {
    selectData: Object
  },
  computed: {
    dataRule () {
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
        name: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        fullPinyinName: [
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
          { required: true, message: '请选择', trigger: 'change' }
        ],
        areaId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        organId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        canLoginWay: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        isGfort: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        vpnEffectTime: [{ required: this.vpnEffectTimeRequired, message: '请选择', trigger: 'change' }],
        vpnExpireTime: [{ required: this.vpnExpireTimeRequired, message: '请选择', trigger: 'change' }],
        fileId: [
          { required: true, message: '请上传附件', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'dataForm.canLoginWay' (newVal, oldVal) {
      this.$nextTick(() => {
        if (newVal !== '1') {
          this.vpnEffectTimeRequired = true
          this.vpnExpireTimeRequired = true
        } else {
          this.vpnEffectTimeRequired = false
          this.vpnExpireTimeRequired = false
          this.dataForm.vpnEffectTime = ''
          this.dataForm.vpnExpireTime = ''
        }
      })
    },
    'dataForm.vpnEffectTime' (newVal, oldVal) {
      if (oldVal) {
        this.dataForm.vpnExpireTime = ''
      }
    }
  },
  mounted () {
    // this.initFileUpload()
    let thisvm = this
    Object.keys(thisvm.selectData).forEach(function (key) {
      Object.keys(thisvm.dataForm).forEach(function (key1) {
        if (key === key1) {
          if (thisvm.selectData[key] === null) {
            thisvm.dataForm[key1] = ''
          } else {
            thisvm.dataForm[key1] = thisvm.selectData[key]
          }
        }
      })
    })
    this.vpnEffectTime = this.dataForm.vpnEffectTime
    setTimeout(function () {
      thisvm.organId = thisvm.dataForm.organId
      thisvm.acctType = thisvm.selectData.acctType
    }, 500)
    // this.dataForm.canLoginWay = '0'
    // this.dataForm.vpnEffectTime = this.setNowFormatDate(0)
    // this.dataForm.vpnExpireTime = this.setNowFormatDate(6)
  },
  methods: {
    // setNowFormatDate (num) {
    //   let date = new Date()
    //   date.setMonth(date.getMonth() + num)
    //   let month = (date.getMonth() + 1).toString().padStart(2, '0')
    //   let strDate = date.getDate().toString().padStart(2, '0')
    //   // 时间格式yyyy-MM-dd
    //   return `${date.getFullYear()}${month}${strDate}`
    // },
    submitResult (res) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.submitData()
        } else {
          return false
        }
      })
      // this.submitData()
    },
    submitData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let accounts = []
      let { fileId, ...account } = this.dataForm
      account.orgId = Array.isArray(this.dataForm.orgId) ? this.dataForm.orgId[this.dataForm.orgId.length - 1] : account.orgId
      account.vpnExpireTime = account.vpnExpireTime.replace(/-/g, '').substring(0, 8)
      account.vpnEffectTime = account.vpnEffectTime.replace(/-/g, '').substring(0, 8)
      accounts.push(account)
      let params = { accounts: accounts, fileId: this.dataForm.fileId }
      thisvm.$http.post('/account4a/account/update', params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg, duration: 8000 })
        }
        console.log(1)
        this.open(res.data)
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    open (msg) {
      let $this = this
      $this.fixMessageVisible = true
      $this.$nextTick(() => {
        $this.$refs.fixMessage.init('提交成功，待审批', msg)
        // $this.$emit('close', 'refresh')
      })
    },
    initFileUpload () {
      // this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 1, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
      this.$refs.ctcFileUpload.init()
    }
  }
}
</script>

<style scoped>
    .el-form{
        display: inline-block;
    }
</style>
