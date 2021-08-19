<template>
  <div class="ctctree-select-tablegy">
    <el-input v-model="showOrganizeName">
      <el-select v-model="showOrganizeName" filterable slot="prefix" :placeholder="placeholder" value-key="id" @change="chooseOrganize">
        <el-option v-for="item in projectOrganizeData" :key="item.id" :label="item.name" :value="item"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="openDialog"></el-button>
    </el-input>
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
          <el-tree v-show="isThis===0" ref="leftTreeData0" :data="data" :props="defaultProps" :default-expand-all="defaultExpandAll" :default-checked-keys="checkedKeys" node-key="id" class="treeLight treeLine treeCss" @node-click="handleNodeClick" :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="false" :check-on-click-node="true" style="height:440px;overflow-y:auto;">
            <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
              <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
              <span>{{data.name}}</span>
            </span>
          </el-tree>
          <el-tree v-show="isThis===1" ref="leftTreeData1" :data="data" :props="defaultProps" default-expand-all :default-checked-keys="checkedKeys" node-key="id" class="treeLight treeLine treeCss" @node-click="handleNodeClick" :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="false" :check-on-click-node="true" style="height:440px;overflow-y:auto;">
            <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
              <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
              <span>{{data.name}}</span>
            </span>
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
  name: 'CtcTreeSelectTableGy',
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
      isPush: false,
      leftCheckData: [],
      projectOrganizeData: []
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
    handleData: Array
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
      if (newVal === '') {
        this.showOrganizeName = ''
      }
    }
  },
  mounted () {
    if (this.id) {
      this.echoData()
    }
    this.$set(this.dataForm, this.defaultDataFormProps.name || 'name', '')
    if (this.pid) {
      this.$set(this.dataForm, this.defaultDataFormProps.pid || 'pid', this.pid)
    }
    if (this.data.length === 0) {
      this.getSeachTreeData()
    }
  },
  methods: {
    chooseOrganize (data) {
      this.$emit('input', data.id)
      this.$emit('afterSelectDo', { 'type': this.selectType, 'data': data })
      this.showOrganizeName = data.name
    },
    handleClose (tag) {
      let thisvm = this
      this.nameList.splice(this.nameList.indexOf(tag), 1)
      this.checkedKeys.splice(this.checkedKeys.indexOf(tag.id), 1)
      let handleData = this.handleData
      for (let i = 0; i < handleData.length; i++) {
        if (handleData[i].organizeId === tag.id) {
          this.handleData.splice(i, 1)
          this.$emit('update:handleData', this.handleData)
        }
      }
      let ids = this.nameList
      let id = []
      for (let i = 0; i < ids.length; i++) {
        if (ids[i].id) {
          id.push(ids[i].id)
        }
      }
      this.$refs['leftTreeData' + thisvm.isThis].setCheckedKeys(id)
      this.$emit('input', id.join(','))
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
          // 默认先清空机构数据
          this.projectOrganizeData = []
          for (let i = 0; i < list.length; i++) {
            let node = {}
            let nodeList = []
            node.name = list[i].organizeTypeName
            node.nodeType = 1
            for (let j = 0; j < list[i].list.length; j++) {
              let tmp = { nodeType: 2, ...list[i].list[j] }
              nodeList.push(tmp)
              this.projectOrganizeData.push(tmp)
            }
            node.list = nodeList
            newData.push(node)
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
              this.showOrganizeName = res.data.list[0].name || res.data.list[0].username
              this.$emit('input', this.id)
            }
          }
        }).catch(() => { })
      }
    },
    cancelHandle () {
      this.visible = false
    },
    commitHandle () {
    }
  }
}
</script>
<style lang="scss" >
.ctctree-select-tablegy {
  .el-input__prefix {
    left: 0px;
    width: 100%;
  }
}
</style>
