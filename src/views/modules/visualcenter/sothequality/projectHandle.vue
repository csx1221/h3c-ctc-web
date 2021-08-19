<template>
  <el-dialog :visible.sync="visible" title="项目详情" width="88%" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table max-height="500" :header-cell-style="getRowClass" v-loading="dataListLoading" :data="dataList" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
      <el-table-column label="序号" width="55" type="index" header-align="center" align="center"></el-table-column>
      <el-table-column width="140" prop="organizeName" label="省份/机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column width="160" prop="projectName" label="项目名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="projectStatus" label="状态" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button type="text" >{{ $getDictLabel('project.projectStatus',scope.row.projectStatus) }}</el-button>
        </template>
      </el-table-column>
      <el-table-column :render-header="resetTableHead" prop="passRank" label="通过率排名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="caseCounts" label="用例数" header-align="center" align="center"></el-table-column>
      <el-table-column :render-header="resetTableHead" prop="passCaseCounts" label="通过用例数" header-align="center" align="center"></el-table-column>
      <el-table-column :render-header="resetTableHead" prop="failCaseCounts" label="不通过用例数" header-align="center" align="center"></el-table-column>
      <el-table-column :render-header="resetTableHead" prop="initPassRate" label="初始通过率" header-align="center" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.initPassRate }}</p>
        </template>
      </el-table-column>
      <el-table-column :render-header="resetTableHead" prop="casePassRate" label="当前通过率" header-align="center" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.casePassRate }}</p>
        </template>
      </el-table-column>
      <el-table-column width="120" prop="caseExecRate" label="执行进度" header-align="center" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.caseExecRate }}</p>
        </template>
      </el-table-column>
      <el-table-column :render-header="resetTableHead" prop="caseExecPassRate" label="执行通过率" header-align="center" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.caseExecPassRate }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="caseDefectCounts" label="缺陷数" header-align="center" align="center"></el-table-column>
      <el-table-column :render-header="resetTableHead" prop="caseRepairedCounts" label="待修复缺陷" header-align="center" align="center"></el-table-column>
      <el-table-column width="160" fixed="right" :render-header="resetTableHead" prop="palnCycle" label="计划周期" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <p>{{scope.row.palnCycle || '暂无'}}</p>
        </template>
      </el-table-column>
      <el-table-column width="160" fixed="right" :render-header="resetTableHead" prop="actCycle" label="实际周期" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <p>{{scope.row.actEndDate || '暂无'}}</p>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="limit"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle">
    </el-pagination>
    <template slot="footer">
      <el-button type="primary" icon="el-icon-refresh" circle @click="pageCurrentChangeHandle(page)"></el-button>
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  mixins: [projectView],
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false,
        activatedIsNeed: false,
        getDataListURL: '/ctc/visualization/network/projectDwon',
        getDataListIsPage: true
      },
      dataForm: {
        name: '',
        type: null
      },
      visible: false,
      dataList: [], // 数据列表
      dataListLoading: false // 数据列表，loading状态
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        if (this.dataForm.organizeId) {
          this.getDataList()
        }
      })
    }
  }
}
</script>
