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
                    <el-form-item prop="    " label="账号信息：">
                        <el-row class="project-mgr-page account-4a noLoginForm">
                            <el-col :span="24">
                                <el-card shadow="never" class="aui-card--fill">
                                    <div class="isTips">
                                        <span>温馨提示:</span>
                                        <span>1、温馨提示：VPN权限的有效期为6个月</span>
<!--                                        <span>2、若需变更账号部门/项目组，请另外发起“部门/项目组变更”工单。</span>-->
                                    </div>
<!--                                    {{dataForm.updateList}}-->
                                    <el-form :model="dataForm.updateList" :rules="dataRules" ref="dataForm_child" label-width="180px">
                                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="4A主账号：">
                                                    <el-input :disabled="$route.params.type!=='1'" v-model="dataForm.updateList.loginName" placeholder="请输入（回车查询）" clearable @keyup.enter.native="getProjectInfo"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="姓名：" prop="name">
                                                <el-input :disabled="disabled" v-model="dataForm.updateList.name" placeholder="请输入" clearable></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="手机号码：" prop="mobile">
                                                <el-input :disabled="disabled" v-model="dataForm.updateList.mobile" placeholder="请输入" clearable></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="邮箱：" prop="email">
                                                <el-input :disabled="disabled" v-model="dataForm.updateList.email" placeholder="请输入" clearable></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="身份证号：" prop="cardValue">
                                                <el-input :disabled="disabled" v-model="dataForm.updateList.cardValue" placeholder="请输入" clearable></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="部门/项目组：" prop="orgId">
                                                <ctc-project-team :disabled="disabled" v-model="dataForm.updateList.orgId"></ctc-project-team>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="图形堡垒权限：" prop="isGfort">
                                                <ctc-select :disabled="disabled" v-model="dataForm.updateList.isGfort" dict-type="isGfort" placeholder="请选择"></ctc-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="VPN权限：" prop="canLoginWay">
                                                <ctc-select :disabled="disabled" v-model="dataForm.updateList.canLoginWay" dict-type="VPNPermission" placeholder="请选择"></ctc-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="账号类型：" prop="">
                                                <ctc-select disabled v-model="dataForm.updateList.sysAcctType" dict-type="accTypeNew" placeholder="请选择"></ctc-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="所属机构/部门/科室：" prop="">
                                                <ctc-tree-organ disabled ref="ctcTreeOrgan" v-model="dataForm.updateList.organization" :pid="dataForm.updateList.sysAcctType" type="radio" :afterSelectData.sync="afterSelectData" placeholder="请选择所属机构/部门/科室"></ctc-tree-organ>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                            <el-form-item label="服务机构/部门/科室：" prop="">
                                                <ctc-tree-organ-serve disabled ref="ctcTreeOrganServe" v-model="dataForm.updateList.organizationGs" type="checkbox" :jg="dataForm.updateList.organization" :acct-type="dataForm.updateList.sysAcctType" placeholder="请选择服务机构/部门/科室"></ctc-tree-organ-serve>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                            <el-form-item label="账号角色：" :prop="hasSubAcct?'roleIds':''">
