<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__goods">
      <!-- There is el-form -->
      <el-form :model="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="报表名称">
              <el-input v-model="dataForm.templateName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="统计维度">
              <ctc-select v-model="dataForm.statisticalDimension" dict-type="support_dimensions" placeholder="请选择"></ctc-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间">
              <el-date-picker unlink-panels clearable value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期" v-model="dateTimeArr" align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="text-align:right;float:right;">
            <el-button size="small" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
            <el-button size="small" @click="resetSelectInfo()">重置</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" style="margin-bottom: 22px;">
            <el-button size="small" type="primary" @click="templateEditHandle()">新增报表模板</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- there is el-table -->
      <el-table stripe highlight-current-row border v-loading="dataListLoading" :data="dataList">
        <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
        <el-table-column prop="templateName" label="报表名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="指标分类" header-align="center" align="center">
          <template slot-scope="scope">
            {{ scope.row.twoClassification ? scope.row.firstClassification + '>' + scope.row.twoClassification : scope.row.firstClassification ? scope.row.firstClassification : '无' }}
          </template>
        </el-table-column>
        <el-table-column prop="statisticalDimension" label="统计维度" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel('support_dimensions',scope.row.statisticalDimension) }}
          </template>
        </el-table-column>
        <el-table-column prop="reportModeName" label="报表模式" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="updateDate" label="更新时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.isShowUpdateAndDelete" type="text" size="small"  @click="templateEditHandle(scope.row.templateId)">编辑</el-button>
            <el-button v-if="scope.row.isShowUpdateAndDelete" type="text" size="small" @click="templateDeleteHandle(scope.row.templateId)">删除</el-button>
            <el-button type="text" size="small" @click="templateDetailsHandle(scope.row.templateId)">详情</el-button>
            <el-button type="text" size="small" @click="templateCopyHandle(scope.row.templateId)">复制</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <template-add-or-update v-if="showTemplateEdit" ref="templateEdit" @refreshDataList="getDataList"></template-add-or-update>
      <template-details v-if="showTemplateDetails" ref="templateDetail" ></template-details>
    </div>
  </el-card>
</template>

<script>
import templateAddOrUpdate from '@/views/modules/visualcenter/template/template-add-or-update'
import templateDetails from '@/views/modules/visualcenter/template/template-details'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      dataForm: {
        templateName: '',
        statisticalDimension: '',
        updateDateStart: '',
        updateDateEnd: ''
      },
      dateTimeArr: [],
      mixinViewModuleOptions: {
        createdIsNeed: true,
        getDataListURL: '/ctc/visualization/templateSetting/page',
        getDataListIsPage: true
      },
      showTemplateEdit: false,
      showTemplateDetails: false,
      dataListLoading: false, // 数据列表，loading状态
      dataList: [] // 获取分页列表的数据
    }
  },
  components: {
    templateAddOrUpdate, templateDetails
  },
  mounted () {
  },
  watch: {
    dateTimeArr: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (this.dateTimeArr === '' || this.dateTimeArr === null) {
          this.dataForm.updateDateStart = ''
          this.dataForm.updateDateEnd = ''
        } else {
          this.dataForm.updateDateStart = this.dateTimeArr[0]
          this.dataForm.updateDateEnd = this.dateTimeArr[1]
        }
      }
    }
  },
  methods: {
    // 重置初始条件状态
    resetSelectInfo () {
      this.$nextTick(() => {
        this.dataForm.templateName = ''
        this.dataForm.statisticalDimension = ''
        this.dateTimeArr = ''
        this.dataForm.updateDateStart = ''
        this.dataForm.updateDateEnd = ''
        this.getDataList()
      })
    },
    // 模板新增/编辑页面
    templateEditHandle (templateId) {
      this.showTemplateEdit = true
      this.$nextTick(() => {
        this.$refs.templateEdit.dataForm.templateId = templateId
        this.$refs.templateEdit.init()
      })
    },
    // 模板删除
    templateDeleteHandle (templateId) {
      this.$confirm('确定要删除该报表模板吗？请注意：删除后无法查看该统计报表，请谨慎操作！', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('/ctc/visualization/templateSetting', { params: { ids: templateId } }, { emulateJSON: true }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => { })
      }).catch(() => {})
    },
    // 模板详情页面
    templateDetailsHandle (templateId) {
      this.showTemplateDetails = true
      this.$nextTick(() => {
        this.$refs.templateDetail.dataForm.templateId = templateId
        this.$refs.templateDetail.init()
      })
    },
    templateCopyHandle (templateId) {
      this.$http.get('/ctc/visualization/templateSetting/copyTemplate', { params: { templateId: templateId } }, { emulateJSON: true }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 500,
          onClose: () => {
            this.getDataList()
          }
        })
      }).catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-head {
  font-size: 14px !important;
}
</style>
