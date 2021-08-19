<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
        <el-row>
            <div class="isTips">
                <span>备注说明:</span>
                <span>1、是否已有主账号为"否"时，申请4A主账号及集中化测试平台从账号</span>
                <span>2、是否已有主账号为"是"时，申请集中化测试平台从账号；</span>
            </div>
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">申请信息(带*为必填项)</span></el-divider>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="是否已有主账号：" prop="isExistAcct">
                        <ctc-select :disabled="selectData!==''" v-model="dataForm.isExistAcct" dict-type="isExistAcct" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col v-if="dataForm.isExistAcct!=='1'" :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="是否创建从账号" prop="subAccount">
                        <el-select v-model="dataForm.subAccount">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col v-if="dataForm.isExistAcct==='1'" :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="主账号用户账号：" prop="loginName">
                        <el-input v-model="dataForm.loginName" placeholder="请输入" clearable @keyup.enter.native="getAccData('校验码','13')"></el-input>
                    </el-form-item>
                </el-col>
                <template v-if="dataForm.isExistAcct==='1'">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="姓名：">
                            <el-input :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.name" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="姓名全拼：">
                            <el-input :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.fullPinyinName" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="手机号码：">
                            <el-input :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.mobile" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="邮箱：">
                            <el-input :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.email" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="身份证号：">
                            <el-input :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.cardValue" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="部门/项目组：">
                            <ctc-project-team :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.orgId" :orgId="dataForm.orgId"></ctc-project-team>
                        </el-form-item>
                    </el-col>
                    <!--                新增（2021-05-06 15:14:11） start-->
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="VPN权限：">
                            <ctc-select :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.canLoginWay" dict-type="VPNPermission" placeholder="请选择"></ctc-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="图形堡垒权限：">
                            <ctc-select :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.isGfort" dict-type="isGfort" placeholder="请选择"></ctc-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="VPN生效时间：">
                            <el-date-picker :picker-options="pickerOptionsStart" :disabled="!vpnEffectTimeRequired||dataForm.isExistAcct==='1'" v-model="dataForm.vpnEffectTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="VPN失效时间：">
                            <el-date-picker :picker-options="pickerOptionsEnd" :disabled="!vpnExpireTimeRequired||dataForm.isExistAcct==='1'" v-model="dataForm.vpnExpireTime" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <!--                新增 end-->
                </template>
                <template v-else>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="姓名：" prop="name">
                            <el-input :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.name" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="姓名全拼：" prop="fullPinyinName">
                            <el-input :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.fullPinyinName" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="手机号码：" prop="mobile">
                            <el-input :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.mobile" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="邮箱：" prop="email">
                            <el-input :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.email" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="身份证号：" prop="cardValue">
                            <el-input :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.cardValue" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="部门/项目组：" prop="orgId">
                            <ctc-project-team jurisdiction :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.orgId" :orgId="dataForm.orgId"></ctc-project-team>
                        </el-form-item>
                    </el-col>
                    <!--                新增（2021-05-06 15:14:11） start-->
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
                    <!--                新增 end-->
                </template>
<!--                <el-col v-if="dataForm.isExistAcct!=='1'" :xs="24" :sm="12" :md="12" :lg="12" :xl="8">-->
<!--                    <el-form-item label="地域ID：" prop="areaId">-->
<!--                        <ctc-select :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.areaId" dict-type="regionId" placeholder="请选择"></ctc-select>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
                <el-col v-if="dataForm.isExistAcct!=='1'" :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="账号类型：" prop="acctType">
                        <ctc-select v-model="dataForm.acctType" dict-type="accType" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col v-if="dataForm.subAccount!=='0'" :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="所属机构：" prop="organId">
                        <ctc-project-organize-table v-model="dataForm.organId" :organizeId.sync="organId" placeholder="请选择所属机构"></ctc-project-organize-table>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="applyReason" label="申请原因：">
                        <el-input v-model="dataForm.applyReason" placeholder="请输入" :rows="5" type="textarea"></el-input>
                    </el-form-item>
                </el-col>

