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
        <el-button icon="el-icon-search" @click="projectCaseDialog" :disabled="disabled"></el-button>
      </div>
    </div>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleDialog" width="25%" :modal="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-col :span="18">
          <el-input v-model="searchName" size="mini" placeholder="请输入处理人名称" clearable />
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button type="primary" size="small" @click="getSeachTreeDataBySearchName">查询</el-button>
        </el-col>
      </el-row>
      <el-tree highlight-current ref="projectTreeData" :data="projectTreeData" :default-checked-keys="checkedKeys" show-checkbox default-expand-all :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="height:600px;overflow-y:auto;overflow-x:hidden;">
        <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
          <!--nodeType={1:项目;2子项目;4:任务;6::用例}-->
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
  name: 'CtcProjectCaseHandler',
  data () {
    return {
      visibleDialog: false,
      checkedKeys: [],
      idsList: [],
      nameList: [],
      // 手动缓存，便于前台过滤
      searchName: '',
      cacheProjectTreeData: [],
      projectTreeData: [],
      selectedTreeData: [], // 存储已选数据
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
    parentProjectId: String,
    projectId: String,
    caseId: String,
    echoDataForm: {
      type: Object,
      default () {
        return { 'nowHandlerIds': '', 'handlerNames': '' }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'echoDataForm.nowHandlerIds' (newVal, oldVal) {
      this.echoData()
    }
  },
  methods: {
    projectCaseDialog () {
      this.visibleDialog = true
      this.selectedTreeData = []
      this.getSeachTreeData()
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        let icon = ''
        if (data.nodeType === 1) {
          icon = 'sys_icon_1'
        } else if (data.nodeType === 2) {
          icon = 'sys_icon_4'
        }
        return require('../../../../assets/img/' + icon + '.png')
      } else {
        let mapInfo = { '1': '机构', '2': '处理人' }
        return mapInfo[data.nodeType] + '：' + data.name
      }
    },
    getSeachTreeDataBySearchName () {
      let thisvm = this
      // 先存储用户刚才选择的数据
      const nodes = thisvm.$refs.projectTreeData.getCheckedNodes()
      thisvm.selectedTreeData = [...thisvm.selectedTreeData, ...nodes]

      let newData = []
      thisvm.cacheProjectTreeData.forEach((item, index) => {
        if (item.nodeType === 1) {
          item.children = []
          newData.push(item)
        } else {
          if (thisvm.searchName) {
            if (item.name.includes(thisvm.searchName)) {
              newData.push(item)
            }
          } else {
            newData.push(item)
          }
        }
      })
      let datas = thisvm.buildTreeDate(newData, null)
      // 过滤无处理人机构信息
      let filterEmptyData = []
      datas.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          filterEmptyData.push(item)
        }
      })
      thisvm.projectTreeData = filterEmptyData
    },
    getSeachTreeData () {
      let thisvm = this
      let projectId = this.projectId || this.parentProjectId || ''
      if (projectId) {
        // 设置默认选中
        this.checkedKeys = this.idsList
        let params = { 'projectId': projectId, 'caseId': this.caseId || '' }
        thisvm.$http.get('/ctc/defect/base/handler', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          }
          thisvm.cacheProjectTreeData = res.data
          let datas = thisvm.buildTreeDate(res.data, null)
          thisvm.projectTreeData = datas
        }).catch(() => {
          thisvm.projectTreeData = []
          thisvm.cacheProjectTreeData = []
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
      let nowHandlerIds = this.echoDataForm.nowHandlerIds || ''
      let handlerNames = this.echoDataForm.handlerNames || ''
      if (nowHandlerIds.indexOf('clear') !== -1) {
        nowHandlerIds = ''
      }
      if (nowHandlerIds && handlerNames) {
        this.idsList = nowHandlerIds.split(',')
        this.nameList = handlerNames.split(',')
      } else if (nowHandlerIds) {
        let ids = nowHandlerIds.split(',')
        this.getRealNameByid(ids)
      } else {
        this.idsList = []
        this.nameList = []
        this.$emit('input', '')
      }
    },
    getRealNameByid (ids) {
      let thisvm = this
      if (ids.length > 0) {
        let idsList = []
        let nameList = []
        ids.forEach((id, index) => {
          this.$http.get('/sys/user/' + id).then(({ data: res }) => {
            if (res.code !== 0) {
              return thisvm.$message.error(res.msg)
            } else {
              let node = res.data
              idsList.push(id)
              nameList.push(node.realName)
              thisvm.idsList = idsList
              thisvm.nameList = nameList
              thisvm.$emit('input', idsList.join(','))
              thisvm.$emit('watchChildPage', { 'type': 'chooseHandler', 'data': nameList.join(',') })
            }
          }).catch(() => { })
        })
      } else {
        thisvm.showName = ''
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
      this.checkedKeys = []
      this.$refs.projectTreeData.setCheckedNodes([])
      this.$emit('input', '')
    },
    commitHandle () {
      let node = this.$refs.projectTreeData.getCheckedNodes()
      node = [...this.selectedTreeData, ...node]
      if (node && node.length > 0) {
        let nowHandlerIds = []
        let handlerNames = []
        node.forEach((item, index) => {
          if (item.nodeType === 2 && !nowHandlerIds.includes(item.id)) {
            nowHandlerIds.push(item.id)
            handlerNames.push(item.name)
          }
        })
        this.$emit('input', nowHandlerIds.join(','))
        this.$emit('watchChildPage', { 'type': 'chooseHandler', 'data': handlerNames.join(',') })
        this.idsList = nowHandlerIds
        this.nameList = handlerNames
        this.visibleDialog = false
      } else {
        this.$message.warning(this.placeholder)
      }
    }
  }
}
</script>
