<template>
  <el-container style="height: 100%; ">
    <split-bar>
      <div slot='split_left' style="background-color: white;height: 100%;padding: 20px 10px 0;margin-right: 10px;margin-left: -5px;">
        <el-row style="margin-bottom:10px;margin-top:5px;">
          <el-input placeholder="请输入项目\子项目名称" v-model="treeProjectName" @keyup.enter.native="reloadTree()" clearable class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="reloadTree"></el-button>
          </el-input>
        </el-row>
        <el-tree highlight-current v-if="leftTree" :data="projectTreeData" :load="loadTreeNode" lazy :props="defaultProps" node-key="id" :default-expanded-keys="expandedKeys" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:710px;overflow-y:auto;overflow-x:hidden;">
          <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
            <!--nodeType={1:项目;2子项目;3:阶段;4:任务;模块6}-->
            <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
            <span>{{data.nodeName}}</span>
          </span>
        </el-tree>
      </div>
      <el-container slot='split_right'>
        <div style="margin-left: 10px;-webkit-box-flex: 1;box-sizing: border-box;flex: 1 1 auto;overflow: auto;">
          <project-task-list :projectData="projectData"></project-task-list>
        </div>
      </el-container>
    </split-bar>
  </el-container>
</template>
<script>
import ProjectTaskList from './project-task-list'
export default {
  components: {
    ProjectTaskList
  },
  data () {
    return {
      treeProjectName: '',
      projectData: {
        // nodeType 1:项目2:子项目;3:阶段
        nodeType: -1,
        projectId: '',
        projectName: '',
        random: ''
      },
      expandedKeys: [],
      projectTreeData: [],
      defaultProps: {
        children: 'zones',
        label: 'nodeName',
        isLeaf: 'leaf'
      },
      leftTree: true
    }
  },
  created () {
    // 项目明细入口(1:项目归档;0:项目列表)
    this.projectData.projectDetailMain = this.$route.params.projectDetailMain || '0'
    this.projectData.projectId = this.$route.params.projectId || ''
    this.projectData.projectName = this.$route.params.projectName || ''
    this.projectData.type = this.$route.params.type || '0'
  },
  methods: {
    getTreeIcon (type, data) {
      if (type === 'src') {
        return require('../../../../../assets/img/icon_' + data.nodeType + '.png')
      } else {
        let mapInfo = { '1': '项目', '2': '子项目', '3': '阶段', '4': '任务', '6': '模块' }
        return mapInfo[data.nodeType] + '：' + data.nodeName
      }
    },
    reloadTree () {
      let thisvm = this
      thisvm.leftTree = false
      setTimeout(function () {
        thisvm.leftTree = true
      }, 400)
    },
    // 获取项目-任务树的数据
    getProjectTaskTreeData (resolve) {
      let params = { 'projectId': this.projectData.projectId, 'name': this.treeProjectName }
      // 根据是否查询，来判断是否展开
      let expandedBool = (params.name !== '')
      this.$http.get('/ctc/project/projectDetail/listTreeRoot', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        let expandedKeys = []
        if (expandedBool) {
          res.data.forEach((item, index) => {
            expandedKeys.push(item.id)
          })
        }
        this.expandedKeys = expandedKeys
        resolve(res.data)
      }).catch(() => { })
    },
    loadTreeNode (node, resolve) {
      // nodeType 1:项目2:子项目;3:阶段
      if (node.level === 0) {
        this.getProjectTaskTreeData(resolve)
      } else {
        let params = { 'id': node.data.id, 'nodeType': node.data.nodeType }
        this.$http.get('/ctc/project/projectDetail/listTree', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            resolve(res.data)
          }
        }).catch(() => {
        })
      }
    },
    handleNodeClick (data) {
      // nodeType 1:项目2:子项目;3:阶段
      this.projectData.nodeId = data.id
      this.projectData.nodeName = data.nodeName
      this.projectData.nodePid = data.pid
      this.projectData.nodeType = data.nodeType
      this.projectData.childNodeType = data.childNodeType
      this.projectData.random = Math.random()
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc-split-left {
  width: 200px;
  padding: 10px;
  border-right: 3px solid #ccc;
  background: #fff;
  height: 780px;
  overflow-y: auto;
}
.ctc-split-right {
  background: #fff;
  height: 780px;
}
</style>
