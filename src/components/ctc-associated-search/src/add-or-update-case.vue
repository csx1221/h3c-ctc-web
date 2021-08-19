<template>
  <el-dialog :title="getTitle()" :visible.sync="innerVisible" :close-on-click-modal="false" width="65%" class="add-or-update-case" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
      <el-row style="margin-bottom:15px;">
        <el-col :span="20" style="padding-top:8px;padding-left:30px;">
          <ctc-page-path ref="ctcPagePath"></ctc-page-path>
        </el-col>
        <el-col :span="4" v-if="dataForm.readOnly==0" style="text-align:right;">
          <el-button type="primary" size="small" @click="handleConfirm" style="margin-left:15px;">确 定</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="moduleOneName" label="模块一：">
            <el-input v-model="dataForm.moduleOneName" placeholder="请输入模块一" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="moduleTwoName" label="模块二：">
            <el-input v-model="dataForm.moduleTwoName" placeholder="请输入模块二" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="moduleThreeName" label="模块三：">
            <el-input v-model="dataForm.moduleThreeName" placeholder="请输入模块三" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="caseName" label="用例名称：">
            <el-input v-model="dataForm.caseName" placeholder="请输入用例名称" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="execType" label="执行类型：">
            <el-input v-model="dataForm.execType" placeholder="请输入执行类型" style="display:none;"></el-input>
            <el-input v-model="dataForm.execTypeName" placeholder="请输入执行类型" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="autoPlatformId" label="关联平台：">
            <el-input v-model="dataForm.autoPlatformId" placeholder="请输入关联平台" style="display:none;"></el-input>
            <el-input v-model="dataForm.autoPlatformName" placeholder="请输入关联平台" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="caseClass" label="用例类别：">
            <ctc-select v-model="dataForm.caseClass" dict-type="caseClass" placeholder="请选择用例类别"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="caseType" label="用例类型：">
            <ctc-select v-model="dataForm.caseType" dict-type="caseType" placeholder="请选择用例类型"></ctc-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="shouldTest" label="是否必测：">
            <ctc-select v-model="dataForm.shouldTest" dict-type="whether" placeholder="请选择是否必测"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="score" label="分值：">
            <el-input-number v-model="dataForm.score" :precision="1" :step="0.1" :min="0.1" :max="2" label="请选择分值" :disabled="dataForm.shouldTest==0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="caseProperty.includes('2')">
          <el-form-item prop="priority" label="优先级：">
            <ctc-select v-model="dataForm.priority" dict-type="priority" placeholder="请选择优先级"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="caseProperty.includes('1')">
          <el-form-item prop="caseCode" label="用例编号：">
            <el-input v-model="dataForm.caseCode" placeholder="请输入用例编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="testTarget" label="测试目的：">
            <el-input v-model="dataForm.testTarget" placeholder="请输入测试目的" :rows="3" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="initializeCondition" label="预期条件：">
            <el-input v-model="dataForm.initializeCondition" placeholder="请输入预期条件" :rows="3" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="testStep" label="测试步骤：">
            <el-input v-model="dataForm.testStep" placeholder="请输入测试步骤" :rows="3" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="expcetResult" label="预期结果：">
            <el-input v-model="dataForm.expcetResult" placeholder="请输入预期结果" :rows="3" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-if="caseProperty.includes('3')">
          <el-form-item prop="testData" label="测试数据：">
            <el-input v-model="dataForm.testData" placeholder="请输入测试数据" :rows="3" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="caseProperty.includes('4')">
          <el-form-item prop="remark" label="用例备注：">
            <el-input v-model="dataForm.remark" placeholder="请输入用例备注" :rows="3" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: 'AddOrUpdateCase',
  components: {
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
        taskId: '',
        caseId: '',
        moduleOneName: '',
        moduleTwoName: '',
        moduleThreeName: '',
        caseName: '',
        execType: '',
        execTypeName: '',
        autoPlatformId: '',
        autoPlatformName: '',
        caseClass: '',
        caseType: '',
        caseSource: 1, // 用例来源(1:用例设计;2:备选用例)
        shouldTest: '1',
        score: '1',
        priority: '',
        caseCode: '',
        testTarget: '',
        initializeCondition: '',
        testStep: '',
        expcetResult: '',
        testData: '',
        remark: '',
        readOnly: '' // 0:编辑模式;1:只读模式
      },
      dataModuleOneData: [], // 模块一数据
      dataModuleTwoData: [], // 模块二数据
      dataModuleThreeData: [], // 模块三数据
      isCaseProperty: false,
      caseProperty: [],
      disabled: true
    }
  },
  watch: {
    'dataForm.shouldTest' (newVal, oldVal) {
      if (newVal === '0') {
        this.dataForm.score = '0.1'
      } else {
        this.dataForm.score = '1.0'
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
        moduleOneName: [
          { required: true, message: '模块一不允许为空', trigger: 'blur' },
          { required: true, message: '模块一不允许为空', trigger: 'change' }
        ],
        caseName: [
          { required: true, message: '用例名称不允许为空', trigger: 'blur' },
          { required: true, message: '用例名称不允许为空', trigger: 'change' }
        ],
        caseClass: [
          { required: true, message: '用例类别不允许为空', trigger: 'blur' },
          { required: true, message: '用例类别不允许为空', trigger: 'change' }
        ],
        caseType: [
          { required: true, message: '用例类型不允许为空', trigger: 'blur' },
          { required: true, message: '用例类型不允许为空', trigger: 'change' }
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
        this.$refs.dataForm.resetFields()
        this.caseProperty = []
        this.isCaseProperty = false
        this.getTaskInfoById()
        // 用例修改反显
        if (this.dataForm.caseId !== '') {
          this.getCaseDataById()
        }
      })
    },
    getTitle () {
      let title = this.dataForm.caseId === '' ? '新增用例' : '修改用例'
      if (this.dataForm.readOnly === 1) {
        title = '查看用例'
      }
      return title
    },
    getCaseDataById () {
      let thisvm = this
      thisvm.$http.get('/ctc/exec/case/' + thisvm.dataForm.caseId).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        thisvm.dataForm = { ...thisvm.dataForm, ...res.data }
        thisvm.dataForm.priority = thisvm.dataForm.priority || ''
      }).catch(() => { })
    },
    getTaskInfoById () {
      if (this.dataForm.taskId) {
        // 显示当前路径
        let pagePathParams = { 'pageName': this.dataForm.pathPageName, 'id': this.dataForm.taskId, 'type': 'task' }
        this.$refs.ctcPagePath.init(pagePathParams)
        this.$http.get('/ctc/task/base/' + this.dataForm.taskId).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            // 手工-关联平台['YHMN', 'ZNBC', 'ZXZX']
            let relaPlatformList = res.data.relaPlatformList
            if (relaPlatformList.length === 0) {
              relaPlatformList.push({ 'applicationId': '-1', 'name': '执行中心', 'code': 'ZXZX' })
            }
            // 设置关联平台
            this.dataForm.autoPlatformId = relaPlatformList[0].applicationId
            this.dataForm.autoPlatformName = relaPlatformList[0].name
            // 设置执行类型
            if (['YHMN', 'ZNBC', 'ZXZX'].includes(relaPlatformList[0].code)) {
              this.dataForm.execType = '1'
              this.dataForm.execTypeName = '手工'
            } else {
              this.dataForm.execType = '2'
              this.dataForm.execTypeName = '自动化'
            }
            // 设置更多字段
            this.caseProperty = res.data.caseProperty.split(',')
          }
        }).catch(() => { })
      }
    },
    handleCasePropertyclick () {
      this.isCaseProperty = !this.isCaseProperty
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 新增：post;修改：put
          let params = { ...this.dataForm }
          // 模块一
          params.moduleOne = (params.moduleOneName || {}).moduleId
          params.moduleOneName = (params.moduleOneName || {}).moduleName
          // 模块二
          params.moduleTwo = (params.moduleTwoName || {}).moduleId
          params.moduleTwoName = (params.moduleTwoName || {}).moduleName
          // 模块三
          params.moduleThree = (params.moduleThreeName || {}).moduleId
          params.moduleThreeName = (params.moduleThreeName || {}).moduleName
          this.$http[!this.dataForm.caseId ? 'post' : 'put']('/ctc/exec/case', params).then(({ data: res }) => {
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
      }, 1000, { 'leading': true, 'trailing': false })
    }
  }
}
</script>
<style lang="scss">
.add-or-update-case {
  .el-dialog__body {
    padding: 15px 10px;
  }
  .selected {
    margin-top: 10px;
    text-align: right;
  }
  .el-select,
  .el-input,
  .el-input-number,
  .el-date-editor {
    width: 100% !important;
  }
}
</style>
