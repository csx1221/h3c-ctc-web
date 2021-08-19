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
    <!--        <el-input :value="value" style="display: none"></el-input>-->
    <el-dialog :visible.sync="visible" width="35%" :modal="false" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row class="leftTree tree-container">
        <el-col :span="24" style="margin-bottom: 10px;">
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
          <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="项目成员" name="0">
              <el-tree v-show="isThis===0" ref="leftTreeData00" :data="data" :props="defaultProps" lazy :load="loadTreeNode0" :default-checked-keys="checkedKeys" node-key="id" class="treeLight treeLine treeCss" @check-change="checkChange" @node-click="handleNodeClick" :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="true" style="height:440px;overflow-y:auto;">
                <div class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
                  <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
                  <span>{{getTreeIcon('name',data)}}</span>
                </div>
              </el-tree>
              <el-tree v-show="isThis===1" ref="leftTreeData10" :data="data" :props="defaultProps" default-expand-all node-key="id" :default-checked-keys="checkedKeys" class="treeLight treeLine treeCss" @check-change="checkChange" @node-click="handleNodeClick" :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="true" style="height:440px;overflow-y:auto;">
                <div class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
                  <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
                  <span>{{getTreeIcon('name',data)}}</span>
                </div>
              </el-tree>
            </el-tab-pane>
            <el-tab-pane label="其他成员" name="1">
              <el-tree v-show="isThis===0" ref="leftTreeData01" :data="dataOther" :props="defaultProps" lazy :load="loadTreeNode1" :default-checked-keys="checkedKeys" node-key="id" class="treeLight treeLine treeCss" @check-change="checkChange" @node-click="handleNodeClick" :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="true" style="height:440px;overflow-y:auto;">
                <div class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
                  <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
                  <span>{{getTreeIcon('name',data)}}</span>
                </div>
              </el-tree>
              <el-tree v-show="isThis===1" ref="leftTreeData11" :data="dataOther" :props="defaultProps" default-expand-all node-key="id" :default-checked-keys="checkedKeys" class="treeLight treeLine treeCss" @check-change="checkChange" @node-click="handleNodeClick" :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="true" style="height:440px;overflow-y:auto;">
                <div class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
                  <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
                  <span>{{getTreeIcon('name',data)}}</span>
                </div>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
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
  name: 'CtcTreeReviewTable',
  data () {
    return {
      dataForm: {},
      data: [],
      dataOther: [],
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
      temporaryStorageData: []
    }
  },
  props: {
    value: Array,
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
    },
    'taskData.projectStageId' (newVal, oldVal) {
      if (this.taskData.operationType === 'add' && newVal) {
        this.defaultData()
      }
    }
  },
  mounted () {
    if (this.taskData.projectStageId && this.taskData.operationType === 'add') {
      this.defaultData()
    }
    if (this.id) {
      console.log('有id -- sjh')
      this.echoData()
    }
    // if (this.defaultDataFormProps) {
    this.$set(this.dataForm, this.defaultDataFormProps.name || 'name', '')
    if (this.pid !== undefined) {
      this.$set(this.dataForm, this.defaultDataFormProps.pid || 'pid', this.pid)
    }
    // }
  },
  methods: {
    // 勾选变化时
    checkChange (data, node) {
      let thisvm = this
      // this.checkedKeys.splice(this.checkedKeys.indexOf(data.id), 1)
      this.$refs['leftTreeData' + thisvm.isThis + '0'].setChecked(data, node)
      this.$refs['leftTreeData' + thisvm.isThis + '1'].setChecked(data, node)
    },
    defaultData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      let params = { ...this.dataForm }
      thisvm.$http.get(this.baseOption.getProjectUrl, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        let ids = res.data
        let id = []
        let list = []
        let nameList = []
        for (let i = 0; i < ids.length; i++) {
          id.push(ids[i].id)
          let obj = {}
          let nameObj = {}
          obj.userId = ids[i].id
          obj.userName = ids[i].name
          nameObj.id = ids[i].id
          nameObj.name = ids[i].name
          list.push(obj)
          nameList.push(nameObj)
          console.log(nameObj)
        }
        this.$emit('input', list)
        this.nameList = nameList
        this.checkedKeys = id
        this.data = ids
      }).catch(() => {
        this.data = []
      })
    },
    handleClose (tag) {
      let thisvm = this
      this.nameList.splice(this.nameList.indexOf(tag), 1)
      let ids = this.nameList
      let id = []
      let list = []
      for (let i = 0; i < ids.length; i++) {
        if (ids[i].id) {
          id.push(ids[i].id)
          let obj = {}
          obj.userId = ids[i].id
          obj.userName = ids[i].name
          list.push(obj)
        }
      }
      this.checkedKeys = id
      this.$emit('input', list)
      this.$refs['leftTreeData' + thisvm.isThis + '0'].setCheckedKeys(id)
      this.$refs['leftTreeData' + thisvm.isThis + '1'].setCheckedKeys(id)
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    openDialog () {
      this.visible = true
      // if (this.data.length === 0) {
      this.getSeachTreeProjectData() // 项目树
      // }
      if (this.dataOther.length === 0) {
        this.getSeachTreeOtherData() // 其他项目树
      }
    },
    getSeachTreeData () {
      let thisvm = this
      this.isThis = this.dataForm.name ? 1 : 0
      thisvm.getSeachTreeProjectData() // 项目树
      thisvm.getSeachTreeOtherData() // 其他项目树
    },
    getSeachTreeProjectData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let params = { ...this.dataForm }
      thisvm.$http.get(this.baseOption.getProjectUrl, { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        if ([1, 2].includes(this.taskData.baseInfo.taskStatus)) {
          for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < thisvm.temporaryStorageData.length; j++) {
              if (thisvm.temporaryStorageData[j].userId === res.data[i].id) {
                res.data[i].disabled = true
              }
            }
          }
        }
        this.data = res.data
        this.$refs['leftTreeData' + thisvm.isThis + '0'].setCheckedKeys(this.checkedKeys)
        this.$refs['leftTreeData' + thisvm.isThis + '1'].setCheckedKeys(this.checkedKeys)
      }).catch(() => {
        this.data = []
        thisvm.$ctcLoading.close()
      })
    },
    getSeachTreeOtherData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let params = { ...this.dataForm }
      thisvm.$http.get(this.baseOption.getOtherUrl, { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        if ([1, 2].includes(this.taskData.baseInfo.taskStatus)) {
          for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < thisvm.temporaryStorageData.length; j++) {
              if (thisvm.temporaryStorageData[j].userId === res.data[i].id) {
                res.data[i].disabled = true
              }
            }
          }
        }
        let datas = this.buildTreeDate(res.data, null)
        this.dataOther = datas
        this.$refs['leftTreeData' + thisvm.isThis + '0'].setCheckedKeys(this.checkedKeys)
        this.$refs['leftTreeData' + thisvm.isThis + '1'].setCheckedKeys(this.checkedKeys)
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
    getTreeData1 (resolve) {
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
        if (data[i].nodeType !== 4) {
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
      return this.$refs['leftTreeData' + this.isThis + '0'].getCheckedNodes().concat(this.$refs['leftTreeData' + this.isThis + '1'].getCheckedNodes())
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
        return require('@/assets/img/sys_icon_' + (data.nodeType || '4') + '.png')
      } else if (type === 'title') {
        return data.name
      } else if (type === 'name') {
        if (data.nodeType === 4) {
          return data.userName + '(' + data.name + ')'
        } else {
          return data.name
        }
      }
    },
    // 获取项目-用例树的数据
    getProjectCaseTreeData (resolve) {
      let thisvm = this
      // 默认先清空目录树缓存数据
      // thisvm.leftTreeDataMap = {}
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
        if (data[i].nodeType !== 4) {
          data[i].disabled = true
        }
      }
      return data
    },
    loadTreeNode0 (node, resolve) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      if (node.level === 0) {
        // console.log(0)
        // this.getTreeData0(resolve)
      } else {
        let params = { ...this.dataForm, 'id': node.data.id, 'nodeType': node.data.nodeType }
        this.$http.get(this.baseOption.getUrl, { 'params': params }).then(({ data: res }) => {
          thisvm.$ctcLoading.close()
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          if ([1, 2].includes(this.taskData.baseInfo.taskStatus)) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].disabled = true
            }
          }
          resolve(thisvm.buildDisable(res.data) || [])
        }).catch(() => {
          resolve([])
          thisvm.$ctcLoading.close()
        })
      }
    },
    loadTreeNode1 (node, resolve) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      if (node.level === 0) {
        // console.log(111)
        // this.getTreeData1(resolve)
      } else {
        let params = { ...this.dataForm, 'id': node.data.id, 'nodeType': node.data.nodeType }
        this.$http.get(this.baseOption.getOtherUrl, { 'params': params }).then(({ data: res }) => {
          thisvm.$ctcLoading.close()
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          if ([1, 2].includes(this.taskData.baseInfo.taskStatus)) {
            for (let i = 0; i < res.data.length; i++) {
              for (let j = 0; j < thisvm.temporaryStorageData.length; j++) {
                if (thisvm.temporaryStorageData[j].userId === res.data[i].id) {
                  res.data[i].disabled = true
                }
              }
            }
          }
          resolve(thisvm.buildDisable(res.data) || [])
          this.$refs['leftTreeData' + thisvm.isThis + '0'].setCheckedKeys(this.checkedKeys)
          this.$refs['leftTreeData' + thisvm.isThis + '1'].setCheckedKeys(this.checkedKeys)
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
          console.log(res)
          let ids = res.data
          let id = []
          let list = []
          let nameList = []
          for (let i = 0; i < ids.length; i++) {
            id.push(ids[i].userId)
            let obj = {}
            let nameObj = {}
            obj.userId = ids[i].userId
            obj.userName = ids[i].userName
            nameObj.id = ids[i].userId
            nameObj.name = ids[i].userName
            list.push(obj)
            nameList.push(nameObj)
          }
          console.log(id)
          this.$emit('input', list)
          this.nameList = nameList
          this.checkedKeys = id
          if ([1, 2].includes(this.taskData.baseInfo.taskStatus) || this.taskData.readOnly === 1) {
            this.temporaryStorageData = list
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
        if (ids.length === 0) {
          this.$message.warning('请选择' + this.title)
          return
        }
        let id = []
        let list = []
        let nameList = []
        for (let i = 0; i < ids.length; i++) {
          if (ids[i].nodeType === 4) {
            id.push(ids[i].id)
            let obj = {}
            let realName = ids[i].name || ids[i].userName
            obj.userId = ids[i].id
            obj.userName = realName
            list.push(obj)
            nameList.push({ id: ids[i].id, name: realName })
          }
        }
        this.$emit('input', list)
        this.nameList = nameList
        this.checkedKeys = id
        if ([1, 2].includes(this.taskData.baseInfo.taskStatus)) {
          for (let i = 0; i < nameList.length; i++) {
            for (let j = 0; j < this.temporaryStorageData.length; j++) {
              if (this.temporaryStorageData[j].userId === nameList[i].id) {
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
