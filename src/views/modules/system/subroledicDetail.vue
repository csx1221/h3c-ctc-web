<template>
  <el-dialog :visible.sync="visible" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form label-position="right" :model="dataForm" ref="dataForm" label-width="160px">
      <el-form-item prop="bizName" label="名称">{{dataForm.bizName || showNull}}</el-form-item>
      <el-form-item prop="bizValue" label="属性值">{{dataForm.bizValue || showNull}}</el-form-item>
      <el-form-item prop="comments" label="备注">{{dataForm.comments || showNull}}</el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      showNull: '无',
      visible: false,
      title: '查看详情',
      dataForm: {
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.getInfo()
        }
      })
    },
    getInfo () {
      this.$http.get(`/ctc/servicebus/routedic/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        res.data.status = res.data.status + ''
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    }
  }
}
</script>
