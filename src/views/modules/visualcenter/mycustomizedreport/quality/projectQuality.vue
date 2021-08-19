<template>
    <div>
        <el-row>
            <el-col :span="12" class="split-line" style="text-align:left;">
                项目质量
            </el-col>
            <el-col :span="12" style="padding-left:0px;text-align:right;">
                <el-button type="blue" size="small" @click="doExportData">导出</el-button>
            </el-col>
        </el-row>
        <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @row-click="dataListClick" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="name" label="项目名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityDTO.cases" label="用例数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityDTO.casesPass" label="通过用例数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityDTO.casesNoPass" label="不通过用例数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityDTO.casePassRate" label="用例通过率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityDTO.execProgress" label="执行进度" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityDTO.execPassRate" label="执行通过率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityDTO.defects" label="缺陷数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualityDTO.defectsRepaired" label="待修复缺陷" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
        </el-pagination>
    </div>
</template>

<script>
import ctcUtils from '@/utils/ctc-utils.js'
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  name: 'projectQuality',
  mixins: [projectView],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/project/quality',
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
      let url = '/ctc/visualization/report/project/quality/export'
      ctcUtils.customExportGet(url, data)
    }
  }
}
</script>

<style scoped>

</style>
