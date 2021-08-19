<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail">
        <el-row style="margin-bottom:20px;">
            <el-col :span="12" class="split-line" style="text-align:left;">
                从账号列表
            </el-col>
            <el-col :span="12" align="right">
                <el-button type="primary" @click="createConfig('批量注销','2')" size="small">批量注销</el-button>
<!--                <el-button type="primary" @click="createConfig('批量解锁','4')" size="small">批量解锁</el-button>-->
            </el-col>
        </el-row>
        <el-row>
            <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
                <el-table-column type="selection" :selectable='checkboxInit' width="45"></el-table-column>
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="user_name" label="用户姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="login_acct" label="用户账号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="org_name" label="所属机构" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                <el-table-column prop="author_effect_time" label="授权生效时间" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                <el-table-column prop="author_expire_time" label="授权失效时间" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                <el-table-column prop="acct_status" label="状态" header-align="center" align="center" show-overflow-tooltip >
                    <template slot-scope="scope">
                        <span v-html="$getDictLabel('appAcctStatus', scope.row.acct_status)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button :disabled="scope.row.acct_status!=='1'" @click="createConfig('注销','1', scope.row)" type="text" size="small">注销</el-button>
<!--                        <el-button :disabled="scope.row.acct_status==='1'" @click="createConfig('解锁','3', scope.row)" type="text" size="small">解锁</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" width="50%" class="add-require" append-to-body>
            <el-row>
                <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item :label="title+'原因：'" prop="reason">
                            <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForm.reason"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div style="text-align:center;margin-top: 20px;">
                <el-button type="info" size="small" @click="dialogVisible=false">取消</el-button>
                <el-button type="primary" size="small" @click="submitResult(dataForm)">{{ $t('confirm') }}</el-button>
            </div>
        </el-dialog>

    </el-card>
</template>

<script>
// import mixinViewModule from '@/mixins/view-module'
export default {
  name: 'secondAccountList',
  components: {},
  data () {
    return {
      addOrUpdataVisible: false,
      dataListLoading: false,
      dataListSelections: '',
      dataForm: {
        reason: ''
      },
      dataRule: {
        reason: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      dataList: [],
      title: '',
      type: '',
      selectDataLocal: []
    }
  },
  props: {
    selectData: Object
  },
  computed: {},
  mounted () {
    // if (this.selectionList.length > 0) {
    //   this.dataList = this.selectionList
    // }
    this.getDataList()
  },
  methods: {
    checkboxInit (row, index) {
      if (row.acct_status === '1') {
        return 1 // 可勾选
      } else {
        return 0 // 不可勾选
      }
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    createConfig (title, type, data) {
      if (type === '1' || type === '3') {
        this.type = type
        this.selectDataLocal = [data]
        this.checkList(this.selectDataLocal)
        this.title = title
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields()
        // })
      } else if (type === '2' || type === '4') {
        if (this.dataListSelections.length === 0) {
          return this.$message.warning('请选择需要操作的列表！！！')
        }
        let ids = []
        for (let i = 0; i < this.dataListSelections.length; i++) {
          ids.push(this.dataListSelections[i])
        }
        this.selectDataLocal = ids
        this.title = title
        this.type = type
        this.checkList(this.selectDataLocal)
        // this.dialogVisible = true
        // this.$nextTick(() => {
        //   this.$refs['dataForm'].resetFields()
        // })
      }
    },
    checkList (ids) {
      let _this = this
      let params = []
      for (let i = 0; i < ids.length; i++) {
        let node = {}
        node.acctStatus = ids[i].acct_status
        node.acctType = ids[i].acct_type
        node.appCode = ids[i].app_code
        node.appId = ids[i].app_id
        node.authorEffectTime = ids[i].author_effect_time
        node.authorExpireTime = ids[i].author_expire_time
        node.loginAcct = ids[i].login_acct
        node.mainAcct = ids[i].main_acct
        node.orgId = ids[i].org_id
        node.orgName = ids[i].org_name
        node.userName = ids[i].user_name
        node.reason = this.dataForm.reason
        params.push(node)
      }
      let url = '/account4a/account/lock/sub/validator'
      _this.$ctcLoading.open()
      _this.$http.post(url, params).then(({ data: res }) => {
        _this.$ctcLoading.close()
        if (res.code !== 0) {
          _this.$message.error(res.msg)
        } else {
          if (res.data) {
            _this.$confirm(res.data, '提示', {
              distinguishCancelAndClose: true,
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning'
            }).then(() => {
              _this.dialogVisible = true
              _this.$nextTick(() => {
                _this.$refs['dataForm'].resetFields()
              })
            }).catch(action => {
              // if (action === 'cancel') {
              //   console.log(2)
              // }
              // console.log(3)
            })
          } else {
            _this.dialogVisible = true
            _this.$nextTick(() => {
              _this.$refs['dataForm'].resetFields()
            })
          }
        }
      }).catch(() => {
        _this.$ctcLoading.close()
      })
    },
    getDataList () {
      this.dataListLoading = true
      let params = { loginName: this.selectData.loginName }
      this.$http.get('/account4a/account/list/subAcct', { 'params': params }).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.dataList = []
        } else {
          this.dataList = res.data
        }
      }).catch(() => {
        this.dataListLoading = false
        this.dataList = []
      })
    },
    submitResult (res) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.addLock(this.selectDataLocal)
        } else {
          return false
        }
      })
    },
    addLock (ids) {
      let params = []
      for (let i = 0; i < ids.length; i++) {
        let node = {}
        node.acctStatus = ids[i].acct_status
        node.acctType = ids[i].acct_type
        node.appCode = ids[i].app_code
        node.appId = ids[i].app_id
        node.authorEffectTime = ids[i].author_effect_time
        node.authorExpireTime = ids[i].author_expire_time
        node.loginAcct = ids[i].login_acct
        node.mainAcct = ids[i].main_acct
        node.orgId = ids[i].org_id
        node.orgName = ids[i].org_name
        node.userName = ids[i].user_name
        node.reason = this.dataForm.reason
        params.push(node)
      }
      let url
      if (this.type === '1' || this.type === '2') { // 加锁
        url = '/account4a/account/lock/sub/record'
      } else { // 解锁
        url = '/account4a/account/unlock/sub/record'
      }
      this.$ctcLoading.open()
      this.$http.post(url, params).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.dialogVisible = false
          this.selectDataLocal = []
          this.getDataList()
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    }
  }
}
</script>

<style scoped lang="scss">
    .el-row{
        margin-bottom: 20px;
    }
    .spanList{
        margin: 0 10px;
    }
    .success{
        color: #409EFF
    }
    .error{
        color: #F56C6C
    }
</style>
