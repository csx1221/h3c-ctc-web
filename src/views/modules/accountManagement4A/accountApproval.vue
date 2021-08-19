<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
        <el-row>
            <el-divider v-if="type!=='12'" content-position="left"><span style="color:#26c6da;font-size:15px;">{{selectData.type === 4||selectData.type === 5?'从账号信息':'账号信息'}}</span></el-divider>
            <el-row v-if="type!=='12'">
                <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
<!--                    selectData.type = 0 申请  1 变更 2 注销 4加锁 5解锁-->
                    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                    <template v-if="selectData.type === 0">
                        <el-table-column prop="name" label="姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="fullPinyinName" label="姓名全拼" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="mobile" label="手机号码" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="email" label="邮箱" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="idCard" label="身份证号" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="orgName" label="部门/项目组" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="accType" label="账号类型" header-align="center" align="center" show-overflow-tooltip >
                            <template slot-scope="scope">
                                <span v-html="$getDictLabel('accType', scope.row.acctType)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="organName" label="所属机构" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                    </template>
                    <template v-else-if="selectData.type === 1">
                        <el-table-column prop="name" label="姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="mobile" label="手机号码" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="email" label="邮箱" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="cardValue" label="身份证号" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="orgName" label="部门/项目组" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="organName" label="所属机构" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="isGfort" label="图形堡垒权限" header-align="center" align="center" show-overflow-tooltip >
                            <template slot-scope="scope">
                                <span v-html="$getDictLabel('isGfort', scope.row.isGfort)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="canLoginWay" label="VPN权限" header-align="center" align="center" show-overflow-tooltip >
                            <template slot-scope="scope">
                                <span v-html="$getDictLabel('VPNPermission', scope.row.canLoginWay)"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="vpnEffectTime" label="VPN生效时间" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="vpnExpireTime" label="VPN失效时间" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                    </template>
                    <template v-else-if="selectData.type === 2">
                        <el-table-column prop="loginName" label="账号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="mobile" label="手机号码" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="email" label="邮箱" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="idCard" label="身份证号" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="orgName" label="部门/项目组" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="cancelMsg" label="注销原因" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="cancelContent" label="注销说明" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                    </template>
                    <template v-else-if="selectData.type === 4">
                        <el-table-column prop="userName" label="用户姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="loginAcct" label="用户账号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orgName" label="所属机构" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="authorEffectTime" label="授权生效时间" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="authorExpireTime" label="授权失效时间" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
<!--                        <el-table-column prop="acctStatus" label="状态" header-align="center" align="center" show-overflow-tooltip >-->
<!--                            <template slot-scope="scope">-->
<!--                                <span v-html="$getDictLabel('appAcctStatus', scope.row.acctStatus)"></span>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                        <el-table-column prop="reason" label="注销原因" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                    </template>
                    <template v-else-if="selectData.type === 5">
                        <el-table-column prop="userName" label="用户姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="loginAcct" label="用户账号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="orgName" label="所属机构" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="authorEffectTime" label="授权生效时间" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="authorExpireTime" label="授权失效时间" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
<!--                        <el-table-column prop="acctStatus" label="状态" header-align="center" align="center" show-overflow-tooltip >-->
<!--                            <template slot-scope="scope">-->
<!--                                <span v-html="$getDictLabel('appAcctStatus', scope.row.acctStatus)"></span>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                        <el-table-column prop="reason" label="解锁原因" header-align="center" align="center" show-overflow-tooltip ></el-table-column>
                    </template>
                </el-table>
            </el-row>
<!--            <template v-if="selectData.type === 2 && fileId">-->
<!--                <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">注销申请附件</span></el-divider>-->
<!--                <ctc-download-table :id="fileId"></ctc-download-table>-->
<!--            </template>-->
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">审批意见</span></el-divider>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="处理意见：" prop="approvalOpinion">
                        <el-input :disabled="type === '10'" type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForm.approvalOpinion"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <div align="center" v-if="type !== '10'">
            <el-button type="info" size="small" @click="$emit('close')">取消</el-button>
          <template v-if="selectData.type===3" >
            <el-button type="primary" size="small" @click="submitData('1')">确认</el-button>
          </template>
          <template v-else>
            <el-button type="danger" v-if="selectData.type !=='2'" size="small" @click="submitData('2')">审批不通过</el-button>
            <el-button type="danger" v-else size="small" @click="submitData('1')">审批不通过</el-button>
            <el-button type="primary" size="small" @click="submitData('1')">审批通过</el-button>
          </template>
        </div>
    </el-card>
</template>

<script>
export default {
  name: 'accountApplication',
  data () {
    return {
      dataForm: {
        approvalOpinion: ''
      },
      dataListLoading: false,
      dataRule: {},
      fileId: '',
      dataList: []
    }
  },
  props: {
    // 选中列表
    selectData: {
      type: Object,
      default () {
        return {}
      }
    },
    type: String
  },
  computed: {},
  mounted () {
    // this.type  === 10是查看  12是批量审批  7是审批
    if (this.type !== '12') {
      this.showList(this.selectData.id)
    }
    if (this.type === '10') {
      this.dataForm = this.selectData
    }
    // if (this.selectData.type === 2) {
    //   this.fileId = this.dataForm.fileId
    // }
  },
  methods: {
    showList (id) {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let params = { recordId: id }
      thisvm.$http.get('/account4a/acctApprove/apply/info', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        this.dataList = res.data
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    submitData (type) {
      if (type === '2') {
        this.$confirm('是否发送邮件?', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          // 发送 申请者邮件 0 不发送 1发送
          // Integer approveSend;
          // 发送 被申请者邮件 0 不发送 1发送
          // Integer approveForSend;
          let emailList = {}
          emailList.approveSend = 1
          emailList.approveForSend = 1
          this.submitApproval(type, emailList)
        }).catch(action => {
          if (action === 'cancel') {
            let emailList = {}
            emailList.approveSend = 0
            emailList.approveForSend = 0
            this.submitApproval(type, emailList)
          }
        })
      } else {
        this.submitApproval(type, {})
      }
    },
    submitApproval (type, emailList) {
      if (this.type !== '12') {
        let thisvm = this
        // 默认先清空目录树缓存数据
        thisvm.$ctcLoading.open()
        let params = { recordId: this.selectData.id, approvalResult: type, ...this.dataForm, ...emailList }
        thisvm.$http.post('/account4a/acctApprove/approve', params).then(({ data: res }) => {
          thisvm.$ctcLoading.close()
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          }
          this.$emit('close', 'refresh')
        }).catch(() => {
          thisvm.$ctcLoading.close()
        })
      } else {
        let thisvm = this
        // 默认先清空目录树缓存数据
        thisvm.$ctcLoading.open()
        let params = { recordIds: this.selectData.id, approvalResult: type, ...this.dataForm, ...emailList }
        thisvm.$http.post('/account4a/acctApprove/approve/batch', params).then(({ data: res }) => {
          thisvm.$ctcLoading.close()
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          }
          this.$emit('close', 'refresh')
        }).catch(() => {
          thisvm.$ctcLoading.close()
        })
      }
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
    .el-row{
        margin-bottom: 20px;
    }
</style>
