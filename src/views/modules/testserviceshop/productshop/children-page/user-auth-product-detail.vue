<template>
  <el-card shadow="never" class="aui-card--fill user-auth-product-detail">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-row id="target1">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">申请单信息</span></el-divider>
            <el-col :span="24">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="申请单号：" prop="billNo">
                    {{dataForm.billNo}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="申请状态：" prop="applyStatus">
                    <span :style="getApplyStatusType(dataForm.applyStatus)">{{$getDictLabel('applyStatus', dataForm.applyStatus)}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="申请人：" prop="applicant">
                    {{dataForm.applicantName}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="申请时间：" prop="billNo">
                    {{dataForm.applyDate}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row id="target2">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">申请产品信息</span></el-divider>
            <el-col :span="24">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="产品名称：" prop="name">
                    {{dataForm.name}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="产品责任人：" prop="linkManName">
                    {{dataForm.linkManName}}
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系方式：" prop="contact">
                    {{dataForm.contact}}
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="申请原因：" prop="applyReason">
                    {{dataForm.applyReason}}
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row id="target3">
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">审批进度</span></el-divider>
            <el-col :span="24">
              <el-row>
                <el-col :span="24" style="padding-left:6%;padding-right:6%;padding-top:24px;padding-bottom:24px;">
                  <el-steps :active="activeStep" finish-status="success">
                    <el-step title="申请权限" :description="dataForm.applicantName +'，申请时间：'+ dataForm.applyDate"></el-step>
                    <el-step title="当前审批人" :description="dataForm.approvePersonName+'，申请意见：'+ dataForm.approvalOpinion"></el-step>
                    <el-step title="完成"></el-step>
                  </el-steps>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-col :span="24" class="submit-button-info">
            <el-button size="small" @click="doCancel">取消</el-button>
            <el-button type="primary" size="small" @click="doSubmit(1)" v-if="dataForm.applyStatus==1">撤 销</el-button>
            <el-button type="info" size="small" v-if="dataForm.applyStatus==1">催单</el-button>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { removeCurrentTabsHandle } from '@/router'
export default {
  name: 'UserAuthProductDetail',
  components: {
  },
  data () {
    return {
      activeStep: 2,
      dataForm: {
        billId: '',
        approvalOpinion: '',
        applicant: '2222',
        applicantName: '张三',
        applyDate: '2020-09-04',
        approvePerson: '1111',
        approvePersonName: '赵武'
      }
    }
  },
  computed: {
    dataRule () {
      return {
      }
    }
  },
  mounted () {
    let productId = this.$route.params.productId || ''
    let billId = this.$route.params.billId || ''
    this.dataForm.productId = productId
    this.dataForm.billId = billId
    // 获取申请单信息
    this.getApprovalBillById()
    // 获取产品信息
    this.getProductInfoById()
  },
  methods: {
    getApplyStatusType (applyStatus) {
      if (applyStatus === 1) {
        return { 'color': '#4190f7' }
      } else if (applyStatus === 2) {
        return { 'color': '#E6A23C' }
      } else if (applyStatus === 3) {
        return { 'color': '#F56C6C' }
      } else if (applyStatus === 4) {
        return { 'color': '#67C23A' }
      }
    },
    getApprovalBillById () {
      let params = { 'billId': this.dataForm.billId }
      this.$http.get('/ctc/shop/productapply/applyform', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          if (res.data) {
            this.dataForm = { ...this.dataForm, ...res.data }
          } else {
            this.$message.warning('暂无申请单详情数据')
            this.doCancel()
          }
        }
      }).catch(() => { })
    },
    getProductInfoById () {
      let params = { 'productId': this.dataForm.productId }
      this.$http.get('/ctc/shop/productinfo/info', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.dataForm = { ...this.dataForm, ...res.data }
        }
      }).catch(() => { })
    },
    doCancel () {
      // 提交成功关闭当前tab
      removeCurrentTabsHandle(this)
    },
    doSubmit (type) {
      // 1催单;2:撤销
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {}
          params.billId = this.dataForm.billId
          // 新增：post;修改：put
          this.$http.post('/ctc/shop/productapply/revokeapply', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
              }
            })
            this.doCancel()
          }).catch(() => { })
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style  lang="scss" scoped>
.user-auth-product-detail {
  margin-bottom: 50px;
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .el-timeline-footer {
    position: fixed;
    top: 45%;
    z-index: 2;
  }
  .submit-button-info {
    text-align: center;
  }
}
</style>
