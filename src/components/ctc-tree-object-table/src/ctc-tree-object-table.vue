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
      <el-row>
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
                <!--                                <el-button size="small" @click="resetForm()">重置</el-button>-->
              </el-col>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="24" class="tree-data">
          <el-tree v-show="isThis===0" ref="leftTreeData0" :data="data" :props="defaultProps" :default-expand-all="defaultExpandAll" :default-checked-keys="checkedKeys" node-key="id" class="treeLight treeLine treeCss" @node-click="handleNodeClick" :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="true" style="height:440px;overflow-y:auto;">
            <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
              <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
              <span>{{data.name}}</span>
            </span>
          </el-tree>
          <el-tree v-show="isThis===1" ref="leftTreeData1" :data="data" :props="defaultProps" default-expand-all :default-checked-keys="checkedKeys" node-key="id" class="treeLight treeLine treeCss" @node-click="handleNodeClick" :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="true" style="height:440px;overflow-y:auto;">
            <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
              <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
              <span>{{data.name}}</span>
            </span>
          </el-tree>
        </el-col>
      </el-row>
      <!--            </div>-->
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button v-if="type==='checkbox'" type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcTreeObjectTable',
  data () {
    return {
      dataForm: {},
      data: [],
      visible: false,
      showOrganizeName: '',
      nameList: [],
      defaultProps: {
        children: 'list',
        label: 'name',
        isLeaf: 'leaf'
      },
      currentNodekey: '',
      selectRowData: {},
      organizeRadio: '',
      searchName: '',
      checkedKeys: [], // 多选回显
      isThis: 0, // 0 是需要懒加载  1是不需要 默认加载全部
      testObjectDataMap: {}
    }
  },
  props: {
    value: [Number, String, Array],
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
    defaultExpandAll: {
      type: Boolean,
      default () {
        return false
      }
    },
    defaultDataFormProps: {
      type: Object,
      default () {
        return { name: '' }
      }
    },
    baseOption: Object,
    placeholder: String,
    selectType: String,
    sign: String,
    handleData: Array,
    taskData: Object
  },
  watch: {
    pid (newVal, oldVal) {
      this.$emit('input', '')
      this.showOrganizeName = ''
      this.data = []
      this.$set(this.dataForm, this.defaultDataFormProps.pid || 'pid', this.pid)
    },
    id (newVal, oldVal) {
      if (oldVal === '') {
        this.echoData()
      }
    }
  },
  mounted () {
    if (this.taskData.operationType === 'add') {
      this.defaultData()
    }
    if (this.id) {
      this.echoData()
    }
    this.$set(this.dataForm, this.defaultDataFormProps.name || 'name', '')
    if (this.pid) {
      this.$set(this.dataForm, this.defaultDataFormProps.pid || 'pid', this.pid)
    }
  },
  methods: {
    defaultData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      thisvm.$http.get(this.baseOption.initUrl, {}).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        console.log(res)
        let ids = res.data
        let nameList = []
        let handleData = []
        let id = []
        this.checkedKeys = []
        for (let i = 0; i < ids.length; i++) {
          id.push(ids[i].organizeId)
          nameList.push({ id: ids[i].organizeId, name: ids[i].organizeName })
          this.checkedKeys.push(ids[i].organizeId)
          handleData.push({ 'projectId': this.id, 'organizeId': ids[i].organizeId, 'organizeType': ids[i].organizeType, 'organizeName': ids[i].organizeName })
        }
        this.$emit('input', id)
        if (this.sign === 'testObject') {
          this.$emit('update:handleData', handleData)
        }
        this.nameList = nameList
      }).catch(() => {
        this.data = []
        thisvm.$ctcLoading.close()
      })
    },
    handleClose (tag) {
      let thisvm = this
      this.nameList.splice(this.nameList.indexOf(tag), 1)
      this.checkedKeys.splice(this.checkedKeys.indexOf(tag.id), 1)
      let ids = this.nameList
      let id = []
      for (let i = 0; i < ids.length; i++) {
        if (ids[i].id) {
          id.push(ids[i].id)
        }
      }
      let handleData = this.handleData.filter(item => {
        return item.organizeId !== tag.id
      })
      if (this.sign === 'testObject') {
        this.$emit('update:handleData', handleData)
      }
      this.checkedKeys = id
      this.$emit('input', id)
      this.$refs['leftTreeData' + thisvm.isThis].setCheckedKeys(id)
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
      let params = { ...this.dataForm }
      thisvm.$http.get(this.baseOption.getUrl, { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        if (this.sign === 'organizeId') {
          let list = res.data.list
          let newData = []
          for (let i = 0; i < list.length; i++) {
            let node = {}
            let nodeList = []
            node.name = list[i].organizeTypeName
            node.nodeType = 1
            for (let j = 0; j < list[i].list.length; j++) {
              nodeList.push({ nodeType: 2, ...list[i].list[j] })
            }
            node.list = nodeList
            newData.push(node)
          }
          this.isThis = this.dataForm.name ? 1 : 0
          this.data = newData
        } else if (this.sign === 'deptId') {
          let data = res.data
          let list = data.list
          let arr = []
          let node = {}
          node.name = data.organizeName
          node.id = data.organizeId
          node.nodeType = 2
          for (let i = 0; i < list.length; i++) {
            list[i].nodeType = 3
          }
          node.list = list
          arr.push(node)
          this.isThis = this.dataForm.name ? 1 : 0
          this.data = arr
          setTimeout(function () {
            thisvm.$refs['leftTreeData' + thisvm.isThis].store.nodesMap[data.organizeId].expanded = true
          }, 10)
        } else if (this.sign === 'managerId') {
          let data = res.data
          let userList = data.userList
          let arr = []
          let node = {}
          node.name = data.organizeName
          node.id = data.organizeId
          node.nodeType = 2
          for (let i = 0; i < userList.length; i++) {
            userList[i].name = userList[i].username + '(' + userList[i].realName + ')'
            userList[i].nodeType = 4
          }
          node.list = userList
          let list = data.list
          if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              let nodeList = {}
              nodeList.id = list[i].id
              nodeList.name = list[i].name
              nodeList.nodeType = 3
              for (let j = 0; j < list[i].userList.length; j++) {
                list[i].userList[j].name = list[i].userList[j].username + '(' + list[i].userList[j].realName + ')'
                list[i].userList[j].nodeType = 4
              }
              nodeList.list = list[i].userList
              node.list.push(nodeList)
            }
          }
          arr.push(node)
          this.isThis = this.dataForm.name ? 1 : 0
          this.data = arr
          setTimeout(function () {
            thisvm.$refs['leftTreeData' + thisvm.isThis].store.nodesMap[data.organizeId].expanded = true
          }, 10)
        } else if (this.sign === 'testObject') {
          let lists = res.data
          let newData = []
          for (let i = 0; i < lists.length; i++) {
            let node = {}
            let nodeList = []
            node.name = lists[i].organizeTypeName
            node.nodeType = 1
            for (let j = 0; j < lists[i].list.length; j++) {
              let item = { nodeType: 2, ...lists[i].list[j] }
              item.id = item.organizeId
              item.name = item.organizeName
              // 控制已选是否可编辑
              if (this.taskData.baseInfo.taskStatus === 1) {
                if (this.testObjectDataMap[item.id]) {
                  item.disabled = true
                } else {
                  item.disabled = false
                }
              } else {
                item.disabled = false
              }
              nodeList.push(item)
            }
            node.list = nodeList
            if (node.list.length > 0) {
              newData.push(node)
            }
          }
          this.isThis = this.dataForm.name ? 1 : 0
          this.data = newData
        }
      }).catch(() => {
        this.data = []
        thisvm.$ctcLoading.close()
      })
    },
    getTreeData (resolve) {
      let thisvm = this
      // 默认先清空目录树缓存数据
      let params = { ...this.dataForm }
      thisvm.$http.get(this.baseOption.getUrl, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        resolve(res.data)
      }).catch(() => {
        resolve([])
      })
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
    getCheckedNodes () {
      let thisvm = this
      return this.$refs['leftTreeData' + thisvm.isThis].getCheckedNodes()
    },
    handleNodeClick (data) {
      // 设置点击，触发选中
      if (this.type === 'radio') {
        if (this.sign === 'organizeId') {
          if (data.nodeType === 2) {
            this.$emit('input', data.id)
            this.$emit('afterSelectDo', { 'type': this.selectType, 'data': data })
            this.showOrganizeName = data.name
            this.visible = false
          }
        } else if (this.sign === 'deptId') {
          if (data.nodeType === 3) {
            this.$emit('input', data.id)
            this.$emit('afterSelectDo', { 'type': this.selectType, 'data': data })
            this.showOrganizeName = data.name
            this.visible = false
          }
        } else if (this.sign === 'managerId') {
          if (data.nodeType === 4) {
            this.$emit('input', data.id)
            this.$emit('afterSelectDo', { 'type': this.selectType, 'data': data })
            this.showOrganizeName = data.name
            this.visible = false
          }
        }
      }
    },
    getTreeIcon (type, data) {
      if (type === 'src') {
        return require('@/assets/img/sys_icon_' + data.nodeType + '.png')
      } else {
        return data.name
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
    loadTreeNode (node, resolve) {
      if (node.level === 0) {
        this.getTreeData(resolve)
      } else {
        let params = { ...this.dataForm, 'id': node.data.id, 'nodeType': node.data.nodeType }
        this.$http.get(this.baseOption.getUrl, { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          resolve(res.data || [])
        }).catch(() => {
          resolve([])
        })
      }
    },
    getChooseOrganizeRow (index, row) {
      this.selectRowData = row
    },
    echoData () {
      if (this.type === 'radio') {
        this.showOrganizeName = ''
        this.$http.get(this.baseOption.echoUrl + this.id).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            if (res.data.list.length > 0) {
              if (this.sign === 'managerId') {
                this.showOrganizeName = res.data.list[0].username + '(' + res.data.list[0].realName + ')'
              } else {
                this.showOrganizeName = res.data.list[0].name || res.data.list[0].username
              }
              this.$emit('input', this.id)
            }
          }
        }).catch(() => { })
      } else {
        this.nameList = []
        this.$http.get(this.baseOption.echoUrl + this.id).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            let list = res.data
            let keys = []
            let handleData = []
            for (let i = 0; i < list.length; i++) {
              list[i].name = list[i].organizeName
              list[i].id = list[i].organizeId
              if (this.taskData.baseInfo.taskStatus === 1) {
                list[i].disable = true
              }
              this.testObjectDataMap[list[i].id] = list[i]
              keys.push(list[i].organizeId)
              handleData.push({ 'projectId': this.id, 'organizeId': list[i].organizeId, 'organizeType': list[i].organizeType, 'organizeName': list[i].organizeName })
            }
            if (this.sign === 'testObject') {
              this.$emit('update:handleData', handleData)
            }
            this.$emit('input', keys)
            this.nameList = list
            this.checkedKeys = keys
          }
        }).catch(() => { })
      }
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
        let ids = this.getCheckedNodes()
        let nameList = []
        let handleData = []
        let id = []
        this.checkedKeys = []
        for (let i = 0; i < ids.length; i++) {
          if (ids[i].id) {
            // 控制已选是否可编辑
            if (this.taskData.baseInfo.taskStatus === 1) {
              if (this.testObjectDataMap[ids[i].id]) {
                ids[i].disable = true
              } else {
                ids[i].disable = false
              }
            } else {
              ids[i].disable = false
            }
            id.push(ids[i].id)
            nameList.push(ids[i])
            this.checkedKeys.push(ids[i].id)
            handleData.push({ 'projectId': this.id, 'organizeId': ids[i].id, 'organizeType': ids[i].type, 'organizeName': ids[i].name })
          }
        }
        this.$emit('input', id)
        if (this.sign === 'testObject') {
          this.$emit('update:handleData', handleData)
        }
        this.nameList = nameList
        this.visible = false
      }
    }
  }
}
</script>
