<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__goods">
      <!-- There is el-form -->
      <el-form :select-on-indeterminate="true" :model="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="100px">
        <el-row>
          <el-col :span="7">
            <el-form-item label="项目名称">
              <el-input v-model="dataForm.name" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="archived" label="项目归档">
              <ctc-select v-model="dataForm.archived" dict-type="project.archived" placeholder="项目归档状态"></ctc-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="" lable-width="0px" style="margin-left:-50px">
              <template>
                <el-radio v-model="dataForm.passRate" :label="0" @change.native="getPassRate(0)">通过率查询</el-radio>
                <el-radio v-model="dataForm.passRate" :label="1" @change.native="getPassRate(1)">初始通过率查询</el-radio>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="text-align: right;">
            <el-button size="small" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
            <el-button size="small" @click="resetSelectInfo()">重置</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="时间范围">
              <el-date-picker clearable unlink-panels value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期" @change="onDateTime" v-model="dateTimeArr" align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="" lable-width="0px" style="margin-left:-100px">
              <el-tooltip class="item" content="均从默认日期0点开始计算，针对项目的用例执行时间进行检索，只对项目指标数据统计产生影响" placement="top">
                <span class="el-icon-question"></span>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- there is el-table -->
      <el-table stripe highlight-current-row :data="dataList" border style="width: 100%;">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="name" label="项目名称" width="150" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="projectType" label="项目类型" width="100" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.parentId?'子项目':'项目'}}
          </template>
        </el-table-column>
        <el-table-column label="项目归档" header-align="center" align="center" width="120">
          <template slot-scope="scope">
            {{ $getDictLabel('project.archived', scope.row.archived) }}
          </template>
        </el-table-column>
        <el-table-column prop="passRateDTO.startDatePassRate" label="起始日期通过率" width="150" header-align="center" align="center" v-if="iniPassRateChangeVisible" :key="Math.random()" show-overflow-tooltip></el-table-column>
        <el-table-column prop="passRateDTO.iniPassRate" label="初始通过率" width="150" header-align="center" align="center" v-if="iniPassPateVisible" :key="Math.random()" show-overflow-tooltip></el-table-column>
        <el-table-column prop="passRateDTO.endDatePassRate" label="结束日期通过率" width="160" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="passRateDTO.passRateChange" label="通过率变化情况" width="160" header-align="center" align="center" v-if="iniPassRateChangeVisible" :key="Math.random()" show-overflow-tooltip></el-table-column>
        <el-table-column prop="passRateDTO.iniPassRateChange" label="通过率变化情况" width="160" header-align="center" align="center" v-if="iniPassPateVisible" :key="Math.random()" show-overflow-tooltip></el-table-column>
        <el-table-column label="省通过率变化趋势图" fixed="right" header-align="center" align="center" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="provinceReportHandle(scope.row.projectId)">加载图形</el-button>
            <el-button type="text" size="small" @click="provinceReportExcle(scope.row)">下载列表</el-button>
          </template>
        </el-table-column>
        <el-table-column label="全量用例输出模板" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="allProvinceReportExcle(scope.row)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column label="日报" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" :disabled="scope.row.archived=='1'" @click="editReportHandle(scope.row.projectId)">编辑日报</el-button>
            <el-button type="text" size="small" @click="sendRecordHandle(scope.row.projectId)">发送记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>
    <provinceReport :visible.sync="visibleReport" v-if="showProvinceReport" ref="provinceReportRef"></provinceReport>
    <editReport :visible.sync="visibleEditReport" v-if="showEditReport" ref="editReportRef"></editReport>
    <sendRecord :visible.sync="visibleSendRecord" v-if="showSendRecord" ref="sendRecordRef"></sendRecord>
  </el-card>
</template>

