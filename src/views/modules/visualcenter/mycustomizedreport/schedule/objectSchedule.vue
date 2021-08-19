<template>
    <div v-if="dataList.length>0">
        <el-row>
            <el-col :span="12" class="split-line" style="text-align:left;">
                参测对象进度
            </el-col>
            <el-col :span="12" style="padding-left:0px;text-align:right;">
                <el-button type="blue" size="small" @click="doExportData">导出</el-button>
            </el-col>
        </el-row>
        <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="organizeName" label="参测对象" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="progressRateDTO.caseExecSituation" label="执行情况" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="progressRateDTO.cases" label="用例数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="progressRateDTO.startDatePassRate" label="起始日期通过率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="progressRateDTO.endDatePassRate" label="结束日期通过率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="progressRateDTO.passRateChange" label="通过率变化情况" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="progressRateDTO.caseExecRate" label="用例执行率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="planCycle" label="计划周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="actualCycle" label="实际周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
        </el-pagination>
    </div>
</template>

<script>
import ctcUtils from '@/utils/ctc-utils.js'
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  name: 'objectSchedule',
  mixins: [projectView],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/participant/progress',
        getDataListIsPage: true,
        createdIsNeed: false
      },
      titleList: []
    }
  },
  methods: {
    doExportData () {
      let data = { ...this.dataForm }
      let url = '/ctc/visualization/report/participant/progress/export'
      ctcUtils.customExportGet(url, data)
    }
  }
}
</script>

<style scoped>

</style>
