<template>
  <el-row class="recycle-bin-page">
    <el-col :span="24">
      <el-card shadow="never" class="aui-card--fill project-task-mgr">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="80px">
          <el-row>
            <!-- <el-col :span="6">
              <el-form-item label="项目名称" prop="caseName">
                <el-input v-model="dataForm.caseName" placeholder="请输入用例名称" clearable></el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item label="所属构件" prop="builderName">
                <el-input v-model="dataForm.builderName" placeholder="请输入构件名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="platform" label="来源平台">
                <el-select v-model="dataForm.platform" defaultValue="lucy" clearable filterable placeholder="请选择来源平台" value-key="moduleId" @change="chooseModule">
                  <!-- 联调:1;用户模拟：2 -->
                  <el-option key="1" label="接口联调" value="1">接口联调</el-option>
                  <el-option key="2" label="用户模拟" value="2">用户模拟</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" align="right">
              <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
              <el-button type="primary" size="small" @click="getLogs()">查询</el-button>
              <el-button size="small" @click="resetProjectCase()">重置</el-button>
            </el-col>
          </el-row>
          <el-row v-if="isOpen">
            <el-col :span="6">
              <el-form-item prop="createDate" label="执行时间">
                <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill  project-mgr-page">
        <el-table stripe highlight-current-row :data="caseTableData" ref="caseTableData" border height="680" style="width:100%;;overflow-y:auto;">
          <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
          <!-- <el-table-column prop="caseName" label="所属项目" header-align="left" align="left" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" size="small">{{scope.row.caseName}}</el-button>
            </template>
          </el-table-column> -->
          <el-table-column prop="builderName" label="所属构件" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="builderCaseId" label="用例ID" header-align="center" align="center">
            <template slot-scope="scope">
              {{ $getDictLabel('builderCaseId', scope.row.builderCaseId) }}
            </template>
          </el-table-column>
          <el-table-column prop="batch" label="批次" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ $getDictLabel('batch', scope.row.batch) }}
            </template>
          </el-table-column>
          <el-table-column prop="platform" label="来源平台" header-align="center" align="center" show-overflow-tooltip>
            <!-- 联调:1;用户模拟：2 -->
            <template slot-scope="scope">
              {{ $getDictLabel('platform', scope.row.platform) }}
            </template>
          </el-table-column>
          <el-table-column prop="caseName" label="用例名称" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ $getDictLabel('caseName', scope.row.caseName) }}
            </template>
          </el-table-column>
          <el-table-column prop="execResult" label="执行结果" header-align="center" align="center">
            <!-- execResult  0: 正在执行  1: 成功  2: 失败 -->
            <template slot-scope="scope">
              {{ scope.row.execResult == 0 ? '正在执行' : scope.row.execResult == 1 ? '成功' : scope.row.execResult == 2 ? '失败' : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="execInfo" label="执行信息" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="execTime" label="执行时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination :current-page="dataForm.page" :page-sizes="[10, 20, 50]" :page-size="dataForm.limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
        </el-pagination>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'RecycleBinMgr',
  components: {
  },
  data () {
    return {
      dataForm: {
        createDate: '',
        builderName: '',
        platform: '',
        page: 1,
        limit: 10
      },
      isOpen: false,
      total: 0,
      caseTableData: []
    }
  },
  computed: {},
  mounted () {
    this.getLogs()
  },
  methods: {
    chooseModule () {

    },
    resetProjectCase () {
      this.$refs.dataForm.resetFields()
      this.getLogs()
    },
    pageSizeChangeHandle (val) {
      this.dataForm.limit = val
      this.getLogs()
    },
    pageCurrentChangeHandle (val) {
      this.dataForm.page = val
      this.getLogs()
    },
    getLogs () {
      let params = { ...this.dataForm }
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.startTime = params.createDate[0]
        params.endTime = params.createDate[1]
        delete params['createDate']
      }
      this.$http.get('integration/buildercaseexec/page/list', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.caseTableData = res.data.list
          this.total = res.data.totalCount
        }
      }).catch(() => {
      })
    }
  }
}
</script>
<style lang="scss">
.recycle-bin-page {
  .el-form-item__content .el-date-editor {
    width: 240px;
  }
}
</style>
