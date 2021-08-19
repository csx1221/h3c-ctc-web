<template>
  <el-row class="left-tree-case">
    <el-col :span="24" class="split-line">
      备选用列树
    </el-col>
    <el-col :span="24" class="toolbars">
      <div @click="doToolTip(1)"> <img src="../../../../assets/img/add.png" /> 添加</div>
      <div @click="doToolTip(2)"><img src="../../../../assets/img/edit.png" /> 编辑</div>
      <div @click="doToolTip(3)"><img src="../../../../assets/img/delete.png" /> 删除</div>
      <div @click="doToolTip(4)" v-if="isShowUpload"><img src="../../../../assets/img/icon_upload.png" /> 上传</div>
      <div @click="reLoadTree"><img src="../../../../assets/img/reload.png" /> 刷新</div>
    </el-col>
    <el-col :span="24">
      <el-tree v-if="leftTree" ref="leftTreeData" :load="loadTreeNode" lazy node-key="id" class="treeLight treeLine" @node-click="handleNodeClick" @node-expand="handleNodeExpand" show-checkbox highlight-current :check-strictly="true" :default-expanded-keys="expandedKeys" :indent="3" :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{data.nodeName}}</span>
        </span>
      </el-tree>
    </el-col>
    <!--引入模块名称编辑页面-->
    <module-info ref="moduleInfo" :visible.sync="moduleInfo" @watchChildPage="triggerParentPage"></module-info>
    <!--引入文件导入-->
    <ctc-file-import ref="ctcFileImport" :visible.sync="ctcFileImport" @watchChildImport="triggerParentPage"></ctc-file-import>
  </el-row>
