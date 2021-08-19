<template>
  <el-dialog title="添加子项目阶段成员" :visible.sync="innerVisible" :close-on-click-modal="false" width="60%" class="add-organize">
    <el-row>
      <el-row>
        <el-col :span="24">
          <el-form label-position="right" :inline="true">
            <el-row>
              <el-col :span="20">
                <el-form-item prop="searchName" label="用户账号">
                  <el-input v-model="searchName" placeholder="请输入用户账号、姓名" clearable style="width:480px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" align="right">
                <el-button type="primary" size="small" @click="getLeftUserInfo()">查询</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <el-table ref="dataList" @select="handleSelectChange" @select-all="handleSelectAllChange" :data="dataList" border style="width: 100%;" height="500">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column label="用户账号" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户姓名" prop="realName" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属角色" prop="projectRoleName" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属机构" prop="organizeName" show-overflow-tooltip></el-table-column>
        <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'AddStageMember',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      parentId: '',
      projectId: '',
      projectStageId: '',
      stageId: '',
      dataList: [],
      searchName: '',
      projectMemberDetailMap: {},
      dataForm: {
        projectId: '',
        projectStageId: '',
        stageId: ''
      }
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
      this.$nextTick(() => {
        this.innerVisible = true
        this.dataForm.parentProjectId = this.parentProjectId
        this.dataForm.projectId = this.projectId
        this.dataForm.projectStageId = this.projectStageId
        this.dataForm.stageId = this.stageId
        this.projectMemberDetailMap = {}
        Promise.all([
          this.getLeftUserInfo()
        ]).then((result) => {
        })
      })
    },
    handleSelectAllChange (selection) {
      let checkAll = selection.length > 0
      let data = this.dataList
      data.forEach((item, index) => {
        if (checkAll) {
          if (!this.projectMemberDetailMap.hasOwnProperty(item.userId)) {
            this.projectMemberDetailMap[item.userId] = item
          }
        } else {
          delete this.projectMemberDetailMap[item.userId]
        }
      })
    },
    handleSelectChange (selection, item) {
      // 判断当前是否选中
      if (this.projectMemberDetailMap.hasOwnProperty(item.userId)) {
        delete this.projectMemberDetailMap[item.userId]
      } else {
        this.projectMemberDetailMap[item.userId] = item
      }
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      let thisvm = this
      // 只查询测试组成员
      let params = { 'projectId': this.dataForm.projectId, 'projectStageId': this.dataForm.projectStageId, 'stageId': this.dataForm.stageId }
      thisvm.$http.get('/ctc/project/projectStage/listStageMember', { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error('查询阶段所在项目成员组数据失败')
        } else {
          // 进行用户名、姓名过滤
          let searchName = (this.searchName || '').toLowerCase()
          let data = res.data.filter(function (item) {
            let bool = false
            if (searchName !== '') {
              bool = item.userName.toLowerCase().includes(searchName) || item.realName.toLowerCase().includes(searchName)
            } else {
              bool = true
            }
            return bool
          })
          thisvm.dataList = data
          thisvm.$nextTick(() => {
            data.forEach((item, index) => {
              if (item.selected === 1) {
                thisvm.$toggleRowSelectionTable('dataList', item)
                thisvm.projectMemberDetailMap[item.userId] = item
              }
            })
          })
        }
      }).catch(() => { })
    },
    handleConfirm () {
      let thisvm = this
      let data = []
      let projectMemberDetailMap = thisvm.projectMemberDetailMap
      for (let key in projectMemberDetailMap) {
        if ({}.hasOwnProperty.call(projectMemberDetailMap, key)) {
          let item = projectMemberDetailMap[key]
          item.projectId = thisvm.projectId
          data.push(item)
        }
      }
      if (data.length > 0) {
        let params = { 'type': 'execute', 'postType': 'post', 'url': '/ctc/project/projectStage/setStageMember', 'reload': true }
        this.$emit('watchChildMethod', { ...params, 'data': data })
        this.handleDialogClose()
      } else {
        thisvm.$message.warning('没有选中任何阶段成员')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-organize {
  .selected {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
