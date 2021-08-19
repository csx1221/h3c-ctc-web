<template>
  <el-dialog title="设置目录权限" :visible.sync="innerVisible" :close-on-click-modal="false" width="25%" class="set-dir-auth">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="150px">
          <el-col :span="24" v-if="authType=='ifWrite'">
            <el-form-item prop="ifWrite" label="目录上传权限：">
              <el-radio-group v-model="dataForm.ifWrite">
                <el-radio :label="0">不可上传</el-radio>
                <el-radio :label="1">可以上传</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="authType=='ifAdmin'">
            <el-form-item prop="ifAdmin" label="目录编辑权限：">
              <el-radio-group v-model="dataForm.ifAdmin">
                <el-radio :label="0">不可编辑</el-radio>
                <el-radio :label="1">可以编辑</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
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
  name: 'SetDirAuth',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      projectId: '',
      dataForm: {
        ifWrite: 0,
        ifAdmin: 0
      },
      authType: 'ifWrite',
      activeGroup: '',
      objectData: {}
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
      }
    }
  },
  watch: {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.dataForm.ifWrite = this.objectData.ifWrite
        this.dataForm.ifAdmin = this.objectData.ifAdmin
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      let thisvm = this
      thisvm.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let data = { ...thisvm.objectData }
          if (thisvm.authType === 'ifWrite') {
            data.ifWrite = thisvm.dataForm.ifWrite
            delete data['ifAdmin']
          } else if (thisvm.authType === 'ifAdmin') {
            data.ifAdmin = thisvm.dataForm.ifAdmin
            delete data['ifWrite']
          }
          delete data['ifRead']
          let url = ''
          if (thisvm.activeGroup === '1') {
            url = '/ctc/project/docDirManage/updateMemberAuth'
          } else {
            url = '/ctc/project/docDirManage/updateParticipantAuth'
          }
          let params = { 'type': 'execute', 'postType': 'post', 'url': url, 'reload': true }
          thisvm.$emit('watchChildMethod', { ...params, 'data': data })
          thisvm.handleDialogClose()
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss" scoped>
.set-dir-auth {
  .el-select {
    width: 100%;
  }
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
