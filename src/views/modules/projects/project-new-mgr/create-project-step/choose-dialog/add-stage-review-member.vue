<template>
  <el-dialog title="添加成员" :visible.sync="innerVisible" :close-on-click-modal="false" width="60%" class="add-member-project">
    <el-row class="add-member-filter">
      <el-col :span="24">
        <el-form label-position="right" :inline="true" ref="dataForm" :model="dataForm">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="userName" label="用户账号">
                <el-input v-model="dataForm.userName" placeholder="请输入用户账号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="realName" label="用户姓名">
                <el-input v-model="dataForm.realName" placeholder="请输入姓名"></el-input>
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
    <el-table ref="leftTableObject" :data="leftTableData" @select="handleSelectChange" @select-all="handleSelectAllChange" border height="440px">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="用户账号" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户姓名" prop="realName" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属角色" prop="userRoleNames" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属机构" prop="organizeName" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @current-change="getLeftUserInfo" style="text-align:left;">
    </el-pagination>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'AddMember',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        userName: '',
        realName: '',
        page: 1,
        limit: 8
      },
      projectId: '',
      leftTableData: [],
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
        this.projectMemberDetailMap = {}
        Promise.all([
          this.getMemberTableDataById(),
          this.doResetLeftUserInfo()
        ]).then((result) => {
        })
      })
    },
    handleSelectAllChange (selection) {
      let checkAll = selection.length > 0
      let data = this.leftTableData
      data.forEach((item, index) => {
        if (checkAll) {
          if (!this.projectMemberDetailMap.hasOwnProperty(item.id)) {
            this.projectMemberDetailMap[item.id] = item
          }
        } else {
          delete this.projectMemberDetailMap[item.id]
        }
      })
    },
    handleSelectChange (selection, item) {
      // 判断当前是否选中
      if (this.projectMemberDetailMap.hasOwnProperty(item.id)) {
        delete this.projectMemberDetailMap[item.id]
      } else {
        this.projectMemberDetailMap[item.id] = item
      }
    },
    doResetLeftUserInfo () {
      this.$refs.dataForm.resetFields()
      this.getLeftUserInfo()
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      let thisvm = this
      let params = thisvm.dataForm
      thisvm.$http.get('sys/project/select/userGroupMember', {
        params: params
      }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          thisvm.total = res.data.total
          thisvm.leftTableData = res.data.list
          thisvm.$nextTick(() => {
            res.data.list.forEach((item, index) => {
              if (thisvm.projectMemberDetailMap.hasOwnProperty(item.id)) {
                thisvm.$toggleRowSelectionTable('leftTableObject', item)
              }
            })
          })
        }
      }).catch(() => { })
    },
    // 根据项目id，获取已保存的项目成员
    getMemberTableDataById () {
      let params = {}
      params.projectId = this.projectId
      params.projectStageId = this.projectStageId
      params.stageId = this.stageId
      let url = '/ctc/project/projectStage/listStageMember'
      this.$http.get(url, { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error('查询成员数据失败：' + res.msg)
        } else {
          this.$nextTick(() => {
            res.data.forEach(item => {
              if (item.selected === 1) {
                this.projectMemberDetailMap[item.userId] = item
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
      let projectMemberDetailMap = thisvm.projectMemberDetailMap
      for (let key in projectMemberDetailMap) {
        if ({}.hasOwnProperty.call(projectMemberDetailMap, key)) {
          let item = projectMemberDetailMap[key]
          let titem = {}
          titem.userId = item.id || item.userId
          titem.userName = item.username || item.userName
          titem.realName = item.realName
          titem.projectId = thisvm.projectId
          titem.projectStageId = thisvm.projectStageId
          titem.stageId = thisvm.stageId
          data.push(titem)
        }
      }
      if (data.length > 0) {
        let params = { 'type': 'execute', 'postType': 'post', 'url': '/ctc/project/projectStage/setStageMember', 'reload': true }
        thisvm.$emit('watchChildMethod', { ...params, 'data': data })
        thisvm.getLeftUserInfo()
      } else {
        thisvm.$message.warning('没有选中任何阶段成员')
      }
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
