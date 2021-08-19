<template>
  <el-dialog title="您确定要下架该产品吗？" :visible.sync="innerVisible" :close-on-click-modal="false" width="25%" class="product-sole-out">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="24" style="text-align:center;margin-bottom:30px;">
              <el-radio v-model="dataForm.offShellType" label="0">临时下架</el-radio>
              <el-radio v-model="dataForm.offShellType" label="1">永久下架</el-radio>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <div class="grid-content bg-purple-dark"></div>
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'ProductSoleOut',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        productIds: [],
        // 0已下架（临时） 1已下架（永久）
        offShellType: '0'
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
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.dataForm.projectStatus = '3'
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {}
          params.ids = this.dataForm.productIds
          params.offShellType = this.dataForm.offShellType
          this.$http.put('/ctc/shop/productinfo/offshelf', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.handleDialogClose()
                this.$emit('refreshDataList')
              }
            })
          }).catch(() => { })
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss" scoped>
.product-sole-out {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
