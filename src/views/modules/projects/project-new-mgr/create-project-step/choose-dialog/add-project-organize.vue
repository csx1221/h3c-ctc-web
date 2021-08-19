<template>
  <el-dialog title="添加机构" :visible.sync="innerVisible" :close-on-click-modal="false" width="40%" class="add-organize">
    <el-row>
      <el-col :span="24">
        <el-row>
          <el-col :span="24">
            <el-form label-position="right" :inline="true" ref="dataForm" :model="dataForm" label-width="90px">
              <el-row>
                <el-col :span="12">
                  <el-form-item prop="name" label="筛选条件：">
                    <el-input v-model="dataForm.name" placeholder="请输入筛选条件" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" align="right">
                  <el-button type="primary" size="small" @click="getOrganizeTreeData()">查询</el-button>
                  <!--<el-button size="small" type="info" @click="doCheckAllCancel">取消全选</el-button>-->
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="24">
            <el-tree ref="leftTreeData" :props="defaultProps" :data="treeData" @check-change="handleCheckChange" :default-expanded-keys="expandedKeys" :default-checked-keys="checkedKeys" node-key="id" :check-strictly="false" :indent="3" :check-on-click-node="true" show-checkbox highlight-current style="height:540px;overflow-y:auto;">
              <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
                <!--nodeType={1:项目;2子项目;3:阶段;4:任务;模块6}-->
                <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
                <span>{{data.name}}</span>
              </span>
            </el-tree>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <div class="grid-content bg-purple-dark"></div>
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'AddProjectOrganize',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        name: ''
      },
      parentId: '',
      projectId: '',
      testObjectDataMap: {}, // 父页面传递过来参测对象数据
      matchValue: 1,
      // 已选的历史机构数据
      testObjectTableData: [],
      testObjectTableDataMap: {},
      treeData: [],
      expandedKeys: [], // 默认展开树节点
      checkedKeys: [], // 默认选中节点
      defaultProps: {
        children: 'list',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.testObjectTableDataMap = {}
        // 设置已选中树节点
        this.testObjectTableData.forEach((item, index) => {
          this.checkedKeys.push(item.organizeId)
          this.testObjectTableDataMap[item.organizeId] = item
        })
        this.getOrganizeTreeData()
      })
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        return require('@/assets/img/sys_icon_' + data.nodeType + '.png')
      } else {
        return data.name
      }
    },
    getOrganizeTreeData () {
      let thisvm = this
      let params = thisvm.dataForm
      params.projectId = thisvm.projectId || ''
      // 根据是否查询，来判断是否展开
      let expandedBool = (params.name !== '')
      thisvm.$http.get('/ctc/project/projectParticipant/select/tree/participantType', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        let expandedKeys = []
        let newData = []
        res.data.forEach((item, index) => {
          item.name = item.organizeTypeName
          item.id = index
          item.nodeType = 1
          let nodeList = []
          item.list.forEach((titem, tindex) => {
            if (thisvm.matchValue === 2) {
              if (thisvm.testObjectDataMap[titem.id]) {
                titem.disabled = true
              } else {
                titem.disabled = false
              }
            } else {
              titem.disabled = false
            }
            nodeList.push({ nodeType: 2, ...titem })
          })
          item.list = nodeList
          newData.push(item)
          if (expandedBool || thisvm.testObjectTableData.length > 0) {
            expandedKeys.push(item.id)
          }
        })
        thisvm.treeData = newData
        thisvm.expandedKeys = expandedKeys
      }).catch(() => {
      })
    },
    doCheckAllCancel () {
      this.checkedKeys = []
      this.getOrganizeTreeData()
    },
    handleCheckChange (data, checked, indeterminate) {
      let thisvm = this
      if (data.nodeType === 1) {
        data.list.forEach((tdata, index) => {
          if (checked) {
            thisvm.testObjectTableDataMap[tdata.id] = tdata
          } else {
            if (thisvm.matchValue === 2) {
              if (thisvm.testObjectDataMap[tdata.id]) {
              } else {
                delete thisvm.testObjectTableDataMap[tdata.id]
              }
            } else {
              delete thisvm.testObjectTableDataMap[tdata.id]
            }
          }
        })
      } else if (data.nodeType === 2) {
        if (checked) {
          thisvm.testObjectTableDataMap[data.id] = data
        } else {
          delete thisvm.testObjectTableDataMap[data.id]
        }
      }
    },
    handleNodeExpand (data) {
    },
    handleNodeClick (data) {
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let thisvm = this
      // 控制是否可编辑
      let data = []
      let testObjectTableDataMap = thisvm.testObjectTableDataMap
      for (let key in testObjectTableDataMap) {
        if ({}.hasOwnProperty.call(testObjectTableDataMap, key)) {
          let item = testObjectTableDataMap[key]
          data.push({ 'projectId': this.projectId, 'organizeId': item.id || item.organizeId, 'organizeType': item.type || item.organizeType, 'organizeName': item.name || item.organizeName, 'name': item.name || item.organizeName })
        }
      }
      let params = { 'type': 'executeSaveTestObject', 'data': data }
      this.$emit('watchChildMethod', params)
      this.handleDialogClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.add-organize {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
