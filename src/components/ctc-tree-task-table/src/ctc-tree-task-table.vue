<template>
  <div>
    <el-input v-if="type==='radio'" v-model="showOrganizeName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="openDialog"></el-button>
    </el-input>
    <div v-else class="el-input el-input-group el-input-group--append">
      <div class="el-input__inner dib" v-if="nameList.length>0">
        <template v-for="(item,index) in nameList">
          <el-tag v-if="item.disable" class="eltag" :key="index" type="info">{{item.name}}</el-tag>
          <el-tag v-else class="eltag" :key="index" closable @close="handleClose(item)">{{item.name}}</el-tag>
        </template>
      </div>
      <el-input v-else :placeholder="placeholder"></el-input>
      <div class="el-input-group__append">
        <el-button icon="el-icon-search" @click="openDialog"></el-button>
      </div>
    </div>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visible" width="35%" :modal="false" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row class="leftTree tree-container">
        <el-col :span="24">
          <el-form label-position="right" :inline="true" ref="dataForm" :model="dataForm" label-width="90px" @keyup.enter.native="getSeachTreeData()">
            <el-row>
              <el-col :span="20">
                <el-form-item prop="name" label="筛选条件：">
                  <el-input v-model="dataForm[defaultDataFormProps.name]" placeholder="请输入筛选条件" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" align="right">
                <el-button type="primary" size="small" @click="getSeachTreeData()">查询</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="24" class="tree-data">
          <el-tree v-show="isThis===0" ref="leftTreeData0" :data="data" :props="defaultProps" lazy :load="loadTreeNode" :default-checked-keys="checkedKeys" :default-expanded-keys="defaultExpandedKeys" node-key="id" class="treeLight treeLine treeCss" @node-click="handleNodeClick" check-on-click-node :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="true" style="height:440px;overflow-y:auto;">
            <div class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
              <!--nodeType={1阶段、2任务、31模块一，32模块二，33模块三、4用例}-->
              <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
              <span>{{data.name}}</span>
            </div>
          </el-tree>
          <el-tree v-show="isThis===1" ref="leftTreeData1" :data="data" :props="defaultProps" default-expand-all node-key="id" :default-checked-keys="checkedKeys" :default-expanded-keys="defaultExpandedKeys" class="treeLight treeLine treeCss" @node-click="handleNodeClick" check-on-click-node :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="true" style="height:440px;overflow-y:auto;">
            <div class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
              <!--nodeType={1阶段、2任务、31模块一，32模块二，33模块三、4用例}-->
              <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
              <span>{{data.name}}</span>
            </div>
          </el-tree>
        </el-col>
      </el-row>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button v-if="type==='checkbox'" type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcTreeTaskTable',
  data () {
    return {
      dataForm: {},
      data: [],
      visible: false,
      showOrganizeName: '',
      nameList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      currentNodekey: '',
      selectRowData: {},
      organizeRadio: '',
      searchName: '',
      isThis: 0, // 0 是需要懒加载  1是不需要 默认加载全部
      activeName: '0',
      checkedKeys: [], // 多选回显
      temporaryStorageData: [],
      defaultExpandedKeys: []
    }
  },
  props: {
    value: [Number, String],
    title: {
      type: String,
      default: '标题'
    },
    type: {
      type: String,
      default: 'radio'
    },
    id: String,
    pid: String,
    defaultDataFormProps: {
      type: Object,
      default () {
        return { name: '' }
      }
    },
    baseOption: Object,
    placeholder: String,
    taskIds: Array,
    caseIds: Array,
    taskType: [Number, String],
    taskData: Object
  },
  watch: {
    pid (newVal, oldVal) {
      console.log('进入pid')
      this.$emit('input', '')
      this.showOrganizeName = ''
      this.$set(this.dataForm, this.defaultDataFormProps.pid || 'pid', this.pid)
    },
    id (newVal, oldVal) {
      if (oldVal === '') {
        console.log('有id -- sjh')
        this.echoData()
      }
    }
  },
  mounted () {
    if (this.id) {
      console.log('有id -- sjh')
      this.echoData()
    }
    this.$set(this.dataForm, this.defaultDataFormProps.name || 'name', '')
    if (this.pid !== undefined) {
      this.$set(this.dataForm, this.defaultDataFormProps.pid || 'pid', this.pid)
    }
  },
  methods: {
    handleClose (tag) {
      let thisvm = this
      this.nameList.splice(this.nameList.indexOf(tag), 1)
      let ids = this.nameList
      let id = []
      let taskIds = [] // 任务id
      let caseIds = [] // 用例id
      if (this.taskType === 5 || this.taskType === 6 || this.taskType === 7) {
        for (let i = 0; i < ids.length; i++) {
          if (ids[i].nodeType === 2) {
            taskIds.push(ids[i].id)
          } else if (ids[i].nodeType === 4) {
            caseIds.push(ids[i].id)
            id.push(ids[i].id)
          }
        }
      } else {
        for (let i = 0; i < ids.length; i++) {
          if (ids[i].nodeType === 2) {
            taskIds.push(ids[i].id)
            id.push(ids[i].id)
          } else if (ids[i].nodeType === 4) {
            caseIds.push(ids[i].id)
            id.push(ids[i].id)
          }
        }
      }
      this.$emit('update:taskIds', taskIds)
      this.$emit('update:caseIds', caseIds)
      this.checkedKeys = id
      this.$refs['leftTreeData' + thisvm.isThis].setCheckedKeys(id)
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    openDialog () {
      this.visible = true
      if (this.data.length === 0) {
        this.getSeachTreeData()
      }
    },
    getSeachTreeData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let params = { nowTaskId: this.id, ...this.dataForm }
      thisvm.$http.get(this.baseOption.getUrl, { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        this.isThis = this.dataForm.name ? 1 : 0
        if (this.taskData.baseInfo.taskStatus === 1) {
          for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < thisvm.temporaryStorageData.length; j++) {
              if (thisvm.temporaryStorageData[j] === res.data[i].id) {
                res.data[i].disabled = true
              }
            }
          }
        }
        let datas = this.buildTreeDate(res.data, null)
        this.data = datas
        this.$refs['leftTreeData' + thisvm.isThis].setCheckedKeys(this.checkedKeys)
      }).catch(() => {
        this.data = []
        thisvm.$ctcLoading.close()
      })
    },
    getTreeData0 (resolve) {
      let thisvm = this
      // 默认先清空目录树缓存数据
      let params = { ...this.dataForm }
      thisvm.$http.get(this.baseOption.getUrl, { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        resolve(res.data)
      }).catch(() => {
        resolve([])
        thisvm.$ctcLoading.close()
      })
    },
    buildTreeDate (data, pid) {
      let result = []
      let temp
      for (let i = 0; i < data.length; i++) {
        if (data[i].nodeType === 1) {
          data[i].disabled = true
        }
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
    getCheckedNodes () {
      return [].concat(
        this.$refs['leftTreeData' + this.isThis].getHalfCheckedNodes(),
        this.$refs['leftTreeData' + this.isThis].getCheckedNodes()
      )
    },
    handleNodeClick (data) {
      // 设置点击，触发选中
      if (this.type === 'radio' && data.nodeType === 4) {
        if (data.id) {
          this.$emit('input', data.id)
          this.showOrganizeName = data.name
          this.visible = false
        }
      }
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        let icon = ''
        if (data.nodeType === 31 || data.nodeType === 32 || data.nodeType === 33) {
          icon = 'icon_7'
        } else if (data.nodeType === 2) {
          icon = 'icon_4'
        } else if (data.nodeType === 4) {
          icon = 'icon_6'
        }
        return require('@/assets/img/' + icon + '.png')
      } else {
        let mapInfo = { '1': '阶段', '2': '任务', '31': '模块', '32': '模块', '33': '模块', '4': '用例' }
        return mapInfo[data.nodeType] + '：' + data.name
      }
    },
    // 获取项目-用例树的数据
    getProjectCaseTreeData (resolve) {
      let thisvm = this
      // 默认先清空目录树缓存数据
      let params = {}
      thisvm.$http.get('/ctc/project/projectDetail/listTreeRoot', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        resolve(res.data)
      }).catch(() => {
        resolve([])
      })
    },
    buildDisable (data) {
      for (let i = 0; i < data.length; i++) {
        if (this.taskType === 5 || this.taskType === 6 || this.taskType === 7) {
        } else {
          if (data[i].nodeType !== 2) {
            data[i].disabled = true
          }
        }
      }
      return data
    },
    loadTreeNode (node, resolve) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      if (node.level === 0) {
      } else {
        console.log(node)
        let params = {}
        if (node.data.nodeType !== 2) {
          params = { ...this.dataForm, 'id': node.data.id, 'relationTaskId': node.data.relationTaskId, 'nowTaskId': this.id, 'nodeType': node.data.nodeType }
        } else {
          params = { ...this.dataForm, 'id': node.data.id, 'relationTaskId': node.data.id, 'nowTaskId': this.id, 'nodeType': node.data.nodeType }
        }
        this.$http.get(this.baseOption.getUrl, { 'params': params }).then(({ data: res }) => {
          thisvm.$ctcLoading.close()
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          let data = res.data
          if (node.data.nodeType === 2) {
            for (let i = 0; i < data.length; i++) {
              data[i].relationTaskId = data[i].pid
            }
          } else {
            for (let j = 0; j < data.length; j++) {
              data[j].relationTaskId = node.data.relationTaskId
            }
          }
          if (this.taskData.baseInfo.taskStatus === 1) {
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < thisvm.temporaryStorageData.length; j++) {
                if (thisvm.temporaryStorageData[j] === data[i].id) {
                  data[i].disabled = true
                }
              }
            }
          }
          let tdata = thisvm.buildDisable(data) || []
          resolve(tdata)
          // 特殊处理，模块节点默认展开
          this.$nextTick(() => {
            for (let i = 0; i < tdata.length; i++) {
              let item = tdata[i]
              if (!this.defaultExpandedKeys.includes(item.id) && [31, 32, 33].includes(item.nodeType)) {
                this.defaultExpandedKeys.push(item.id)
              }
            }
          })
        }).catch(() => {
          resolve([])
          thisvm.$ctcLoading.close()
        })
      }
    },
    getChooseOrganizeRow (index, row) {
      this.selectRowData = row
    },
    echoData () {
      this.showOrganizeName = ''
      this.$http.get(this.baseOption.echoUrl + this.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let task = res.data.task
          let cases = res.data.case

          let nameList = []
          let taskIds = [] // 任务id
          let caseIds = [] // 用例id
          for (let i = 0; i < task.length; i++) {
            taskIds.push(task[i].id)
            nameList.push({ nodeType: 2, ...task[i] })
          }
          for (let i = 0; i < cases.length; i++) {
            caseIds.push(cases[i].id)
            if (this.taskType !== 5 && this.taskType !== 6 && this.taskType !== 7) {
              nameList.push({ nodeType: 4, ...cases[i] })
            }
          }
          this.$emit('update:taskIds', taskIds)
          this.$emit('update:caseIds', caseIds)
          this.nameList = nameList
          this.checkedKeys = caseIds.length > 0 ? caseIds : taskIds
          if (this.taskData.baseInfo.taskStatus === 1 || this.taskData.readOnly === 1) {
            this.temporaryStorageData = taskIds.concat(caseIds)
            let newNameList = []
            nameList.forEach(item => {
              newNameList.push({ disable: true, ...item })
            })
            this.nameList = newNameList
          }
        }
      }).catch(() => { })
    },
    getOrganizeList () {
      return this.$http.get('/sys/project/select/organize', {
        params: {
          order: '',
          orderField: '',
          name: this.searchName,
          sidx: 1,
          page: this.page,
          limit: this.limit
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.organizeList = res.data.list
        this.total = res.data.total
      }).catch(() => { })
    },
    cancelHandle () {
      this.visible = false
    },
    commitHandle () {
      if (this.type !== 'radio') {
        let ids = this.filterArr(this.getCheckedNodes(), 'id')
        console.log(ids)
        console.log(this.$refs['leftTreeData' + this.isThis].getHalfCheckedNodes())
        console.log(this.$refs['leftTreeData' + this.isThis].getCheckedNodes())
        if (ids.length === 0) {
          this.$message.warning('请选择' + this.title)
          return
        }
        let nameList = []
        let id = []
        let taskIds = [] // 任务id
        let caseIds = [] // 用例id
        if (this.taskType === 5 || this.taskType === 6 || this.taskType === 7) {
          for (let i = 0; i < ids.length; i++) {
            if (ids[i].nodeType === 2) {
              taskIds.push(ids[i].id)
              nameList.push(ids[i])
            } else if (ids[i].nodeType === 4) {
              caseIds.push(ids[i].id)
              id.push(ids[i].id)
              // nameList.push(ids[i])
            }
          }
        } else {
          for (let i = 0; i < ids.length; i++) {
            if (ids[i].nodeType === 2) {
              taskIds.push(ids[i].id)
              id.push(ids[i].id)
              nameList.push(ids[i])
            } else if (ids[i].nodeType === 4) {
              caseIds.push(ids[i].id)
              id.push(ids[i].id)
              nameList.push(ids[i])
            }
          }
        }
        this.$emit('update:taskIds', taskIds)
        this.$emit('update:caseIds', caseIds)
        this.nameList = nameList
        this.checkedKeys = id
        if (this.taskData.baseInfo.taskStatus === 1) {
          for (let i = 0; i < nameList.length; i++) {
            for (let j = 0; j < this.temporaryStorageData.length; j++) {
              if (this.temporaryStorageData[j] === nameList[i].id) {
                nameList[i].disable = true
              }
            }
          }
          this.nameList = nameList
        }
        this.visible = false
      }
    },
    // 根据对象中的属性进行去重
    filterArr (arr, val) {
      const res = new Map()
      return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1))
    }
  }
}
</script>
<style lang="scss">
.leftTree {
  background: #fff;
  .treeCss {
    margin: 10px 0 0 -16px;
  }
  .treeLight {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    height: 768px;
    overflow-y: auto;
    .el-tree-node:focus > .el-tree-node__content {
      background-color: #f5f7fa !important;
    }
    .custom-tree-node {
      display: flex;
      width: 100%;
      font-family: PingFang-SC-Medium;
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.65);
      justify-content: space-between;
      align-items: center;
      .rightTreeColorCon {
        display: flex;
        margin-right: 15px;
        justify-content: space-between;
        align-items: center;
        :nth-child(1) {
          margin-right: 20px;
        }
      }
      .rightTreeColor {
        border-radius: 10px;
        width: 8px;
        height: 8px;
      }
    }
    .el-tree-node__content {
      height: 32px;
      line-height: 32px;
      .el-checkbox__inner {
        background: rgba(255, 255, 255, 0.45);
      }
    }

    .el-tree-node__content:hover {
      background-color: #f5f7fa !important;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      border-color: #147bd1;
      background-color: #147bd1;
    }
    .el-tree-node.is-current > .el-tree-node__content {
      color: rgba(0, 0, 0, 0.65);
      background-color: #f5f7fa !important;
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: rgba(0, 0, 0, 0.65);
      background-color: #f5f7fa !important;
    }
    /deep/ .el-tree-node::before {
      position: absolute;
      top: -11px;
      right: auto;
      bottom: 0;
      left: -4px;
      border-width: 1px;
      border-left: 1px solid rgba(0, 0, 0, 0.19);
      width: 1px;
      height: 100%;
      content: '';
    }

    /deep/ .el-tree-node::after {
      position: absolute;
      top: 15px;
      right: auto;
      left: -4px;
      border-width: 1px;
      border-top: 1px solid rgba(0, 0, 0, 0.19);
      width: 26px;
      height: 20px;
      content: '';
    }
  }
  .el-tree .el-tree-node__expand-icon.expanded {
    transform: rotate(0deg);
  }
  .el-tree .el-icon-caret-right::before {
    font-size: 12px;
    content: '\E723' !important;
  }
  .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right::before {
    font-size: 12px;
    content: '\E722' !important;
  }
  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #edf2fc;
    border-color: #dcdfe6;
    cursor: not-allowed;
  }
}

/* 树形结构节点添加连线 */
.treeLine /deep/ .el-tree-node {
  position: relative;
  padding-left: 16px;
}

.treeLine /deep/ .el-tree-node__children {
  padding-left: 16px;
}

.treeLine /deep/ .el-tree-node :last-child::before {
  height: 26px;
}

.treeLine /deep/ .el-tree > .el-tree-node::before {
  border-left: none;
}

.tree-container /deep/ .el-tree > .el-tree-node::after {
  border-top: none;
}

.treeLine /deep/ .el-tree-node[tabindex^='0']::before {
  border-left: none !important;
}

.treeLine /deep/ .el-tree-node__expand-icon.is-leaf {
  display: none;
}

.treeLine .el-tree-node > .el-tree-node__children {
  overflow: inherit;
}

.eltag {
  margin-right: 5px;
}
</style>
