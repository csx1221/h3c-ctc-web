<template>
  <el-row class="set-interface-user">
    <el-col :span="24">
      <el-row>
        <el-col :span="24" style="margin-top:5px;margin-bottom:5px;text-align:right;">
          <el-button size="small" @click="handleTabsClose">取消</el-button>
          <el-button size="small" type="primary" @click="doSaveInterfaceUser">设置{{leftSearchName}}</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-row style="margin-bottom:10px;">
          <el-col :span="12">
            <el-select v-model="organizeItem" placeholder="请选择机构" @change="chooseOrganize" value-key="organizeId">
              <el-option v-for="data in organizeData" :key="data.organizeId" :label="data.organizeName" :value="data"></el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-input v-model="leftSearchName" placeholder="输入姓名自动匹配搜索" clearable />
          </el-col>
        </el-row>
        <el-table ref="leftTableObject" :data="leftTableData.filter(data => !leftSearchName || (data.realName.toLowerCase().includes(leftSearchName.toLowerCase()) || (data.username || data.userName).toLowerCase().includes(leftSearchName.toLowerCase())))" style="width: 100%;height:700px;overflow-y:auto;">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="用户账号" prop="username">
            <template slot-scope="scope">
              {{ scope.row.username || scope.row.userName }}
            </template>
          </el-table-column>
          <el-table-column label="用户姓名" prop="realName"></el-table-column>
          <el-table-column prop="organizeName" label="所属机构/部门" header-align="left" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.deptName"> {{scope.row.organizeName}} / {{scope.row.deptName}}</span>
              <span v-else> {{scope.row.organizeName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { removeCurrentTabsHandle } from '@/router'
export default {
  name: 'SetInterFaceUser',
  data () {
    return {
      projectId: '',
      leftSearchName: '',
      leftTableData: [],
      organizeItem: '',
      organizeData: []
    }
  },
  computed: {},
  mounted () {
    this.projectId = this.$route.params.projectId || ''
    this.listCanBeSetOrganizes()
  },
  methods: {
    listCanBeSetOrganizes () {
      this.$ctcLoading.open()
      let params = { 'projectId': this.projectId }
      this.$http.get('ctc/project/projectParticipant/listCanBeSetOrganizes', { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.organizeData = res.data
          // 默认选中一个
          if (this.organizeData.length > 0) {
            this.organizeItem = this.organizeData[0]
            this.chooseOrganize()
          }
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    chooseOrganize (item) {
      this.getLeftUserInfo()
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      // 获取机构类型
      let organizeType = this.organizeItem.organizeType
      let url = 'sys/project/select/userByOrganize'
      let params = {
        username: this.leftSearchName,
        organizeId: this.organizeItem.organizeId
      }
      if (organizeType === 6) {
        url = '/sys/platformUser/listInfo'
        params.platformId = this.organizeItem.organizeId
        params.userType = '2'
      }
      this.$http.get(url, { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.leftTableData = res.data
          this.getSetMemberById()
        }
      }).catch(() => { })
    },
    getSetMemberById () {
      let params = { 'projectId': this.projectId, organizeId: this.organizeItem.organizeId }
      this.$http.get('ctc/project/projectParticipant/getParticipantInterfaceUserId', { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let interfaceUserData = res.data || []
          this.leftTableData.forEach((item, index) => {
            if (interfaceUserData.includes(item.id)) {
              this.$toggleRowSelectionTable('leftTableObject', item)
            }
          })
        }
      }).catch(() => { })
    },
    handleTabsClose () {
      // 保存成功关闭当前tab
      removeCurrentTabsHandle(this)
    },
    doSaveInterfaceUser () {
      let thisvm = this
      let selection = thisvm.$refs.leftTableObject.selection
      if (selection.length > 0) {
        let participantInterfaceUsers = []
        selection.forEach((item, index) => {
          // scope.row.username || scope.row.userName
          let interfaceUserId = item.id || item.userId
          let interfaceUserName = item.username || item.userName
          participantInterfaceUsers.push({ 'participantId': thisvm.organizeItem.participantId, 'interfaceUserId': interfaceUserId, 'interfaceUserName': interfaceUserName })
        })
        let data = {}
        data.participantInterfaceUsers = participantInterfaceUsers
        data.projectId = thisvm.projectId
        data.participantId = thisvm.organizeItem.participantId
        thisvm.$http.post('ctc/project/projectParticipant/setParticipantInterfaceUser', data).then(({ data: res }) => {
          if (res.code !== 0) {
            let msg = res.msg || '操作失败'
            thisvm.$message.error(msg)
          } else {
            thisvm.$message.success('操作成功，可继续设置参测接口人！')
            // 保存成功关闭当前tab
            thisvm.listCanBeSetOrganizes()
          }
        }).catch(() => { })
      } else {
        thisvm.$message.warning('请选择项目接口人')
      }
    }
  }
}
</script>
<style  lang="scss" scoped>
.set-test-object-member {
}
</style>
