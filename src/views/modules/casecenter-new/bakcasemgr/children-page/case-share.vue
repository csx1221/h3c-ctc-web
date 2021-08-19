<template>
  <el-dialog title="用例共享" :visible.sync="innerVisible" :close-on-click-modal="false" width="50%" class="case-share">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="moduleId" label="模块目录：">
                <ctc-bak-case-module-tree v-model="dataForm.moduleId" placeholder="请选择共享模块目录" :treeType.sync="dataForm.treeType" :parent-name.sync="dataForm.parentName" @watchChildTree="triggerParentTree"></ctc-bak-case-module-tree>
              </el-form-item>
            </el-col>
          </el-row>
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
import CtcBakCaseModuleTree from '@/components/project/ctc-bak-case-module-tree'
export default {
  name: 'CaseShare',
  components: {
    CtcBakCaseModuleTree
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
        treeType: -1, // 目录树类型(-1:共享用例树;2:我的用例树)
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
          params.caseIds = this.caseIds
          params.moduleId = this.selectNodeInfo.moduleId
          this.$http.post('ctc/case/alternative/sharedCase ', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                // 刷新表格
                this.$emit('watchChildTree', { 'type': 'reloadTable', 'data': {} })
                this.handleDialogClose()
              }
            })
          }).catch(() => { })
        }
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss" scoped>
.case-share {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
