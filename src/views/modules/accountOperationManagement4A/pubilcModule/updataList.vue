<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="70%" class="add-require" append-to-body>
    <el-card shadow="never" class="aui-card--fill defect-data-detail">
      <el-row>
        <!--      {{dataForms}}-->
<!--        <div class="isTips">-->
<!--          <span>温馨提示:</span>-->
<!--          <span>1、4A主从账号申请：同时申请4A主账号和集中化测试平台从账号</span>-->
<!--          <span>2、集测从账号申请：已有4A平台主账号，申请集中化测试平台的从账号</span>-->
<!--        </div>-->
        <!--      {{dataForm}}-->
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
          <!--        1 批量申请 2 批量变更-->
          <template v-if="updataType==='1'">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="申请类型：" prop="type">
                <el-radio-group disabled v-model="dataForm.type">
                  <el-radio :label="'0'">4A主从账号申请</el-radio>
                  <el-radio :label="'2'">集测从账号申请</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <template v-if="dataForm.type==='0'">
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="姓名：" prop="name">
                  <el-input v-model="dataForm.name" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="手机号码：" prop="mobile">
                  <el-input v-model="dataForm.mobile" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="邮箱：" prop="email">
                  <el-input v-model="dataForm.email" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="身份证号：" prop="cardValue">
                  <el-input v-model="dataForm.cardValue" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="部门/项目组：" prop="orgId">
                  <ctc-project-team jurisdiction accountApp v-model="dataForm.orgId"></ctc-project-team>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="图形堡垒权限：" prop="isGfort">
                  <ctc-select v-model="dataForm.isGfort" dict-type="isGfort" placeholder="请选择"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="VPN权限：" prop="canLoginWay">
                  <ctc-select v-model="dataForm.canLoginWay" dict-type="VPNPermission" placeholder="请选择"></ctc-select>
                </el-form-item>
              </el-col>
            </template>
            <template v-else-if="dataForm.type==='2'">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                  <el-form-item label="4A主账号：">
                    <el-input v-model="dataForm.loginName" placeholder="请输入" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="姓名：">
                  <el-input disabled v-model="dataForm.name" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="手机号码：">
                  <el-input disabled v-model="dataForm.mobile" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="邮箱：">
                  <el-input disabled v-model="dataForm.email" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="身份证号：">
                  <el-input disabled v-model="dataForm.cardValue" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="部门/项目组：">
                  <ctc-project-team disabled v-model="dataForm.orgId"></ctc-project-team>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="图形堡垒权限：">
                  <ctc-select disabled v-model="dataForm.isGfort" dict-type="isGfort" placeholder="请选择"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item label="VPN权限：">
                  <ctc-select disabled v-model="dataForm.canLoginWay" dict-type="VPNPermission" placeholder="请选择"></ctc-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="账号类型：" prop="sysAcctType">
                <ctc-select v-model="dataForm.sysAcctType" dict-type="accTypeNew" placeholder="请选择"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="所属机构/部门/科室：" prop="organId">
                <!--            {{dataForm.organization}}-->
                <ctc-tree-organ ref="ctcTreeOrgan" v-model="dataForm.organization" :pid="dataForm.sysAcctType" type="radio" placeholder="请选择所属机构/部门/科室"></ctc-tree-organ>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="16">
              <el-form-item label="服务机构/部门/科室：" prop="serviceId">
                <!--            {{dataForm.organizationGs}}-->
                <ctc-tree-organ-serve ref="ctcTreeOrganServe" v-model="dataForm.organizationGs" type="checkbox" :jg="dataForm.organization" :acct-type="dataForm.sysAcctType" placeholder="请选择服务机构/部门/科室"></ctc-tree-organ-serve>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="账号角色：" prop="roleIds">
                <ctc-select-role v-model="dataForm.roleIds" :pid="dataForm.organization" multiple placeholder="请选择"></ctc-select-role>
              </el-form-item>
            </el-col>
          </template>
          <template v-else-if="updataType==='2'">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="4A主账号：" prop="loginName">
                <el-input disabled v-model="dataForm.loginName" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="手机号码：" prop="mobile">
                <el-input v-model="dataForm.mobile" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="dataForm.email" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="身份证号：" prop="cardValue">
                <el-input v-model="dataForm.cardValue" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="部门/项目组：" prop="orgId">
                <ctc-project-team v-model="dataForm.orgId"></ctc-project-team>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="图形堡垒权限：" prop="isGfort">
                <ctc-select v-model="dataForm.isGfort" dict-type="isGfort" placeholder="请选择"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="VPN权限：" prop="canLoginWay">
                <ctc-select v-model="dataForm.canLoginWay" dict-type="VPNPermission" placeholder="请选择"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="账号类型：" prop="">
                <ctc-select disabled v-model="dataForm.sysAcctType" dict-type="accTypeNew" placeholder="请选择"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
              <el-form-item label="所属机构/部门/科室：" prop="">
                <!--            {{dataForm.organization}}-->
                <ctc-tree-organ disabled ref="ctcTreeOrgan" v-model="dataForm.organization" :pid="dataForm.sysAcctType" type="radio" placeholder="请选择所属机构/部门/科室"></ctc-tree-organ>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="16">
              <el-form-item label="服务机构/部门/科室：" prop="">
                <ctc-tree-organ-serve disabled ref="ctcTreeOrganServe" v-model="dataForm.organizationGs" type="checkbox" :jg="dataForm.organization" :acct-type="dataForm.sysAcctType" placeholder="请选择服务机构/部门/科室"></ctc-tree-organ-serve>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <el-form-item label="账号角色：" :prop="hasSubAcct?'roleIds':''">
                <ctc-select-role :disabled="!hasSubAcct" v-model="dataForm.roleIds" :pid="dataForm.organization" multiple placeholder="请选择"></ctc-select-role>
              </el-form-item>
            </el-col>
          </template>
        </el-form>
      </el-row>
      <div align="center">
        <el-button type="primary" size="small" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
      </div>
    </el-card>
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
      dataForm: {
        loginName: '',
        type: '0',
        name: '',
        mobile: '',
        email: '',
        cardValue: '',
        orgId: [],
        isGfort: '',
        canLoginWay: '',
        sysAcctType: '',
        organId: '',
        serviceId: '',
        organization: [], // 所属机构
        organizationGs: [], // 归属机构
        roleIds: []// 账号角色
      },
      hasSubAcct: false,
      edit: false,
      dataForms: {}
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
        type: [
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
        sysAcctType: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        canLoginWay: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        isGfort: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        organId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        serviceId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        roleIds: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    dialogVisible (newVal, oldVal) {
      if (!newVal) {
        this.$emit('init')
      }
    },
    // 所属机构
    'dataForm.organization' (newVal, oldVal) {
      if (!this.edit) {
        console.log('所属机构')
        if (newVal.length > 0) {
          this.dataForm.organId = newVal[newVal.length - 1]
        } else {
          this.dataForm.organId = ''
        }
      }
    },
    // 服务机构
    'dataForm.organizationGs' (newVal, oldVal) {
      if (!this.edit) {
        console.log('服务机构')
        if (newVal.length > 0) {
          this.dataForm.serviceId = ''
          let ids = []
          for (let i = 0; i < newVal.length; i++) {
            ids.push(newVal[i][newVal[i].length - 1])
          }
          this.dataForm.serviceId = ids.join(';')
        } else {
          this.dataForm.serviceId = ''
        }
      }
    }
  },
  methods: {
    init (title, type, data, index, updataType) {
      console.log(55)
      let thisvm = this
      thisvm.edit = true
      thisvm.dialogVisible = true
      thisvm.title = title
      thisvm.type = type
      thisvm.index = index
      // updataType 1批量申请 2批量变更
      thisvm.updataType = updataType
      if (updataType === '1') {
        let newData = JSON.parse(JSON.stringify(data))
        // this.dataForm = newData
        thisvm.dataForm.loginName = newData.loginName
        thisvm.dataForm.type = newData.type + ''
        thisvm.dataForm.name = newData.name
        thisvm.dataForm.mobile = newData.mobile
        thisvm.dataForm.email = newData.email
        thisvm.dataForm.cardValue = newData.cardValue
        thisvm.dataForm.orgId = newData.orgId
        thisvm.dataForm.isGfort = newData.isGfort
        thisvm.dataForm.canLoginWay = newData.canLoginWay
        thisvm.dataForm.sysAcctType = newData.sysAcctType + ''
        thisvm.dataForm.organId = newData.organId
        thisvm.dataForm.serviceId = newData.serviceId
        // thisvm.dataForm.roleIds = newData.roleIds
        thisvm.dataForm.isException = newData.isException

        setTimeout(() => {
          let ssjgId = newData.organizeFrom.organId
          thisvm.dataForm.organization = [ssjgId, newData.organId]
          setTimeout(() => {
            thisvm.dataForm.roleIds = newData.roleIds

            thisvm.$nextTick(() => {
              thisvm.$refs.ctcTreeOrgan.init({ name: data.organName })
              let nameList = []
              let serviceId = newData.serviceId.split(';') || ''
              let seviceName = newData.serviceName ? newData.serviceName.split(',') : []
              for (let i = 0; i < seviceName.length; i++) {
                let node = {}
                node.name = seviceName[i]
                node.id = serviceId[i]
                node.ids = [serviceId[i]]
                if (serviceId[i] === newData.organId) {
                  node.disabled = true
                }
                nameList.push(node)
              }
              console.log(555)
              thisvm.$refs.ctcTreeOrganServe.init(nameList)
              thisvm.edit = false
            })
          }, 100)
        }, 100)

        thisvm.dataForms = JSON.parse(JSON.stringify(data))
      } else if (updataType === '2') {
        let newData = JSON.parse(JSON.stringify(data))
        thisvm.dataForm.loginName = newData.loginName
        // thisvm.dataForm.type = newData.type + ''
        thisvm.dataForm.name = newData.name
        thisvm.dataForm.mobile = newData.mobile
        thisvm.dataForm.email = newData.email
        thisvm.dataForm.cardValue = newData.cardValue
        thisvm.dataForm.orgId = newData.orgId
        thisvm.dataForm.isGfort = newData.isGfort !== null ? newData.isGfort + '' : ''
        thisvm.dataForm.canLoginWay = newData.canLoginWay !== null ? newData.canLoginWay + '' : ''
        thisvm.dataForm.sysAcctType = newData.sysAcctType !== null ? newData.sysAcctType + '' : ''
        thisvm.dataForm.organId = newData.organId ? newData.organId : ''
        thisvm.dataForm.serviceId = newData.serviceId ? newData.serviceId : ''
        // thisvm.dataForm.roleIds = newData.roleIds
        thisvm.dataForm.isException = newData.isException
        thisvm.dataForm.serviceOrg = newData.serviceOrg

        this.dataForm.hasSubAcct = newData.hasSubAcct
        this.hasSubAcct = newData.hasSubAcct
        setTimeout(() => {
          thisvm.dataForm.organization = []
          if (newData.organizeFrom && newData.organizeFrom.organId) {
            thisvm.dataForm.organization.push(newData.organizeFrom.organId)
          }
          if (newData.organId) {
            thisvm.dataForm.organization.push(newData.organId)
          }
          setTimeout(() => {
            thisvm.dataForm.roleIds = newData.roleIds ? newData.roleIds : []

            thisvm.$nextTick(() => {
              if (data.organName) {
                thisvm.$refs.ctcTreeOrgan.init({ name: data.organName })
              }
              if (newData.serviceName) {
                let nameList = []
                let serviceId = newData.serviceOrg ? newData.serviceOrg : []
                let seviceName = newData.serviceName ? newData.serviceName.split(',') : []
                for (let i = 0; i < seviceName.length; i++) {
                  let node = {}
                  node.name = seviceName[i]
                  node.id = serviceId[i].serviceId
                  node.ids = [serviceId[i].serviceId]
                  if (serviceId[i] === newData.organId) {
                    node.disabled = true
                  }
                  nameList.push(node)
                }
                console.log(nameList)
                thisvm.$refs.ctcTreeOrganServe.init(nameList)
              }
              thisvm.edit = false
            })
          }, 100)
        }, 100)

        thisvm.dataForms = JSON.parse(JSON.stringify(data))
      }
    },
    submitResult () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          console.log(6666)
          // 1批量申请 2批量变更
          if (this.updataType === '1') {
            this.validateForm('/account4a/apply/account/applyAccountValidator2')
          } else if (this.updataType === '2') {
            this.validateForm('/account4a/update/account/updateAccountValidator2')
            // this.dialogVisible = false
            // this.dataForm.isException = false
            // this.$emit('refresh', this.index, this.dataForm)
          }
        } else {
          console.log(7777)
          return false
        }
      })
    },
    validateForm (url) {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let { organization, organizationGs, organId, serviceId, isException, ...account } = this.dataForm
      account.organizeFrom = { serviceId: this.dataForm.organId }
      if (this.updataType === '1') {
        let serverIds = this.dataForm.serviceId ? this.dataForm.serviceId.split(';') : ''
        account.serviceOrg = []
        for (let i = 0; i < serverIds.length; i++) {
          account.serviceOrg.push({ serviceId: serverIds[i] })
        }
      }
      account.orgId = Array.isArray(this.dataForm.orgId) ? this.dataForm.orgId[this.dataForm.orgId.length - 1] : account.orgId
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

        Object.keys(thisvm.dataForms).forEach(function (key) {
          Object.keys(thisvm.dataForm).forEach(function (key1) {
            if (key === key1) {
              if (thisvm.dataForm[key] === null) {
                thisvm.dataForm[key1] = ''
              } else {
                thisvm.dataForms[key1] = thisvm.dataForm[key]
              }
            }
          })
        })
        thisvm.$emit('refresh', thisvm.index, thisvm.dataForms)
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
