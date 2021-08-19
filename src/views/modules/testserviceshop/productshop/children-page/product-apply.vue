<template>
  <el-dialog title="产品申请" :visible.sync="innerVisible" :close-on-click-modal="false" width="40%" class="product-apply">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="产品名称：" prop="name">
                <el-input v-model="dataForm.name" placeholder="请输入产品名称" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="起止日期：" prop="applyDate">
                <el-date-picker v-model="dataForm.applyDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="applyEnv" label="申请环境：">
                <ctc-select v-model="dataForm.applyEnv" dict-type="productEnv" placeholder="请选择申请环境"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="applyReason" label="申请原因：">
                <el-input v-model="dataForm.applyReason" placeholder="请输入申请原因" :rows="4" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">提 交</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'ProductApply',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        productId: '',
        name: '',
        applyDate: '',
        applyEnv: '',
        applyReason: ''
      }
    }
  },
  watch: {
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    },
    dataRule () {
      return {
        name: [
          { required: true, message: '产品名称不允许为空', trigger: 'blur' },
          { required: true, message: '产品名称不允许为空', trigger: 'change' }
        ],
        applyDate: [
          { required: true, message: '申请日期不允许为空', trigger: 'blur' },
          { required: true, message: '申请日期不允许为空', trigger: 'change' }
        ],
        applyEnv: [
          { required: true, message: '申请环境不允许为空', trigger: 'blur' },
          { required: true, message: '申请环境不允许为空', trigger: 'change' }
        ],
        applyReason: [
          { required: true, message: '申请原因不允许为空', trigger: 'blur' },
          { required: true, message: '申请原因不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = this.dataForm
          params.productName = this.dataForm.name
          if (params.applyDate.length > 0) {
            params.effectDate = params.applyDate[0]
            params.expireDate = params.applyDate[1]
            delete params['applyDate']
          }
          // 新增：post;修改：put
          this.$http.post('/ctc/shop/productapply/apply', params).then(({ data: res }) => {
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
            this.handleDialogClose()
            this.$emit('watchChildPage')
          }).catch(() => { })
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss" scoped>
.product-apply {
  .el-select,
  .el-input-number,
  .el-date-editor {
    width: 100%;
  }
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
