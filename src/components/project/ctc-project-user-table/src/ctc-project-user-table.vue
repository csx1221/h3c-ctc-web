<template>
  <div>
    <el-input v-model="showUserName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="userDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleUser" width="50%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row style="margin-bottom:10px;">
        <el-col :span="18">
          <el-input v-model="realName" placeholder="请输入用户姓名"></el-input>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button type="primary" size="small" @click="getUserList">查询</el-button>
          <el-button size="small" @click="doResetGetUserList">重置</el-button>
        </el-col>
      </el-row>
      <el-table ref="tableObject" border :data="userList" style="width: 100%;height:340px;">
        <el-table-column type="selection" header-align="center" align="center" width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="userRadio" @change.native="getChooseUserRow(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户账号" header-align="left" align="left"></el-table-column>
        <el-table-column prop="realName" label="用户姓名" header-align="left" align="left"></el-table-column>
        <el-table-column prop="deptName" label="部门名称" header-align="left" align="left">
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getUserList" style="text-align:left;">
      </el-pagination>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcProjectUserTable',
  data () {
    return {
      visibleUser: false,
      userList: [],
      showUserName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      selectRowData: {},
      userRadio: '',
      realName: '',
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
    userDialog () {
      this.visibleUser = true
      this.realName = ''
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
      this.realName = ''
      this.getUserList()
    },
    getUserList () {
      this.$http.get('/sys/project/select/manager', {
        params: {
          realName: this.realName,
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
