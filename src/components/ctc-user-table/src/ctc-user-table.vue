<template>
  <div>
    <el-input :disabled="disabled" v-model="showUserName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="userDialog"></el-button>
    </el-input>
    <el-input :value="value" style="display: none"></el-input>
    <el-dialog :visible.sync="visibleUser" width="60%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row :gutter="20">
        <el-col :span="8">
          <ctc-organize-table v-model="organizeId" placeholder="请输入机构名称" :organizeId.sync="organizeId"></ctc-organize-table>
        </el-col>
        <el-col :span="8">
          <ctc-dept-table v-model="deptId" placeholder="请输入部门名称" :deptId.sync="deptId" :organizeId.sync="organizeId"></ctc-dept-table>
        </el-col>
        <el-col :span="8" style="text-align:right">
          <el-button type="primary" size="small" @click="getUserList">查询</el-button>
          <el-button size="small" @click="doResetGetUserList">重置</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin:10px 0px;">
        <el-col :span="8">
          <el-input v-model="userName" placeholder="请输入用户账号"></el-input>
        </el-col>
        <el-col :span="8">
          <el-input v-model="realName" placeholder="请输入用户名"></el-input>
        </el-col>
      </el-row>
      <el-table ref="tableObject" :data="userList" border style="width: 100%;height:340px;">
        <el-table-column type="selection" header-align="center" align="center" width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.id" v-model="userRadio" @change.native="getChooseUserRow(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户账号" header-align="left" align="left"></el-table-column>
        <el-table-column prop="realName" label="用户姓名" header-align="left" align="left"></el-table-column>
        <el-table-column prop="organizeName" label="所属机构 / 部门" header-align="left" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.deptName"> {{scope.row.organizeName}} / {{scope.row.deptName}}</span>
            <span v-else> {{scope.row.organizeName}}</span>
          </template>
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
  name: 'CtcUserTable',
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
      userName: '',
      realName: '',
      organizeId: '',
      deptId: '',
      page: 1,
      limit: 5,
      total: 0
    }
  },
  props: {
    value: [Number, String],
    userId: String,
    type: [Number, String],
    placeholder: String,
    disabled: Boolean
  },
  watch: {
    userId (newVal, oldVal) {
      this.echoUserData()
    }
  },
  methods: {
    userDialog () {
      this.visibleUser = true
      this.userName = ''
      this.realName = ''
      this.getUserList()
    },
    getChooseUserRow (index, row) {
      this.selectRowData = row
    },
    echoUserData () {
      if (this.userId !== '') {
        this.$http.get(`/sys/user/${this.userId}`).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.showUserName = res.data.realName
          }
        }).catch(() => { })
      } else {
        this.showUserName = ''
      }
    },
    doResetGetUserList () {
      this.organizeId = ''
      this.deptId = ''
      this.userName = ''
      this.realName = ''
      this.getUserList()
    },
    getUserList () {
      return this.$http.get('/sys/user/page', {
        params: {
          order: '',
          orderField: '',
          username: this.userName,
          realName: this.realName,
          organizeId: this.organizeId,
          deptId: this.deptId,
          sidx: 1,
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
      this.$emit('update:userName2', node.username)
      this.$emit('watchChildPage', { 'type': this.type, 'data': node })
      this.showUserName = node.realName
      this.visibleUser = false
      this.userList = []
    }
  }
}
</script>
<style lang="scss" scoped>
.user-filter {
  margin-bottom: 10px;
}
</style>
