<template>
  <el-container style="height: 100%; ">
    <split-bar>
      <div slot='split_left' style="background-color: white;height: 100%;padding: 20px 10px 0;margin-right: 10px;margin-left: -5px;">
        <el-row>
          <el-col :span="12" class="split-line">
            项目构件树
          </el-col>
          <el-col :span="12" class="toolbars">
            <div @click="getSeachTreeData"><img src="../../../../assets/img/reload.png" /></div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:10px;margin-top:5px;">
          <el-input placeholder="项目\子项目\任务名称" v-model="nameFromProjectCase" @keyup.enter.native="getSeachTreeData()" clearable class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getSeachTreeData"></el-button>
          </el-input>
        </el-row>
        <el-tree highlight-current ref="projectTreeData" :data="projectTreeData" :load="loadTreeNode" lazy :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:800px;overflow-y:auto;overflow-x:hidden;">
          <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
            <!--nodeType={1:项目;2子项目;4:任务;6::用例}-->
            <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
            <span>{{data.nodeName}}</span>
          </span>
        </el-tree>
      </div>
      <el-container slot='split_right'>
        <div style="margin-left: 10px;-webkit-box-flex: 1;box-sizing: border-box;flex: 1 1 auto;overflow: auto;">
          <caseset-list-page :projectData="projectData" @watchChildTree="triggerParentPage"></caseset-list-page>
        </div>
      </el-container>
    </split-bar>
  </el-container>
</template>
<script>
import CasesetListPage from './caseset-list-page'
export default {
  name: 'CasesetPage',
  components: { CasesetListPage },
  data () {
    return {
      nameFromProjectCase: '',
      projectData: {
        // nodeType 1:项目2:子项目;3:阶段
        nodeType: '',
        projectId: '',
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
        return require('../../../../assets/img/icon_' + data.nodeType + '.png')
      } else {
        let mapInfo = { '1': '项目', '2': '子项目', '7': '构件' }
        return mapInfo[data.nodeType] + '：' + data.nodeName
      }
    },
    getSeachTreeData () {
      let thisvm = this
      let params = { 'nameFromProjectCase': thisvm.nameFromProjectCase }
      thisvm.$http.get('/ctc/project/projectDetail/listTreeRoot', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        let data = res.data
        thisvm.projectTreeData = data
      }).catch(() => {
        thisvm.projectTreeData = []
      })
    },
    // 获取项目-任务树的数据
    getProjectTaskTreeData (resolve) {
      let params = { 'nameFromProjectCase': this.nameFromProjectCase }
      this.$http.get('/ctc/project/projectDetail/listTreeRoot', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        resolve(res.data)
      }).catch(() => { })
    },
    loadTreeNode (node, resolve) {
      // nodeType 1:项目2:子项目;4:任务
      if (node.level === 0) {
        this.getProjectTaskTreeData(resolve)
      } else {
        let nodeType = node.data.nodeType
        let childNodeType = node.data.childNodeType
        let params = { 'id': node.data.id, 'nodeType': nodeType }
        let url = '/ctc/project/projectDetail/listTree'
        if (childNodeType === 2) {
          url = '/ctc/project/projectDetail/listTree'
        } else {
          url = '/integration/builder/tree/list'
          params = { projectId: node.data.pid ? node.data.pid : node.data.id, projectSubId: node.data.pid ? node.data.id : '' }
        }
        this.$http.get(url, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            let data = res.data
            resolve(data)
          }
        }).catch(() => {
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
      if (nodeType === 1) {
        if (childNodeType === 2) {
          projectData.parentProjectId = id
          projectData.projectId = ''
        } else {
          projectData.projectId = id
        }
        projectData.builderId = ''
      } else if (nodeType === 2) {
        projectData.projectId = id
        projectData.parentProjectId = pid
        projectData.builderId = ''
      } else if (nodeType === 7) {
        projectData.projectId = pid
        projectData.builderId = id
      }
      projectData.random = Math.random()
      this.projectData = { ...this.projectData, ...projectData }
      // console.log(this.projectData)
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
