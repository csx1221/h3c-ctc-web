<template>
  <el-card shadow="never" class="aui-card--fill  business-integration-page">
    <el-form :model="dataForm" ref="dataForm" :inline="false" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item prop="defectStatus" label="缺陷状态">
            <ctc-select v-model="dataForm.defectStatus" dict-type="defectStatus" placeholder="请选择缺陷状态"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align:right;">
          <el-button type="primary" size="small" @click="loadBusinessData()">查询</el-button>
          <el-button size="small" @click="doResetBusinessData()">重置</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-col :span="24" class="split-line" style="text-align:left;">
          业务列表
        </el-col>
      </el-row>
      <el-tabs v-model="tabActiveName" @tab-click="handleClick">
        <el-tab-pane label="待测试" name="1"></el-tab-pane>
        <el-tab-pane label="已归档" name="2"></el-tab-pane>
      </el-tabs>
      <el-table stripe highlight-current-row :data="dataList" ref="dataList" border style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" label="业务名称" header-align="left" align="left" width="200" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="operationType" label="操作类型" header-align="center" align="center" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="medium" :class="getClassName()">{{scope.row.operationType==11?'新 增':'修 改'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="parentProjectName" label="需求文件" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="medium" class="btn-underline btn-red" @click="downLoadFileData(1,scope.row)">下 载</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="前序测试结果" header-align="center" align="center" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="medium" class="btn-underline btn-red" @click="downLoadFileData(1,scope.row)">下 载</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="参测省" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="defectStatus" label="已上线省份" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mktTestExpectFinishTim" label="期望时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="repairDate" label="创建时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="closeDate" label="更新时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rejectCount" label="需求提出人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rejectCount" label="更新记录" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="medium" class="btn-underline btn-red" @click="doUpdateDefect(scope.row)">查 看</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="rejectCount" label="是否接收" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rejectCount" label="查看记录" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="medium" class="btn-underline btn-red" @click="doUpdateDefect(scope.row)">查 看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" header-align="center" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="doUpdateDefect(scope.row)">归 档</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="dataForm.page" :page-sizes="[10, 20, 50]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </el-form>
  </el-card>
</template>
<script>
export default {
  name: 'BusinessIntegrationPage',
  components: {
  },
  data () {
    return {
      dataForm: {
      },
      total: 0,
      dataList: [],
      tabActiveName: '1',
      // 用户操作状态标识
      userOperateStatusMap: {}
    }
  },
  computed: {},
  created () {
  },
  mounted () {
    this.loadBusinessData()
  },
  activated () {
  },
  methods: {
    triggerParentProject (message) {
      this.loadBusinessData()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getBusinessData()
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.loadBusinessData()
    },
    doResetBusinessData () {
      this.$refs.dataForm.resetFields()
      this.loadBusinessData()
    },
    loadBusinessData () {
      this.dataForm.page = 1
      this.getBusinessData()
    },
    getBusinessData () {
      // let params = Object.assign({}, this.dataForm)
      this.dataList = [{ 'name': '1111111111', 'operationType': 11 }]
      this.total = 1
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    getClassName () {
      return 'btn-red'
    },
    downLoadFileData (type, row) {
    }
  }
}
</script>
<style  lang="scss">
.business-integration-page {
  .btn-underline {
    text-decoration: underline;
  }
  .btn-red {
    color: #f50b0b;
  }
  .btn-blue {
    color: #0667e4;
  }
  .btn-black {
    color: #141415;
  }
}
</style>
