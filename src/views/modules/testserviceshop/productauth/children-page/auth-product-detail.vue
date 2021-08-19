<template>
  <el-card shadow="never" class="aui-card--fill auth-product-detail">
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
                    {{$getDictLabel('applyStatus', dataForm.applyStatus)}}
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
                  <el-form-item label="产品责任人：" prop="linkMan">
                    {{dataForm.linkMan}}
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
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">审批操作</span></el-divider>
            <el-col :span="24">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="" prop="approvalOpinion">
                    <el-input v-model="dataForm.approvalOpinion" :rows="4" placeholder="请输入审批意见" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-col :span="24" class="submit-button-info">
            <el-button size="small" @click="doCancel">取消</el-button>
            <el-button type="primary" size="small" @click="doSubmit(2)">通 过</el-button>
            <el-button type="info" size="small" @click="doSubmit(3)">不通过</el-button>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { removeCurrentTabsHandle } from '@/router'
export default {
  name: 'AuthProductDetail',
  components: {
  },
  data () {
    return {
      dataForm: {
        billId: '',
        approvalOpinion: ''
      }
    }
  },
  computed: {
    dataRule () {
      return {
        approvalOpinion: [
          { required: true, message: '审批意见不允许为空', trigger: 'blur' },
          { required: true, message: '审批意见不允许为空', trigger: 'change' }
        ]
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
    getApprovalBillById () {
      let params = { 'billId': this.dataForm.billId }
      this.$http.get('/ctc/shop/productapply/applyform', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.dataForm = { ...this.dataForm, ...res.data }
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
    doSubmit (applyStatus) {
      // 1待审核 2审核通过 3审核不通过
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {}
          params.billIds = [this.dataForm.billId]
          params.applyStatus = applyStatus
          params.approvalOpinion = this.dataForm.approvalOpinion
          params.applyData = [{ 'productId': this.dataForm.productId, 'orderPerson': this.dataForm.applicant, 'orderPersonName': this.dataForm.applicantName }]
          // 新增：post;修改：put
          this.$http.post('/ctc/shop/productapply/save', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
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
.auth-product-detail {
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
