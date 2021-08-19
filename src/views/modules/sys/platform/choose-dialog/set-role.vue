<template>
  <el-dialog title="设置角色" :visible.sync="innerVisible" :close-on-click-modal="false" width="35%" class="set-role">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="120px">
          <el-form-item prop="userType" label="平台角色：">
            <el-select v-model="dataForm.userType" placeholder="选择平台角色">
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
      platformMemberIds: [],
      projectRoleData: [],
      dataForm: {
        userType: ''
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
        userType: [
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
        this.getSelectableRole()
      })
    },
    getSelectableRole () {
      this.projectRoleData = [{ 'value': '1', 'label': '测试人员' }, { 'value': '2', 'label': '接口人员' }]
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let data = { 'idList': this.platformMemberIds, 'userType': this.dataForm.userType }
          let params = { 'type': 'execute', 'postType': 'post', 'url': '/sys/platformUser/setType', 'reload': true }
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
