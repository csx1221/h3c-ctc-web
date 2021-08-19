<template>
    <div>
        <el-row>
            <el-col :span="12" class="split-line" style="text-align:left;">
                工作量
            </el-col>
        </el-row>
        <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
            <el-table-column type="index" label="排名" width="50" align="center"></el-table-column>
            <el-table-column prop="organize" label="所属机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="testPerson" label="测试人员" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="excCases" label="执行用例数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="findBugs" label="发现BUG数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="seriousBugs" label="严重BUG数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="工作详情" header-align="center" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button type="text" @click="downdetail(scope.row)">下载详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
        </el-pagination>
    </div>
</template>

<script>
import ctcUtils from '@/utils/ctc-utils.js'
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  name: 'workload',
  mixins: [projectView],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/workLoadList',
        getDataListIsPage: true
      },
      titleList: [],
      dataForm: this.dataForms
    }
  },
  props: {
    dataForms: Object
  },
  watch: {
    dataForms: {
      deep: true,
      handler: function (newVal, oldVal) {
        this.dataForm.startTime = newVal.startDate
        this.dataForm.endTime = newVal.endDate
        delete this.dataForm.startDate
        delete this.dataForm.endDate
      }
    }
  },
  methods: {
    downdetail (rows) {
      let data = {
        caseId: rows.caseIds.join(','),
        userId: rows.id,
        realName: rows.testPerson
      }
      let url = '/ctc/visualization/report/workLoadList/export'
      ctcUtils.customExportGet(url, data)
    }
  }
}
</script>

<style scoped>

</style>
