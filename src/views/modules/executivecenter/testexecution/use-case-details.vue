<template>
  <div>
    <el-dialog title="查看" :visible.sync="dialogVisible" append-to-body width="70%" class="useCase">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用例详情" name="1">
            <el-form label-position="right" :rules="dataRule" ref="dataForm" :model="dataForm" label-width="110px">
              <el-row>
                <template v-for="(item,index) in useCase">
                  <el-col v-if="item.type==='text'" :key="index" :span="item.span" v-show="dataForm[item.code]!=''">
                    <el-form-item :label="item.name" :prop="item.code">
                      <el-input v-model="dataForm[item.code]" :disabled="!item.edit" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-else-if="item.type==='select'" :key="index" :span="item.span" v-show="dataForm[item.code]!=''">
                    <el-form-item :label="item.name" :prop="item.code">
                      <ctc-select v-model="dataForm[item.code]" :disabled="!item.edit" :dict-type="item.dictType" placeholder="请选择"></ctc-select>
                    </el-form-item>
                  </el-col>
                  <el-col v-else-if="item.type==='textarea'" :key="index" :span="item.span" v-show="dataForm[item.code]!=''">
                    <el-form-item :label="item.name" :prop="item.code">
                      <el-input v-model="dataForm[item.code]" :placeholder="'请输入'+item.name" :disabled="!item.edit" :rows="5" type="textarea"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col v-else-if="item.type==='file'" :key="index" :span="item.span">
                    <el-form-item :label="item.name" :prop="item.code">
                      <ctc-file-upload ref="ctcFileUpload" v-model="dataForm[item.code]"></ctc-file-upload>
                    </el-form-item>
                  </el-col>
                </template>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="测试结果" name="2">
            <el-row>
              <template v-for="(item,index) in testResult">
                <el-col v-if="item.type==='text'" :key="index" :span="item.span" class="is_flex">
                  <div class="flex_left">{{item.name}}:</div>
                  <div class="flex_right">{{getTableColumnData(testResultData,item)}}</div>
                </el-col>
                <el-col v-else-if="item.type==='file'" :key="index" :span="item.span" class="is_flex">
                  <div class="flex_left">{{item.name}}:</div>
                  <div class="flex_right">
                    <ctc-download-table :id="getTableColumnData(testResultData,item)"></ctc-download-table>
                  </div>
                </el-col>
                <el-col v-else-if="item.type==='pic'" :key="index" :span="item.span" class="is_flex">
                  <div class="flex_left">{{item.name}}:</div>
                  <div class="flex_right">
                    <ctc-download-table :id="getTableColumnData(testResultData,item)"></ctc-download-table>
                  </div>
                </el-col>
              </template>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="执行轨迹" name="3">
            <el-table :data="executeListTable" stripe border style="width: 100%;">
              <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>
              <template v-for="(item, index) in executeListTableTitle">
                <el-table-column v-if="item.code!='operate'" :key="index" :label="item.name" align="center">
                  <template slot-scope="scope">
                    <span v-html="getTableColumnData(scope.row,item)"></span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="缺陷轨迹" name="4">
            <el-table :data="defectListTable" stripe border style="width: 100%;">
              <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>
              <template v-for="(item, index) in defectListTableTitle">
                <el-table-column :key="index" :label="item.name" align="center">
                  <template slot-scope="scope">
                    <el-button v-if="item.code==='defectCode'" type="text" size="small" @click="doSearchDefectDetail(scope.row)">{{scope.row.defectCode}}</el-button>
                    <span v-else v-html="getTableColumnData(scope.row,item)"></span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { addDynamicRoute } from '@/router'
