<template>
  <el-dialog title="布局调整(鼠标直接拖拽产品，进行布局位置调整)" :visible.sync="innerVisible" :close-on-click-modal="false" width="80%" class="product-layout">
    <el-row>
      <el-col :span="20" style="height:600px;overflow-y:auto;border:1px solid #ccc;">
        <el-tag v-for="(item,index) in productListData" :key="index" effect="dark" v-dragging="{ item: item, list: productListData, group: 'color' }">
          {{ item.name }}
        </el-tag>
      </el-col>
      <el-col :span="4" style="height:600px;overflow-y:auto;border:1px solid #ccc;margin-left:-1px;" class="product-layout-list">
        <div v-for="(item,index) in productListData" :key="index">
          {{index+1}}：{{item.name}}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'ProductLayout',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      productListData: [
      ]
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
    }
  },
  mounted () {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.getProductInfo()
      })
    },
    getProductInfo () {
      let params = { 'page': 1, 'limit': 10000000 }
      this.$http.get('/ctc/shop/productinfo/layout/page', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.productListData = res.data.list
        }
      }).catch(() => { })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let layoutList = []
      this.productListData.forEach((item, index) => {
        layoutList.push({ 'productId': item.productId, 'layoutNum': index + 1 })
      })
      this.$http.put('/ctc/shop/productinfo/layout', { 'layoutList': layoutList }).then(({ data: res }) => {
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
        this.handleDialogClose()
      }).catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.product-layout {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
  .el-tag {
    margin: 10px;
    cursor: move;
  }
  .product-layout-list {
    div {
      margin: 5px;
      padding: 0px 5px;
      border: 1px solid #ccc;
      border-radius: 5px;
      height: 25px;
      line-height: 25px;
    }
  }
}
</style>
