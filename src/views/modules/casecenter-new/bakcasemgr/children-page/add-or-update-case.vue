<template>
  <el-dialog :title="dialogTitle" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false" width="70%" class="add-or-update-case">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" :inline="false" label-position="right" label-width="80px" :disabled="dataForm.readOnly == 1">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="moduleId" label="模块目录">
                <ctc-bak-case-module-tree v-model="dataForm.moduleId" placeholder="请选择模块目录" :treeType.sync="dataForm.treeType" :parent-name.sync="dataForm.parentName" @watchChildTree="triggerParentTree"></ctc-bak-case-module-tree>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item prop="caseName" label="用例名称">
                <el-input v-model="dataForm.caseName" placeholder="请输入用例名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="caseType" label="用例类型">
                <ctc-select v-model="dataForm.caseType" dict-type="caseType" placeholder="请选择用例类型"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="caseClass" label="用例类别">
                <ctc-select v-model="dataForm.caseClass" dict-type="caseClass" placeholder="请选择用例类别"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="shouldTest" label="是否必测">
                <ctc-select v-model="dataForm.shouldTest" dict-type="whether" placeholder="请选择是否必测"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="score" label="分值">
                <el-input-number v-model="dataForm.score" :precision="1" :step="0.1" :min="0" :max="2" label="请选择分值" :disabled="dataForm.shouldTest==0"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="testTarget" label="测试目的">
                <el-input v-model="dataForm.testTarget" placeholder="请输入测试目的" :rows="3" type="textarea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="initializeCondition" label="预期条件">
                <el-input v-model="dataForm.initializeCondition" placeholder="请输入预期条件" :rows="3" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="testStep" label="测试步骤">
                <el-input v-model="dataForm.testStep" placeholder="请输入测试步骤" :rows="3" type="textarea"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="expcetResult" label="预期结果">
                <el-input v-model="dataForm.expcetResult" placeholder="请输入预期结果" :rows="3" type="textarea"></el-input>
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
        <el-button type="primary" size="small" v-if="dataForm.readOnly==0" :disabled="confirmBtn" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import CtcBakCaseModuleTree from '@/components/project/ctc-bak-case-module-tree'
export default {
  name: 'AddOrUpdateCase',
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
        treeType: -2, // 目录树类型(-1:共享用例树;2:我的用例树)
        caseId: '',
        moduleId: '',
        // 用来回显项目模块
        parentName: '',
        caseName: '',
        caseType: '1',
        caseSource: 2, // 用例来源(1:用例设计;2:备选用例)
        caseClass: '',
        shouldTest: '1',
        score: '1.0',
        testTarget: '',
        testStep: '',
        initializeCondition: '',
        expcetResult: '',
        readOnly: '1' // 0:编辑模式;1:只读模式
      },
      // 选中目录树节点信息
      selectNodeInfo: {
      },
      relevanceData: [],
      dialogTitle: '新增用例',
      confirmBtn: false
    }
  },
  watch: {
    'dataForm.shouldTest' (newVal, oldVal) {
      // 设置用例新增时候，触发默认值
      if (!this.dataForm.caseId) {
        if (newVal === '0') {
          this.dataForm.score = '0.0'
        } else {
          this.dataForm.score = '1.0'
        }
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
        moduleId: [
          { required: true, message: '项目模块不允许为空', trigger: 'blur' },
          { required: true, message: '项目模块不允许为空', trigger: 'change' }
        ],
        caseName: [
          { required: true, message: '用例名称不允许为空', trigger: 'blur' },
          { required: true, message: '用例名称不允许为空', trigger: 'change' }
        ],
        caseType: [
          { required: true, message: '用例类型不允许为空', trigger: 'blur' },
          { required: true, message: '用例类型不允许为空', trigger: 'change' }
        ],
        caseClass: [
          { required: true, message: '用例类别不允许为空', trigger: 'blur' },
          { required: true, message: '用例类别不允许为空', trigger: 'change' }
        ],
        shouldTest: [
          { required: true, message: '是否必测不允许为空', trigger: 'blur' },
          { required: true, message: '是否必测不允许为空', trigger: 'change' }
        ],
        score: [
          { required: true, message: '分值不允许为空', trigger: 'blur' },
          { required: true, message: '分值不允许为空', trigger: 'change' }
        ],
        testStep: [
          { required: true, message: '测试步骤不允许为空', trigger: 'blur' },
          { required: true, message: '测试步骤不允许为空', trigger: 'change' }
        ],
        initializeCondition: [
          { required: true, message: '预期条件不允许为空', trigger: 'blur' },
          { required: true, message: '预期条件不允许为空', trigger: 'change' }
        ],
        expcetResult: [
          { required: true, message: '预期结果不允许为空', trigger: 'blur' },
          { required: true, message: '预期结果不允许为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.relevanceData = []
        this.confirmBtn = false
        this.dataForm.parentName = ''
        this.dataForm.moduleId = ''
        this.$refs.dataForm.resetFields()
        this.dialogTitle = '新增用例'
        // 用例修改反显
        if (this.dataForm.caseId !== '') {
          this.getCaseDataById()
          this.dialogTitle = (this.dataForm.readOnly === 1) ? '查看用例' : '修改用例'
        }
      })
    },
    triggerParentTree (message) {
      this.selectNodeInfo = message.data
    },
    getCaseDataById () {
      this.$http.get('/ctc/case/alternative/' + this.dataForm.caseId).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = { ...this.dataForm, ...res.data }
        // 设置项目模块回显
        let idsArr = res.data.idsArr
        let namesArr = res.data.namesArr
        if (res.data.ifShared === 1) {
          idsArr[idsArr.length - 1] = '-1'
          namesArr[namesArr.length] = '共享用例树'
        } else {
          idsArr[idsArr.length - 1] = '-2'
          namesArr[namesArr.length] = '我的用例树'
        }
        this.dataForm.parentName = namesArr.reverse().join('/')
        this.dataForm.moduleId = idsArr[0]
      }).catch(() => { })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.confirmBtn = true
          // 新增：post;修改：put
          let params = { ...this.dataForm, ...this.selectNodeInfo }
          // 处理模块参数
          let idsArr = params.idsArr
          let tidsArr = Object.assign([], idsArr).reverse()
          tidsArr.forEach((item, index) => {
            if (index === 1) {
              // 模块一
              params.moduleOne = item
            } else if (index === 2) {
              // 模块二
              params.moduleTwo = item
            } else if (index === 3) {
              // 模块三
              params.moduleThree = item
            }
          })
          this.$http[!this.dataForm.caseId ? 'post' : 'put']('/ctc/case/alternative', params).then(({ data: res }) => {
            this.confirmBtn = false
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.handleDialogClose()
                // 刷新表格
                this.$emit('watchChildPage', { 'type': 'reloadTable', 'data': {} })
              }
            })
          }).catch(() => { })
        }
      }, 3000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss">
.add-or-update-case {
  .el-input-group--append {
    width: 100% !important;
  }
  .el-select,
  .el-input,
  .el-input-number,
  .el-date-editor {
    width: 100% !important;
  }
}
</style>
<style lang="scss" scoped>
.add-or-update-case {
  .el-dialog__body {
    padding: 15px 10px;
  }
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
