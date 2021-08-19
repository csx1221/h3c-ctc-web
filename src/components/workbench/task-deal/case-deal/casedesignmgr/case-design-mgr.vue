<template>
  <el-container style="height: 100%; ">
    <split-bar>
      <div slot='split_left' style="background-color: white;height: 100%;padding: 20px 10px 0;margin-right: 10px;margin-left: -5px;">
        <el-row>
          <el-col :span="12" class="split-line">
            项目用例树
          </el-col>
          <el-col :span="12" class="toolbars">
            <div @click="getProjectTaskTreeData"><img src="../../../../../assets/img/reload.png" /></div>
          </el-col>
        </el-row>
        <el-tree highlight-current ref="projectTreeData" :data="projectTreeData" :props="defaultProps" node-key="id" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false" style="max-height:710px;overflow-y:auto;overflow-x:hidden;">
          <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
            <!--nodeType={1:项目;2子项目;4:任务;6::用例}-->
            <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
            <span>{{data.nodeName}}</span>
          </span>
        </el-tree>
      </div>
      <el-container slot='split_right'>
        <div style="margin-left: 10px;-webkit-box-flex: 1;box-sizing: border-box;flex: 1 1 auto;overflow: auto;">
          <project-case-list :projectData="projectData" :baseInfo="baseInfo" :inType="inType" @watchChildTree="triggerParentPage"></project-case-list>
        </div>
      </el-container>
    </split-bar>
  </el-container>
</template>
<script>
import ProjectCaseList from './project-case-list'
export default {
  name: 'CaseDesignMgr',
  components: { ProjectCaseList },
  props: {
    inType: [Number, String],
    baseInfo: {
      type: Object
    }
  },
  data () {
    return {
      nameFromProjectCase: '',
      projectData: {
        // nodeType 1:项目2:子项目;3:阶段
        nodeType: '',
        projectId: '',
        projectName: '',
        random: ''
      },
      expandedKeys: [],
      projectTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  watch: {
    baseInfo: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.getProjectTaskTreeData()
        // 设置左侧用例按照工单id查询
        let projectData = {}
        projectData.orderId = newVal.result.orderId
        this.projectData = projectData
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    triggerParentPage (message) {
      if (message.type === 'reloadTable') {
        this.projectData.random = Math.random()
      } else if (message.type === 'reloadTree') {
        // let taskId = message.data.taskId
        // 通过节点id找到对应树节点对象
        // let node = this.$refs.projectTreeData.getNode(taskId)
        // node.loaded = false
        // 主动调用展
        // node.expand()
      }
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        return require('../../../../../assets/img/icon_' + data.nodeType + '.png')
      } else {
        let mapInfo = { '1': '项目', '2': '子项目', '4': '任务' }
        return mapInfo[data.nodeType] + '：' + data.nodeName
      }
    },
    // 获取项目-任务树的数据
    getProjectTaskTreeData () {
      if (this.baseInfo.result.orderId) {
        this.$http.get('/ctc/task/workOrder/getProjectTree/' + this.baseInfo.result.taskId).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          let datas = res.data
          this.projectTreeData = datas
        }).catch(() => {
          this.projectTreeData = []
        })
      }
    },
    handleNodeClick (data) {
      // nodeType 1:项目2:子项目;3,4:任务;6:用例
      let id = data.id
      let pid = data.pid
      let nodeType = data.nodeType
      let childNodeType = data.childNodeType
      let projectData = {}
      // 设置左侧用例按照工单id查询
      projectData.orderId = this.baseInfo.result.orderId
      if (nodeType === 1) {
        if (childNodeType === 2) {
          projectData.parentProjectId = id
          projectData.projectId = ''
        } else {
          projectData.parentProjectId = ''
          projectData.projectId = id
        }
        projectData.taskId = ''
        projectData.caseId = ''
      } else if (nodeType === 2) {
        projectData.projectId = id
        projectData.parentProjectId = pid
        projectData.taskId = ''
        projectData.caseId = ''
      } else if (nodeType === 4) {
        projectData.taskId = id
        projectData.parentProjectId = data.parentProjectId || ''
        projectData.projectId = data.projectId || ''
        projectData.caseId = ''
      } else if (nodeType === 6) {
        projectData.caseId = id
        projectData.taskId = pid
      }
      projectData.random = Math.random()
      this.projectData = projectData
    }
  }
}
</script>
<style  lang="scss" scoped>
.toolbars {
  margin-top: 5px;
  text-align: right;
  div {
    float: right;
    margin: 5px 5px;
    cursor: pointer !important;
  }
}
</style>
