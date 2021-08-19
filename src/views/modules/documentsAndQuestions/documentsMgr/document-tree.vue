<template>
  <el-container style="height: 100%; ">
    <split-bar>
      <div slot='split_left' style="background-color: white;height: 100%;padding: 20px 10px 0;margin-right: 10px;margin-left: -5px;">
        <el-row>
          <el-col :span="12" class="split-line">
            文档目录树
          </el-col>
          <el-col :span="12" class="toolbars">
            <div @click="getSeachTreeData"><img src="../../../../assets/img/reload.png" /></div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:10px;margin-top:5px;">
          <el-input placeholder="项目名" v-model="dirName" @keyup.enter.native="getSeachTreeData()" clearable class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getSeachTreeData"></el-button>
          </el-input>
        </el-row>
        <el-tree highlight-current ref="projectTreeData" :data="projectTreeData" :load="loadTreeNode" lazy :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:700px;overflow-y:auto;overflow-x:hidden;">
          <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
            <!--dirType={1:项目;2:目录;}-->
            <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
            <span>{{data.dirName}}</span>
          </span>
        </el-tree>
      </div>
      <el-container slot='split_right'>
        <div style="margin-left: 10px;-webkit-box-flex: 1;box-sizing: border-box;flex: 1 1 auto;overflow: auto;">
          <document-list :projectData="projectData" @watchChildTree="triggerParentPage"></document-list>
        </div>
      </el-container>
    </split-bar>
  </el-container>
</template>
<script>
import DocumentList from './document-list'
export default {
  name: 'DocumentTree',
  components: { DocumentList },
  data () {
    return {
      dirName: '',
      projectData: {
        projectId: '',
        // dirType 1:项目2:目录;
        dirType: '',
        random: ''
      },
      expandedKeys: [],
      projectTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      dirTreeMap: {},
      dirModule: false
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    triggerParentPage (message) {
      if (message.type === 'reloadTree') {
        this.getSeachTreeData()
      }
    },
    doDirModuleEdit (data) {
      this.$refs.dirModule.dirEditData = data
      this.$refs.dirModule.init()
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        return require('../../../../assets/img/icon_' + data.dirType + '.png')
      } else {
        let mapInfo = { '1': '项目', '2': '目录' }
        return mapInfo[data.dirType] + '：' + data.dirName
      }
    },
    getSeachTreeData () {
      let thisvm = this
      let params = { 'dirName': thisvm.dirName }
      thisvm.$http.get('/ctc/project/docDirManage/listTree', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        let data = res.data
        data.forEach((item, index) => {
          thisvm.dirTreeMap[item.id] = { 'pathId': [item.id], 'pathName': [item.dirName] }
        })
        thisvm.projectTreeData = data
      }).catch(() => {
        thisvm.projectTreeData = []
      })
    },
    // 获取项目-任务树的数据
    getProjectTaskTreeData (resolve) {
      let params = { 'dirName': this.dirName }
      this.$http.get('/ctc/project/docDirManage/listTree', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        let data = res.data
        data.forEach((item, index) => {
          this.dirTreeMap[item.id] = { 'pathId': [item.id], 'pathName': [item.dirName] }
        })
        resolve(data)
      }).catch(() => { })
    },
    loadTreeNode (node, resolve) {
      // dirType 1:项目2:目录
      if (node.level === 0) {
        this.getProjectTaskTreeData(resolve)
      } else {
        let tnode = Object.assign({}, node)
        let dirLevel = tnode.data.dirLevel
        let params = {}
        if (dirLevel === 0) {
          params = { 'projectId': tnode.data.id, 'dirLevel': dirLevel + 1 }
        } else {
          params = { 'pid': tnode.data.id, 'dirLevel': dirLevel + 1 }
        }
        let url = '/ctc/project/docDirManage/listTree'
        this.$http.get(url, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            let data = res.data
            data.forEach((item, index) => {
              let pidObj = this.dirTreeMap[item.pid] || this.dirTreeMap[item.projectId] || {}
              let pathId = [item.id].concat(pidObj.pathId)
              let pathName = [item.dirName].concat(pidObj.pathName)
              this.dirTreeMap[item.id] = { 'pathId': pathId, 'pathName': pathName }
            })
            resolve(data)
          }
        }).catch(() => {
        })
      }
    },
    handleNodeClick (node) {
      let tnode = Object.assign({}, node)
      let nodePath = this.dirTreeMap[tnode.id] || this.dirTreeMap[tnode.projectId] || {}
      let pathIdArr = nodePath.pathId
      let pathNameArr = nodePath.pathName
      nodePath.pathId = pathIdArr.reverse()
      nodePath.pathName = pathNameArr.reverse()
      tnode.nodePath = nodePath
      tnode.dirId = tnode.id
      let projectData = tnode
      // 特殊处理异常数据
      projectData.ifRead = projectData.ifRead || 1
      projectData.ifWrite = projectData.ifWrite || 0
      projectData.ifAdmin = projectData.ifAdmin || 0
      projectData.random = Math.random()
      this.projectData = { ...this.projectData, ...projectData }
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
