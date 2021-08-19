<template>
  <el-row>
    <el-col :span="24" class="demand-plan-deal-page">
      <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px">
        <el-form-item prop="result" :label="labelName">
          <el-input :disabled="isDisable" type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForm.result"></el-input>
        </el-form-item>
        <el-form-item prop="file" label="附件上传">
          <ctc-file-upload :disabled="isDisable" ref="ctcFileUpload" v-model="dataForm.attachementId"></ctc-file-upload>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'DemandPlanDealPage',
  props: {
    orderType: [Number, String],
    isDisable: Boolean
  },
  data () {
    return {
      dataForm: {
        result: '',
        attachementId: ''
      },
      rules: {
        result: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      labelName: '',
      nameList: [
        { name: '分析结果', orderType: 1 },
        { name: '评审意见', orderType: 2 },
        { name: '设计结果', orderType: 3 },
        { name: '评审意见', orderType: 4 }
      ]
    }
  },
  computed: {},
  mounted () {
    this.setName()

    this.$refs.ctcFileUpload.customUploadParams = { 'maxCount': 50, 'checkFileType': ['.doc', '.docx', '.xls', '.xlsx'] }
    this.$refs.ctcFileUpload.init()
  },
  methods: {
    setName () {
      let type = this.orderType
      let result = this.nameList.filter(item => item.orderType === type)
      this.labelName = result[0].name
    },
    submitForm (type) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$emit('watchChildTaskDeal', type)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resultData (result, attachementId) {
      this.dataForm.result = result
      this.dataForm.attachementId = attachementId
      this.$refs.ctcFileUpload.echoInit(attachementId)
    }
  }
}
</script>
<style  lang="scss" scoped>
.demand-plan-deal-page {
}
</style>
