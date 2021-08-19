<template>
  <el-dialog title="添加子项目成员" :visible.sync="innerVisible" :close-on-click-modal="false" width="60%" class="add-member-project">
    <el-row class="add-member-filter">
      <el-col :span="24">
        <el-form label-position="right" :inline="true" ref="dataForm" :model="dataForm">
          <el-row>
            <el-col :span="16">
              <el-form-item prop="searchName" label="用户账号">
                <el-input v-model="dataForm.searchName" placeholder="请输入用户账号、姓名" style="width:580px;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align:right;">
              <el-button size="small" type="primary" @click="getLeftUserInfo">查询</el-button>
              <!--<el-button size="small" type="info" @click="doCheckAllCancel">取消全选</el-button>-->
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-table ref="leftTableObject" :data="leftTableData" border height="450px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户账号" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户姓名" prop="realName" show-overflow-tooltip></el-table-column>
        <el-table-column label="项目角色" prop="projectRoleName" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @current-change="getLeftUserInfo" style="text-align:left;">
      </el-pagination>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'AddChildProjectMember',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        searchName: '',
        page: 1,
        limit: 999999
      },
      // 回显表单数据
      echoDataForm: {
        organizeId: '',
        deptId: ''
      },
      parentId: '',
      projectId: '',
      leftTableData: [],
      childProjectMemberList: [],
      projectMemberDetailMap: {},
      total: 0
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
        // 添加已保存子项目成员
        this.projectMemberDetailMap = {}
        this.childProjectMemberList.forEach((item, index) => {
          this.projectMemberDetailMap[item.userId] = item
        })
        this.getLeftUserInfo()
      })
    },
    doCheckAllCancel () {
      this.leftTableData.forEach((item, index) => {
        this.$refs['leftTableObject'].toggleRowSelection(item, false)
      })
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      let params = this.dataForm
      params.projectId = this.parentId
      this.$http.get('/ctc/project/projectMember/listSubProjectSelectableMembers', {
        params: params
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          // 进行用户名、姓名过滤
          let searchName = (params.searchName || '').toLowerCase()
          let data = res.data.filter(function (item) {
            let bool = false
            if (searchName !== '') {
              bool = item.userName.toLowerCase().includes(searchName) || item.realName.toLowerCase().includes(searchName)
            } else {
              bool = true
            }
            return bool
          })
          this.total = data.length
          this.leftTableData = data
          this.$nextTick(() => {
            data.forEach((item, index) => {
              if (this.projectMemberDetailMap.hasOwnProperty(item.userId)) {
                this.$toggleRowSelectionTable('leftTableObject', item)
              }
            })
          })
        }
      }).catch(() => { })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let thisvm = this
      let data = []
      let leftTableData = thisvm.$refs.leftTableObject.selection
      // 过滤已添加的用户
      leftTableData.forEach((item, index) => {
        item.memberId = ''
        item.projectId = thisvm.projectId
        data.push(item)
      })
      let params = { 'type': 'executeSaveMember', 'reload': true }
      thisvm.$emit('watchChildMethod', { ...params, 'data': data })
      thisvm.handleDialogClose()
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
