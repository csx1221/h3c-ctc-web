<template>
  <el-row>
    <el-col :span="24">
      <case-design-mgr v-if="orderType==5" :baseInfo="baseInfo" :inType="inType"></case-design-mgr>
      <case-review-mgr v-if="orderType==6" :baseInfo="baseInfo" :inType="inType"></case-review-mgr>
    </el-col>
  </el-row>
</template>
<script>
import CaseDesignMgr from './casedesignmgr/case-design-mgr'
import CaseReviewMgr from './casereviewmgr/case-review-mgr'

export default {
  name: 'CaseDealPage',
  components: {
    CaseDesignMgr, CaseReviewMgr
  },
  props: {
    orderType: [Number, String],
    inType: [Number, String],
    isDisable: Boolean
  },
  data () {
    return {
      baseInfo: {
        result: {},
        attachementId: ''
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    submitForm (type) {
      this.$emit('watchChildTaskDeal', type)
    },
    resultData (result, attachementId) {
      this.baseInfo.result = result
      this.baseInfo.attachementId = Math.random()
    }
  }
}
</script>
<style lang="scss">
.project-case-container {
}
</style>
<style lang="scss" scoped>
.project-case-container {
}
</style>
