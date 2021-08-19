<template>
  <el-dialog title="选择转单人" :visible.sync="innerVisible" :close-on-click-modal="false" width="25%">
    <el-tree highlight-current ref="projectMemberData" :data="projectMemberData" default-expand-all :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:510px;overflow-y:auto;overflow-x:hidden;">
      <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
        <!--nodeType={1:用户}-->
        <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
        <span>{{data.name}}</span>
      </span>
    </el-tree>
    <template slot="footer">
      <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
      <el-button type="info" @click="clearHandle()" size="mini">清除</el-button>
      <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'DefectTransferOrder',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defectId: '',
      projectId: '',
      projectMemberData: [],
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
  mounted () {
  },
  methods: {
    // 初始化
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.getProjectMember()
      })
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        let icon = ''
        if (data.nodeType === 1) {
          icon = 'sys_icon_4'
        }
        return require('../../../../../assets/img/' + icon + '.png')
      } else {
        let mapInfo = { '1': '转单人' }
        return mapInfo[data.nodeType] + '：' + data.name
      }
    },
    getProjectMember (projectId) {
      if (this.projectId) {
        let params = {}
        this.$http.get('/ctc/project/projectMember/defectTransferOrder/' + this.projectId, params).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            // 遍历项目成员
            let data = []
            res.data.forEach((item, index) => {
              let titem = {}
              titem.id = item.userId
              titem.name = item.realName || item.userName
              titem.nodeType = 1
              data.push(titem)
            })
            this.projectMemberData = data
          }
        }).catch(() => { })
      }
    },
    handleNodeClick (data) {
      this.commitHandle()
    },
    cancelHandle () {
      this.innerVisible = false
    },
    clearHandle () {
      this.$emit('watchChildPage', { 'type': 'chooseTransfer', 'data': {} })
      this.innerVisible = false
    },
    commitHandle () {
      const node = this.$refs.projectMemberData.getCurrentNode()
      if (node && node.nodeType === 1) {
        this.$emit('watchChildPage', { 'type': 'chooseTransfer', 'data': node })
        this.innerVisible = false
      } else {
        this.$message.warning('请选择转单人员')
      }
    }
  }
}
</script>

<style lang="scss">
</style>
