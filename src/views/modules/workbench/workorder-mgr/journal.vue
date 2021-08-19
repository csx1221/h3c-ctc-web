<template>
  <el-dialog :visible.sync="visible" title="工单日志" :close-on-click-modal="false" :close-on-press-escape="false">
    <workOrderLog :orderId="orderId" ref="workOrderLog"></workOrderLog>
  </el-dialog>
</template>

<script>
import workOrderLog from '@/components/workbench/work-order-log'
export default {
  name: 'journal',
  data () {
    return {
      visible: true,
      radio: '',
      orderId: ''
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
      // this.$nextTick(() => {
      //     this.$refs['dataForm'].resetFields()
      // })
    },
    // 表单提交
    dataFormSubmitHandle () {
      console.log(this.radio)
    }
  },
  components: {
    workOrderLog
  }
}
</script>

<style scoped>
</style>
