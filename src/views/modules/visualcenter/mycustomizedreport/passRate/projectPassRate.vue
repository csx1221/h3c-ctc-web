<template>
    <div>
        <el-row>
            <el-col :span="12" class="split-line" style="text-align:left;">
                项目通过率
            </el-col>
            <el-col :span="12" style="padding-left:0px;text-align:right;">
                <el-button type="blue" size="small" @click="doExportData">导出</el-button>
            </el-col>
        </el-row>
        <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @row-click="dataListClick" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="项目名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="passRateDTO.startDatePassRate" label="起始日期通过率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="passRateDTO.endDatePassRate" label="结束日期通过率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="passRateDTO.passRateChange" label="通过率变化情况" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="passRateDTO.iniPassRate" label="初始通过率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="passRateDTO.finalPassRate" label="最终通过率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="passRateDTO.avgPassRate" label="平均通过率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="passRateDTO.caseExecPassRate" label="用例执行通过率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
        </el-pagination>
    </div>
</template>

<script>
import ctcUtils from '@/utils/ctc-utils.js'
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  name: 'passRate',
  mixins: [projectView],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/project/pass',
        getDataListIsPage: true
      },
      titleList: [],
      dataForm: this.dataForms
    }
  },
  props: {
    dataForms: Object
  },
  methods: {
    // 行点击
    dataListClick (row, column, event) {
      this.$emit('doSomeThing', row)
    },
    doExportData () {
      let data = { ...this.dataForm }
      let url = '/ctc/visualization/report/project/pass/export'
      ctcUtils.customExportGet(url, data)
    }
  }
}
</script>

<style scoped>

</style>
