<template>
  <el-dialog :visible.sync="visible" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form label-position="right" :model="dataForm" ref="dataForm" label-width="220px">
      <el-form-item prop="type" label="字典类型">{{ ['项目', '任务', '工单', '用例主本', '用例副本', '参测对象', '参测对象成员', '项目成员', '工单执行人', '机构'][dataForm.type] || showNull}}</el-form-item>
      <el-form-item prop="requestUrl" label="请求地址">{{dataForm.requestUrl || showNull}}</el-form-item>
      <el-form-item prop="requestParams" label="请求参数">{{dataForm.requestParams || showNull}}</el-form-item>
      <el-form-item prop="requestMethod" label="请求方法">{{dataForm.requestMethod || showNull}}</el-form-item>
      <el-form-item prop="opertionType" label="操作类型">{{ ['新增', '修改', '删除', '推送', '其他'][dataForm.opertionType] }}</el-form-item>
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
      this.$http.get(`/ctc/servicebus/route/${this.dataForm.id}`).then(({ data: res }) => {
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
