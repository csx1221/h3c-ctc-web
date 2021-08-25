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
                    <el-form-item prop="accountList" label="账号注销列表：">
                        <el-row class="project-mgr-page account-4a">
                            <el-col :span="24">
                                <el-card shadow="never" class="aui-card--fill">
                                    <div class="isTips">
                                        <span>温馨提示:</span>
                                        <span>1、云测试平台的从账号可与4A主账号一起注销，其余平台从账号需在对应的所属平台进行注销；</span>
                                        <span>2、注销的账号作为测试项目的非项目经理角色名下有未处理工单，可直接注销。未处理的工单自动转给工单所在测试项目的项目经理名下；</span>
                                        <span>3、注销的账号作为测试项目的项目经理角色，需先变更测试项目的项目经理后方可注销账号。</span>
                                    </div>
                                    <el-row style="margin-top: 10px">
                                        <el-col :span="12">
                                            <el-form-item label="4A主账号：" label-width="90px" prop="loginName">
                                                <el-input v-model="dataForms.loginName" placeholder="请输入（回车可查询）" clearable @keyup.enter.native="getProjectInfo"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12" align="right">
                                            <el-button type="primary" size="small" @click="getProjectInfo()">加入注销列表</el-button>
                                            <el-button type="danger" size="small" @click="removeNodeAll()">全部移除</el-button>
                                        </el-col>
                                    </el-row>
                                    <el-row style="margin-bottom:20px;margin-top:10px;">
                                        <el-col :span="6" class="split-line" style="text-align:left;">
                                            4A账号主列表
                                            <el-badge v-if="dataForm.accountList" :value="dataForm.accountList.length" size="mini" class="item"></el-badge>
                                        </el-col>
                                    </el-row>
                                    <el-table max-height="450" stripe v-loading="dataListLoading" :data="dataForm.accountList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
                                        <!--                    <el-table-column :selectable="selectable" type="selection" width="45"></el-table-column>-->
                                        <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                                        <template v-for="(item, index) in titleDataList">
                                            <el-table-column :key="index" :label="item.name" align="center" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <span v-html="getTableColumnData(scope.row,item)"></span>
                                                </template>
                                            </el-table-column>
                                        </template>
                                        <el-table-column fixed="right" label="操作" header-align="center" align="center" width="160">
                                            <template slot-scope="scope">
                                                <el-button @click="removeNode(scope.row.index,scope.row)" type="danger" size="small">移除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>

                                    <el-row style="margin-bottom:20px;margin-top:10px;">
                                        <el-col :span="6" class="split-line" style="text-align:left;">
                                            4A从账号列表
                                            <el-badge v-if="accountListSub" :value="accountListSub.length" size="mini" class="item"></el-badge>
                                        </el-col>
                                    </el-row>
                                    <el-table max-height="450" stripe v-loading="dataListLoadingSub" :data="accountListSub" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
                                        <!--                    <el-table-column :selectable="selectable" type="selection" width="45"></el-table-column>-->
                                        <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                                        <template v-for="(item, index) in titleDataListSub">
                                            <el-table-column :key="index" :label="item.name" align="center" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    <span v-html="getTableColumnData(scope.row,item)"></span>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </el-table>
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="注销原因：" prop="reason">
                        <ctc-select v-model="dataForm.reason" dict-type="cancelCause" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item prop="cancelContent" label="注销说明：">
                        <el-input v-model="dataForm.cancelContent" placeholder="请输入" :rows="5" type="textarea"></el-input>
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
            <el-button :disabled="isHasOrgId" type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
        </div>
        <setting-manage v-if="visible" ref="settingMange" @init="visible = false" @afterDo="submitData"></setting-manage>
    </el-card>
</template>

