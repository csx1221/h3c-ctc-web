<template>
    <div>
        <div>
            <el-row>
                <el-col :span="12" class="split-line" style="text-align:left;">
                    项目数统计
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-table stripe highlight-current-row v-loading="dataListLoading1" :data="projectList" border @row-click="dataListClick" style="width: 100%;">
                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                        <el-table-column prop="testTime" label="测试年月" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="testingProject" label="在测项目" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="testACProject" label="实测项目" header-align="center" align="center" show-overflow-tooltip></el-table-column>
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
                <el-table-column prop="testTime" label="年月" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="project" label="项目名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="cases" label="当前用例数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="excCases" label="月执行次数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="pass" label="月通过率" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="newDefects" label="月新增缺陷数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="defects" label="全部缺陷数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="repairedDefects" label="待修改缺陷数" header-align="center" align="center" show-overflow-tooltip></el-table-column>
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
  name: 'projectNumber',
  mixins: [projectView],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/testingProjectsInfo',
        getDataListIsPage: true,
        createdIsNeed: false
      },
      titleList: [],
      projectNumberUrl: '/ctc/visualization/report/testingProjects',
      dataListLoading1: false,
      projectList: []
    }
  },
  props: {
    dataForms: Object
  },
  mounted () {
    this.getProjectNumberData()
  },
  methods: {
    getProjectNumberData () {
      let thisvm = this
      thisvm.dataListLoading1 = true
      thisvm.$http.get(
        thisvm.projectNumberUrl,
        {
          params: {
            startTime: thisvm.dataForms.startDate || new Date().getFullYear() + '-01-01',
            endTime: thisvm.dataForms.endDate || new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate()),
            labelId: thisvm.dataForms.labelId,
            projectName: thisvm.dataForms.projectName
          }
        }
      ).then(({ data: res }) => {
        thisvm.dataListLoading1 = false
        if (res.code !== 0) {
          this.stageDataList = []
          this.total = 0
          return this.$message.error(res.msg)
        }
        thisvm.projectList = res.data
        let obj = {}
        obj.dateDim = []
        obj.projectData = []
        obj.taskData = []
        for (let i = 0; i < res.data.length; i++) {
          obj.dateDim.push(res.data[i].testTime)
          obj.projectData.push(res.data[i].testingProject)
          obj.taskData.push(res.data[i].testACProject)
        }
        thisvm.loadProjectNumberGraph(obj)
      }).catch(() => {
        thisvm.dataListLoading1 = false
      })
    },
    // 行点击
    dataListClick (row, column, event) {
      this.dataForm.Ids = row.testProjectID.join(',')
      this.dataForm.startTime = row.testTime
      this.getDataList()
    },
    loadProjectNumberGraph (data) {
      let projectNumber = echarts.init(document.getElementById('projectNumber'))
      projectNumber.clear()
      projectNumber.setOption(this.getOption(data))
    },
    getOption (data) {
      let option = {
        tooltip: {
          show: true
        },
        legend: {
          icon: 'circle',
          data: ['在测项目数', '实测项目数'],
          left: 'right',
          top: '5%',
          textStyle: {
            color: 'fff'
          },
          itemWidth: 10,
          itemHeight: 10
        },
        grid: {
          left: '5%',
          right: '2%',
          bottom: '10%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.dateDim,
          axisLine: {
            lineStyle: {
              color: '#2dd8ff'
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#909399'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '数量(个)',
          axisLine: {
            lineStyle: {
              color: '#2dd8ff'
            }
          },
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        series: [{
          name: '在测项目数',
          type: 'line',
          data: data.projectData,
          color: '#7DA6FF',
          lineStyle: {
            normal: {
              width: 1.5
            }
          },
          symbolSize: 6,
          smooth: true
        },
        {
          name: '实测项目数',
          type: 'line',
          color: '#9470E8',
          data: data.taskData,
          lineStyle: {
            normal: {
              width: 1.5
            }
          },
          symbolSize: 6,
          smooth: true
        }]
      }
      return option
    },
    doExportData () {
      let data = { ...this.dataForm }
      let url = '/ctc/visualization/report/testingProjectsInfo/export'
      ctcUtils.customExportGet(url, data)
    }
  }
}
</script>

<style scoped>

</style>
