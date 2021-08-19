<template>
  <div>
    <el-input v-if="type==='radio'" v-model="showOrganizeName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="openDialog"></el-button>
    </el-input>
    <div v-else class="el-input el-input-group el-input-group--append">
      <div class="el-input__inner" v-if="nameList.length>0">
        <template v-for="(item,index) in nameList">
          <el-tag :key="index">{{item.name}}</el-tag>
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
          <el-tree v-show="isThis===0" ref="leftTreeData" :data="data" :props="defaultProps" lazy :load="loadTreeNode" node-key="id" class="treeLight treeLine treeCss" @node-click="handleNodeClick" :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="true" style="height:440px;overflow-y:auto;">
            <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
              <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
              <span>{{data.name}}</span>
            </span>
          </el-tree>
          <el-tree v-show="isThis===1" ref="leftTreeData" :data="data" :props="defaultProps" default-expand-all node-key="id" class="treeLight treeLine treeCss" @node-click="handleNodeClick" :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="3" :expand-on-click-node="true" style="height:440px;overflow-y:auto;">
            <span class="custom-tree-node" :title="getTreeIcon('title',data)" slot-scope="{ node, data }" style="display:block;">
              <img :src="getTreeIcon('src',data)" style="width:16px;height:16px;margin-right:5px;" />
              <span>{{data.name}}</span>
            </span>
          </el-tree>
        </el-col>
      </el-row>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button type="info" @click="clearHandle()" size="mini">清除</el-button>
        <el-button v-if="type==='checkbox'" type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcTreeTable',
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
      isThis: 0 // 0 是需要懒加载  1是不需要 默认加载全部
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
    placeholder: String
  },
  watch: {
    pid (newVal, oldVal) {
      console.log('进入pid')
      this.$emit('input', '')
      this.showOrganizeName = ''
      this.$set(this.dataForm, this.defaultDataFormProps.pid || 'pid', this.pid)
    },
    id (newVal, oldVal) {
      console.log('有id -- sjh')
      this.echoData()
    }
  },
  mounted () {
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
    openDialog () {
      this.visible = true
      // this.getSeachTreeData()
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
        // this.data = res.data
        this.isThis = this.dataForm.name ? 1 : 0
        let datas = this.buildTreeDate(res.data, null)
        this.data = datas
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
      return this.$refs.leftTreeData.getCheckedNodes()
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
      let thisvm = this
      thisvm.$ctcLoading.open()
      if (node.level === 0) {
        this.getTreeData(resolve)
      } else {
        let params = { ...this.dataForm, 'id': node.data.id, 'nodeType': node.data.nodeType }
        this.$http.get(this.baseOption.getUrl, { 'params': params }).then(({ data: res }) => {
          thisvm.$ctcLoading.close()
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].nodeType === 4) {
              res.data[i].name = res.data[i].userName + '(' + res.data[i].name + ')'
            }
          }
          resolve(res.data || [])
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
      if ((this.id || '') !== '') {
        this.showOrganizeName = ''
        this.$http.get(this.baseOption.echoUrl + this.id).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.showOrganizeName = res.data.username + '(' + res.data.realName + ')'
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
    clearHandle () {
      this.$emit('input', '')
      this.showOrganizeName = ''
      this.nameList = []
      this.visible = false
    },
    commitHandle () {
      if (this.type !== 'radio') {
        let ids = this.getCheckedNodes()
        console.log(ids)
        if (ids.length === 0) {
          this.$message.warning('请选择' + this.title)
          return
        }
        let id = []
        for (let i = 0; i < ids.length; i++) {
          id.push(ids[i].id)
        }
        this.$emit('input', id.join(','))
        this.$emit('update:showOrganizeName', '')
        this.nameList = ids
        this.visible = false
      }
    }
  }
}
</script>
