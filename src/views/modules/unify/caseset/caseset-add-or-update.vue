<template>
  <el-dialog :visible.sync="visible" :title="$t('add')" :close-on-click-modal="false" :close-on-press-escape="false" class="organize-add-or-update">
    <el-form ref="queryDataForm" :model="queryDataForm" :inline="false" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item prop="platform" label="来源平台">
            <el-select v-model="queryDataForm.platform" defaultValue="lucy" clearable filterable placeholder="请选择来源平台" value-key="moduleId" @change="chooseModule">
              <!-- 联调:1;用户模拟：2 -->
              <el-option key="1" label="接口联调" value="1">接口联调</el-option>
              <el-option key="2" label="用户模拟" value="2">用户模拟</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="name" label="用例">
            <el-input v-model="queryDataForm.name" placeholder="请输入用例名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="text-align:right;">
          <el-button type="primary" size="small" @click="getBuilderCase()">查询</el-button>
          <el-button size="small" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table stripe highlight-current-row :data="caseTableData" ref="caseTableData" border height="500" style="width:100%;;overflow-y:auto;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="caseId" label="用例ID" header-align="center" align="center" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column prop="caseClass" label="来源平台" header-align="center" align="center">
        <template slot-scope="scope">
          {{ $getDictLabel('caseClass', scope.row.caseClass) }}
        </template>
      </el-table-column> -->
      <el-table-column prop="caseName" label="用例名称" header-align="center" align="center">
      </el-table-column>
      <!-- <el-table-column prop="reviewStatus" label="用例类型" header-align="center" align="center">
        <template slot-scope="scope">
          {{ $getDictLabel('reviewStatus', scope.row.reviewStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="测试目的" header-align="right" align="right" width="120" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="descript" label="备注" header-align="right" align="right" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-pagination :current-page="dataForm.page" :page-sizes="[10, 100, 500,1000]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
    </el-pagination>
    <el-row style="paddingTop: 16px">
      <el-col :span="2">
        <span style="lineHeight: 36px">
          执行人：
        </span>
      </el-col>
      <el-col :span="12">
        <el-select v-model="execUserNo" filterable placeholder="请选择执行人" clearable>
          <el-option v-for="item in userData" :key="item.userId" :label="item.realName" :value="item.userId"></el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <span style="lineHeight: 36px;paddingLeft: 10px;color: rgb(65, 144, 247);">
          * 执行用例的权限人（接口联调必输）
        </span>
      </el-col>
    </el-row>
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t('confirm') }}</el-button>
    </template>
  </el-dialog>
</template>
<script>
import debounce from 'lodash/debounce'
export default {
  data () {
    return {
      visible: false,
      builderId: '',
      execUserNo: '',
      caseTableData: [],
      total: 0,
      queryDataForm: {
        platform: '2',
        name: ''
      },
      projectId: '',
      userData: [],
      dataForm: {
        caseId: '',
        caseName: '',
        descript: '',
        limit: 10,
        page: 1
      }
    }
  },
  watch: {

  },
  computed: {
    dataRule () {
      return {

      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.isAppendName = true
        this.dataForm.serviceOrganizeName = ''
        // this.$refs['dataForm'].resetFields()
        this.getBuilderCase()
        this.getUserData()
      })
    },
    chooseModule () {
      this.getBuilderCase()
    },
    getUserData () {
      let params = {
        projectId: this.projectId
      }
      this.$http.get('ctc/project/projectMember/list', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.userData = res.data
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    getBuilderCase () {
      let params = {
        limit: this.dataForm.limit,
        page: this.dataForm.page,
        builderId: this.builderId,
        ...this.queryDataForm
      }
      this.$http.get('integration/rest/buildercase/case/list', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.caseTableData = res.data.list
          this.total = res.data.totalCount
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getBuilderCase()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getBuilderCase()
    },
    checkAbbreviated () {
      this.dataForm.abbreviatedName = this.dataForm.abbreviatedName.replace(/[^a-zA-Z]/g, '')
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      let selectionData = this.$refs.caseTableData.selection
      if (selectionData.length > 0) {
        if (this.queryDataForm.platform === '1' && !this.execUserNo) {
          this.$message.warning('接口联调必须选择执行人！')
        } else {
          let params = {
            builderId: this.builderId,
            execUserNo: this.execUserNo,
            platform: this.queryDataForm.platform,
            data: selectionData
          }
          this.$http['post']('integration/buildercase/save', params).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            this.$message({
              message: this.$t('prompt.success'),
              type: 'success',
              duration: 500,
              onClose: () => {
                this.visible = false
                this.$emit('watchChildPage')
              }
            })
          }).catch(() => { })
        }
      } else {
        this.$message.warning('没有选中任何用例！')
      }
    })
  }
}
</script>
<style  lang="scss">
.organize-add-or-update {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
}
</style>
