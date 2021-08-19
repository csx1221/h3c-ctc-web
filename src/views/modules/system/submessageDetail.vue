<template>
  <el-dialog :visible.sync="visible" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form label-position="right" :model="dataForm" ref="dataForm" label-width="160px">
      <el-form-item prop="dataSource" label="数据来源">{{ ['集中化平台', '集成平台'][dataForm.dataSource] || showNull }}</el-form-item>
      <el-form-item prop="businessType" label="业务类型">{{ ['项目', '任务', '工单', '用例主本', '用例副本', '参测对象', '参测对象成员', '项目成员', '工单执行人', '机构'][dataForm.businessType] || showNull }}</el-form-item>
      <el-form-item prop="operationType" label="业务操作">{{ ['新增', '修改', '删除', '其他'][dataForm.operationType] || showNull }}</el-form-item>
      <el-form-item prop="processingStatus" label="处理状态">{{ ['未处理', '消费成功', '消费失败', '已处理', '人工处理'][dataForm.processingStatus] || showNull }}</el-form-item>
      <el-form-item prop="content" label="内容">{{ dataForm.content || showNull }}</el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" @click="visible = false">{{ $t('confirm') }}</el-button>
    </template>
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
      this.$http.get(`/ctc/servicebus/messagefail/${this.dataForm.id}`).then(({ data: res }) => {
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
