<template>
  <el-dialog title="查看成员详情" :visible.sync="innerVisible" :close-on-click-modal="false" width="60%" class="add-member-project">
    <el-row class="add-member-filter">
      <el-col :span="24">
        <el-form label-position="right" :inline="true" ref="dataForm" :model="dataForm">
          <el-row>
            <el-col :span="16">
              <el-form-item prop="searchName" label="用户账号">
                <el-input v-model="searchName" placeholder="请输入用户账号、姓名" style="width:580px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align:right;">
              <el-button size="small" type="primary" @click="getLeftUserInfo">查询</el-button>
              <el-button size="small" @click="doResetLeftUserInfo">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-table ref="leftTableObject" :data="leftTableData.filter(data => !searchName || (data.userName.toLowerCase().includes(searchName.toLowerCase()) || data.realName.toLowerCase().includes(searchName.toLowerCase())))" border height="440px">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="用户账号" prop="userName" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户姓名" prop="realName" show-overflow-tooltip></el-table-column>
      <el-table-column label="项目角色" prop="projectRoleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属机构" prop="organizeName" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  name: 'SearchMemberInfo',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
      },
      searchName: '',
      userGroupId: '',
      leftTableData: []
    }
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.leftTableData = []
        Promise.all([
          this.doResetLeftUserInfo()
        ]).then((result) => {
        })
      })
    },
    doResetLeftUserInfo () {
      this.searchName = ''
      this.getLeftUserInfo()
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      let params = {}
      this.$http.get('/ctc/project/userGroup/getMembersByUserGroupId/' + this.userGroupId, {
        params: params
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.leftTableData = res.data
        }
      }).catch(() => { })
    },
    handleDialogClose () {
      this.innerVisible = false
    }
  }
}
</script>
<style lang="scss">
.add-member-project {
  .add-member-filter {
  }
  .selected {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
