<template>
  <div>
    <el-input v-model="showName" :placeholder="placeholder" readonly :disabled="disabled">
      <el-button slot="append" icon="el-icon-search" @click="projectCaseDialog" :disabled="disabled"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleDialog" width="30%" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tree highlight-current ref="projectTreeData" :data="projectTreeData" default-expand-all :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:510px;overflow-y:auto;overflow-x:hidden;">
        <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
          <!--nodeType={1:项目;2子项目;4:任务;6::用例}-->
          <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
          <span>{{data.nodeName}}</span>
        </span>
      </el-tree>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button type="info" @click="clearHandle()" size="mini">清除</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcProjectCaseTable',
  data () {
    return {
      visibleDialog: false,
      showName: '',
      projectTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  props: {
    value: [Number, String],
    placeholder: String,
    parentName: String,
    taskId: String,
    caseId: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    parentName (newVal, oldVal) {
      this.showName = newVal
    },
    caseId (newVal, oldVal) {
      this.echoData()
    }
  },
  methods: {
    projectCaseDialog () {
      this.visibleDialog = true
      this.getSeachTreeData()
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        let icon = ''
        if (data.nodeType === 1) {
          icon = 'sys_icon_1'
        } else if (data.nodeType === 4) {
          icon = 'icon_4'
        } else if (data.nodeType === 6) {
          icon = 'icon_6'
        }
        return require('../../../../assets/img/' + icon + '.png')
      } else {
        let mapInfo = { '1': '机构', '4': '任务', '6': '用例' }
        return mapInfo[data.nodeType] + '：' + data.nodeName
      }
    },
    getSeachTreeData () {
      let thisvm = this
      if (this.taskId) {
        let params = { 'taskId': this.taskId }
        thisvm.$http.get('/ctc/defect/base/case', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          }
          let datas = thisvm.buildTreeDate(res.data, null)
          thisvm.projectTreeData = datas
        }).catch(() => {
          thisvm.projectTreeData = []
        })
      }
    },
    buildTreeDate (data, pid) {
      let result = []
      let temp
      for (let i = 0; i < data.length; i++) {
        if (data[i].pid === pid) {
          temp = this.buildTreeDate(data, data[i].id)
          if (temp.length > 0) {
            data[i].children = temp
          }
          result.push(data[i])
        }
      }
      return result
    },
    echoData () {
      if (this.caseId && this.caseId.indexOf('clear') === -1) {
        let params = {}
        this.$http.get('/ctc/case/caseInfo/' + this.caseId, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.showName = res.data.caseName || ''
            // 如果用例名称为空，去执行中心获取用例名称
            if (!this.showName) {
              this.getExecCaseById()
            }
          }
        }).catch(() => { })
      } else {
        this.showName = ''
      }
    },
    getExecCaseById () {
      let params = {}
      this.$http.get('/ctc/exec/case/' + this.caseId, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.showName = res.data.caseName || ''
        }
      }).catch(() => { })
    },
    handleNodeClick (data) {
      this.commitHandle()
    },
    cancelHandle () {
      this.visibleDialog = false
    },
    clearHandle () {
      this.$emit('input', '')
      this.$emit('update:showName', '')
      this.visibleDialog = false
    },
    commitHandle () {
      const node = this.$refs.projectTreeData.getCurrentNode()
      if (node && node.nodeType === 6) {
        this.$emit('input', node.id)
        this.$emit('update:showName', node.nodeName)
        this.$emit('watchChildPage', { 'type': 'chooseCase', 'data': node })
        this.showName = node.nodeName
        this.visibleDialog = false
      } else {
        this.$message.warning(this.placeholder)
      }
    }
  }
}
</script>