<script>
import { removeCurrentTabsHandle } from '@/router'
import mixinViewModule from '@/mixins/view-module'
import SettingManage from '../../pubilcModule/settingManage'
// import qs from 'qs'
export default {
  name: 'workOrderApplication',
  mixins: [mixinViewModule],
  components: {
    SettingManage
  },
  watch: {
    'dataForm.accountList' (newVal, oldValue) {
      if (newVal.length > 0) {
        this.getSubData()
      } else {
        this.accountListSub = []
      }
    }
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      visible: false,
      dataListLoadingSub: false,
      isHasOrgId: false,
      formData: '',
      title: '',
      name: this.$store.state.user.realName,
      dataForm: {
        title: '', // 工单标题
        accountList: [],
        mangerUpdateList: [],
        reason: '', // 注销原因
        cancelContent: '', // 注销说明
        fileId: '',
        handleUserId: ''// 下一步处理人
      },
      dataForms: {
        loginName: ''
      },
      titleDataList: [
        {
          name: '4A主账号',
          code: 'loginName'
        },
        {
          name: '部门/项目组',
          code: 'orgName'
        },
        {
          name: '姓名',
          code: 'name'
        },
        {
          name: '手机号码',
          code: 'mobile'
        },
        {
          name: '邮箱',
          code: 'email'
        },
        {
          name: '状态',
          code: 'status'
        }
      ],
      accountListSub: [], // 从账号列表
      titleDataListSub: [
        {
          name: '4A主账号',
          code: 'loginName'
        },
        {
          name: '从账号名',
          code: 'subLoginName'
        },
        {
          name: '所属平台',
          code: 'appName'
        },
        {
          name: '状态',
          code: 'acctStatus'
        }
      ]
    }
  },
  computed: {
    dataRule () {
      return {
        title: [
          { required: true, message: '请输入', trigger: 'blur' },
          { required: true, message: '最多输入128个字', trigger: 'blur', min: 1, max: 128 }
        ],
        accountList: [
          { required: true, message: '请选择账号', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        cancelContent: [
          { required: true, message: '请输入', trigger: 'blur' },
          { required: true, message: '最多输入200个字', trigger: 'blur', min: 1, max: 200 }
        ],
        handleUserId: [
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
    getSubData () {
      let accountList = this.dataForm.accountList
      if (accountList.length > 0) {
        this.dataListLoadingSub = true
        let loginNames = []
        for (let i = 0; i < accountList.length; i++) {
          loginNames.push(accountList[i].loginName)
        }
        // let params = { loginNames: loginNames }
        this.$http.post('/account4a/cancel/account/allSubAcct', loginNames).then(({ data: res }) => {
          this.dataListLoadingSub = false
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            let list = res.data
            // let newList = []
            for (let i = 0; i < list.length; i++) {
              // if (list[i].userId) {
              list[i].appName = list[i].platform
              delete list[i].platform
              // newList.push(list[i])
              // }
            }
            console.log(list)
            this.accountListSub = list
          }
        }).catch(() => {
          this.dataListLoadingSub = false
        })
      }
    },
    getProjectInfo () {
      if (this.dataForms.loginName) {
        let accountList = this.dataForm.accountList
        for (let i = 0; i < accountList.length; i++) {
          if (accountList[i].loginName.toLowerCase() === this.dataForms.loginName.toLowerCase()) {
            return this.$message.warning('当前账号：' + this.dataForms.loginName + ' 已在列表中，请勿重复添加！')
          }
        }
      } else {
        return this.$message.warning('请输入主账号')
      }
      this.dataListLoading = true
      let params = { ...this.dataForms }
      this.$http.get('/account4a/cancel/account/acctInfo', { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let list = res.data
          let node = {}
          node.loginName = list.loginName
          node.name = list.name
          node.mobile = list.phone
          node.cardValue = list.idCard
          node.email = list.email
          node.orgId = list.orgId
          node.orgName = list.orgName
          node.canLoginWay = list.canLoginWay
          node.isGfort = list.isGfort
          node.status = list.status

          this.dataForm.accountList.push(node)
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'status') {
        columnValue = this.$getDictLabel('accStateNew', row[item.code])
      } else if (item.code === 'acctStatus') {
        columnValue = this.$getDictLabel('accStateSub', row[item.code])
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
            thisvm.judgeState()
          })
        } else {
          return false
        }
      })
      // thisvm.judgeState()
    },
    submitData (data) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params
      let url
      let node = {}
      if (data) {
        node.title = data.title
        node.reason = data.reason
        node.handleUserId = data.handleUserId
        node.fileId = data.fileId
        node.cancelContent = data.cancelContent
        node.mainAccountList = data.accountList
        node.subAccountList = data.subAccountList
        node.mangerUpdateList = data.mangerUpdateList
      } else {
        node.title = thisvm.dataForm.title
        node.reason = thisvm.dataForm.reason
        node.handleUserId = thisvm.dataForm.handleUserId
        node.fileId = thisvm.dataForm.fileId
        node.cancelContent = thisvm.dataForm.cancelContent
        node.mainAccountList = thisvm.dataForm.accountList
        node.subAccountList = thisvm.accountListSub
        node.mangerUpdateList = thisvm.dataForm.mangerUpdateList
      }
      if (this.$route.params.type === '1') {
        url = '/account4a/cancel/account/create'
        params = { ...node }
      } else if (this.$route.params.type === '2') {
        url = '/account4a/cancel/account/edit'
        params = { ...node, recordId: thisvm.$route.params.recordId }
      }
      thisvm.$http.post(url, params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg, duration: 8000 })
        }
        if (data) {
          thisvm.$refs.settingMange.dialogVisible = false
        }
        thisvm.$message.success('提交成功')
        thisvm.close()
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    judgeState () {
      let thisvm = this
      console.log(555)
      // 1.其他平台从账号未注销 2.除集测平台的从账号已注销 3.所有从账号已注销
      let state
      let loginName
      let subLoginName
      let subData = thisvm.accountListSub
      if (subData.length === 0) {
        state = 3
      } else {
        let jzhList = []
        let jzhListNo = []
        for (let i = 0; i < subData.length; i++) {
          if (subData[i].appName !== '云测试平台') {
            jzhListNo.push(subData[i])
          } else {
            jzhList.push(subData[i])
          }
        }
        if (jzhListNo.length > 0) {
          loginName = jzhListNo[0].loginName
          subLoginName = jzhListNo[0].subLoginName
          state = 1
        } else {
          loginName = jzhList[0].loginName
          subLoginName = jzhList[0].subLoginName
          state = 2
        }
      }
      console.log(666)
      // state = 2 // 暂时先写这个

      if (state === 1) {
        let title = `${loginName} 尚有未注销的从账号【${subLoginName}】，请先注销从账号后再进行4A主账号注销。`
        thisvm.$alert(title, '提示', {
          confirmButtonText: '关闭',
          callback: action => {
            // do something
          }
        })
      } else if (state === 2) {
        let title = `${loginName} 的云测试平台从账号【${subLoginName}】未注销，确定将4A主账号与云测试平台从账号一起注销吗？`
        thisvm.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$message({
          //     type: 'success',
          //     message: '删除成功!'
          // });
          thisvm.visible = true
          thisvm.$nextTick(() => {
            thisvm.$refs.settingMange.init('账号注销确认', '1', { ...thisvm.dataForm, subAccountList: subData })
          })
        }).catch(() => {
          // this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          // });
        })
      } else if (state === 3) {
        thisvm.submitData()
      }
    },
    getEchoData (id) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { recordId: id }
      thisvm.$http.get('/account4a/cancel/account/info', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg })
        }
        // 信息处理
        if (res.data) {
          let data = res.data
          this.dataForm.title = data.title
          this.dataForm.accountList = data.mainList
          this.accountListSub = data.subList
          this.dataForm.mangerUpdateList = data.mangerUpdateList
          this.dataForm.reason = data.reason
          this.dataForm.cancelContent = data.cancelContent
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