</template>
<script>
import ModuleInfo from './children-page/module-info'
export default {
  name: 'leftTree',
  components: {
    ModuleInfo
  },
  data () {
    return {
      parentProjectId: '', // 记录目录上展开第一层项目ID
      moduleInfo: false,
      ctcFileImport: false,
      leftTree: true,
      isShowUpload: true,
      tmpExpandedKeys: [],
      expandedKeys: [],
      leftTreeDataMap: {}
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    triggerParentPage (message) {
      let thisvm = this
      if (message.type === 'saveModule') {
        thisvm.leftTree = false
        thisvm.expandedKeys = message.data.expandedKeys
        thisvm.tmpExpandedKeys = message.data.expandedKeys
        setTimeout(function () {
          thisvm.leftTree = true
        }, 400)
      } else if (message.type === 'reloadTable') {
        this.$emit('watchChildPage', { 'type': 'reloadTable', 'data': {} })
      }
    },
    // 获取项目-用例树的数据
    getProjectCaseTreeData (resolve) {
      let data = [
        { 'id': '-2', 'pid': '', 'nodeName': '我的用例树', 'nodeType': -2, 'childNodeType': 7, 'leaf': false },
        { 'id': '-1', 'pid': '', 'nodeName': '共享用例树', 'nodeType': -1, 'childNodeType': 7, 'leaf': false }
      ]
      resolve(data)
      this.handStorageTreeData(data)
    },
    loadTreeNode (node, resolve) {
      // nodeType -2:我的用例树;-1:共享用例树;7:模块
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
            resolve(res.data || [])
            this.handStorageTreeData(res.data)
            // 设置目录树默认展开
            this.$refs.leftTreeData.setCheckedKeys(this.tmpExpandedKeys)
          }
        }).catch(() => {
          resolve([])
        })
      }
    },
    getSelectNodeParams (type) {
      // type(1:添加;2:编辑;3:删除;4:上传)
      let selectParams = { 'isOK': true, 'message': '', 'random': Math.random() }
      let b = this.$refs.leftTreeData.getCheckedNodes()
      if (b.length > 0) {
        let modBool = false
        let indexMap = {}
        let moduleParams = { 'moduleIds': [] }
        b.forEach((item, index) => {
          // nodeType(-1:共享用例树;-2:我的用例树;)
          if (item.nodeType === -1) {
            moduleParams.parentId = item.id
          } else if (item.nodeType === -2) {
            moduleParams.parentId = item.id
            moduleParams.parentModule = item.pid
          } else if (item.nodeType === 7) {
            moduleParams.moduleId = item.id
            moduleParams.parentModule = item.pid
            moduleParams.level = item.level
            moduleParams.moduleName = item.nodeName
            moduleParams.moduleIds.push(item.id)
          }
          // childNodeType(3:阶段;7:模块)
          if (item.childNodeType === 3) {
            modBool = true
            if (indexMap.hasOwnProperty('index3')) {
              indexMap['index3'] = indexMap['index3'] + 1
            } else {
              indexMap['index3'] = 1
            }
          } else if (item.childNodeType === 7) {
            modBool = true
            let key = 'index7_' + item.level
            if (indexMap.hasOwnProperty(key)) {
              indexMap[key] = indexMap[key] + 1
            } else {
              indexMap[key] = 1
            }
          }
        })
        moduleParams.expandedKeys = []
        selectParams.moduleParams = moduleParams
        if (modBool) {
          let onlyOne = true
          if (type !== 3) {
            for (let key in indexMap) {
              if ({}.hasOwnProperty.call(indexMap, key)) {
                if (indexMap[key] > 1 && onlyOne) {
                  selectParams.isOK = false
                  selectParams.message = '用例树/模块只能选择一个！'
                  onlyOne = false
                }
              }
            }
          }
        }
      } else {
        selectParams.isOK = false
        selectParams.message = '请先选择要操作的模块目录！'
      }
      return selectParams
    },
    // 手动存储tree数据
    handStorageTreeData (data) {
      data.forEach((item, index) => {
        this.leftTreeDataMap[item.id] = item
      })
    },
    recursionData (key, moduleParams, callback) {
      if (this.leftTreeDataMap.hasOwnProperty(key)) {
        let item = this.leftTreeDataMap[key]
        // 存储要展开的节点
        if (!moduleParams.expandedKeys.includes(item.id) && item.id) {
          moduleParams.expandedKeys.push(item.id)
        }
        if (item.nodeType === -1 || item.nodeType === -2) {
          moduleParams.parentId = item.id
          callback && callback(moduleParams)
        } else if (item.nodeType === -3) {
          item.pid = '-1'
          moduleParams.creator = item.id
          this.recursionData(item.pid, moduleParams, callback)
        } else {
          if (item.level === 1) {
            // 模块一
            moduleParams.moduleOne = item.id
          } else if (item.level === 2) {
            // 模块二
            moduleParams.moduleTwo = item.id
          } else if (item.level === 3) {
            // 模块三
            moduleParams.moduleThree = item.id
          }
          this.recursionData(item.pid, moduleParams, callback)
        }
      }
    },
    autoData (selectParams, callback) {
      let moduleParams = selectParams.moduleParams
      let key = moduleParams.moduleId || moduleParams.creator || moduleParams.parentId
      this.recursionData(key, moduleParams, function (moduleParams) {
        callback && callback(moduleParams)
      })
    },
    reLoadTree () {
      // 刷新
      // 重新加载左侧目录树
      this.tmpExpandedKeys = []
      let message = { 'type': 'saveModule', 'data': {} }
      message.data.expandedKeys = []
      this.triggerParentPage(message)
      // 重新加载左侧表格数据
      this.$emit('watchChildPage', { 'type': 'reloadTable', 'data': {} })
    },
    doToolTip (type) {
      let thisvm = this
      // 默认先清空选中键值
      thisvm.tmpExpandedKeys = []
      let selectParams = thisvm.getSelectNodeParams(type)
      if (selectParams.isOK) {
        // 自动补全数据
        thisvm.autoData(selectParams, function (moduleParams) {
          thisvm.tmpExpandedKeys = moduleParams.expandedKeys
          // 控制是否显示
          if (type === 1) {
            if ((moduleParams.level || 0) < 3) {
              // 添加模块去掉模块id
              moduleParams.parentModule = moduleParams.moduleId
              // 特殊处理父模块是根目录
              if (moduleParams.parentModule === '-1' || moduleParams.parentModule === '-2') {
                moduleParams.parentModule = moduleParams.moduleId
              }
              // 添加模块去掉模块id
              moduleParams.moduleId = ''
              moduleParams.moduleName = ''
              thisvm.$refs.moduleInfo.moduleParams = moduleParams
              thisvm.$refs.moduleInfo.init()
            } else {
              thisvm.$message.warning('用例模块层级不允许超过3层！')
            }
          } else if (type === 2) {
            // 编辑
            // 特殊处理父模块是根目录
            if (moduleParams.parentModule === '-1' || moduleParams.parentModule === '-2') {
              moduleParams.parentModule = ''
            }
            thisvm.$refs.moduleInfo.moduleParams = moduleParams
            thisvm.$refs.moduleInfo.init()
          } else if (type === 3) {
            // 删除
            thisvm.deleteProjectModule(moduleParams)
          } else if (type === 4) {
            // 上传用例
            // 判断能否上传
            if (moduleParams.parentId === '-2') {
              thisvm.doUploadCase(moduleParams)
            } else {
              thisvm.$message.warning('共享用例树模块下，不允许上传！')
            }
          }
          console.info(JSON.stringify(moduleParams))
        })
      } else {
        thisvm.$message.warning(selectParams.message)
      }
    },
    deleteProjectModule (moduleParams) {
      this.$confirm('确定进行[删除模块]操作?，删除模块同时会删除模块下的用例，请谨慎操作！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/ctc/case/caseTree', { 'data': moduleParams.moduleIds }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message.success('操作成功')
            this.reLoadTree()
          }
        }).catch(() => { })
      }).catch(() => {
      })
    },
    doUploadCase (moduleParams) {
      let templateData = { 'fileName': '备选用例模板下载' }
      let uploadData = moduleParams
      let fileImportParams = { 'templateData': templateData, 'uploadData': uploadData }
      fileImportParams.templateUrl = '/ctc/case/alternative/exportCaseTemplate'
      fileImportParams.uploadUrl = '/ctc/case/alternative/importCaseData'
      this.$refs.ctcFileImport.fileImportParams = { ...this.$refs.ctcFileImport.fileImportParams, ...fileImportParams }
      this.$refs.ctcFileImport.init()
    },
    handleNodeExpand (data) {
    },
    handleNodeClick (data) {
      let checkedKeys = this.$refs.leftTreeData.getCheckedKeys()
      if (checkedKeys.includes(data.id)) {
        var index = checkedKeys.findIndex(item => {
          if (item === data.id) {
            return true
          }
        })
        checkedKeys.splice(index, 1)
      } else {
        checkedKeys.push(data.id)
      }
      this.$refs.leftTreeData.setCheckedKeys(checkedKeys)
      this.triggerRightTableReload(data)
    },
    triggerRightTableReload (data) {
      let thisvm = this
      let params = { ...data }
      if (data.nodeType === -1) {
        params.parentId = data.id
      } else if (data.nodeType === -2) {
        params.parentId = data.id
      } else if (data.nodeType === 7) {
        params.moduleId = data.id
      } else if (data.nodeType === -3) {
        params.creator = data.id
      }
      params.expandedKeys = []
      let selectParams = { 'moduleParams': params }
      thisvm.autoData(selectParams, function (moduleParams) {
        let tparams = {}
        tparams.moduleId = moduleParams.moduleId || moduleParams.id
        if (moduleParams.expandedKeys.includes('-1')) {
          tparams.nodeType = -1
        } else if (params.expandedKeys.includes('-2')) {
          tparams.nodeType = -2
        }
        // 模块一
        tparams.moduleOne = moduleParams.moduleOne || ''
        // 模块二
        tparams.moduleTwo = moduleParams.moduleTwo || ''
        // 模块三
        tparams.moduleThree = moduleParams.moduleThree || ''
        // 共享用例-用户节点
        tparams.creator = moduleParams.creator || ''
        // 特殊处理,删除children节点
        delete tparams['children']
        thisvm.$emit('watchChildPage', { 'type': 'treeReloadTable', 'data': tparams })
      })
    }
  }
}
</script>
<style lang="scss">
.left-tree-case {
  background: #fff;
  .toolbars {
    margin-top: 5px;
    margin-bottom: 5px;
    padding-left: 8px;
    div {
      float: left;
      margin-top: 5px;
      margin-right: 8px;
      cursor: pointer !important;
    }
  }
}
</style>
