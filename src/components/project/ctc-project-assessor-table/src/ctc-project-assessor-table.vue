<template>
  <div>
    <el-input v-model="showUserName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="userDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleUser" width="50%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row style="margin-bottom:10px;">
        <el-col :span="18">
          <el-input v-model="searchName" placeholder="请输入用户姓名"></el-input>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button type="primary" size="small" @click="getUserList">查询</el-button>
          <el-button size="small" @click="doResetGetUserList">重置</el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="项目成员" name="first">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="项目成员1"></el-checkbox>
            <el-checkbox label="项目成员2"></el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
        <el-tab-pane label="其他人员" name="second">其他人员</el-tab-pane>
      </el-tabs>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcProjectAssessorTable',
  data () {
    return {
      activeName: 'second',
      checkList: [],
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
    handleClick (tab, event) {
      console.log(tab, event)
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
<style lang="scss" scoped>
.el-checkbox-group {
  .el-checkbox {
    display: block;
  }
}
</style>
