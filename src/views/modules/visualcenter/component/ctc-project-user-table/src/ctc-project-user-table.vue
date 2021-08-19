<template>
  <div>
    <!-- 这里是要显示到父组件的 -->
    <el-input v-model="showUserName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="userDialog"></el-button>
    </el-input>
    <!-- 这里是要接受父组件传入的数据的，但是，此处暂时没处理 -->
    <!-- <el-input :value="value" style="display: none"></el-input> -->
    <!-- 这里是对话框 -->
    <el-dialog :visible.sync="visibleUser" width="50%" :modal="false" :title="placeholder" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row style="margin-bottom:10px;">
        <el-col :span="18">
          <!-- 这里是查询的输入框 -->
          <el-input v-model="realName" placeholder="请输入用户姓名" ></el-input>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <!-- 查询框的操作按钮 -->
          <el-button type="primary" size="small" @click="getUserList">查询</el-button>
          <el-button size="small" @click="doResetGetUserList">重置</el-button>
        </el-col>
      </el-row>
      <!-- 这里是宣传数据的表达 -->
      <el-table ref="tableObject" @selection-change="handleSelectionChange" border :data="userList" style="width: 100%;height:340px;">
        <el-table-column type="selection" header-align="center" align="center" width="60"></el-table-column>
        <el-table-column prop="username" label="用户账号" header-align="left" align="left"></el-table-column>
        <el-table-column prop="realName" label="用户姓名" header-align="left" align="left"></el-table-column>
        <el-table-column prop="deptName" label="部门名称" header-align="left" align="left">
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination background layout="prev, pager, next" :page-size="limit" :total="total" :current-page.sync="page" :hide-on-single-page="false" @current-change="getUserList" style="text-align:left;">
      </el-pagination>
      <!-- 对话框的操作按钮 -->
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
      managerIdList: [],
      managerNameList: [],
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
  // 接受父组件的数据
  props: {
    value: [String, Number],
    organizeId: String,
    deptId: String,
    userId: String,
    placeholder: String
  },
  // 监听传入id的变化并且做请求，这里好像是没有用到
  watch: {
    userId (newVal, oldVal) {
      this.echoUserData()
    }
  },
  methods: {
    // 触发对话框
    userDialog () {
      this.visibleUser = true
      this.realName = ''
      this.getUserList()
    },
    // 去重方法
    _uniqueHandle (arr) {
      return Array.from(new Set(arr))
    },
    // 实现多选
    handleSelectionChange (val) {
      val.forEach((item) => {
        this.managerIdList.push(item.id)
        this.managerNameList.push(item.realName)
      })
      this.managerIdList = this._uniqueHandle(this.managerIdList)
      this.managerNameList = this._uniqueHandle(this.managerNameList)
    },
    // 根据传入的值做对应请求
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
    // 重置操作
    doResetGetUserList () {
      this.realName = ''
      this.getUserList()
    },
    // 获取数据
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
    // 取消操作
    cancelHandle () {
      this.visibleUser = false
      this.userList = []
      this.managerNameList = []
      this.managerIdList = []
    },
    // 提交操作，并且通过emit向父组件传值
    commitHandle () {
      const node = this.selectRowData
      if (!node && !(node.id)) {
        this.$message.warning(this.placeholder)
        return
      }
      this.$emit('input', this.managerIdList.join())
      this.$emit('update:userName', this.managerNameList.join())
      this.showUserName = this.managerNameList.join()
      this.visibleUser = false
      this.managerNameList = []
      this.managerIdList = []
      this.userList = []
    }
  }
}
</script>
