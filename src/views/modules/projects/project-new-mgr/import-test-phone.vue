<template>
  <el-dialog title="导入测试号码" :visible.sync="innerVisible" :close-on-click-modal="false" width="65%" class="import-test-phone">
    <el-row>
      <el-col :span="24">
        <el-form :inline="false" label-position="right" label-width="80px" ref="dataForm" :model="dataForm">
          <el-row>
            <el-col :span="8">
              <el-form-item prop="organizeId" label="所属机构">
                <ctc-organize-table v-model="dataForm.organizeId" placeholder="请选择所属机构" :organizeType.sync="dataForm.organizeType" :organizeId.sync="echoDataForm.organizeId"></ctc-organize-table>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="testPhone" label="测试号码">
                <el-input v-model="dataForm.testPhone" placeholder="不支持模糊匹配"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" style="text-align:right;">
              <el-button size="small" type="primary" @click="getDataInfo">查询</el-button>
              <el-button size="small" @click="doResetDataInfo">重置</el-button>
              <el-button size="small" @click="doImportPhoneData" type="warning">导入</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="24" class="split-line" style="text-align:left;">
            号码列表<span style="color:#4190f7;padding-left:24px;">说明：重新导入会覆盖原数据，请谨慎操作</span>
          </el-col>
        </el-row>
        <el-table ref="leftTableObject" :data="leftTableData" border height="292px">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="测试号码" prop="testPhone" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="所属机构" prop="organizeName" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination background layout="total, prev, pager, next" :page-size="dataForm.limit" :total="total" :current-page.sync="dataForm.page" @current-change="getDataInfo" style="text-align:left;">
        </el-pagination>
      </el-col>
      <!--引入文件导入-->
      <ctc-file-import ref="ctcFileImport" :visible.sync="ctcFileImport" @watchChildImport="triggerParentPage"></ctc-file-import>
    </el-row>
    <div :span="24" class="selected">
      <el-button size="small" @click="handleDialogClose">关闭</el-button>
      <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'ImportTestPhone',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataForm: {
        testPhoneCode: '',
        organizeId: '',
        testPhone: '',
        page: 1,
        limit: 5
      },
      // 回显表单数据
      echoDataForm: {
        organizeId: ''
      },
      total: 0,
      leftTableData: [],
      ctcFileImport: false
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
    }
  },
  watch: {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
        this.doResetDataInfo()
      })
    },
    triggerParentPage (message) {
      let testPhoneCode = message.data
      this.dataForm.testPhoneCode = testPhoneCode
      this.$emit('watchChildMethod', { type: 'importTestPhone', data: testPhoneCode })
      this.doResetDataInfo()
    },
    doResetDataInfo () {
      this.$refs.dataForm.resetFields()
      this.echoDataForm.organizeId = 'clear_' + Math.random()
      this.getDataInfo()
    },
    // 获取左边未选用户数据
    getDataInfo () {
      if (this.dataForm.testPhoneCode) {
        let params = Object.assign({}, this.dataForm)
        this.$http.get('ctc/project/projectTestPhone/page', {
          params: params
        }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            this.total = res.data.total
            this.leftTableData = res.data.list
          }
        }).catch(() => { })
      }
    },
    doImportPhoneData () {
      let templateData = { 'fileName': '测试号码模板下载' }
      let testPhoneCode = this.dataForm.testPhoneCode || ''
      let uploadData = { 'testPhoneCode': testPhoneCode }
      let fileImportParams = { 'templateData': templateData, 'uploadData': uploadData }
      fileImportParams.templateUrl = '/ctc/project/projectTestPhone/exportTemplate'
      fileImportParams.uploadUrl = '/ctc/project/projectTestPhone/importData'
      this.$refs.ctcFileImport.fileImportParams = { ...fileImportParams }
      this.$refs.ctcFileImport.init()
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.handleDialogClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.import-test-phone {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .selected {
    margin-top: 10px;
    text-align: right;
  }
}
</style>
