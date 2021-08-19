<template>
  <el-dialog title="指定接口人" :visible.sync="innerVisible" :close-on-click-modal="false" width="55%" class="set-role">
    <el-row>
      <el-col :span="24">
        <el-checkbox-group v-model="userIdsCheckList">
          <el-checkbox v-for="(item,index) in userData" :key="index" :label="item.id" border style="margin-bottom:10px;width:200px;">{{item.realName}}</el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <div class="grid-content bg-purple-dark"></div>
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'ThisUser',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      projectId: '',
      organizeId: '',
      participantId: '',
      participantInterfaceUsers: [],
      userIdsCheckList: [],
      userDataMap: {},
      organizeType: '',
      userData: []
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
        this.userIdsCheckList = []
        this.participantInterfaceUsers.forEach((item, index) => {
          this.userIdsCheckList.push(item.interfaceUserId)
        })
        this.getUserInfo()
      })
    },
    getUserInfo () {
      let params = {}
      params.organizeId = this.organizeId
      let url = '/sys/project/select/userByOrganize'
      if (this.organizeType === 6) {
        url = '/sys/platformUser/listInfo'
        params.platformId = this.organizeId
        params.userType = 2
      }
      this.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.userData = res.data
          this.userData.forEach((item, index) => {
            this.userDataMap[item.id] = item
          })
        }
      }).catch(() => { })
    },
    handleCheckAllChange (val) {
      let agencyFuncIds = []
      if (val) {
        this.agencyProject.forEach((item, index) => {
          agencyFuncIds.push(item.id)
        })
      }
      this.dataForm.agencyFuncIds = agencyFuncIds
      this.isIndeterminate = false
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let thisvm = this
      let participantInterfaceUsers = []
      thisvm.userIdsCheckList.forEach((item, index) => {
        let user = thisvm.userDataMap[item]
        if (user) {
          participantInterfaceUsers.push({ 'participantId': thisvm.participantId, 'interfaceUserId': item, 'interfaceUserName': user.realName })
        }
      })
      let data = { 'participantId': thisvm.participantId, 'participantInterfaceUsers': participantInterfaceUsers }
      let params = { 'type': 'execute', 'postType': 'put', 'url': '/ctc/project/projectParticipant', 'reload': true }
      thisvm.$emit('watchChildMethod', { ...params, 'data': data })
      thisvm.handleDialogClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.set-role {
  .el-select {
    width: 100%;
  }
  .selected {
    margin-top: 10px;
    text-align: right;
  }
  .el-radio {
    margin: 10px;
  }
}
</style>
