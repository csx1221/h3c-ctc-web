<template>
  <el-dialog title="用例模块" :visible.sync="innerVisible" :close-on-click-modal="false" width="35%" class="case-module">
    <el-row>
      <el-col :span="24">
        <div @click="nodeTreeClick(1,null)" style="margin-left:10px;margin-bottom:5px;cursor:pointer;"> <img src="../../../../../assets/img/add.png" /> 添加</div>
        <el-tree highlight-current v-if="treeFlag" ref="caseModuleTree" :data="treeData" :load="loadTreeNode" lazy :props="defaultProps" :default-expanded-keys="expandedKeys" node-key="id" :expand-on-click-node="false" @node-click="handleNodeClick" style="max-height:600px;overflow-y:auto;overflow-x:hidden;">
          <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
            <!--nodeType={7:模块}-->
            <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
            <span>
              {{data.nodeName}}
              <i class="el-icon-plus" @click="nodeTreeClick(1,data)" v-if="data.level<3" style="margin-left:10px;margin-right:10px;"></i>
              <i class="el-icon-edit" @click="nodeTreeClick(2,data)" style="margin-left:10px;margin-right:10px;"></i>
              <i class="el-icon-delete" @click="nodeTreeClick(3,data)" style="margin-left:10px;margin-right:10px;"></i>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="24" style="padding-left:10px;margin-top:5px;">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" :inline="false" label-position="right" label-width="80px">
          <el-row v-if="moduleEdit">
            <el-col :span="16">
              <el-form-item prop="moduleName" label="模块名称">
                <el-input v-model="dataForm.moduleName" placeholder="请输入模块名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align:center;padding-top:5px;">
              <el-button size="mini" type="primary" @click="saveCaseModule">保存</el-button>
              <el-button size="mini" @click="moduleEdit=false">取消</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'CaseModule',
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
      taskId: '',
      moduleType: '2',
      dataForm: {
        moduleName: ''
      },
      treeFlag: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      expandedKeys: [], // 默认展开节点
      moduleTreeMap: {},
      moduleEdit: false,
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
        moduleName: [
          { required: true, message: '模块名称不允许为空', trigger: 'blur' },
          { required: true, message: '模块名称不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      let thisvm = this
      thisvm.innerVisible = true
      thisvm.$nextTick(() => {
        thisvm.moduleTreeMap = {}
        thisvm.dataForm.moduleName = ''
        thisvm.treeFlag = false
        thisvm.reLoadTree()
      })
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        return require('../../../../../assets/img/icon_' + data.nodeType + '.png')
      } else {
        let mapInfo = { '7': '模块' }
        return mapInfo[data.nodeType] + '：' + data.nodeName
      }
    },
    getCaseModuleTreeData (resolve) {
      let thisvm = this
      let params = { 'nodeType': 3, 'id': thisvm.projectId }
      thisvm.$http.get('/ctc/case/caseTree/listModule', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        let data = res.data
        data.forEach((item, index) => {
          thisvm.moduleTreeMap[item.id] = [item.id]
        })
        resolve(res.data)
      }).catch(() => { })
    },
    loadTreeNode (node, resolve) {
      let thisvm = this
      // nodeType 1:项目2:子项目;4:任务
      if (node.level === 0) {
        thisvm.getCaseModuleTreeData(resolve)
      } else {
        let nodeType = node.data.nodeType
        let params = { 'id': node.data.id, 'nodeType': nodeType }
        let url = '/ctc/case/caseTree/listModule'
        this.$http.get(url, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          } else {
            let data = res.data
            data.forEach((item, index) => {
              let pidArr = thisvm.moduleTreeMap[item.pid] || []
              thisvm.moduleTreeMap[item.id] = [item.id].concat(pidArr)
            })
            resolve(data)
          }
        }).catch(() => {
        })
      }
    },
    nodeTreeClick (type, node) {
      if (!node) {
        node = {}
      }
      node.projectId = this.projectId
      node.taskId = this.taskId
      node.moduleType = this.moduleType
      if (type === 1) {
        // 添加
        node.postType = 'post'
        node.parentModule = node.id ? node.id : ''
        this.moduleEdit = true
        this.dataForm.moduleName = ''
      } else if (type === 2) {
        // 修改
        node.postType = 'put'
        node.moduleId = node.id
        this.moduleEdit = true
        this.dataForm.moduleName = node.nodeName
      } else if (type === 3) {
        // 删除
        node.postType = 'delete'
        this.moduleEdit = false
        this.dataForm.moduleName = ''
        this.$confirm('确定删除[模块]操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('/ctc/case/caseTree', { 'data': [node.id] }).then(({ data: res }) => {
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
      this.expandedKeys = this.moduleTreeMap[node.id] || []
      this.currNode = node
    },
    saveCaseModule () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let currNode = this.currNode
          let message = { 'url': '/ctc/case/caseTree', 'reload': true, data: {} }
          message.postType = currNode.postType
          message.data.projectId = currNode.projectId || ''
          message.data.taskId = currNode.taskId || ''
          message.data.moduleType = currNode.moduleType || ''
          message.data.parentModule = currNode.parentModule || ''
          message.data.moduleId = currNode.moduleId || ''
          message.data.moduleName = this.dataForm.moduleName
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
      thisvm.moduleEdit = false
    },
    handleNodeClick (data) {
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss" scoped>
.case-module {
}
</style>