<!--                                            <el-form-item label="账号角色：" prop="roleIds">-->
                                                <ctc-select-role :disabled="dataForm.updateList.roleIds.length===0&&!dataForm.updateList.loginName?true:false||!hasSubAcct" v-model="dataForm.updateList.roleIds" :pid="dataForm.updateList.organization" multiple placeholder="请选择"></ctc-select-role>
                                            </el-form-item>
                                        </el-col>
                                    </el-form>

                                </el-card>
                            </el-col>
                        </el-row>
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
export default {
  name: 'workOrderApplication',
  mixins: [mixinViewModule],
  components: {
  },
  watch: {
    // 主账号
    'dataForm.updateList.loginName' (newVal, oldVal) {
      if (this.$route.params.type === '1') {
        this.disabled = true

        // this.dataForm.updateList.loginName = ''
        this.dataForm.updateList.name = ''
        this.dataForm.updateList.mobile = ''
        this.dataForm.updateList.email = ''
        this.dataForm.updateList.cardValue = ''
        this.dataForm.updateList.orgId = []
        this.dataForm.updateList.isGfort = ''
        this.dataForm.updateList.canLoginWay = ''
        this.dataForm.updateList.sysAcctType = ''
        this.dataForm.updateList.organization = []
        this.dataForm.updateList.organizationGs = []
        this.dataForm.updateList.roleIds = []

        this.$nextTick(() => {
          // this.$refs['dataForm_child'].clearValidate(['loginName'])
          this.$refs['dataForm_child'].clearValidate(['name'])
          this.$refs['dataForm_child'].clearValidate(['mobile'])
          this.$refs['dataForm_child'].clearValidate(['email'])
          this.$refs['dataForm_child'].clearValidate(['cardValue'])
          this.$refs['dataForm_child'].clearValidate(['orgId'])
          this.$refs['dataForm_child'].clearValidate(['isGfort'])
          this.$refs['dataForm_child'].clearValidate(['canLoginWay'])
          this.$refs['dataForm_child'].clearValidate(['sysAcctType'])
          this.$refs['dataForm_child'].clearValidate(['organization'])
          this.$refs['dataForm_child'].clearValidate(['organizationGs'])
          this.$refs['dataForm_child'].clearValidate(['roleIds'])
        })
      }
    },
    // 项目组
    'dataForm.updateList.orgId' (newVal, oldVal) {
      this.checkData()
    },
    // 所属机构
    'dataForm.updateList.organization' (newVal, oldVal) {
      if (!this.edit) {
        if (newVal.length > 0) {
          this.dataForm.updateList.organizeFrom.serviceId = newVal[newVal.length - 1]
        } else {
          this.dataForm.updateList.organizeFrom = {}
        }
      }
    },
    // 服务机构
    'dataForm.updateList.organizationGs' (newVal, oldVal) {
      if (!this.edit) {
        if (newVal.length > 0) {
          this.dataForm.updateList.serviceOrg = []
          for (let i = 0; i < newVal.length; i++) {
            this.dataForm.updateList.serviceOrg.push({
              serviceId: newVal[i][newVal[i].length - 1]
            })
          }
        } else {
          this.dataForm.updateList.serviceOrg = []
        }
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
      disabled: false,
      dataForm: {
        title: '', // 工单标题
        updateList: {
          loginName: '',
          name: '',
          mobile: '',
          email: '',
          cardValue: '',
          orgId: [],
          isGfort: '',
          canLoginWay: '',
          sysAcctType: '',
          organization: [], // 所属机构
          organizationGs: [], // 归属机构
          roleIds: []// 账号角色
        },
        reason: '', // 申请原因
        fileId: '',
        handleUserId: ''// 下一步处理人
      },
      hasSubAcct: false, // 从账号判断
      dataForms: {
        loginName: ''
      },
      edit: false
    }
  },
  computed: {
    dataRule () {
      return {
        title: [
          { required: true, message: '请输入', trigger: 'blur' },
          { required: true, message: '最多输入128个字', trigger: 'blur', min: 1, max: 128 }
        ],
        // updateList: [
        //   { required: true, message: '请选择账号', trigger: 'change' }
        // ],
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
        organization: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        organizationGs: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        roleIds: [
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
      let orgId, loginNameList
      if (dataForm.updateList.orgId && dataForm.updateList.orgId.length > 0) {
        orgId = Array.isArray(dataForm.updateList.orgId) ? dataForm.updateList.orgId[dataForm.updateList.orgId.length - 1] : dataForm.updateList.orgId
        loginNameList = [dataForm.updateList.loginName] || []
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
    getProjectInfo () {
      let thisvm = this
      thisvm.edit = true
      if (!this.dataForm.updateList.loginName) {
        return this.$message.warning('请输入主账号')
      }
      this.$ctcLoading.open()
      let params = { loginName: this.dataForm.updateList.loginName }
      this.$http.get('/account4a/update/account/acctInfo', { 'params': params }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          // organization: [], // 所属机构
          // organizationGs: [], // 归属机构
          this.disabled = false
          let list = res.data
          // this.dataForm.updateList.loginName = list.loginName
          this.dataForm.updateList.name = list.name
          this.dataForm.updateList.mobile = list.phone
          this.dataForm.updateList.cardValue = list.idCard
          this.dataForm.updateList.email = list.email
          this.dataForm.updateList.orgId = list.orgId
          this.dataForm.updateList.isGfort = list.isGfort
          this.dataForm.updateList.canLoginWay = list.canLoginWay

          // true 有从账号信息 就显示账号类型 所属机构 服务机构 角色这些内容
          this.hasSubAcct = list.hasSubAcct
          this.dataForm.updateList.hasSubAcct = list.hasSubAcct
          if (list.hasSubAcct) {
            let organId = ''
            if (list.sectionId) {
              organId = list.sectionId
            } else if (list.deptId) {
              organId = list.deptId
            } else if (list.organId) {
              organId = list.organId
            }
            this.dataForm.updateList.organizeFrom = { serviceId: organId }
            this.dataForm.updateList.serviceOrg = list.serviceOrg
            this.dataForm.updateList.sysAcctType = list.sysAcctType ? list.sysAcctType + '' : ''

            setTimeout(() => {
              let ssjgId = list.organId ? list.organId : ''
              thisvm.dataForm.updateList.organization = [ssjgId, organId]
              setTimeout(() => {
                thisvm.dataForm.updateList.roleIds = list.roleIds ? list.roleIds : []
                thisvm.$nextTick(() => {
                  thisvm.$refs.ctcTreeOrgan.init({ name: list.organName ? list.organName : '' })
                  let nameList = []
                  let serviceId = list.serviceOrg ? list.serviceOrg : []
                  let seviceName = list.serviceOrgName ? list.serviceOrgName.split(',') : []
                  for (let i = 0; i < seviceName.length; i++) {
                    let node = {}
                    node.name = seviceName[i]
                    node.id = serviceId[i].serviceId
                    node.ids = [serviceId[i].serviceId]
                    if (serviceId[i].serviceId === organId) {
                      node.disabled = true
                    }
                    nameList.push(node)
                  }
                  thisvm.$refs.ctcTreeOrganServe.init(nameList)
                  thisvm.edit = false
                })
              }, 100)
            }, 100)
          }
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
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
          thisvm.$refs.dataForm_child.validate((valid) => {
            if (valid) {
              thisvm.$refs.ctcFileUpload.doFileUploadAction(function () {
                thisvm.submitData()
              })
            } else {
              return false
            }
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
      delete data.updateList
      let updateList = JSON.parse(JSON.stringify(thisvm.dataForm.updateList))
      updateList.orgId = Array.isArray(this.dataForm.updateList.orgId) ? this.dataForm.updateList.orgId[this.dataForm.updateList.orgId.length - 1] : updateList.orgId
      if (this.$route.params.type === '1') {
        url = '/account4a/update/account/create'
        params = { ...data, updateList: [updateList] }
      } else if (this.$route.params.type === '2') {
        url = '/account4a/update/account/edit'
        params = { ...data, updateList: [updateList], recordId: thisvm.$route.params.recordId }
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
          // this.dataForm.updateList = data.applyList
          this.dataForm.reason = data.reason
          this.dataForm.fileId = data.fileId
          // this.dataForm.handleUserId = data.handleUserId

          let applyList = data.applyList[0]
          this.dataForm.updateList.type = applyList.type + ''

          this.dataForm.updateList.loginName = applyList.loginName
          this.dataForm.updateList.name = applyList.name
          this.dataForm.updateList.mobile = applyList.mobile
          this.dataForm.updateList.cardValue = applyList.cardValue
          this.dataForm.updateList.email = applyList.email
          this.dataForm.updateList.orgId = applyList.orgId
          this.dataForm.updateList.isGfort = applyList.isGfort
          this.dataForm.updateList.canLoginWay = applyList.canLoginWay
          this.dataForm.updateList.sysAcctType = applyList.sysAcctType + ''

          this.dataForm.updateList.hasSubAcct = applyList.hasSubAcct
          this.hasSubAcct = applyList.hasSubAcct

          console.log(this.dataForm)
          let organId = ''
          if (applyList.sectionId) {
            organId = applyList.sectionId
          } else if (applyList.deptId) {
            organId = applyList.deptId
          } else if (applyList.organId) {
            organId = applyList.organId
          }
          setTimeout(() => {
            this.dataForm.updateList.organization = [applyList.organId, organId]
            setTimeout(() => {
              this.dataForm.updateList.roleIds = applyList.roleIds.split(',')
            }, 100)
          }, 100)
          this.dataForm.updateList.organizeFrom = { serviceId: organId }
          this.dataForm.updateList.serviceOrg = []
          // let serviceOrg = applyList.serviceOrgList
          // for (let i = 0; i < serviceOrg.length; i++) {
          //   this.dataForm.updateList.serviceOrg.push(
          //     {
          //       serviceId: serviceOrg[i].serviceId
          //     }
          //   )
          // }
          setTimeout(() => {
            thisvm.$nextTick(() => {
              thisvm.$refs.ctcTreeOrgan.init({ name: applyList.organName })
              let nameList = []
              // let serviceId = applyList.serviceOrg
              let seviceName = applyList.serviceOrgName ? applyList.serviceOrgName.split(',') : []
              for (let i = 0; i < seviceName.length; i++) {
                let node = {}
                node.name = seviceName[i]
                // node.id = serviceOrg[i].serviceId
                // node.ids = [serviceOrg[i].serviceId]
                // if (serviceOrg[i].serviceId === organId) {
                //   node.disabled = true
                // }
                nameList.push(node)
              }
              thisvm.$refs.ctcTreeOrganServe.init(nameList)
              thisvm.edit = false
            })
          }, 250)

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
