<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__goods">
      <!-- There is el-form -->
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-position="right">
        <el-row>
          <el-col :span="4">
            <el-form-item label="项目名称">
              <el-input v-model="dataForm.parentName" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="子项目名称">
              <el-input v-model="dataForm.name" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="archived" label="项目归档">
              <ctc-select v-model="dataForm.archived" dict-type="project.archived" placeholder="项目归档状态"></ctc-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="项目经理">
              <ctc-project-user-table ref="childcom" v-model="dataForm.managerIds" placeholder="请选择项目经理"></ctc-project-user-table>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="子项目时间">
              <el-date-picker unlink-panels clearable value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期" @change="onDateTime" v-model="dateTimeArr" align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align:right;float:right;">
            <!-- br 是为了让表单底部对齐 -->
            <br />
            <el-button size="small" type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
            <el-button size="small" @click="resetSelectInfo()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <!-- there is el-table -->
      <el-table stripe highlight-current-row border max-height="660" v-loading="dataListLoading" :data="dataList" @selection-change="dataListSelectionChangeHandle">
        <el-table-column :render-header="resetTableHead" prop="name" label="子项目名称" header-align="left" align="left" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column width="140" :render-header="resetTableHead" prop="parentName" label="项目名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="projectStatus" label="子项目状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text">{{ $getDictLabel('project.projectStatus',scope.row.projectStatus) }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="项目归档" header-align="center" align="center" width="120">
          <template slot-scope="scope">
            {{ $getDictLabel('project.archived', scope.row.archived) }}
          </template>
        </el-table-column>
        <el-table-column prop="caseCount" label="用例数" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="passCaseCount" label="通过用例数" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="notPassCaseCount" label="不通过用例数" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="caseExecRate" label="用例执行率" header-align="center" align="center">
          <template slot-scope="scope">
            <p>{{ toPercent(scope.row.caseExecRate) }}</p>
          </template>
        </el-table-column>
        <el-table-column :render-header="resetTableHead" prop="finalCasepassRate" label="最终通过率" header-align="center" align="center">
          <template slot-scope="scope">
            <p>{{ toPercent(scope.row.finalCasepassRate) }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="defectCount" label="缺陷数" header-align="center" align="center"></el-table-column>
        <el-table-column :render-header="resetTableHead" prop="participantCount" label="参测对象(数量)" header-align="center" align="center"></el-table-column>
        <el-table-column width="160" prop="planPeriod" label="计划周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column width="160" prop="actualPeriod" label="实际周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="实际进度" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="childProjectViewHandle(scope.row.projectId, scope.row.name, scope.row.projectStatus, scope.row.parentId)">{{ toPercent(scope.row.actualSchedule) }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="省测概况" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" :disabled="scope.row.scope === 1 || scope.row.participantCount === 0 ? true : false" @click="childProvinceProgressHandle(scope.row.projectId, scope.row.name, scope.row.parentId)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="全量用例" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="quanlityExcle(scope.row.projectId, scope.row.parentId, scope.row.name)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <ActualProgress v-if="showChildProgress" ref="childProgressRef"></ActualProgress>
      <childProvinceProgress v-if="showChildProvince" ref="childProvinceRef"></childProvinceProgress>
    </div>
  </el-card>
</template>

<script>
import childProvinceProgress from '@/views/modules/visualcenter/acommonResource/echartComponent/provinceProgress'
import ActualProgress from '@/views/modules/visualcenter/acommonResource/echartComponent/actualProgressProject'
import CtcProjectUserTable from '@/views/modules/visualcenter/component/ctc-project-user-table'
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  mixins: [projectView],
  data () {
    return {
      managerList: '',
      underline: false,
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/projectSurvey/childList',
        getDataListIsPage: true,
        deleteURL: '/ctc/servicebus/routedic'
      },
      dataForm: {
        name: '',
        archived: '',
        type: null
      },
      dataListLoading: false, // 数据列表，loading状态
      dataList: [] // 获取分页列表的数据
    }
  },
  components: {
    CtcProjectUserTable,
    ActualProgress,
    childProvinceProgress
  },
  watch: {
    dateTimeArr: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (this.dateTimeArr === '' || this.dateTimeArr === null) {
          this.startTime = ''
          this.endTime = ''
        }
      }
    }
  },
  methods: {
    // 重置初始条件状态
    resetSelectInfo () {
      this.$refs.childcom.showUserName = ''
      this.dateTimeArr = ''
      this.startTime = ''
      this.endTime = ''
      this.dataForm.managerIds = ''
      this.managerList = ''
      this.dataForm.name = ''
      this.dataForm.parentName = ''
      this.dataForm.archived = ''
      this.getDataList()
    }
  }
}
</script>
<style lang="scss" scoped>
.table-head {
  font-size: 14px !important;
}
</style>
