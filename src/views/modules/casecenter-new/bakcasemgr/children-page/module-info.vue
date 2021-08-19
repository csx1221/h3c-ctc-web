<template>
  <el-dialog title="操作提示" :visible.sync="innerVisible" :close-on-click-modal="false" width="30%" class="module-info">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="moduleName" label="模块名称：">
                <el-input v-model="dataForm.moduleName" placeholder="请输入模块名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
  name: 'ModuleInfo',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        moduleId: '',
        moduleName: ''
      },
      moduleParams: {
      }
    }
  },
  watch: {
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
        moduleName: [
          { required: true, message: '模块名称不允许为空', trigger: 'blur' },
          { required: true, message: '模块名称不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.dataForm = { ...this.dataForm, ...this.moduleParams }
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let data = {}
          data.parentId = this.moduleParams.parentId
          data.parentModule = this.moduleParams.parentModule
          data.moduleId = this.moduleParams.moduleId
          data.moduleName = this.dataForm.moduleName
          data.moduleType = 2
          // 共享模块新增
          let url = 'ctc/case/alternative/saveSharedModule'
          if (data.parentId === '-2') {
            url = 'ctc/case/alternative/saveMyModule'
          }
          // 特殊处理修改用项目用例修改接口
          if (this.dataForm.moduleId) {
            url = '/ctc/case/caseTree'
          }
          // 新增：post;修改：put
          this.$http[!this.dataForm.moduleId ? 'post' : 'put'](url, data).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            } else {
              this.$message({
                'message': '操作成功',
                'type': 'success',
                'duration': 500,
                onClose: () => {
                  this.handleDialogClose()
                  this.$emit('watchChildPage', { 'type': 'saveModule', 'data': this.moduleParams })
                }
              })
            }
          }).catch(() => { })
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss" scoped>
.module-info {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
</style>
