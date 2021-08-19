<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="70%" class="add-require" append-to-body>
        <el-row>
            <div v-if="updataType!=='3'" class="isTips">
                <span>备注说明:</span>
                <span>1、是否已有主账号为"否"时，申请4A主账号及集中化测试平台从账号</span>
                <span>2、是否已有主账号为"是"时，申请集中化测试平台从账号；</span>
            </div>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
                <template v-if="updataType!=='3'">
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="是否已有主账号：" prop="isExistAcct">
                            <ctc-select disabled v-model="dataForm.isExistAcct" dict-type="isExistAcct" placeholder="请选择"></ctc-select>
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
                            <el-input disabled v-model="dataForm.loginName" placeholder="请输入" clearable></el-input>
                        </el-form-item>
                    </el-col>
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
                        <el-form-item label="身份证：" prop="cardValue">
                            <el-input :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.cardValue" placeholder="请输入姓名" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="部门/项目组：" prop="orgId">
                            <ctc-project-team jurisdiction :disabled="dataForm.isExistAcct==='1'" backName :organName.sync="dataForm.orgName" v-model="dataForm.orgId" :orgId="dataForm.orgId"></ctc-project-team>
                        </el-form-item>
                    </el-col>
                    <template v-if="dataForm.isExistAcct!=='1'">
<!--                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">-->
<!--                            <el-form-item label="地域ID：" prop="areaId">-->
<!--                                <ctc-select v-model="dataForm.areaId" dict-type="regionId" placeholder="请选择"></ctc-select>-->
<!--                            </el-form-item>-->
<!--                        </el-col>-->
                        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                            <el-form-item label="账号类型：" prop="acctType">
                                <ctc-select v-model="dataForm.acctType" dict-type="accType" placeholder="请选择"></ctc-select>
                            </el-form-item>
                        </el-col>
                    </template>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="所属机构：" prop="organId">
                            <ctc-project-organize-table v-model="dataForm.organId" :organizeId.sync="organId" backName :organName.sync="dataForm.organName" placeholder="请选择所属机构"></ctc-project-organize-table>
                        </el-form-item>
                    </el-col>

                    <!--                新增（2021-05-06 15:14:11） start-->
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="VPN权限：" prop="canLoginWay">
                            <ctc-select :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.canLoginWay" dict-type="VPNPermission" placeholder="请选择"></ctc-select>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="图形堡垒权限：" prop="isGfort">
                            <ctc-select :disabled="dataForm.isExistAcct==='1'" v-model="dataForm.isGfort" dict-type="isGfort" placeholder="请选择"></ctc-select>
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
                <template v-else>
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
                            <el-input v-model="dataForm.cardValue" placeholder="请输入姓名" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                        <el-form-item label="部门/项目组：" prop="orgId">
                            <ctc-project-team jurisdiction v-model="dataForm.orgId" :orgId="dataForm.orgId"></ctc-project-team>
                        </el-form-item>
                    </el-col>
<!--                    <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">-->
<!--                        <el-form-item label="地域ID：" prop="areaId">-->
<!--                            <ctc-select v-model="dataForm.areaId" dict-type="regionId" placeholder="请选择"></ctc-select>-->
<!--                        </el-form-item>-->
<!--                    </el-col>-->
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
                </template>
            </el-form>
        </el-row>
        <div align="center">
            <el-button type="primary" size="small" @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import { isEmail, isIDCard, isMobile } from '@/utils/validate'
export default {
  name: 'updataList',
  components: {
    CtcProjectOrganizeTable
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogVisible: false,
      title: '',
      type: '',
      index: '',
      updataType: '',
      organId: '',
      dataForm: {},
      // dataRule:
      vpnEffectTimeRequired: true,
      vpnExpireTimeRequired: true,
      vpnEffectTime: '',
      pickerOptionsStart: {
        disabledDate: time => {
          const dateVal = new Date(this.vpnEffectTime).getTime()
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
          { required: true, message: '请选择', trigger: 'change' }
        ],
        areaId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        acctType: [
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
        vpnEffectTime: [
          { required: this.vpnEffectTimeRequired, message: '请选择', trigger: 'change' }
        ],
        vpnExpireTime: [
          { required: this.vpnExpireTimeRequired, message: '请选择', trigger: 'change' }
        ],
        subAccount: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  watch: {
    dialogVisible (newVal, oldVal) {
      if (!newVal) {
        this.$emit('init')
      }
    },
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
    // ,
    // 'dataForm.areaId' (newVal, oldVal) {
    //   if (this.updataType !== '3') {
    //     if (newVal === '2') {
    //       this.dataForm.acctType = '6'
    //     } else {
    //       if (this.dataForm.acctType === '6') {
    //         this.dataForm.acctType = ''
    //       }
    //     }
    //   }
    // },
    // 'dataForm.acctType' (newVal, oldVal) {
    //   if (this.updataType !== '3') {
    //     if (newVal === '6') {
    //       this.dataForm.areaId = '2'
    //     } else {
    //       if (this.dataForm.areaId === '2') {
    //         this.dataForm.areaId = ''
    //       }
    //     }
    //   }
    // }
  },
  methods: {
    init (title, type, data, index, updataType) {
      console.log(55)
      this.dialogVisible = true
      this.title = title
      this.type = type
      this.index = index
      this.updataType = updataType
      let newData = data
      for (var i in newData) {
        if (newData[i] === null) {
          newData[i] = ''
        }
      }
      let newdata = JSON.parse(JSON.stringify(newData))
      if (newdata.vpnEffectTime) {
        newdata.vpnEffectTime = newdata.vpnEffectTime.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
        newdata.vpnExpireTime = newdata.vpnExpireTime.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
      }
      // this.dataForm = JSON.parse(JSON.stringify(newData))
      this.dataForm = newdata
      this.vpnEffectTime = this.dataForm.vpnEffectTime
      let thisvm = this
      setTimeout(function () {
        thisvm.organId = thisvm.dataForm.organId
      }, 500)
    },
    submitResult () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (this.updataType !== '3') {
            this.validateForm('/account4a/account/applyAccountValidator2')
          } else {
            this.validateForm('/account4a/account/updateAccountValidator2')
            // this.dialogVisible = false
            // this.dataForm.isException = false
            // this.$emit('refresh', this.index, this.dataForm)
          }
        } else {
          return false
        }
      })
    },
    validateForm (url) {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let { fileId, exception, isException, ...account } = this.dataForm
      account.orgId = Array.isArray(this.dataForm.orgId) ? this.dataForm.orgId[this.dataForm.orgId.length - 1] : account.orgId
      if (this.dataForm.vpnEffectTime) {
        account.vpnEffectTime = this.dataForm.vpnEffectTime.replace(/-/g, '')
        account.vpnExpireTime = this.dataForm.vpnExpireTime.replace(/-/g, '')
      }
      let params = { ...account }
      console.log(params)
      thisvm.$http.post(url, params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg, duration: 3000 })
        }
        console.log(res.data)
        this.dialogVisible = false
        this.dataForm.isException = false
        this.$emit('refresh', this.index, this.dataForm)
        // this.$emit('refresh', this.index, res.data)
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    .add-require {
        .selected {
            margin-top: 10px;
            text-align: right;
        }
    }
    .isTips{
        color: red;
        margin-bottom: 10px;
        span{
            display: block;
        }
    }
</style>
