<template>
  <el-dialog title="设置角色" :visible.sync="innerVisible" :close-on-click-modal="false" width="35%" class="set-role">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="120px">
          <el-form-item prop="projectRoleId" label="项目角色：">
            <el-select v-model="dataForm.projectRoleId" placeholder="选择项目角色">
              <el-option v-for="item in projectRoleData" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
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
  name: 'SetRole',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      projectId: '',
      memberId: '',
      isIndeterminate: true,
      checkAll: false,
      projectRoleData: [],
      agencyProject: [],
      dataForm: {
        projectRoleId: '',
        agencyFuncIds: []
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
    },
    dataRule () {
      return {
        projectRoleId: [
          { required: true, message: '项目角色不允许为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.dataForm.projectRoleId = ''
        this.dataForm.agencyFuncIds = []
        Promise.all([
          this.getSelectableRole()
        ]).then((result) => {
          this.getProjectMemberById()
        })
      })
    },
    getSelectableRole () {
      this.$http.get(`/ctc/project/projectMember/get/selectableRole`, { params: {} }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.projectRoleData = res.data
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
    getProjectMemberById () {
      this.$http.get(`/ctc/project/projectMember/${this.memberId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.dataForm.projectRoleId = res.data.projectRoleId
          this.dataForm.agencyFuncIds = res.data.agencyFuncIds || []
        }
      }).catch(() => { })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let data = { 'memberId': this.memberId, ...this.dataForm }
          let params = { 'type': 'execute', 'postType': 'put', 'url': '/ctc/project/projectMember', 'reload': true }
          this.$emit('watchChildMethod', { ...params, 'data': data })
          this.handleDialogClose()
        }
      }, 1000, { 'leading': true, 'trailing': false })
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
}
</style>
