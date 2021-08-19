<template>
  <div>
    <!--订单类型(1 需求分析  2 需求评审  3 测试方案设计  4 测试方案评审  )-->
    <demand-plan-deal-page ref="taskDealObject" :isDisable="isDisable" :orderType="orderType" v-if="getShowOrderType('1,2,3,4')" @watchChildTaskDeal="triggerParentTaskDeal"></demand-plan-deal-page>
    <!--订单类型(5 用例设计  6 用例评审   )-->
    <case-deal-page ref="taskDealObject" :isDisable="isDisable" :orderType="orderType" :inType="inType" v-if="getShowOrderType('5,6')" @watchChildTaskDeal="triggerParentTaskDeal"></case-deal-page>
    <!--订单类型(7 用例执行   )-->
    <test-execute-deal-page ref="taskDealObject" :isDisable="isDisable" :orderType="orderType" :inType="inType" v-if="getShowOrderType('7')" @watchChildTaskDeal="triggerParentTaskDeal"></test-execute-deal-page>
  </div>
</template>
<script>
import DemandPlanDealPage from '../../task-deal/demand-plan-deal/demand-plan-deal-page'
import CaseDealPage from '../../task-deal/case-deal/case-deal-page'
import TestExecuteDealPage from '../../task-deal/test-execute-deal/test-execute-deal-page'
export default {
  name: 'workOrderProcessing',
  components: {
    DemandPlanDealPage, CaseDealPage, TestExecuteDealPage
  },
  props: {
    orderType: [Number, String],
    // pending:待办去处理;processed:已办去处理;order:工单去处理
    inType: [Number, String],
    orderData: [Object],
    // 已办:true,待办:false
    isDisable: Boolean
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    // 目前没有发现有场景用到触发父类方法
    triggerParentTaskDeal (type) {
      this.$emit('submitData', type)
    },
    getDataForm () {
      let dataForm = this.$refs.taskDealObject.dataForm
      return dataForm
    },
    getShowOrderType (type) {
      let typeArr = type.split(',')
      let bool = typeArr.includes(this.orderType + '')
      return bool
    },
    resultData (result, attachementId) {
      this.$nextTick(() => {
        this.$refs.taskDealObject.resultData(result, attachementId)
      })
    },
    submitForm (type) {
      this.$nextTick(() => {
        this.$refs.taskDealObject.submitForm(type)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
