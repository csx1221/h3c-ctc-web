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
                    <el-form-item prop="applyList" label="账号信息：">
                        <el-row class="project-mgr-page account-4a noLoginForm">
                            <el-col :span="24">
                                <el-card shadow="never" class="aui-card--fill">
                                    <div class="isTips">
                                        <span>温馨提示:</span>
                                        <span>1、4A主从账号申请：同时申请4A主账号和集中化测试平台从账号</span>
                                        <span>2、集测从账号申请：已有4A平台主账号，申请集中化测试平台的从账号</span>
                                    </div>
                                    <el-form :model="dataForm.applyList" :rules="dataRules" ref="dataForm_child" label-width="180px">
                                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                            <el-form-item label="申请类型：" prop="type">
                                                <el-radio-group v-model="dataForm.applyList.type">
                                                    <el-radio :label="'0'">4A主从账号申请</el-radio>
                                                    <el-radio :label="'2'">集测从账号申请</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </el-col>
                                        <template v-if="dataForm.applyList.type==='0'">
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="姓名：" prop="name">
                                                    <el-input v-model="dataForm.applyList.name" placeholder="请输入" clearable></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="手机号码：" prop="mobile">
                                                    <el-input v-model="dataForm.applyList.mobile" placeholder="请输入" clearable></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="邮箱：" prop="email">
                                                    <el-input v-model="dataForm.applyList.email" placeholder="请输入" clearable></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="身份证号：" prop="cardValue">
                                                    <el-input v-model="dataForm.applyList.cardValue" placeholder="请输入" clearable></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="部门/项目组：" prop="orgId">
                                                    <ctc-project-team jurisdiction accountApp v-model="dataForm.applyList.orgId"></ctc-project-team>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="图形堡垒权限：" prop="isGfort">
                                                    <ctc-select v-model="dataForm.applyList.isGfort" dict-type="isGfort" placeholder="请选择"></ctc-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="VPN权限：" prop="canLoginWay">
                                                    <ctc-select v-model="dataForm.applyList.canLoginWay" dict-type="VPNPermission" placeholder="请选择"></ctc-select>
                                                </el-form-item>
                                            </el-col>
                                        </template>
                                        <template v-if="dataForm.applyList.type==='2'">
                                            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                    <el-form-item label="4A主账号：">
                                                        <el-input v-model="dataForm.applyList.loginName" placeholder="请输入（回车可查询）" clearable @keyup.enter.native="getProjectInfo"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="姓名：">
                                                    <el-input disabled v-model="dataForm.applyList.name" placeholder="请输入" clearable></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="手机号码：">
                                                    <el-input disabled v-model="dataForm.applyList.mobile" placeholder="请输入" clearable></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="邮箱：">
                                                    <el-input disabled v-model="dataForm.applyList.email" placeholder="请输入" clearable></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="身份证号：">
                                                    <el-input disabled v-model="dataForm.applyList.cardValue" placeholder="请输入" clearable></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="部门/项目组：">
                                                    <ctc-project-team disabled v-model="dataForm.applyList.orgId"></ctc-project-team>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="图形堡垒权限：">
                                                    <ctc-select disabled v-model="dataForm.applyList.isGfort" dict-type="isGfort" placeholder="请选择"></ctc-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                                <el-form-item label="VPN权限：">
                                                    <ctc-select disabled v-model="dataForm.applyList.canLoginWay" dict-type="VPNPermission" placeholder="请选择"></ctc-select>
                                                </el-form-item>
                                            </el-col>
                                        </template>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="账号类型：" prop="sysAcctType">
                                                <ctc-select v-model="dataForm.applyList.sysAcctType" dict-type="accTypeNew" placeholder="请选择"></ctc-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="所属机构/部门/科室：" prop="organization">
                                                <ctc-tree-organ ref="ctcTreeOrgan" v-model="dataForm.applyList.organization" :pid="dataForm.applyList.sysAcctType" type="radio" :afterSelectData.sync="afterSelectData" placeholder="请选择所属机构/部门/科室"></ctc-tree-organ>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="16">
                                            <el-form-item label="服务机构/部门/科室：" prop="organizationGs">
                                                <ctc-tree-organ-serve ref="ctcTreeOrganServe" v-model="dataForm.applyList.organizationGs" type="checkbox" :jg="dataForm.applyList.organization" :acct-type="dataForm.applyList.sysAcctType" placeholder="请选择服务机构/部门/科室"></ctc-tree-organ-serve>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                            <el-form-item label="账号角色：" prop="roleIds">
                                                <ctc-select-role v-model="dataForm.applyList.roleIds" :pid="dataForm.applyList.organization" multiple placeholder="请选择"></ctc-select-role>
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
                        <ctc-next-step-handler v-model="dataForm.handleUserId" urlType="3" placeholder="请选择"></ctc-next-step-handler>
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
    // 申请类型
    'dataForm.applyList.type' (newVal, oldVal) {
      console.log(newVal)
      if (!this.edit) {
        this.dataForm.applyList.loginName = ''
        this.dataForm.applyList.name = ''
        this.dataForm.applyList.mobile = ''
        this.dataForm.applyList.email = ''
        this.dataForm.applyList.cardValue = ''
        this.dataForm.applyList.orgId = []
        this.dataForm.applyList.isGfort = ''
        this.dataForm.applyList.canLoginWay = ''
        this.dataForm.applyList.sysAcctType = ''
        this.dataForm.applyList.organization = []
        this.dataForm.applyList.organizationGs = []
        this.dataForm.applyList.roleIds = []

        this.$refs['dataForm_child'].clearValidate(['loginName'])
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
      }
    },
    // 所属机构
    'dataForm.applyList.organization' (newVal, oldVal) {
      if (!this.edit) {
        if (newVal.length > 0) {
          this.dataForm.applyList.organizeFrom.serviceId = newVal[newVal.length - 1]
        } else {
          this.dataForm.applyList.organizeFrom = {}
        }
      }
    },
    // 服务机构
    'dataForm.applyList.organizationGs' (newVal, oldVal) {
      // this.$refs.dataForm_child.validate()
      if (!this.edit) {
        if (newVal.length > 0) {
          this.dataForm.applyList.serviceOrg = []
          for (let i = 0; i < newVal.length; i++) {
            this.dataForm.applyList.serviceOrg.push({
              serviceId: newVal[i][newVal[i].length - 1]
            })
          }
        } else {
          this.dataForm.applyList.serviceOrg = []
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
      dataForm: {
        title: '', // 工单标题
        applyList: {
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
          organization: [], // 所属机构
          organizationGs: [], // 归属机构
          roleIds: []// 账号角色
        },
        reason: '', // 申请原因
        name: '',
        fileId: '',
        handleUserId: ''// 下一步处理人
      },
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
        applyList: [
          { required: true, message: '请选择账号', trigger: 'change' }
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
      if (!this.dataForm.applyList.loginName) {
        return this.$message.warning('请输入主账号')
      }
      this.$ctcLoading.open()
      let params = { loginName: this.dataForm.applyList.loginName }
      this.$http.get('/account4a/account/detail', { 'params': params }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let list = res.data
          this.dataForm.applyList.loginName = list.loginName
          this.dataForm.applyList.name = list.name
          this.dataForm.applyList.mobile = list.phone
          this.dataForm.applyList.cardValue = list.idCard
          this.dataForm.applyList.email = list.email
          this.dataForm.applyList.orgId = list.orgId
          this.dataForm.applyList.orgName = list.orgName
          this.dataForm.applyList.canLoginWay = list.canLoginWay
          this.dataForm.applyList.isGfort = list.isGfort
          this.dataForm.applyList.status = list.status
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
      console.log(55)
      let data = JSON.parse(JSON.stringify(thisvm.dataForm))
      delete data.applyList
      let applyList = JSON.parse(JSON.stringify(thisvm.dataForm.applyList))
      applyList.orgId = Array.isArray(this.dataForm.applyList.orgId) ? this.dataForm.applyList.orgId[this.dataForm.applyList.orgId.length - 1] : applyList.orgId
      if (this.$route.params.type === '1') {
        url = '/account4a/apply/account/create'
        params = { ...data, applyList: [applyList] }
      } else if (this.$route.params.type === '2') {
        url = '/account4a/apply/account/edit'
        params = { ...data, applyList: [applyList], recordId: thisvm.$route.params.recordId }
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
      thisvm.edit = true
      thisvm.$ctcLoading.open()
      let params = { recordId: id }
      thisvm.$http.get('/account4a/apply/account/info', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg })
        }
        // 信息处理
        if (res.data) {
          let data = res.data
          this.dataForm.title = data.title
          this.dataForm.reason = data.reason
          this.dataForm.name = data.userName
          this.dataForm.fileId = data.fileId
          // this.dataForm.handleUserId = data.handleUserId
          let applyList = data.applyList[0]
          this.dataForm.applyList.type = applyList.type + ''

          this.dataForm.applyList.loginName = applyList.loginName
          this.dataForm.applyList.name = applyList.name
          this.dataForm.applyList.mobile = applyList.mobile
          this.dataForm.applyList.cardValue = applyList.idCard
          this.dataForm.applyList.email = applyList.email
          this.dataForm.applyList.orgId = applyList.orgId
          this.dataForm.applyList.isGfort = applyList.isGfort
          this.dataForm.applyList.canLoginWay = applyList.canLoginWay
          this.dataForm.applyList.sysAcctType = applyList.sysAcctType + ''

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
            this.dataForm.applyList.organization = [applyList.organId, organId]
            setTimeout(() => {
              this.dataForm.applyList.roleIds = applyList.roleIds.split(',')
            }, 100)
          }, 100)
          this.dataForm.applyList.organizeFrom = { serviceId: organId }
          this.dataForm.applyList.serviceOrg = []
          let serviceOrg = applyList.serviceOrgList
          console.log(serviceOrg)
          for (let i = 0; i < serviceOrg.length; i++) {
            this.dataForm.applyList.serviceOrg.push(
              {
                serviceId: serviceOrg[i].serviceId
              }
            )
          }
          // this.dataForm.applyList.serviceOrg = applyList.serviceOrg

          setTimeout(() => {
            thisvm.$nextTick(() => {
              thisvm.$refs.ctcTreeOrgan.init({ name: applyList.organName })
              let nameList = []
              // let serviceId = applyList.serviceOrg
              let seviceName = applyList.serviceOrgName.split(',')
              for (let i = 0; i < seviceName.length; i++) {
                let node = {}
                node.name = seviceName[i]
                node.id = serviceOrg[i].serviceId
                node.ids = [serviceOrg[i].serviceId]
                if (serviceOrg[i].serviceId === organId) {
                  node.disabled = true
                }
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
            }, 500)
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
