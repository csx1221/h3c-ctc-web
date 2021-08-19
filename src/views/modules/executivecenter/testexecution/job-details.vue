<template>
    <div>
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
        >
            <case-list ref="caseList"></case-list>
        </el-dialog>
    </div>
</template>

<script>
import caseList from '@/views/modules/executivecenter/testexecution/case-list'
export default {
  name: 'job-details',
  data () {
    return {
      title: '详情',
      dialogVisible: false
    }
  },
  watch: {
    dialogVisible (newValue, oldValue) {
      if (!newValue) {
        this.$emit('init')
      }
    }
  },
  methods: {
    init (row) {
      this.dialogVisible = true
      this.title = row.orderTitle
      this.$nextTick(() => {
        this.$refs.caseList.init(row.orderId)
      })
    }
  },
  components: {
    caseList
  }
}
</script>

<style scoped>

</style>
