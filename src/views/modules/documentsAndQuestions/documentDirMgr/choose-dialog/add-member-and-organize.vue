<template>
  <el-dialog title="添加数据" :visible.sync="innerVisible" :close-on-click-modal="false" width="35%" class="add-organize">
    <el-row>
      <el-col :span="24">
        <el-row>
          <el-col :span="24">
            <el-tree ref="leftTreeData" :props="defaultProps" :data="treeData" :default-expanded-keys="expandedKeys" :default-checked-keys="checkedKeys" node-key="id" :check-strictly="false" :indent="3" :expand-on-click-node="false" :check-on-click-node="true" show-checkbox highlight-current style="height:540px;overflow-y:auto;">
              <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
                <!--nodeType={1:项目成员组;2:参测对象组;3:机构;4:成员;}-->
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
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'AddMemberAndOrganize',
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
      activeGroup: '1',
      projectData: '',
      userSelectData: [],
      userSelectDataMap: {},
      treeData: [],
      expandedKeys: [], // 默认展开树节点
      checkedKeys: [], // 默认选中节点
      defaultProps: {
        children: 'children',
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
        // 设置已选中树节点
        this.userSelectDataMap = {}
        this.userSelectData.forEach((item, index) => {
          let keyId = item.userId || item.organizeId
          this.userSelectDataMap[keyId] = keyId
        })
        this.getOrganizeTreeData()
      })
    },
    getTreeIcon (type, data) {
      // 1:项目成员组;2:参测对象组;3:机构;4:成员;
      if (type === 'src') {
        let sysIcon = ''
        if (data.nodeType === 1) {
          sysIcon = 'sys_icon_3'
        } else if (data.nodeType === 2) {
          sysIcon = 'sys_icon_1'
        } else if (data.nodeType === 3) {
          sysIcon = 'sys_icon_2'
        } else if (data.nodeType === 4) {
          sysIcon = 'sys_icon_4'
        }
        return require('@/assets/img/' + sysIcon + '.png')
      } else {
        let mapInfo = { '1': '项目', '2': '参测对象组', '3': '参测对象', '4': '成员' }
        return mapInfo[data.nodeType] + '：' + data.name
      }
    },
    getOrganizeTreeData () {
      let thisvm = this
      if (thisvm.projectData && thisvm.projectData.dirId) {
        let projectId = thisvm.projectData.projectId
        let dirLevel = thisvm.projectData.dirLevel
        let pDirId = thisvm.projectData.pDirId
        let url = '/ctc/project/docDirManage/listSelectableAuthMember'
        if (this.activeGroup === '2') {
          url = '/ctc/project/docDirManage/listSelectableAuthParticipant'
        }
        let params = thisvm.dataForm
        if (dirLevel === 1) {
          params = { 'projectId': projectId, 'dirLevel': dirLevel }
        } else {
          params = { 'pid': pDirId, 'dirLevel': dirLevel }
        }
        thisvm.$http.get(url, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          }
          let newData = res.data
          thisvm.buildTreeDisabled(newData)
          thisvm.treeData = newData
        }).catch(() => {
        })
      }
    },
    buildTreeDisabled (data, pid) {
      for (let idx = 0; idx < data.length; idx++) {
        let item = data[idx]
        if (item.data) {
          let keyId = item.data.userId || item.data.organizeId
          if (this.userSelectDataMap[keyId]) {
            item.disabled = true
          } else {
            item.disabled = false
          }
        }
        let children = item.children || []
        if (children.length > 0) {
          this.buildTreeDisabled(children)
        }
      }
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let thisvm = this
      const node = thisvm.$refs.leftTreeData.getCheckedNodes()
      if (node && node.length > 0) {
        let data = []
        node.forEach((item, index) => {
          if (item.data) {
            item.data.dirId = thisvm.projectData.dirId
            item.data.ifRead = 1
            if (thisvm.activeGroup === '1' && item.nodeType === 4) {
              item.data.ifWrite = 1
              item.data.ifAdmin = 0
              data.push(item.data)
            } else if (thisvm.activeGroup === '2' && item.nodeType === 3) {
              item.data.ifWrite = 0
              item.data.ifAdmin = 0
              data.push(item.data)
            }
          }
        })
        let url = '/ctc/project/docDirManage/saveMemberAuth'
        if (thisvm.activeGroup === '2') {
          url = '/ctc/project/docDirManage/saveParticipantAuth'
        }
        let params = { 'type': 'execute', 'postType': 'post', 'url': url, 'reload': true }
        thisvm.$emit('watchChildMethod', { ...params, 'data': data })
        thisvm.handleDialogClose()
      } else {
        thisvm.$message.warning('必须选择一个数据')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-organize {
  .selected {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
