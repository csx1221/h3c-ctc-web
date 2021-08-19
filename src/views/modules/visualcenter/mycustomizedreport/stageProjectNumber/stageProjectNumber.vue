<template>
    <div>
        <div>
            <el-row>
                <el-col :span="12" class="split-line" style="text-align:left;">
                    阶段项目数
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-table stripe highlight-current-row v-loading="dataListLoading1" :data="stageDataList" border @row-click="dataListClick" style="width: 100%;">
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="stage" label="测试阶段" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="stages" label="个数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="16" style="height:250px" id="projectNumber"></el-col>
            </el-row>
        </div>
        <div style="margin-top:20px" v-if="dataList.length>0">
            <el-row>
                <el-col :span="12" class="split-line" style="text-align:left;">
                    项目明细
                </el-col>
                <el-col :span="12" style="padding-left:0px;text-align:right;">
                    <el-button type="blue" size="small" @click="doExportData">导出</el-button>
                </el-col>
            </el-row>
            <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="stage" label="阶段名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="project" label="项目名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="stagePlanCycle" label="阶段计划周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="stageActualCycle" label="阶段实际周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="planCycle" label="项目计划周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="actualCycle" label="项目实际周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            </el-table>
            <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import ctcUtils from '@/utils/ctc-utils.js'
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
// import qs from 'qs'
const echarts = require('echarts')
export default {
  name: 'stageProjectNumber',
  mixins: [projectView],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/stageProjectsInfo',
        getDataListIsPage: true,
        createdIsNeed: false
      },
      titleList: [],
      projectNumberUrl: '/ctc/visualization/report/stageProjects',
      dataListLoading1: false,
      stageDataList: []
    }
  },
  props: {
    dataForms: Object
  },
  mounted () {
    this.getProjectNumberData()
    window.onresize = echarts.init(document.getElementById('projectNumber')).resize
  },
  methods: {
    getProjectNumberData () {
      this.dataListLoading1 = true
      this.$http.get(
        this.projectNumberUrl,
        {
          params: {
            startTime: this.dataForms.startDate,
            endTime: this.dataForms.endDate,
            labelId: this.dataForms.labelId,
            projectName: this.dataForms.projectName
          }
        }
      ).then(({ data: res }) => {
        this.dataListLoading1 = false
        if (res.code !== 0) {
          this.stageDataList = []
          this.total = 0
          return this.$message.error(res.msg)
        }
        this.stageDataList = res.data
        this.loadProjectNumberGraph(res.data)
      }).catch(() => {
        this.dataListLoading1 = false
      })
    },
    // 行点击
    dataListClick (row, column, event) {
      this.dataForm.id = row.id
      this.dataForm.Ids = row.projectID.join(',')
      this.dataForm.stage = row.stage
      this.dataForm.startTime = this.dataForms.startDate
      this.dataForm.endTime = this.dataForms.endDate
      // this.dataForm = qs.stringify(this.dataForm, { arrayFormat: 'repeat' })
      this.getDataList()
    },
    loadProjectNumberGraph (data) {
      let projectNumber = echarts.init(document.getElementById('projectNumber'))
      projectNumber.clear()
      let node = {}
      node.stage = []
      node.data = []
      for (let i = 0; i < data.length; i++) {
        node.stage.push(data[i].stage)
        let childrenNode = {}
        childrenNode.name = data[i].stage
        childrenNode.value = data[i].stages
        node.data.push(childrenNode)
      }
      projectNumber.setOption(this.getOption(node))
    },
    getOption (data) {
      let option = {
        // title: {
        //   text: '同名数量统计',
        //   subtext: '纯属虚构',
        //   left: 'center'
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data.stage
        },
        series: [
          {
            name: '阶段',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: data.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      return option
    },
    doExportData () {
      let data = { ...this.dataForm }
      let url = '/ctc/visualization/report/stageProjectsInfo/export'
      ctcUtils.customExportGet(url, data)
    }
  }
}
</script>

<style scoped>

</style>