export default {
  name: 'use-case-details',
  data () {
    return {
      dialogVisible: false,
      activeName: '1',
      modifyVisible: false,
      dataForm: {
      },
      useCase: [
        { name: '模块一', code: 'moduleOneName', span: 8, type: 'text', edit: false },
        { name: '模块二', code: 'moduleTwoName', span: 8, type: 'text', edit: false },
        { name: '模块三', code: 'moduleThreeName', span: 8, type: 'text', edit: false },
        { name: '用例名称', code: 'caseName', span: 8, type: 'text', edit: false },
        { name: '用例类型', code: 'caseType', span: 8, type: 'select', dictType: 'caseType', edit: false },
        { name: '执行类型', code: 'execType', span: 8, type: 'select', dictType: 'execType', edit: false },
        { name: '关联平台', code: 'autoPlatformName', span: 8, type: 'text', edit: false },
        { name: '是否必测', code: 'shouldTest', span: 8, type: 'select', dictType: 'whether', edit: false },
        { name: '分值', code: 'score', span: 8, type: 'text', edit: false },
        { name: '用例编号', code: 'caseId', span: 8, type: 'text', edit: false },
        { name: '优先级', code: 'priority', span: 8, type: 'select', dictType: 'priority', edit: false },
        { name: '创建人', code: 'createName', span: 8, type: 'text', edit: false },
        { name: '创建时间', code: 'createDate', span: 8, type: 'text', edit: false },
        { name: '最后修改人', code: 'updateName', span: 8, type: 'text', edit: false },
        { name: '最后修改时间', code: 'updateDate', span: 8, type: 'text', edit: false },
        { name: '用例审核人', code: 'reviewer', span: 8, type: 'text', edit: false },
        { name: '审核时间', code: 'reviewTime', span: 8, type: 'text', edit: false },
        { name: '测试目的', code: 'testTarget', span: 24, type: 'textarea', edit: false },
        { name: '测试步骤', code: 'testStep', span: 24, type: 'textarea', edit: false },
        { name: '预期条件', code: 'initializeCondition', span: 24, type: 'textarea', edit: false },
        { name: '预期结果', code: 'expcetResult', span: 24, type: 'textarea', edit: false },
        { name: '测试数据', code: 'testData', span: 24, type: 'textarea', edit: false },
        { name: '用例备注', code: 'remark', span: 24, type: 'textarea', edit: false }
      ],
      useCaseData: '',
      testResult: [
        { name: '用例ID', code: 'caseId', span: 8, type: 'text' },
        { name: '用例名称', code: 'caseName', span: 8, type: 'text' },
        { name: '执行人', code: 'creatorName', span: 8, type: 'text' },
        { name: '执行时间', code: 'createDate', span: 8, type: 'text' },
        { name: '结果判定', code: 'resultCode', span: 8, type: 'text' },
        { name: '测试号码', code: 'testPhone', span: 8, type: 'text' },
        { name: '备注', code: 'remark', span: 24, type: 'text' },
        { name: '测试附件', code: 'testReportId', span: 24, type: 'file' }
      ],
      testResultData: '',
      executeListTable: [], // 执行轨迹
      executeListTableTitle: [
        // { name: '缺陷名称', code: 'name' },
        { name: '工单号', code: 'orderId' },
        { name: '执行时间', code: 'createDate' },
        { name: '执行人', code: 'creatorName' },
        { name: '结果断定', code: 'resultCode' }
        // { name: '联系电话', code: 'phone' }
      ],
      defectListTable: [], // 缺陷轨迹
      defectListTableTitle: [
        {
          'code': 'defectCode',
          'name': '缺陷编号'
        },
        {
          'code': 'name',
          'name': '缺陷名称'
        },
        {
          'code': 'createDate',
          'name': '创建时间'
        },
        {
          'code': 'creatorName',
          'name': '创建人'
        },
        {
          'code': 'updateDate',
          'name': '处理时间'
        },
        {
          'code': 'handlerName',
          'name': '处理人'
        },
        {
          'code': 'defectStatus',
          'name': '缺陷处理状态'
        }
      ],
      caseId: '',
      isEditList: ['updateReason', 'testStep', 'expcetResult']
    }
  },
  watch: {
    modifyVisible (newVal, oldVal) {
      if (newVal) {
        let isEdit = this.isEditList
        for (let i = 0; i < isEdit.length; i++) {
          for (let j = 0; j < this.useCase.length; j++) {
            if (isEdit[i] === this.useCase[j].code) {
              console.log(this.useCase[j])
              this.useCase[j].edit = true
              this.dataForm[this.useCase[j].code] = this.getTableColumnData(this.useCaseData, this.useCase[j])
            }
          }
        }
      }
    },
    dialogVisible (newVal, oldVal) {
      if (!newVal) {
        this.$emit('init')
      }
    }
  },
  computed: {
    dataRule () {
      return {
        caseName: [
          { required: true, message: '用例名称不允许为空', trigger: 'blur' },
          { required: true, message: '用例名称不允许为空', trigger: 'change' }
        ],
        caseType: [
          { required: true, message: '用例类型不允许为空', trigger: 'blur' },
          { required: true, message: '用例类型不允许为空', trigger: 'change' }
        ],
        testType: [
          { required: true, message: '测试类型不允许为空', trigger: 'blur' },
          { required: true, message: '测试类型不允许为空', trigger: 'change' }
        ],
        priority: [
          { required: true, message: '优先级不允许为空', trigger: 'blur' },
          { required: true, message: '优先级不允许为空', trigger: 'change' }
        ],
        shouldTest: [
          { required: true, message: '是否必测不允许为空', trigger: 'blur' },
          { required: true, message: '是否必测不允许为空', trigger: 'change' }
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
    init (row) {
      this.dialogVisible = true
      this.caseId = row.caseId
      this.activeName = '1'
      this.useCaseData = ''
      this.testResultData = ''
      this.executeListTable = []
      this.defectListTable = []
      this.getData(this.activeName)
    },
    handleClick (tab, event) {
      this.getData(tab.name)
    },
    getData (name) {
      if (name === '1') { // 用例详情
        if (this.useCaseData === '') {
          this.getUseCaseData()
        }
      } else if (name === '2') {
        if (this.testResultData === '') {
          this.getTestResultData()
        }
      } else if (name === '3') {
        if (this.executeListTable.length === 0) {
          this.getExecuteListTableData()
        }
      } else if (name === '4') {
        if (this.defectListTable.length === 0) {
          this.getDefectListTableData()
        }
      }
    },
    getUseCaseData () {
      let params = {}
      this.$ctcLoading.open()
      this.$http.get('/ctc/exec/case/' + this.caseId, { 'params': params }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.useCaseData = res.data
          this.dataForm = res.data
          // 特殊处理类型null
          for (var i in this.dataForm) {
            if (this.dataForm[i] === null) {
              this.dataForm[i] = ''
            }
          }
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    getTestResultData () {
      let params = {}
      this.$ctcLoading.open()
      this.$http.get('/ctc/exec/result/' + this.caseId, { 'params': params }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          console.log(res)
          this.testResultData = res.data
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    getExecuteListTableData () {
      let params = {}
      this.$ctcLoading.open()
      this.$http.get('/ctc/exec/result/locus/' + this.caseId, { 'params': params }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          console.log(res)
          this.executeListTable = res.data
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    getDefectListTableData () {
      // 待定
      let params = { caseId: this.caseId, 'page': 1, limit: 9999999 }
      this.$ctcLoading.open()
      this.$http.get('/ctc/defect/base/list', { 'params': params }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.defectListTable = res.data.data.list
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'resultCode') {
        columnValue = this.$getDictLabel('resultDetermination', row[item.code])
      } else if (item.code === 'defectStatus') {
        columnValue = this.$getDictLabel('defectStatus', row[item.code])
      } else if (item.code === 'operation') {
        columnValue = this.$getDictLabel('operation', row[item.code])
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    doTableOperate (type, row) {
      if (type === 0) {
        this.$confirm('此操作将永久删除该轨迹, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delExecute(row.execResultId)
        }).catch(() => {
        })
      }
    },
    delExecute (id) {
      let params = {}
      this.$ctcLoading.open()
      this.$http.delete('/ctc/exec/result/' + id, { 'params': params }).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.executeListTable = []
          this.getData(this.activeName)
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    modifySubmit () {
      let params = { caseId: this.caseId, ...this.dataForm }
      this.$ctcLoading.open()
      this.$http.put('/ctc/exec/case', params).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.modifyVisible = false
          let isEdit = this.isEditList
          for (let i = 0; i < isEdit.length; i++) {
            for (let j = 0; j < this.useCase.length; j++) {
              if (isEdit[i] === this.useCase[j].code) {
                console.log(this.useCase[j])
                this.useCase[j].edit = false
                this.dataForm[this.useCase[j].code] = ''
              }
            }
          }
          this.$message.success('提交成功')
          this.getUseCaseData()
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    doSearchDefectDetail (row) {
      let path = 'defectcenter/defect-mgr/defect-data-detail'
      let titel = '查看缺陷详情'
      let params = {}
      params.defectId = row.defectId
      params.defectInfo = row
      this.customAddDynamicRoute(path, titel, params)
      this.dialogVisible = false
    },
    customAddDynamicRoute (path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {}
      }
      addDynamicRoute(routeParams, this.$router)
    }
  }
}
</script>
<style lang="scss">
.useCase {
  .el-form--inline .el-form-item {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>
<style scoped lang="scss">
.is_flex {
  display: flex;
  min-height: 40px;
  margin-top: 10px;
  line-height: 40px;
  .flex_left {
    width: 120px;
    text-align: right;
    padding-right: 10px;
    color: darkgray;
  }
  .flex_right {
    flex: 1;
  }
}
.isPic {
  height: 80px;
  width: 80px;
}
</style>