<!--                <el-col v-if="dataForm.isExistAcct!=='1'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">-->
<!--                    <el-form-item label="审批附件：" prop="fileId">-->
<!--                        <div style="color:red;line-height: 1.8">-->
<!--                          <span>安全中心对审批附件有以下要求：</span><br>-->
<!--                          <span>1-信息技术中心人员申请4A主账号时，需部门领导知晓、同意</span><br>-->
<!--                          <span>2-其他移动机构申请4A主账号时，需局方直属领导，或局方分管领导，或局方部门领导知晓、同意</span><br>-->
<!--                          <span>请上传相关领导知晓、同意的审批材料，支持截图、邮件附件等形式。</span>-->
<!--                        </div>-->
<!--                        <ctc-file-upload ref="ctcFileUpload" v-model="dataForm.fileId"></ctc-file-upload>-->
<!--                    </el-form-item>-->
<!--                </el-col>-->
            </el-form>
        </el-row>
        <div align="center">
            <el-button type="primary" size="small" @click="$emit('close')">取消</el-button>
            <el-button :disabled="isHasOrgId" type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
        </div>
        <check-code v-if="checkCodeVisible" ref="checkCode" @refresh="getAccDataList" @init="checkCodeVisible = false"></check-code>
        <fix-message v-if="fixMessageVisible" ref="fixMessage" @refresh="getAccDataList" @init="fixMessageVisible = false,$emit('close', 'refresh')"></fix-message>
    </el-card>
</template>

