<template>
  <div class="ctc-project-module-tree">
    <el-input v-model="showName" :placeholder="placeholder" @focus="treeDialog"  readonly>
      <el-button slot="append" icon="el-icon-search" @click="treeDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleTree" width="30%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row style="margin-bottom:10px;margin-top:5px;">
        <el-input placeholder="项目\子项目\任务名称" v-model="nameFromProjectCase" @keyup.enter.native="reloadTree()" clearable style="width:100%;">
          <el-button slot="append" icon="el-icon-search" @click="reloadTree"></el-button>
        </el-input>
      </el-row>
      <el-tree v-if="caseTree" ref="tree" :load="loadTreeNode" lazy :props="defaultProps" node-key="id" class="filter-tree" highlight-current :default-expanded-keys="expandedKeys" :expand-on-click-node="false">
        <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
          <!--nodeType={1:项目;2子项目;4:任务;6::用例}-->
          <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
          <span>{{data.nodeName}}</span>
        </span>
      </el-tree>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">{{ $t('cancel') }}</el-button>
        <el-button type="info" @click="clearHandle()" size="mini">{{ $t('clear') }}</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">{{ $t('confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcProjectModuleTree',
  data () {
    return {
      visibleTree: false,
      caseTree: false,
      showName: '',
      defaultProps: {
        children: 'zones',
        label: 'nodeName',
        isLeaf: 'leaf'
      },
      nameFromProjectCase: '',
      expandedKeys: [],
      leftTreeDataMap: {}
    }
  },
  props: {
    value: [Number, String],
    parentName: String,
    placeholder: String
  },
  watch: {
    parentName (val) {
      this.showName = val
    }
  },
  methods: {
    getTreeIcon (type, data) {
      if (type === 'src') {
        return require('../../../../assets/img/icon_' + data.nodeType + '.png')
      } else {
        let mapInfo = { '1': '项目', '2': '子项目', '4': '任务', '6': '用例' }
        return mapInfo[data.nodeType] + '：' + data.nodeName
      }
    },
    treeDialog () {
      this.expandedKeys = []
      this.visibleTree = true
      this.caseTree = false
      this.nameFromProjectCase = ''
      this.$nextTick(() => {
        this.caseTree = true
      })
    },
    reloadTree () {
      let thisvm = this
      thisvm.caseTree = false
      setTimeout(function () {
        thisvm.caseTree = true
      }, 400)
    },
    // 获取项目-用例树的数据
    getProjectCaseTreeData (resolve) {
      // 默认先清空目录树缓存数据
      this.leftTreeDataMap = {}
      let params = { 'nameFromProjectCase': this.nameFromProjectCase }
      this.$http.get('/ctc/project/projectDetail/listTreeRoot', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          resolve([])
          return this.$message.error(res.msg)
        }
        resolve(res.data)
        this.handStorageTreeData(res.data)
      }).catch(() => {
        resolve([])
      })
    },
    loadTreeNode (node, resolve) {
      // nodeType 1:项目2:子项目;6:用例
      if (node.level === 0) {
        this.getProjectCaseTreeData(resolve)
      } else {
        let nodeType = node.data.nodeType
        let childNodeType = node.data.childNodeType
        let params = { 'id': node.data.id, 'nodeType': nodeType }
        let url = '/ctc/project/projectDetail/listTree'
        if (childNodeType === 2) {
          url = '/ctc/project/projectDetail/listTree'
        } else if (childNodeType === 3 || childNodeType === 4) {
          url = '/ctc/task/taskQuery/listTaskTree'
          params.taskType = 5
        }
        if (childNodeType !== 6) {
          this.$http.get(url, { 'params': params }).then(({ data: res }) => {
            if (res.code !== 0) {
              resolve([])
              return this.$message.error(res.msg)
            } else {
              // 特殊处理，任务数据默认设置叶子节点
              let data = res.data
              if (childNodeType === 3 || childNodeType === 4) {
                data.map((item, index) => {
                  item.leaf = true
                })
              }
              resolve(data)
              this.handStorageTreeData(res.data)
            }
          }).catch(() => {
            resolve([])
          })
        } else {
          resolve([])
        }
      }
    },
    // 手动存储tree数据
    handStorageTreeData (data) {
      data.forEach((item, index) => {
        this.leftTreeDataMap[item.id] = item
      })
    },
    recursionData (key, node, callback) {
      if (this.leftTreeDataMap.hasOwnProperty(key)) {
        let item = this.leftTreeDataMap[key]
        node.idsArr.push(item.id)
        node.namesArr.push(item.nodeName)
        if (item.nodeType === 1) {
          // 特殊判断项目架构类型
          if (item.childNodeType === 2) {
            node.parentProjectId = item.id
            node.parentProjectName = item.nodeName
          } else {
            node.projectId = item.id
            node.projectName = item.nodeName
          }
          node.moduleLevel = item.moduleLevel
          node.caseProperty = item.caseProperty
          callback && callback(node)
        } else if (item.nodeType === 2) {
          node.projectId = item.id
          node.projectName = item.nodeName
          node.moduleLevel = item.moduleLevel
          node.caseProperty = item.caseProperty
          this.recursionData(item.pid, node, callback)
        } else if (item.nodeType === 4) {
          node.taskId = item.id
          node.parentProjectId = item.parentProjectId || ''
          node.projectId = item.projectId || ''
          this.recursionData(item.pid, node, callback)
        } else if (item.nodeType === 6) {
          node.moduleId = item.id
          node.parentModule = item.pid
          node.moduleName = item.nodeName
          node.level = item.level
          this.recursionData(item.pid, node, callback)
        } else {
          this.recursionData(item.pid, node, callback)
        }
      }
    },
    cancelHandle () {
      this.visibleTree = false
      this.caseTree = false
    },
    clearHandle () {
      this.$emit('input', '0')
      this.$emit('update:parentName', '')
      this.showName = ''
      this.visibleTree = false
      this.caseTree = false
    },
    commitHandle () {
      let thisvm = this
      const node = thisvm.$refs.tree.getCurrentNode()
      node.idsArr = []
      node.namesArr = []
      thisvm.recursionData(node.id, node, function (node) {
        console.info(JSON.stringify(node))
        let id = node.id
        let name = node.namesArr.reverse().join('/')
        thisvm.node = node
        thisvm.showName = name
        thisvm.$emit('input', id)
        thisvm.$emit('update:parentName', name)
        thisvm.$emit('watchChildTree', { 'type': 'chooseProjectTask', 'data': node })
        thisvm.visibleTree = false
        thisvm.caseTree = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc-project-module-tree {
  .filter-tree {
    height: 400px;
    min-height: 400px;
    overflow-y: auto;
  }
}
</style>
