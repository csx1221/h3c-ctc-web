<template>
  <div class="ctc-project-module-tree">
    <el-input v-model="showName" :placeholder="placeholder" @focus="treeDialog" readonly>
      <el-button slot="append" icon="el-icon-search" @click="treeDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleTree" width="30%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tree v-if="caseTree" ref="tree" :load="loadTreeNode" lazy node-key="id" class="filter-tree" highlight-current :default-expanded-keys="expandedKeys" :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
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
  name: 'CtcBakCaseModuleTree',
  data () {
    return {
      visibleTree: false,
      caseTree: false,
      showName: '',
      expandedKeys: [],
      leftTreeDataMap: {}
    }
  },
  props: {
    value: [Number, String],
    parentName: String,
    placeholder: String,
    treeType: Number
  },
  watch: {
    parentName (val) {
      this.showName = val
    }
  },
  methods: {
    treeDialog () {
      this.expandedKeys = []
      this.visibleTree = true
      this.caseTree = false
      this.$nextTick(() => {
        this.caseTree = true
      })
    },
    // 获取项目-用例树的数据
    getProjectCaseTreeData (resolve) {
      // 默认先清空目录树缓存数据
      this.leftTreeDataMap = {}
      let data = []
      if (this.treeType === -1) {
        data.push({ 'id': '-1', 'pid': '', 'nodeName': '共享用例树', 'nodeType': -1, 'childNodeType': 6, 'leaf': false })
      } else if (this.treeType === -2) {
        data.push({ 'id': '-2', 'pid': '', 'nodeName': '我的用例树', 'nodeType': -2, 'childNodeType': 6, 'leaf': false })
      }
      resolve(data)
      this.handStorageTreeData(data)
    },
    loadTreeNode (node, resolve) {
      // nodeType -2:我的用例树;-1:共享用例树;6:模块
      if (node.level === 0) {
        this.getProjectCaseTreeData(resolve)
      } else {
        let params = { 'id': node.data.id, 'nodeType': node.data.nodeType }
        let url = 'ctc/case/alternative/listModuleTree'
        this.$http.get(url, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            resolve([])
            return this.$message.error(res.msg)
          } else {
            resolve(res.data)
            this.handStorageTreeData(res.data)
          }
        }).catch(() => {
          resolve([])
        })
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
        if (item.nodeType === -1 || item.nodeType === -2) {
          node.parentId = item.id
          node.parentIdName = item.nodeName
          node.moduleLevel = item.moduleLevel
          callback && callback(node)
        } else if (item.nodeType === 7) {
          node.moduleId = item.id
          node.parentModule = item.pid
          node.moduleName = item.nodeName
          node.level = item.level
          // 按模块层级映射键值
          if (item.level === 1) {
            node.moduleOne = item.id
          } else if (item.level === 2) {
            node.moduleTwo = item.id
          } else if (item.level === 3) {
            node.moduleThree = item.id
          }
          this.recursionData(item.pid, node, callback)
        } else if (item.nodeType === -3) {
          item.pid = '-1'
          node.creator = item.id
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
        if (node.moduleId) {
          // 设置选中模块id
          node.moduleId = node.id
          let id = node.id
          let name = node.namesArr.reverse().join('/')
          thisvm.node = node
          thisvm.showName = name
          thisvm.$emit('input', id)
          thisvm.$emit('update:parentName', name)
          thisvm.$emit('watchChildTree', { 'type': 'chooseModule', 'data': node })
          thisvm.visibleTree = false
          thisvm.caseTree = false
        } else {
          thisvm.$message.warning('只允许选择模块目录！')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc-project-module-tree {
  .filter-tree {
    height: 500px;
    overflow-y: auto;
  }
}
</style>