<script>
import ctcUtils from '@/utils/ctc-utils.js'
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
import editReport from '@/views/modules/visualcenter/reportManage/editReport'
import provinceReport from '@/views/modules/visualcenter/reportManage/provinceReport'
import sendRecord from '@/views/modules/visualcenter/reportManage/sendRecord'
export default {
  mixins: [projectView],
  data () {
    return {
      optionProps: {
        expandTrigger: 'hover',
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'list'
      },
      underline: false,
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/project/pass',
        getDataListIsPage: true,
        deleteURL: '/ctc/servicebus/routedic'
      },
      daterange: null,
      dataForm: {
        projectId: '',
        archived: '',
        name: '',
        startDate: ctcUtils.getDynamicDate('d', 'yyyy-MM-dd', 0),
        endDate: ctcUtils.getDynamicDate('d', 'yyyy-MM-dd', 0),
        labelId: '',
        passRate: 0
      },
      dataListLoading: false, // 数据列表，loading状态
      dataList: [], // 获取分页列表的数据
      showProvinceReport: false,
      showEditReport: false,
      showSendRecord: false,
      visibleReport: false,
      visibleEditReport: false,
      visibleSendRecord: false,
      iniPassPateVisible: false,
      iniPassRateChangeVisible: true,
      dateTimeArr: [ctcUtils.getDynamicDate('d', 'yyyy-MM-dd', 0), ctcUtils.getDynamicDate('d', 'yyyy-MM-dd', 1)]
    }
  },
  components: {
    provinceReport,
    editReport,
    sendRecord
  },
  watch: {
    dateTimeArr: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (this.dateTimeArr === '' || this.dateTimeArr === null) {
          this.startDate = ''
          this.endDate = ''
        }
      }
    },
    daterange (val) {
      this.dataForm.startDate = val[0]
      this.dataForm.endDate = val[1]
    }
  },
  methods: {
    resetSelectInfo () {
      this.dateTimeArr = ''
      this.dataForm.name = ''
      this.dataForm.archived = ''
      this.getDataList()
    },
    editReportHandle (id) {
      this.showEditReport = true
      this.$nextTick(() => {
        this.$refs.editReportRef.dataForm.projectId = id
        this.$refs.editReportRef.dataForm.startDate = this.dateTimeArr[0]
        this.$refs.editReportRef.dataForm.endDate = this.dateTimeArr[1]
        this.$refs.editReportRef.init()
      })
    },
    onDateTime () {
      // 解决时间选择器的事件赋值问题
      this.$nextTick(() => {
        this.startDate = this.dateTimeArr[0]
        this.endDate = this.dateTimeArr[1]
        this.dataForm.startDate = this.dateTimeArr[0]
        this.dataForm.endDate = this.dateTimeArr[1]
      })
    },
    provinceReportHandle (id) {
      this.showProvinceReport = true
      this.$nextTick(() => {
        this.$refs.provinceReportRef.dataForm.projectId = id
        this.$refs.provinceReportRef.dataForm.startDate = this.dateTimeArr[0]
        this.$refs.provinceReportRef.dataForm.endDate = this.dateTimeArr[1]
        this.$refs.provinceReportRef.dataForm.iniPassPateVisible = this.iniPassPateVisible
        this.$refs.provinceReportRef.init()
      })
    },
    sendRecordHandle (id) {
      this.showSendRecord = true
      this.$nextTick(() => {
        this.$refs.sendRecordRef.dataForm.projectId = id
        this.$refs.sendRecordRef.init()
      })
    },
    getPassRate (num) {
      if (num === 0) {
        this.iniPassPateVisible = false
        this.iniPassRateChangeVisible = true
      } else {
        this.iniPassPateVisible = true
        this.iniPassRateChangeVisible = false
      }
    },
    provinceReportExcle (row) {
      let fileName = '【' + row.name + '】-各省通过率'
      let params = { 'projectId': row.projectId, 'startDate': this.startDate, 'endDate': this.endDate, 'fileName': fileName }
      let url = '/ctc/visualization/report/participant/pass/export'
      ctcUtils.customExportGet(url, params)
    },
    allProvinceReportExcle (row) {
      let fileName = '【' + row.name + '】-全量输出模板.xlsx'
      let params = { 'projectId': row.projectId, 'fileName': fileName }
      let url = '/ctc/visualization/projectSurvey/fullOutputTemplate'
      ctcUtils.customExportGet(url, params, fileName)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-head {
  font-size: 14px !important;
}
/deep/ .el-select__tags {
  flex-wrap: unset;
  overflow: auto;
  margin: 0 1px;
}
</style>
