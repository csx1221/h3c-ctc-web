<template>
  <el-container style="height: 100%; ">
    <split-bar>
      <div slot='split_left' style="background-color: white;height: 100%;padding: 20px 10px 0;margin-right: 10px;margin-left: -5px;">
        <el-row>
          <el-col :span="12" class="split-line">
            下发用例树
          </el-col>
          <el-col :span="12" class="toolbars">
            <div @click="getSeachTreeData"><img src="../../../../assets/img/reload.png" /> 刷新</div>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:10px;margin-top:5px;">
          <el-input placeholder="项目\子项目\任务" v-model="pnameFromCase" clearable class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getSeachTreeData"></el-button>
          </el-input>
        </el-row>
        <el-tree highlight-current ref="projectTreeData" :data="projectTreeData" :load="loadTreeNode" lazy :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:800px;overflow-y:auto;overflow-x:hidden;">
          <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
            <!--nodeType={1:项目;2子项目;4:任务;5:机构}-->
            <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
            <span>{{data.nodeName}}</span>
          </span>
        </el-tree>
      </div>
      <el-container slot='split_right'>
        <div style="margin-left: 10px;-webkit-box-flex: 1;box-sizing: border-box;flex: 1 1 auto;overflow: auto;">
          <execute-case-list :projectData="projectData"></execute-case-list>
        </div>
      </el-container>
    </split-bar>
  </el-container>
</template>
<script>
import ExecuteCaseList from './execute-case-list'
export default {
  name: 'ExecuteCaseMgr',
  components: { ExecuteCaseList },
  data () {
    return {
      pnameFromCase: '',
      projectData: {
        // nodeType 1:项目2:子项目;3:阶段
        nodeType: -1,
        projectId: '',
        projectName: '',
        random: ''
      },
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
    getTreeIcon (type, data) {
      if (type === 'src') {
        let icon = ''
        if (data.nodeType === 1) {
          icon = 'icon_1'
        } else if (data.nodeType === 2) {
          icon = 'icon_2'
        } else if (data.nodeType === 3) {
          icon = 'icon_3'
        } else if (data.nodeType === 4) {
          icon = 'icon_4'
        } else if (data.nodeType === 5) {
          icon = 'sys_icon_1'
        }
        return require('../../../../assets/img/' + icon + '.png')
      } else {
        let mapInfo = { '1': '项目', '2': '子项目', '4': '任务', '5': '机构' }
        return mapInfo[data.nodeType] + '：' + data.nodeName
      }
    },
    getSeachTreeData () {
      let thisvm = this
      let params = { 'nameFromExecCase': thisvm.pnameFromCase }
      thisvm.$http.get('/ctc/project/projectDetail/listTreeRoot', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        let datas = res.data
        thisvm.projectTreeData = datas
      }).catch(() => {
        thisvm.projectTreeData = []
      })
    },
    // 获取项目-任务树的数据
    getProjectTaskTreeData (resolve) {
      let params = { 'nameFromExecCase': this.pnameFromCase }
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
        let params = { 'id': node.data.id, 'nodeType': nodeType, 'childNodeType': childNodeType }
        let url = '/ctc/project/projectDetail/listTree'
        if (childNodeType === 2) {
          url = '/ctc/project/projectDetail/listTree'
        } else if (childNodeType === 3 || childNodeType === 4) {
          url = '/ctc/task/tree/listTaskTreeRoot'
          params.taskType = 7
        } else if (childNodeType === 5) {
          url = '/ctc/task/tree/listParticipantTreeRoot'
        }
        this.$http.get(url, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            let data = res.data
            // 特殊处理任务节点数据，设置叶子节点
            if (childNodeType === 5) {
              data.map((item, index) => {
                item.leaf = true
              })
            }
            resolve(data)
          }
        }).catch(() => {
        })
      }
    },
    handleNodeClick (data) {
      // nodeType 1:项目2:子项目;4:任务;5:用例
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
          projectData.parentProjectId = ''
          projectData.projectId = id
        }
        projectData.taskId = ''
        projectData.organizeId = ''
      } else if (nodeType === 2) {
        projectData.projectId = id
        projectData.parentProjectId = pid
        projectData.taskId = ''
        projectData.organizeId = ''
      } else if (nodeType === 4) {
        projectData.taskId = id
        projectData.parentProjectId = data.parentProjectId || ''
        projectData.projectId = data.projectId || ''
        projectData.organizeId = ''
      } else if (nodeType === 5) {
        projectData.projectId = data.projectId || ''
        projectData.organizeId = id
        projectData.taskId = pid
      }
      // projectData.random = Math.random()
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
    margin: 5px 10px;
    cursor: pointer !important;
  }
}
</style>
