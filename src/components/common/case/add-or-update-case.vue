<template>
  <el-dialog :title="getTitle()" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false" width="75%" class="add-or-update-case">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" :disabled="dataForm.readOnly==1">
      <el-row style="margin-bottom:15px;">
        <el-col :span="24" style="padding-left:10px;">
          <ctc-page-path ref="ctcPagePath"></ctc-page-path>
        </el-col>
        <el-col :span="24" v-if="dataForm.readOnly==0" style="text-align:right;">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">更多字段<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" style="padding:10px;">
              <el-checkbox-group v-model="caseProperty">
                <el-checkbox label="1">用例编号</el-checkbox><br />
                <el-checkbox label="2">优先级</el-checkbox><br />
                <el-checkbox label="3">测试数据</el-checkbox><br />
                <el-checkbox label="4">用例备注</el-checkbox><br />
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" size="small" @click="openSmrtSearch" style="margin-left:15px;">智能搜索</el-button>
          <el-button type="primary" size="small" :disabled="btnConfirmDisabled" @click="handleConfirm" style="margin-left:15px;">确 定</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item prop="moduleOneName" label="模块一">
            <el-select v-model="dataForm.moduleOneName" clearable filterable allow-create placeholder="选择模块一" value-key="moduleId" @change="chooseModule" @blur="chooseModuleBlur(1,$event)">
              <el-option v-for="data in dataModuleOneData" :key="data.moduleId" :label="data.moduleName" :value="data">{{data.moduleName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="moduleTwoName" label="模块二">
            <el-select v-model="dataForm.moduleTwoName" clearable filterable allow-create placeholder="选择模块二" value-key="moduleId" @change="chooseModule" @blur="chooseModuleBlur(2,$event)">
              <el-option v-for="data in dataModuleTwoData" :key="data.moduleId" :label="data.moduleName" :value="data">{{data.moduleName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="moduleThreeName" label="模块三">
            <el-select v-model="dataForm.moduleThreeName" clearable filterable allow-create placeholder="选择模块三" value-key="moduleId" @change="chooseModule" @blur="chooseModuleBlur(3,$event)" :disabled="commodityData.length>0">
              <el-option v-for="data in dataModuleThreeData" :key="data.moduleId" :label="data.moduleName" :value="data">{{data.moduleName}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="caseName" label="用例名称">
            <el-input v-model="dataForm.caseName" placeholder="请输入用例名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="execType" label="执行类型">
            <el-input v-model="dataForm.execType" placeholder="请输入执行类型" style="display:none;"></el-input>
            <el-input v-model="dataForm.execTypeName" placeholder="请输入执行类型" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="autoPlatformId" label="关联平台">
            <el-input v-model="dataForm.autoPlatformId" placeholder="请输入关联平台" style="display:none;"></el-input>
            <el-input v-model="dataForm.autoPlatformName" placeholder="请输入关联平台" :disabled="disabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="caseClass" label="用例类别">
            <ctc-select v-model="dataForm.caseClass" dict-type="caseClass" placeholder="请选择用例类别"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="caseType" label="用例类型">
            <ctc-select v-model="dataForm.caseType" dict-type="caseType" placeholder="请选择用例类型"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="shouldTest" label="是否必测">
            <ctc-select v-model="dataForm.shouldTest" dict-type="whether" placeholder="请选择是否必测"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="score" label="分值">
            <el-input-number v-model="dataForm.score" :precision="1" :step="0.1" :min="Number(minScore)" :max="2" label="请选择分值" :disabled="dataForm.shouldTest==0"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="caseProperty.includes('2')">
          <el-form-item prop="priority" label="优先级">
            <ctc-select v-model="dataForm.priority" dict-type="priority" placeholder="请选择优先级"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="caseProperty.includes('1')">
          <el-form-item prop="caseCode" label="用例编号">
            <el-input v-model="dataForm.caseCode" placeholder="请输入用例编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="testTarget" label="测试目的">
            <el-input v-model="dataForm.testTarget" placeholder="请输入测试目的" :rows="6" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="initializeCondition" label="预期条件">
            <el-input v-model="dataForm.initializeCondition" placeholder="请输入预期条件" :rows="6" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="testStep" label="测试步骤">
            <el-input v-model="dataForm.testStep" placeholder="请输入测试步骤" :rows="6" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="expcetResult" label="预期结果">
            <el-input v-model="dataForm.expcetResult" placeholder="请输入预期结果" :rows="6" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="caseProperty.includes('3')">
          <el-form-item prop="testData" label="测试数据">
            <el-input v-model="dataForm.testData" placeholder="请输入测试数据" :rows="6" type="textarea"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="caseProperty.includes('4')">
          <el-form-item prop="remark" label="用例备注">
            <el-input v-model="dataForm.remark" placeholder="请输入用例备注" :rows="6" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog title="全局搜索" :visible.sync="dialogVisible" width="80%" append-to-body>
      <ctc-associated-search :dialog="dialogOff" @valueItem='getMsgFormSon'></ctc-associated-search>
    </el-dialog>
  </el-dialog>
</template>
<script>
import debounce from 'lodash/debounce'
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
        pathPageName: '', // 显示当前路径页面名称
        taskId: '',
        caseId: '',
        orderId: '',
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
      minScore: '0.1',
      dialogVisible: false, // 用例搜索模块
      dialogOff: true, // 全局用例搜索
      btnConfirmDisabled: false,
      disabled: true,
      isCaseProperty: false,
      dataModuleOneData: [], // 模块一数据
      dataModuleTwoData: [], // 模块二数据
      dataModuleThreeData: [], // 模块三数据
      caseProperty: [],
      commodityData: [] // 商品信息
    }
  },
  watch: {
    'dataForm.shouldTest' (newVal, oldVal) {
      // 设置用例新增时候，触发默认值
      if (!this.dataForm.caseId) {
        if (newVal === '0') {
          this.minScore = '0.0'
          this.dataForm.score = '0.0'
        } else {
          this.minScore = '0.1'
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
        this.dataForm.caseCode = ''
        this.caseProperty = []
        this.commodityData = []
        this.isCaseProperty = false
        this.btnConfirmDisabled = false
        this.getTaskInfoById()
        this.getOrderCodeByProjectId()
      })
    },
    // 智能搜索回填到输入框
    getMsgFormSon (data) {
      this.dialogVisible = false
      console.log(data, this.dataForm)
      this.dataForm = { ...this.dataForm, ...data }
    },
    getTitle () {
      let title = this.dataForm.caseId === '' ? '新增用例' : '修改用例'
      if (this.dataForm.readOnly === 1) {
        title = '查看用例'
      }
      return title
    },
    openSmrtSearch () {
      this.dialogVisible = true
    },
    // 根据项目Id，获取orderCode获取商品信息
    getOrderCodeByProjectId () {
      let thisvm = this
      let projectId = thisvm.dataForm.projectId
      if (projectId) {
        thisvm.$http.get('/ctc/project/projectBase/' + projectId).then(({ data: res }) => {
          if (res.code !== 0) {
            thisvm.$message.error('获取项目基本信息失败')
          } else {
            let orderCode = res.data.orderCode || ''
            if (orderCode) {
              let params = {}
              params.orderCode = orderCode
              thisvm.$http.get('/ctc/plan/commodityOrderInfo/findGoodsByOrderCode', { 'params': params }).then(({ data: res }) => {
                if (res.code !== 0) {
                  thisvm.$message.error('获取项目基本信息失败')
                } else {
                  thisvm.commodityData = res.data
                  thisvm.loadModuleData(1, { 'moduleLevel': 1 })
                }
              }).catch(() => { })
            } else {
              thisvm.loadModuleData(1, { 'moduleLevel': 1 })
            }
          }
        }).catch(() => { })
      } else {
        thisvm.loadModuleData(1, { 'moduleLevel': 1 })
      }
    },
    loadModuleData (type, tparams) {
      let thisvm = this
      let params = tparams || {}
      params.taskId = thisvm.dataForm.taskId
      thisvm.$http.get('ctc/case/caseTree/moduleList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          if (type === 1) {
            thisvm.dataModuleOneData = res.data
            thisvm.dataModuleTwoData = []
            thisvm.dataModuleThreeData = []
            thisvm.dataForm.moduleOneName = ''
            thisvm.dataForm.moduleTwoName = ''
            thisvm.dataForm.moduleThreeName = ''
            // 特殊处理，模块一加载完成，触发用例修改反显
            if (this.dataForm.caseId !== '') {
              this.getCaseDataById()
            }
          } else if (type === 2) {
            thisvm.dataModuleTwoData = res.data
            thisvm.dataModuleThreeData = []
            thisvm.dataForm.moduleTwoName = ''
            thisvm.dataForm.moduleThreeName = ''
          } else if (type === 3) {
            thisvm.dataModuleThreeData = res.data
            thisvm.dataForm.moduleThreeName = ''
          }
        }
      }).catch(() => { })
    },
    chooseModuleBlur (type, el) {
      let thisvm = this
      let inputValue = el.target.value
      let hasModuleName = true
      let tdata = []
      if (inputValue) {
        if (type === 1) {
          // 过滤新创建条目，并且判断用户输入名称是否存在
          let data = thisvm.dataModuleOneData.filter(function (item) {
            if (item.moduleName === inputValue) {
              hasModuleName = false
            }
            return item.moduleId !== ''
          })
          if (hasModuleName) {
            if (data !== undefined) {
              tdata = data
            }
            tdata = [{ 'moduleLevel': 1, 'moduleId': '', 'moduleName': inputValue }].concat(tdata)
            thisvm.dataModuleOneData = tdata
            thisvm.dataForm.moduleOneName = tdata[0]
            thisvm.chooseModule(thisvm.dataForm.moduleOneName)
          }
        } else if (type === 2) {
          // 过滤新创建条目，并且判断用户输入名称是否存在
          let data = thisvm.dataModuleTwoData.filter(function (item) {
            if (item.moduleName === inputValue) {
              hasModuleName = false
            }
            return item.moduleId !== ''
          })
          if (hasModuleName) {
            if (data !== undefined) {
              tdata = data
            }
            tdata = [{ 'moduleId': '', 'moduleName': inputValue }].concat(tdata)
            thisvm.dataModuleTwoData = tdata
            thisvm.dataForm.moduleTwoName = tdata[0]
          }
        } else if (type === 3) {
          // 过滤新创建条目，并且判断用户输入名称是否存在
          let data = thisvm.dataModuleThreeData.filter(function (item) {
            if (item.moduleName === inputValue) {
              hasModuleName = false
            }
            return item.moduleId !== ''
          })
          if (hasModuleName) {
            if (data !== undefined) {
              tdata = data
            }
            tdata = [{ 'moduleId': '', 'moduleName': inputValue }].concat(tdata)
            thisvm.dataModuleThreeData = tdata
            thisvm.dataForm.moduleThreeName = tdata[0]
          }
        }
      }
    },
    chooseModule (item) {
      let thisvm = this
      // 特殊处理产商品模块数据
      if (thisvm.commodityData.length > 0) {
        if (item.moduleLevel === 1) {
          let dataModuleTwoData = []
          thisvm.commodityData.forEach((item, index) => {
            dataModuleTwoData.push({ 'moduleLevel': 2, 'moduleId': item.goodsId, 'moduleName': item.goodsId, 'goodsId': item.goodsId, 'commodityName': item.commodityName })
          })
          thisvm.dataModuleTwoData = dataModuleTwoData
        } else {
          thisvm.dataModuleThreeData = [{ 'moduleLevel': 3, 'moduleId': item.goodsId, 'moduleName': item.commodityName }]
          thisvm.dataForm.moduleThreeName = thisvm.dataModuleThreeData[0]
        }
      } else {
        let moduleLevel = item.moduleLevel
        let moduleLevelNext = moduleLevel + 1
        if (item.moduleId) {
          let params = { 'parentModule': item.moduleId, 'moduleLevel': moduleLevelNext }
          thisvm.loadModuleData(moduleLevelNext, params)
        }
      }
    },
    getCaseDataById () {
      let thisvm = this
      thisvm.$http.get('/ctc/case/caseInfo/' + thisvm.dataForm.caseId).then(({ data: res }) => {
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        thisvm.dataForm = { ...thisvm.dataForm, ...res.data }
        thisvm.dataForm.priority = thisvm.dataForm.priority || ''
        // 判断是否必测；
        if (thisvm.dataForm.shouldTest === 0) {
          thisvm.minScore = '0.0'
          thisvm.dataForm.score = '0.0'
        }
        // 回显模块一
        let moduleOneData = thisvm.dataModuleOneData.filter(function (item) {
          return item.moduleId === thisvm.dataForm.moduleOne
        })
        thisvm.dataForm.moduleOneName = moduleOneData[0]
        // 特殊处理产商品模块数据
        if (thisvm.commodityData.length > 0) {
          // 回显模块二
          thisvm.echoCaseModuleData({ 'parentModule': thisvm.dataForm.moduleOne, 'moduleLevel': 2 }, function (res) {
            let moduleTwoSelect = res.data.filter(function (item) {
              return item.moduleId === thisvm.dataForm.moduleTwo
            })
            if (moduleTwoSelect.length > 0) {
              let moduleTwoItem = {}
              let dataModuleTwoData = []
              thisvm.commodityData.forEach((item, index) => {
                let tModule = { 'moduleLevel': 2, 'moduleId': item.goodsId, 'moduleName': item.goodsId, 'goodsId': item.goodsId, 'commodityName': item.commodityName }
                if (item.goodsId === moduleTwoSelect[0].moduleName) {
                  moduleTwoItem = tModule
                }
                dataModuleTwoData.push(tModule)
              })
              thisvm.dataModuleTwoData = dataModuleTwoData
              thisvm.dataForm.moduleTwoName = moduleTwoItem
              thisvm.chooseModule(moduleTwoItem)
            }
          })
        } else {
          // 回显模块二
          thisvm.echoCaseModuleData({ 'parentModule': thisvm.dataForm.moduleOne, 'moduleLevel': 2 }, function (res) {
            thisvm.dataModuleTwoData = res.data
            let moduleTwoData = thisvm.dataModuleTwoData.filter(function (item) {
              return item.moduleId === thisvm.dataForm.moduleTwo
            })
            if (moduleTwoData.length > 0) {
              thisvm.dataForm.moduleTwoName = moduleTwoData[0]
            }
          })
          // 回显模块三
          thisvm.echoCaseModuleData({ 'parentModule': thisvm.dataForm.moduleTwo, 'moduleLevel': 3 }, function (res) {
            thisvm.dataModuleThreeData = res.data
            let moduleThreeData = thisvm.dataModuleThreeData.filter(function (item) {
              return item.moduleId === thisvm.dataForm.moduleThree
            })
            if (moduleThreeData.length > 0) {
              thisvm.dataForm.moduleThreeName = moduleThreeData[0]
            }
          })
        }
      }).catch(() => { })
    },
    echoCaseModuleData (params, callback) {
      if (params.parentModule !== '') {
        this.$http.get('ctc/case/caseTree/moduleList', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            callback && callback(res)
          }
        }).catch(() => { })
      } else {
        let res = { 'data': [] }
        callback && callback(res)
      }
    },
    getTaskInfoById () {
      if (this.dataForm.taskId) {
        // 显示当前路径
        let pagePathParams = { 'pageName': this.dataForm.pathPageName || 'XXXX', 'id': this.dataForm.taskId, 'type': 'task' }
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
    saveTaskCaseProperty () {
      let params = { 'taskId': this.dataForm.taskId, 'caseProperty': this.caseProperty.join(',') }
      this.$http.post('ctc/task/base/setUpTaskCaseProperty', params).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
      }).catch(() => { })
    },
    handleConfirm: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnConfirmDisabled = true
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
          // 特殊处理产商品模块数据
          if (this.commodityData.length > 0) {
            params.moduleTwo = ''
            params.moduleThree = ''
          }
          // 特殊处理用例保存，手动去除[创建人、下发状态]
          delete params['creator']
          delete params['issueStatus']
          delete params['createDate']
          delete params['updateDate']
          this.$http[!this.dataForm.caseId ? 'post' : 'put']('/ctc/case/caseInfo', params).then(({ data: res }) => {
            if (res.code !== 0) {
              this.btnConfirmDisabled = false
              return this.$message.error(res.msg)
            }
            // 保存任务用例属性
            this.saveTaskCaseProperty()
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
      })
    }, 2000, { 'leading': true, 'trailing': false })
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
}
</style>
