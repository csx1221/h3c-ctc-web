<template>
  <el-row class="set-test-object-member">
    <el-col :span="24">
      <el-row>
        <el-col :span="24" style="margin-top:5px;margin-bottom:5px;text-align:right;">
          <el-button size="small" @click="handleTabsClose">取消</el-button>
          <el-button size="small" type="primary" @click="doSaveTestObjectMember">保存</el-button>
        </el-col>
      </el-row>
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
      <el-row>
        <el-col :span="24">
          <el-table ref="leftTableObject" @select="handleSelectChange" @select-all="handleSelectAllChange" :data="leftTableData.filter(data => !leftSearchName || data.realName.toLowerCase().includes(leftSearchName.toLowerCase()))" style="width:100%;height:680px;overflow-y:auto;">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="用户账号" prop="username">
              <template slot-scope="scope">
                {{ scope.row.username || scope.row.userName }}
              </template>
            </el-table-column>
            <el-table-column label="用户姓名" prop="realName"></el-table-column>
            <el-table-column label="机构名称" prop="organizeName"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import { removeCurrentTabsHandle } from '@/router'
export default {
  name: 'SetTestObjectMember',
  data () {
    return {
      parentId: '',
      projectId: '',
      leftSearchName: '', // 左表格过滤条件
      leftTableData: [],
      projectMemberDetailMap: {},
      organizeItem: '',
      organizeData: []
    }
  },
  computed: {},
  mounted () {
    this.parentId = this.$route.params.parentId || ''
    this.projectId = this.$route.params.projectId || ''
    this.listCanBeSetOrganizes()
  },
  methods: {
    listCanBeSetOrganizes () {
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
      }).catch(() => { })
    },
    chooseOrganize (item) {
      this.getTestObjectMemberById()
    },
    getTestObjectMemberById () {
      let params = {}
      params.projectId = this.projectId
      params.participantId = this.organizeItem.participantId
      this.$http.get('/ctc/project/participantMember/servicebus/getParticipantMember', { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          res.data.forEach((item, index) => {
            this.projectMemberDetailMap[item.participantUserId] = item
          })
          this.getLeftUserInfo()
        }
      }).catch(() => { })
    },
    // 获取左边未选用户数据
    getLeftUserInfo () {
      let url = 'sys/project/select/participantMemberUser'
      let params = { realName: this.leftSearchName, page: 1, limit: 99999 }
      // 获取机构类型
      let organizeType = this.organizeItem.organizeType
      if (organizeType === 6) {
        url = '/sys/platformUser/listInfo'
        params.platformId = this.organizeItem.organizeId
      }
      // 父项目编码不为空，是子项目
      if (this.parentId !== '') {
        url = 'ctc/project/participantMember/listParentProjectParticipantMember'
        params.projectId = this.parentId
        params.organizeId = this.organizeItem.organizeId
      }
      this.$http.get(url, { params: params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.leftTableData = res.data
          this.$nextTick(() => {
            res.data.forEach((item, index) => {
              if (this.projectMemberDetailMap.hasOwnProperty(item.id)) {
                this.$toggleRowSelectionTable('leftTableObject', item)
              }
            })
          })
        }
      }).catch(() => { })
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
    handleTabsClose () {
      // 保存成功关闭当前tab
      removeCurrentTabsHandle(this)
    },
    doSaveTestObjectMember () {
      let thisvm = this
      let data = []
      let projectMemberDetailMap = thisvm.projectMemberDetailMap
      for (let key in projectMemberDetailMap) {
        if ({}.hasOwnProperty.call(projectMemberDetailMap, key)) {
          let item = projectMemberDetailMap[key]
          let titem = {}
          titem.projectId = this.projectId
          titem.participantUserId = item.id || item.participantUserId
          titem.participantUserName = item.realName || item.username
          titem.participantMemberId = ''
          titem.contactPerson = 0
          data.push(titem)
        }
      }
      if (data.length > 0) {
        let tdata = { 'projectId': this.projectId, 'participantId': this.organizeItem.participantId, 'projectParticipantMembers': data }
        this.$http.post('/ctc/project/participantMember', tdata).then(({ data: res }) => {
          if (res.code !== 0) {
            let msg = res.msg || '操作失败'
            this.$message.error(msg)
          } else {
            this.$message.success('操作成功')
            // 保存成功关闭当前tab
            removeCurrentTabsHandle(this)
          }
        }).catch(() => { })
      }
    }
  }
}
</script>
<style  lang="scss" scoped>
.set-test-object-member {
}
</style>
