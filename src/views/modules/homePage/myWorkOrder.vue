<template>
  <div class="bcw orderWork">
    <template v-if="roleType==='0'">
      <project-mgr-page ref="pmp"></project-mgr-page>
    </template>
    <template v-if="roleType==='1'">
      <workorder-mgr></workorder-mgr>
    </template>
    <template v-if="roleType==='2'">
      <my-to-do ref="mtd"></my-to-do>
    </template>
    <template v-if="roleType==='3'">
      <defect-mgr ref="dm"></defect-mgr>
    </template>
  </div>
</template>

<script>
import projectMgrPage from '@/views/modules/projects/project-new-mgr/project-mgr-page'
import workorderMgr from '@/views/modules/workbench/workorder-mgr/workordermgr-page'
import myToDo from '@/views/modules/workbench/mytodo/mytodo-page'
import defectMgr from '@/views/modules/defectcenter/defect-mgr/defect-mgr'
export default {
  name: 'myWorkOrder',
  components: {
    projectMgrPage, workorderMgr, myToDo, defectMgr
  },
  data () {
    return {
    }
  },
  props: {
    roleType: String
  },
  watch: {
    roleType (newVal, oldVal) {
      if (newVal === '0') {
        this.$nextTick(() => {
          this.$refs.pmp.getProjectInfo()
        })
      } else if (newVal === '2') {
        this.$nextTick(() => {
          this.$refs.mtd.loadTableData()
        })
      } else if (newVal === '3') {
        this.$nextTick(() => {
          this.$refs.dm.getRelevanceData()
        })
      }
    }
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.orderWork {
  /*height: 400px;*/
  padding: 10px;
}
</style>
