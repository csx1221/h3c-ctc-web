<template>
  <el-dialog :visible.sync="visible" title="选择催单类型" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
    <div style="text-align: center">
      <el-radio v-model="radio" label="2" border :disabled="true">短信催单</el-radio>
      <el-radio v-model="radio" label="1" border>邮件催单</el-radio>
      <el-radio v-model="radio" label="" border :disabled="true">邮件和短信催单</el-radio>
    </div>
    <template slot="footer">
      <el-button size="small" @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" size="small" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
<script>
export default {
  name: 'reminder',
  data () {
    return {
      visible: true,
      radio: '1',
      rows: []
    }
  },
  computed: {},
  watch: {

  },
  mounted () {
  },
  methods: {
    // 初始化
    init () {
      this.visible = true
    },
    // 表单提交
    dataFormSubmitHandle () {
      this.$ctcLoading.open()
      let arr = []
      for (let i = 0; i < this.rows.length; i++) {
        let node = {}
        node.orderId = this.rows[i].orderId
        if (this.rows[i].userId) {
          node.userId = this.rows[i].userId.split('、')
        }
        arr.push(node)
      }
      let params = { 'type': this.radio, 'user': arr }
      this.$http.post('/ctc/task/workOrder/email', { 'params': params }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.$emit('refreshDataList')
          this.visible = false
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    }
  }
}
</script>

<style scoped>
</style>
