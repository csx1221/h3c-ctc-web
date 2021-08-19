<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__log-error">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" :model="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
            <el-form-item label="模块名称：">
              <el-input v-model="dataForm.module" placeholder="请输入模块名称" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" style="text-align:right">
          <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
          <el-button size="small" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-col :span="12" class="split-line" style="text-align:left;">
          异常日志列表
        </el-col>
        <el-col :span="12" style="text-align:right;">
          <el-button type="warning" size="small" @click="exportHandle()">{{ $t('export') }}</el-button>
        </el-col>
      </el-row>
      <el-table stripe v-loading="dataListLoading" :data="dataList" border @sort-change="dataListSortChangeHandle" style="width: 100%;">
        <el-table-column prop="module" :label="$t('logError.module')" header-align="left" align="left"></el-table-column>
        <el-table-column prop="requestUri" :label="$t('logError.requestUri')" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="requestMethod" :label="$t('logError.requestMethod')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="requestParams" :label="$t('logError.requestParams')" header-align="center" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ip" :label="$t('logError.ip')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="userAgent" :label="$t('logError.userAgent')" header-align="center" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" :label="$t('logError.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="infoHandle(scope.row.errorInfo)">{{ $t('logError.errorInfo') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/log/error/page',
        getDataListIsPage: true,
        exportURL: '/sys/log/error/export'
      },
      dataForm: {
        module: ''
      }
    }
  },
  methods: {
    // 异常信息
    infoHandle (info) {
      this.$alert(info, this.$t('logError.errorInfo'), {
        customClass: 'mod-sys__log-error-view-info'
      })
    },
    onReset () {
      this.dataForm.module = ''
      this.getDataList()
    }
  }
}
</script>

<style lang="scss">
.mod-sys__log-error {
  &-view-info {
    width: 80%;
  }
}
</style>
