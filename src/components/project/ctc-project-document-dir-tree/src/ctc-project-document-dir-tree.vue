<template>
  <div class="ctc-project-module-tree">
    <el-input v-model="showName" :placeholder="placeholder" @focus="treeDialog" readonly>
      <el-button slot="append" icon="el-icon-search" @click="treeDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleTree" width="30%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tree ref="tree" :load="loadTreeNode" lazy node-key="id" class="filter-tree" highlight-current :default-expanded-keys="expandedKeys" :expand-on-click-node="false" style="height:600px;overflow-y:auto;overflow-x:hidden;">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{data.dirName}}</span>
        </span>
      </el-tree>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">{{ $t('confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcProjectDocumentDirTree',
  data () {
    return {
      visibleTree: false,
      showName: '',
      dirName: '',
      expandedKeys: [],
      dirTreeMap: {}
    }
  },
  props: {
    value: [Number, String],
    parentName: String,
    projectId: String,
    placeholder: String
  },
  watch: {
    parentName (val) {
      this.showName = val
    }
  },
  methods: {
    treeDialog () {
      this.expandedKeys = []
      this.visibleTree = false
      this.$nextTick(() => {
        this.visibleTree = true
      })
    },
    // 获取项目-用例树的数据
    getProjectDocumentTreeData (resolve) {
      let projectId = this.projectId || ''
      if (projectId) {
        let params = {}
        this.$http.get('/ctc/project/docDirManage/listTree', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          let newData = []
          let data = res.data
          data.forEach((item, index) => {
            if (item.projectId === projectId) {
              this.dirTreeMap[item.id] = { 'pathId': [item.id], 'pathName': [item.dirName] }
              newData.push(item)
            }
          })
          resolve(newData)
        }).catch(() => { })
      }
    },
    loadTreeNode (node, resolve) {
      // dirType 1:项目2:子项目;4:任务
      if (node.level === 0) {
        this.getProjectDocumentTreeData(resolve)
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
    cancelHandle () {
      this.visibleTree = false
    },
    commitHandle () {
      let thisvm = this
      const node = thisvm.$refs.tree.getCurrentNode()
      if (node.dirType !== 1) {
        if ((node.ifWrite || 0) === 0) {
          return thisvm.$message.warning('该目录您没有权限上传文档')
        }
        let nodePath = thisvm.dirTreeMap[node.id] || this.dirTreeMap[node.projectId] || {}
        let pathIdArr = nodePath.pathId
        let pathNameArr = nodePath.pathName
        nodePath.pathId = pathIdArr.reverse()
        nodePath.pathName = pathNameArr.reverse()
        node.nodePath = nodePath
        node.dirId = node.id
        // 开始获取目录名称
        thisvm.showName = node.nodePath.pathName.join('/')
        thisvm.$emit('input', node.id)
        thisvm.$emit('update:parentName', node.nodePath.pathName.join('/'))
        thisvm.$emit('watchChildPage', { 'type': 'chooseDocumentDir', 'data': node })
        thisvm.visibleTree = false
      } else {
        thisvm.$message.warning('不允许选择【项目】节点目录！')
      }
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
