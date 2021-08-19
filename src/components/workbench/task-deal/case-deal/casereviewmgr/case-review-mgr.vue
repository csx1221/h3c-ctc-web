<template>
  <el-container style="height: 100%; ">
    <project-case-review-list :projectData="projectData" :baseInfo="baseInfo" :inType="inType"></project-case-review-list>
  </el-container>
</template>
<script>
import ProjectCaseReviewList from './project-case-review-list'
export default {
  name: 'CaseReviewMgr',
  components: { ProjectCaseReviewList },
  props: {
    inType: [Number, String],
    baseInfo: {
      type: Object
    }
  },
  data () {
    return {
      pnameFromCase: '',
      projectData: {
        // nodeType 1:项目2:子项目;3:阶段
        nodeType: '',
        projectId: '',
        projectName: '',
        random: ''
      },
      projectTreeData: [],
      defaultProps: {
        children: 'zones',
        label: 'nodeName',
        isLeaf: 'leaf'
      },
      loadTree: false
    }
  },
  watch: {
    baseInfo: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.$nextTick(() => {
          // 设置左侧用例按照工单id查询
          let projectData = {}
          projectData.orderId = newVal.result.orderId
          this.projectData = projectData
        })
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
  }
}
</script>
<style  lang="scss" scoped>
.toolbars {
  margin-top: 5px;
  text-align: right;
  div {
    float: right;
    margin: 5px 10px;
    cursor: pointer !important;
  }
}
</style>
