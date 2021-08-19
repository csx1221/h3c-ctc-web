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
                    <el-form-item prop="accountList" label="账号解锁列表：">
                        <el-row class="project-mgr-page account-4a">
                            <el-col :span="24">
                                <el-card shadow="never" class="aui-card--fill">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-form-item label="4A主账号：" label-width="90px" prop="loginName">
                                                <el-input v-model="dataForms.loginName" placeholder="请输入（回车可查询）" clearable @keyup.enter.native="getProjectInfo"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12" align="right">
                                            <el-button type="primary" size="small" @click="getProjectInfo()">加入解锁列表</el-button>
                                            <el-button type="danger" size="small" @click="removeNodeAll()">全部移除</el-button>
                                        </el-col>
                                    </el-row>
                                    <el-row style="margin-bottom:20px;margin-top:10px;">
                                        <el-col :span="6" class="split-line" style="text-align:left;">
                                            4A账号解锁列表
                                            <el-badge v-if="dataForm.accountList" :value="dataForm.accountList.length" size="mini" class="item"></el-badge>
                                        </el-col>
                                    </el-row>
                                    <el-table max-height="450px" stripe v-loading="dataListLoading" :data="dataForm.accountList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
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
            <el-button :disabled="isHasOrgId" type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
        </div>
    </el-card>
</template>

<script>
import { removeCurrentTabsHandle } from '@/router'
import mixinViewModule from '@/mixins/view-module'
export default {
  name: 'workOrderApplication',
  mixins: [mixinViewModule],
  components: {
  },
  watch: {
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      isHasOrgId: false,
      formData: '',
      title: '',
      name: this.$store.state.user.realName,
      dataForm: {
        title: '', // 工单标题
        accountList: [],
        reason: '', // 申请原因
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
          name: '身份证号',
          code: 'cardValue'
        },
        {
          name: '部门/项目组',
          code: 'orgName'
        },
        {
          name: '图形堡垒权限',
          code: 'isGfort'
        },
        {
          name: 'VPN权限',
          code: 'canLoginWay'
        },
        {
          name: '状态',
          code: 'status'
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
      this.$http.get('/account4a/account/detail', { 'params': params }).then(({ data: res }) => {
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
            thisvm.submitData()
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
      if (this.$route.params.type === '1') {
        url = '/account4a/unlock/account/create'
        params = { ...thisvm.dataForm }
      } else if (this.$route.params.type === '2') {
        url = '/account4a/unlock/account/edit'
        params = { ...thisvm.dataForm, recordId: thisvm.$route.params.recordId }
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
      thisvm.$http.get('/account4a/unlock/account/info', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg })
        }
        // 信息处理
        if (res.data) {
          let data = res.data
          this.dataForm.title = data.title
          this.dataForm.accountList = data.unlockInfoList
          this.dataForm.reason = data.reason
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
