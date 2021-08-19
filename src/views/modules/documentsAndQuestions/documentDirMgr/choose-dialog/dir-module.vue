<template>
  <el-dialog title="文档目录" :visible.sync="innerVisible" :close-on-click-modal="false" width="35%" class="dir-dir" @close="closeEvent">
    <el-row>
      <el-col :span="24">
        <el-tree highlight-current v-if="treeFlag" ref="dirModuleTree" :data="treeData" :load="loadTreeNode" lazy :props="defaultProps" :default-expanded-keys="expandedKeys" node-key="id" :expand-on-click-node="false" style="max-height:600px;overflow-y:auto;overflow-x:hidden;">
          <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
            <!--dirType={1:项目;2:目录}-->
            <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
            <span>
              {{data.dirName}}
              <i class="el-icon-plus" @click="nodeTreeClick(1,data)" v-if="data.dirLevel<5" style="margin-left:10px;margin-right:10px;"></i>
              <i class="el-icon-edit" @click="nodeTreeClick(2,data)" v-if="data.dirType!=1" style="margin-left:10px;margin-right:10px;"></i>
              <i class="el-icon-delete" @click="nodeTreeClick(3,data)" v-if="data.dirType!=1" style="margin-left:10px;margin-right:10px;"></i>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="24" style="padding-left:10px;margin-top:5px;">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :inline="false" label-position="right" label-width="80px">
          <el-row v-if="dirEdit">
            <el-col :span="16">
              <el-form-item prop="dirName" label="目录名称">
                <el-input v-model="dataForm.dirName" placeholder="请输入目录名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align:center;padding-top:5px;">
              <el-button size="mini" type="primary" @click="saveDirModule">保存</el-button>
              <el-button size="mini" @click="dirEdit=false">取消</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'DirModule',
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      projectId: '',
      dirEditData: {}, // 目录编辑参数
      dataForm: {
        dirName: ''
      },
      treeFlag: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      expandedKeys: [], // 默认展开节点
      dirTreeMap: {},
      dirEdit: false,
      currNode: {}
    }
  },
  watch: {
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    },
    dataRule () {
      return {
        dirName: [
          { required: true, message: '目录名称不允许为空', trigger: 'blur' },
          { required: true, message: '目录名称不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      let thisvm = this
      thisvm.innerVisible = true
      thisvm.$nextTick(() => {
        thisvm.dirTreeMap = {}
        thisvm.dataForm.dirName = ''
        thisvm.currNode = {}
        thisvm.projectId = thisvm.dirEditData.projectId
        thisvm.treeFlag = false
        thisvm.reLoadTree()
      })
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        return require('../../../../../assets/img/icon_' + data.dirType + '.png')
      } else {
        let mapInfo = { '1': '项目', '2': '目录' }
        return mapInfo[data.dirType] + '：' + data.dirName
      }
    },
    getDirModuleTreeData (resolve) {
      let thisvm = this
      let data = [thisvm.dirEditData]
      data.forEach((item, index) => {
        thisvm.dirTreeMap[item.id] = [item.id]
      })
      resolve(data)
    },
    loadTreeNode (node, resolve) {
      let thisvm = this
      // dirType 1:项目2:目录;
      if (node.level === 0) {
        thisvm.getDirModuleTreeData(resolve)
      } else {
        let tnode = Object.assign({}, node)
        let dirLevel = tnode.data.dirLevel
        let params = {}
        if (dirLevel === 0) {
          params = { 'projectId': tnode.data.id, 'dirLevel': 1 }
        } else {
          params = { 'pid': tnode.data.id, 'dirLevel': dirLevel + 1 }
        }
        let url = '/ctc/project/docDirManage/listTree'
        this.$http.get(url, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          } else {
            let data = res.data
            data.forEach((item, index) => {
              let pidArr = thisvm.dirTreeMap[item.pid] || thisvm.dirTreeMap[item.projectId] || []
              thisvm.dirTreeMap[item.id] = [item.id].concat(pidArr)
            })
            resolve(data)
          }
        }).catch(() => {
        })
      }
    },
    nodeTreeClick (type, node) {
      if (type === 1) {
        // 添加
        node.postType = 'post'
        node.pid = node.id
        this.dirEdit = true
        this.dataForm.dirName = ''
      } else if (type === 2) {
        // 修改
        node.postType = 'put'
        node.dirId = node.id
        this.dirEdit = true
        this.dataForm.dirName = node.dirName
      } else if (type === 3) {
        // 删除
        node.postType = 'delete'
        this.dirEdit = false
        this.dataForm.dirName = ''
        this.$confirm('确定删除[目录]操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/ctc/project/docDirManage', { 'data': [node.id] }).then(({ data: res }) => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
            } else {
              this.$message.success('操作成功')
              this.reLoadTree()
            }
          }).catch(() => { })
        }).catch(() => { })
      }
      // 设置默认展开
      this.expandedKeys = this.dirTreeMap[node.id] || []
      this.currNode = Object.assign({}, node)
    },
    saveDirModule () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let currNode = this.currNode
          let message = { 'url': '/ctc/project/docDirManage', 'reload': true, data: {} }
          message.postType = currNode.postType
          // 判断是修改还是新增
          if (currNode.postType === 'put') {
            message.data.dirId = currNode.dirId || ''
            message.data.dirName = this.dataForm.dirName
          } else {
            message.data.projectId = currNode.projectId || ''
            // 第一层父目录是项目，不需要传pDirId
            message.data.pDirId = (currNode.dirType === 1) ? '' : currNode.id
            // 新增目录dirId为空
            message.data.dirId = currNode.dirId || ''
            message.data.dirType = 2
            message.data.dirLevel = currNode.dirLevel + 1
            message.data.dirName = this.dataForm.dirName
          }
          this.executeMethod(message)
        }
      }, 1000, { 'leading': true, 'trailing': false })
    },
    executeMethod (message) {
      let thisvm = this
      // 支持[put,post,delete]
      thisvm.$http[message.postType](message.url, message.data).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          thisvm.$message.success('操作成功')
          if (message.reload) {
            thisvm.reLoadTree()
          }
        }
      }).catch(() => { })
    },
    reLoadTree () {
      let thisvm = this
      thisvm.treeFlag = false
      setTimeout(function () {
        thisvm.treeFlag = true
      }, 200)
      thisvm.dirEdit = false
    },
    closeEvent () {
      this.$emit('watchChildTree', { 'type': 'reloadTree', 'data': {} })
    }
  }
}
</script>
<style lang="scss" scoped>
.dir-dir {
}
</style>
