<template>
  <el-dialog title="用例还原" :visible.sync="innerVisible" :close-on-click-modal="false" width="50%" class="ref-case">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="moduleId" label="项目模块：">
                <ctc-project-module-tree v-model="dataForm.moduleId" placeholder="请选择项目模块" :parent-name.sync="dataForm.parentName" @watchChildTree="triggerParentTree"></ctc-project-module-tree>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <div class="grid-content bg-purple-dark"></div>
        <el-button @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import CtcProjectModuleTree from '@/components/project/ctc-project-module-tree'
export default {
  name: 'CaseModule',
  components: {
    CtcProjectModuleTree
  },
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
        parentName: ''
      },
      total: 0,
      // 选中目录树节点信息
      selectNodeInfo: {
      },
      caseIds: []
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
        moduleId: [
          { required: true, message: '项目模块不允许为空', trigger: 'blur' },
          { required: true, message: '项目模块不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.dataForm.moduleId = ''
        this.dataForm.parentName = ''
        this.$refs.dataForm.resetFields()
      })
    },
    triggerParentTree (message) {
      this.selectNodeInfo = message.data
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let params = {}
          params.ids = this.caseIds
          params.parentProjectId = this.selectNodeInfo.parentProjectId
          params.projectId = this.selectNodeInfo.projectId
          params.moduleId = this.selectNodeInfo.moduleId
          this.$http.put('/ctc/case/caseInfo/restore', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.handleDialogClose()
              }
            })
            // 刷新表格
            this.$emit('watchChildPage', { 'type': 'reloadTable', 'data': {} })
          }).catch(() => { })
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss" scoped>
.ref-case {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
