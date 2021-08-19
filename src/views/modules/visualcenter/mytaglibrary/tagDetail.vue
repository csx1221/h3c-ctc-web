<template>
  <el-dialog :visible.sync="visible" @close="closeToast" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form label-position="right" :model="dataForm" ref="dataForm" label-width="220px">
      <el-form-item prop="labelId" label="标识ID">{{dataForm.labelId || showNull}}</el-form-item>
      <el-form-item prop="labelName" label="标签名字">{{dataForm.labelName || showNull}}</el-form-item>
      <el-form-item prop="count" label="项目数量">{{ dataForm.count || showNull}}</el-form-item>
      <el-form-item prop="creator" label="创建人标识ID">{{dataForm.creator || showNull}}</el-form-item>
      <el-form-item prop="creatorName" label="创建人">{{dataForm.creatorName || showNull}}</el-form-item>
      <el-form-item prop="createDate" label="标签创建时间">{{dataForm.createDate || showNull}}</el-form-item>
      <el-form-item prop="remark" label="备注">{{ dataForm.remark || showNull }}</el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      showNull: '无',
      visible: false,
      title: '标签详情',
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
      this.$http.get(`/ctc/project/projectLabel/getLabelById/${this.dataForm.id}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        res.data.status = res.data.status + ''
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
      }).catch(() => {})
    },
    closeToast () {
      this.dataForm = {}
    }
  }
}
</script>
