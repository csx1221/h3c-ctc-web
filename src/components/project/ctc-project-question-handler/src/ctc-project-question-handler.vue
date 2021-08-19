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
        <el-button icon="el-icon-search" @click="projectQuestionDialog" :disabled="disabled"></el-button>
      </div>
    </div>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleDialog" width="25%" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-tree highlight-current ref="projectTreeData" :data="projectTreeData" :default-checked-keys="checkedKeys" :show-checkbox="echoDataForm.flow==0" default-expand-all :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:600px;overflow-y:auto;overflow-x:hidden;">
        <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
          <!--nodeType={1:项目;2子项目}-->
          <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
          <span>{{data.name}}</span>
        </span>
      </el-tree>
      <template slot="footer" v-if="echoDataForm.flow==0">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button type="info" @click="clearHandle()" size="mini">清除</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcProjectQuestionHandler',
  data () {
    return {
      visibleDialog: false,
      checkedKeys: [],
      idsList: [],
      nameList: [],
      projectTreeData: [],
      defaultProps: {
        children: 'list',
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
        return { 'flow': '0', 'type': '0', 'handler': '', 'handlerName': '' }
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
    projectQuestionDialog () {
      this.visibleDialog = true
      this.getSeachTreeData()
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        let icon = ''
        if (data.nodeType === 1) {
          icon = 'sys_icon_1'
        } else if (data.nodeType === 2) {
          icon = 'sys_icon_4'
        } else if (data.nodeType === 4) {
          icon = 'sys_icon_4'
        }
        return require('../../../../assets/img/' + icon + '.png')
      } else {
        let mapInfo = { '2': '参测对象', '4': '项目成员' }
        if (mapInfo[data.nodeType]) {
          return mapInfo[data.nodeType] + '：' + data.name
        } else {
          return data.name
        }
      }
    },
    getSeachTreeData () {
      let thisvm = this
      let projectId = this.projectId || this.parentProjectId || ''
      if (projectId) {
        // 设置默认选中
        this.checkedKeys = this.idsList
        let params = {}
        let url = '/ctc/project/question/listQuestionHandler'
        if (this.echoDataForm.flow === '0') {
          params.parentId = projectId
          url = '/ctc/project/projectParticipant/subProjectSelectableParticipant'
        } else {
          params.projectId = projectId
          params.type = this.echoDataForm.type
        }
        thisvm.$http.get(url, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          }
          let newData = []
          if (this.echoDataForm.flow === '0') {
            res.data.forEach((item, index) => {
              item.name = item.organizeTypeName
              item.id = index
              item.nodeType = 1
              let nodeList = []
              item.list.forEach((titem, tindex) => {
                titem.disabled = false
                nodeList.push({ nodeType: 2, ...titem })
              })
              item.list = nodeList
              newData.push(item)
            })
          } else {
            newData = res.data
          }
          thisvm.projectTreeData = newData
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
      if (this.echoDataForm.flow === '1' && data.nodeType === 4) {
        this.$emit('input', data.id)
        this.$emit('watchChildPage', { 'type': 'chooseHandler', 'data': data.name })
        this.idsList = [data.id]
        this.nameList = [data.name]
        this.visibleDialog = false
      }
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
          if (item.nodeType === 2) {
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
