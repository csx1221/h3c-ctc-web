<template>
  <el-dialog title="添加参测对象成员" :visible.sync="innerVisible" :close-on-click-modal="false" width="60%" class="add-member-project">
    <el-row class="add-member-filter">
      <el-col :span="24">
        <el-form label-position="right" :inline="true">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="searchName" label="用户账号">
                <el-input v-model="searchName" placeholder="请输入用户账号、姓名" style="width:580px;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-table ref="leftTableObject" @select="handleSelectChange" @select-all="handleSelectAllChange" :data="leftTableData.filter(data => !searchName || (data.username.toLowerCase().includes(searchName.toLowerCase()) || data.realName.toLowerCase().includes(searchName.toLowerCase())))" border height="440px">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="用户账号" prop="username" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.username || scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" prop="realName" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属机构" prop="organizeName" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属部门" prop="deptName" show-overflow-tooltip></el-table-column>
    </el-table>
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
  name: 'AddTestObjectMember',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchName: '',
      projectId: '',
      participantId: '',
      organizeId: '',
      organizeType: 1,
      leftTableData: [],
      projectMemberDetailMap: {}
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
        this.leftTableData = []
        this.projectMemberDetailMap = {}
        this.getMemberTableDataById()
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
    // 获取左边未选用户数据
    getLeftUserInfo () {
      let thisvm = this
      let params = {}
      params.organizeId = thisvm.organizeId
      let url = '/sys/project/select/participantMemberUser'
      if (this.organizeType === 6) {
        url = '/sys/platformUser/listInfo'
        params.platformId = thisvm.organizeId
      }
      thisvm.$http.get(url, { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        } else {
          thisvm.leftTableData = res.data
          thisvm.$nextTick(() => {
            res.data.forEach((item, index) => {
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
      let thisvm = this
      let params = { 'projectId': thisvm.projectId, 'organizeId': thisvm.organizeId }
      let url = '/ctc/project/participantMember/servicebus/getparticipantmemberuser'
      thisvm.$http.get(url, { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error('查询成员数据失败：' + res.msg)
        } else {
          res.data.list.forEach((item, index) => {
            thisvm.projectMemberDetailMap[item.participantUserId] = item
          })
          thisvm.getLeftUserInfo()
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
          item.participantUserId = item.participantUserId || item.id
          item.participantUserName = item.participantUserName || item.realName
          item.contactPerson = 0
          item.projectId = thisvm.projectId
          item.organizeId = thisvm.organizeId
          item.participantId = thisvm.participantId
          data.push(item)
        }
      }
      let pdata = { 'projectId': this.projectId, 'participantId': this.participantId, 'projectParticipantMembers': data }
      let params = { 'type': 'execute', 'postType': 'post', 'url': 'ctc/project/participantMember/saveAny', 'reload': true }
      thisvm.$emit('watchChildMethod', { ...params, 'data': pdata })
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
