<template>
  <div>
    <div class="el-input el-input-group el-input-group--append">
      <div class="el-input__inner" v-if="nameList.length>0">
        <template v-for="(item,index) in nameList">
          <el-tag class="eltag" :key="index">{{item}}</el-tag>
        </template>
      </div>
      <el-input v-else :placeholder="placeholder" readonly :disabled="disabled"></el-input>
      <div class="el-input-group__append">
        <el-button icon="el-icon-search" @click="projectDocumentDialog" :disabled="disabled"></el-button>
      </div>
    </div>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleDialog" width="25%" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tree highlight-current ref="projectTreeData" :data="projectTreeData" :default-checked-keys="checkedKeys" show-checkbox default-expand-all :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:600px;overflow-y:auto;overflow-x:hidden;">
        <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
          <!--nodeType={1:项目成员组2:参测对象组;3:机构;4:成员;}-->
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
  </div>
</template>
<script>
export default {
  name: 'CtcProjectDocumentHandler',
  data () {
    return {
      visibleDialog: false,
      checkedKeys: [],
      idsList: [],
      nameList: [],
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
    projectId: String,
    echoDataForm: {
      type: Object,
      default () {
        return { 'handler': '', 'handlerName': '' }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'echoDataForm.handler' (newVal, oldVal) {
      this.echoData()
    }
  },
  methods: {
    projectDocumentDialog () {
      this.visibleDialog = true
      this.getSeachTreeData()
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
        let mapInfo = { '1': '审核人', '4': '成员' }
        return mapInfo[data.nodeType] + '：' + data.name
      }
    },
    getSeachTreeData () {
      let thisvm = this
      let projectId = thisvm.projectId || ''
      if (projectId) {
        // 设置默认选中
        thisvm.checkedKeys = thisvm.idsList
        let params = {}
        params.projectId = thisvm.projectId
        thisvm.$http.get('/ctc/project/docDirManage/listDocUploader', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          }
          let data = res.data
          thisvm.projectTreeData = data
        }).catch(() => {
          thisvm.projectTreeData = []
        })
      }
    },
    echoData () {
      let handler = this.echoDataForm.handler || ''
      let handlerName = this.echoDataForm.handlerName || ''
      if (handler.indexOf('clear') !== -1) {
        handler = ''
      }
      if (handler && handlerName) {
        this.idsList = handler.split(',')
        this.nameList = handlerName.split(',')
      } else {
        this.idsList = []
        this.nameList = []
        this.$emit('input', '')
      }
    },
    handleNodeClick (data) {
    },
    cancelHandle () {
      this.visibleDialog = false
    },
    clearHandle () {
      this.idsList = []
      this.nameList = []
      this.$emit('input', '')
      this.visibleDialog = false
    },
    commitHandle () {
      const node = this.$refs.projectTreeData.getCheckedNodes()
      if (node && node.length > 0) {
        let handler = []
        let handlerName = []
        node.forEach((item, index) => {
          if (item.nodeType === 4) {
            handler.push(item.id)
            handlerName.push(item.name)
          }
        })
        this.$emit('input', handler.join(','))
        this.$emit('watchChildPage', { 'type': 'chooseHandler', 'data': handlerName.join(',') })
        this.idsList = handler
        this.nameList = handlerName
        this.visibleDialog = false
      } else {
        this.$message.warning(this.placeholder)
      }
    }
  }
}
</script>
