<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__news">
      <el-row>
        <el-col :span="20">
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item label="标题名称">
              <el-input v-model="dataForm.title" placeholder="请输入标题" clearable></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker v-model="daterange" type="daterange" value-format="yyyy-MM-dd" :range-separator="$t('datePicker.range')" :start-placeholder="$t('datePicker.start')" :end-placeholder="$t('datePicker.end')">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4" style="text-align:right">
          <el-button type="primary" size="small" @click="getDataList()">{{ $t('query') }}</el-button>
          <el-button size="small" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-col :span="12" class="split-line" style="text-align:left;">
          消息列表
        </el-col>
        <el-col :span="12" style="text-align:right;">
          <el-button type="primary" size="small" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
          <el-button type="danger" size="small" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-col>
      </el-row>
      <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="title" :label="$t('news.title')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="pubDate" :label="$t('news.pubDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column prop="createDate" :label="$t('news.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './news-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/news/page',
        getDataListIsPage: true,
        deleteURL: '/sys/news',
        deleteIsBatch: true
      },
      daterange: null,
      dataForm: {
        title: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  watch: {
    daterange (val) {
      this.dataForm.startDate = val[0]
      this.dataForm.endDate = val[1]
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    onReset () {
      this.dataForm.title = ''
      this.daterange = ''
      this.getDataList()
    }
  }
}
</script>
