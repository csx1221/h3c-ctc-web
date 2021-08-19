<template>
  <div>
    <el-input v-model="showUserName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="userDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleUser" width="50%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row style="margin-bottom:10px;">
        <el-col :span="18">
          <el-input v-model="searchName" placeholder="请输入关联任务"></el-input>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button type="primary" size="small" @click="getUserList">查询</el-button>
          <el-button size="small" @click="doResetGetUserList">重置</el-button>
        </el-col>
      </el-row>
      <el-tree
        :props="props"
        :load="loadNode"
        lazy
        show-checkbox
        @check-change="handleCheckChange">
      </el-tree>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcAssociatedTaskTable',
  data () {
    return {
      props: {
        label: 'name',
        children: 'zones'
      },
      count: 1,
      visibleUser: false,
      userList: [],
      showUserName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectRowData: {},
      userRadio: '',
      searchName: '',
      page: 1,
      limit: 5,
      total: 0
    }
  },
  props: {
    value: [Number, String],
    organizeId: String,
    deptId: String,
    userId: String,
    placeholder: String
  },
  watch: {
    userId (newVal, oldVal) {
      this.echoUserData()
    }
  },
  methods: {
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handleNodeClick (data) {
      console.log(data)
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region1' }, { name: 'region2' }])
      }
      if (node.level > 3) return resolve([])
      var hasChild
      if (node.data.name === 'region1') {
        hasChild = true
      } else if (node.data.name === 'region2') {
        hasChild = false
      } else {
        hasChild = Math.random() > 0.5
      }
      setTimeout(() => {
        var data
        if (hasChild) {
          data = [{
            name: 'zone' + this.count++
          }, {
            name: 'zone' + this.count++
          }]
        } else {
          data = []
        }
        resolve(data)
      }, 500)
    },
    userDialog () {
      this.visibleUser = true
      this.searchName = ''
      this.getUserList()
    },
    getChooseUserRow (index, row) {
      this.selectRowData = row
    },
    echoUserData () {
      if (this.userId !== '') {
        let params = { 'userId': this.userId }
        this.$http.get('/sys/project/select/manager', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            if (res.data.list.length > 0) {
              this.showUserName = res.data.list[0].realName
            }
          }
        }).catch(() => { })
      } else {
        this.showUserName = ''
      }
    },
    doResetGetUserList () {
      this.searchName = ''
      this.getUserList()
    },
    getUserList () {
      this.$http.get('/sys/project/select/manager', {
        params: {
          realName: this.searchName,
          id: this.userId,
          organizeId: this.organizeId,
          deptId: this.deptId,
          page: this.page,
          limit: this.limit
        }
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.userList = res.data.list
        this.total = res.data.total
      }).catch(() => { })
    },
    cancelHandle () {
      this.visibleUser = false
      this.userList = []
    },
    commitHandle () {
      const node = this.selectRowData
      if (!node && !(node.id)) {
        this.$message.warning(this.placeholder)
        return
      }
      this.$emit('input', node.id)
      this.$emit('update:userName', node.realName)
      this.showUserName = node.realName
      this.visibleUser = false
      this.userList = []
    }
  }
}
</script>