<script>
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import checkCode from '@/views/modules/accountManagement4A/checkCode'
import fixMessage from '@/views/modules/accountManagement4A/fixMessage'
import { isEmail, isIDCard, isMobile } from '@/utils/validate'
export default {
  name: 'accountApplication',
  components: {
    CtcProjectOrganizeTable, checkCode, fixMessage
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
    'dataForm.isExistAcct' (newVal, oldVal) {
      this.dataForm.loginName = ''
      this.isHasOrgId = false

      let f = this.dataForm
      f.name = ''
      f.fullPinyinName = ''
      f.mobile = ''
      f.email = ''
      f.cardValue = ''
      f.orgId = ''
      f.organId = ''
      f.canLoginWay = ''
      f.isGfort = ''
      f.vpnEffectTime = ''
      f.vpnExpireTime = ''
      f.applyReason = ''
      f.subAccount = ''

      this.$refs['dataForm'].clearValidate(['name'])
      this.$refs['dataForm'].clearValidate(['fullPinyinName'])
      this.$refs['dataForm'].clearValidate(['mobile'])
      this.$refs['dataForm'].clearValidate(['email'])
      this.$refs['dataForm'].clearValidate(['cardValue'])
      this.$refs['dataForm'].clearValidate(['orgId'])
      this.$refs['dataForm'].clearValidate(['areaId'])
      this.$refs['dataForm'].clearValidate(['acctType'])
      this.$refs['dataForm'].clearValidate(['organId'])
      this.$refs['dataForm'].clearValidate(['fileId'])

      this.$refs['dataForm'].clearValidate(['canLoginWay'])
      this.$refs['dataForm'].clearValidate(['isGfort'])
      this.$refs['dataForm'].clearValidate(['vpnEffectTime'])
      this.$refs['dataForm'].clearValidate(['vpnExpireTime'])

      this.$refs['dataForm'].clearValidate(['applyReason'])
      this.$refs['dataForm'].clearValidate(['subAccount'])

      // if (newVal !== '1') {
      //   this.$nextTick(() => {
      //     this.initFileUpload()
      //   })
      // }
    },
    'dataForm.vpnEffectTime' (newVal, oldVal) {
      if (oldVal) {
        this.dataForm.vpnExpireTime = ''
      }
    }
  },
  props: {
    selectData: [Object, String]
  },
  data () {
    return {
      isHasOrgId: false,
      organId: '',
      checkCodeVisible: false,
      fixMessageVisible: false,
      dataForm: {
        isExistAcct: '0',
        loginName: '',
        name: '',
        fullPinyinName: '',
        mobile: '',
        email: '',
        cardValue: '',
        orgId: '',
        // areaId: '',
        acctType: '',
        organId: '',
        fileId: '',
        canLoginWay: '',
        isGfort: '',
        vpnEffectTime: '',
        vpnExpireTime: '',
        applyReason: '',
        subAccount: '1'
      },
      vpnEffectTimeRequired: true,
      vpnExpireTimeRequired: true,
      pickerOptionsStart: {
        disabledDate: time => {
          const dateVal = new Date().getTime()
          return time.getTime() < dateVal - 86400000
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
  computed: {
    dataRule () {
      // let validateEmail = (rule, value, callback) => {
      //     if (!isEmail(value)) {
      //         return callback(new Error(this.$t('validate.format', { 'attr': this.$t('user.email') })))
      //     }
      //     callback()
      // }
      // let validateID = (rule, value, callback) => {
      //     if (!isIDCard(value)) {
      //         return callback(new Error(this.$t('validate.format', { 'attr': '身份证号码' })))
      //     }
      //     callback()
      // }
      // let validateMobile = (rule, value, callback) => {
      //     if (!isMobile(value)) {
      //         return callback(new Error(this.$t('validate.format', { 'attr': '手机号码' })))
      //     }
      //     callback()
      // }
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
        isExistAcct: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        loginName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
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
          { required: true, message: '请输入', trigger: 'change' }
        ],
        areaId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        acctType: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        organId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        fileId: [
          { required: true, message: '请上传附件', trigger: 'change' }
        ],
        canLoginWay: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        isGfort: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        vpnEffectTime: [{ required: this.vpnEffectTimeRequired, message: '请选择', trigger: 'change' }],
        vpnExpireTime: [{ required: this.vpnExpireTimeRequired, message: '请选择', trigger: 'change' }],
        applyReason: [{ required: true, message: '请输入', trigger: 'blur' }],
        subAccount: [{ required: true, message: '请选择', trigger: 'change' }]
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
    setTimeout(function () {
      thisvm.organId = thisvm.dataForm.organId
    }, 500)
  },
  methods: {
    submitResult (res) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (this.$store.state.user.id === 0) {
            this.checkCodeVisible = true
            this.$nextTick(() => {
              this.$refs.checkCode.init('申请校验码', 'submitData')
            })
          } else {
            this.submitData()
          }
        } else {
          return false
        }
      })
    },
    submitData (val) {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let accounts = []
      let { fileId, ...account } = this.dataForm
      account.orgId = Array.isArray(this.dataForm.orgId) ? this.dataForm.orgId[this.dataForm.orgId.length - 1] : account.orgId
      if (this.dataForm.vpnEffectTime) {
        account.vpnEffectTime = this.dataForm.vpnEffectTime.replace(/-/g, '')
        account.vpnExpireTime = this.dataForm.vpnExpireTime.replace(/-/g, '')
      }
      accounts.push(account)
      delete account.applyReason
      let params = {}
      if (val) {
        params = { accounts: accounts, fileId: this.dataForm.fileId, ...val }
        // params = { params, ...val }
      } else {
        params = { accounts: accounts, applyReason: this.dataForm.applyReason, fileId: this.dataForm.fileId }
      }
      thisvm.$http.post(this.$store.state.user.id === 0 ? '/account4a/home/register/acct/add' : '/account4a/account/add', params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          if (this.$store.state.user.id === 0) {
            this.$refs.checkCode.getCaptcha()
          }
          return thisvm.$message.error({ message: res.msg, duration: 8000 })
        }
        // if (this.$store.state.user.id === 0) {
        //   this.checkCodeVisible = false
        // }
        // this.$message.success('提交成功，待审批')
        if (this.dataForm.isExistAcct === '1') {
          this.$message.success('创建成功')
        } else {
          if (res.data) {
            this.open(res.data)
          } else {
            this.$message.success('提交成功，待审批')
            this.$emit('close', 'refresh')
          }
        }
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    open (msg) {
      this.fixMessageVisible = true
      this.$nextTick(() => {
        this.$refs.fixMessage.init('提交成功，待审批', msg)
      })
    },
    initFileUpload () {
      // this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 1, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
      this.$refs.ctcFileUpload.init()
    },
    getAccData (title) {
      if (this.$store.state.user.id === 0) {
        this.checkCodeVisible = true
        this.$nextTick(() => {
          this.$refs.checkCode.init(title, 'getAccDataList')
        })
      } else {
        this.getAccDataList()
      }
    },
    getAccDataList (val) {
      let thisvm = this
      // 默认先清空目录树缓存数据
      let f = this.dataForm
      f.name = ''
      f.fullPinyinName = ''
      f.mobile = ''
      f.email = ''
      f.cardValue = ''
      f.orgId = ''
      f.organId = ''
      this.organId = ''
      thisvm.$ctcLoading.open()
      thisvm.$http.get(this.$store.state.user.id === 0 ? 'account4a/home/register/acct/info?loginName=' + thisvm.dataForm.loginName + '&uuid=' + val.uuid + '&captcha=' + val.captcha : 'account4a/account/info?loginName=' + thisvm.dataForm.loginName).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          if (this.$store.state.user.id === 0) {
            this.$refs.checkCode.getCaptcha()
          }
          return thisvm.$message.error(res.msg)
        }
        if (this.$store.state.user.id === 0) {
          this.checkCodeVisible = false
        }
        // let f = this.dataForm
        f.name = res.data.name
        f.fullPinyinName = res.data.loginName
        f.mobile = res.data.phone
        f.email = res.data.email
        f.cardValue = res.data.idCard
        f.orgId = res.data.orgId
        f.organId = res.data.organId
        this.organId = res.data.organId
        f.canLoginWay = res.data.canLoginWay
        f.isGfort = res.data.isGfort
        f.vpnEffectTime = res.data.vpnEffectTime.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
        f.vpnExpireTime = res.data.vpnExpireTime.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
        if (res.data.organId) {
          this.isHasOrgId = true
          this.$message.warning('当前主账号下有从账号，不可申请')
        }
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
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
        }
    }
</style>
