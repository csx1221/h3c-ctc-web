<template>
  <el-row>
    <el-col :span="24" class="test-execute-deal-page">
      <execution-case-list></execution-case-list>
    </el-col>
  </el-row>
</template>
<script>
import ExecutionCaseList from '../../../../views/modules/executivecenter/testexecution/case-list'
export default {
  name: 'TestExecuteDealPage',
  components: {
    ExecutionCaseList
  },
  props: {
    orderType: [Number, String],
    inType: [Number, String],
    isDisable: Boolean
  },
  data () {
    return {
      dataForm: {
        result: '',
        attachementId: ''
      }
    }
  },
  computed: {},
  mounted () { },
  methods: {
    submitForm (type) {
      this.$emit('watchChildTaskDeal', type)
    },
    resultData (result, attachementId) {
      console.log(result)
      this.dataForm.result = result
      this.dataForm.attachementId = attachementId
    }
  }
}
</script>
<style  lang="scss" scoped>
.test-execute-deal-page {
}
</style>
