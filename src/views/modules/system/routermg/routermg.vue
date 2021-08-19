<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__params">
      <el-row>
        <el-col :span="12">
          <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item prop="requestMethod" label="请求方式">
            <ctc-select v-model="dataForm.requestMethod" dict-type="requestWay" placeholder="请选择请求方式"></ctc-select>
          </el-form-item>
            <el-form-item label="创建时间：">
              <el-date-picker v-model="daterange" type="daterange" value-format="yyyy-MM-dd" :range-separator="$t('datePicker.range')" :start-placeholder="$t('datePicker.start')" :end-placeholder="$t('datePicker.end')">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
          <el-button size="small" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-col :span="12" class="split-line" style="text-align:left;">
          路由列表
        </el-col>
        <el-col :span="12" style="text-align:right;">
          <el-button type="primary" size="small" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
          <el-button type="danger" size="small" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-col>
      </el-row>
      <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="paramCode" :label="$t('params.paramCode')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="paramValue" :label="$t('params.paramValue')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="remark" :label="$t('params.remark')" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('sys:params:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('sys:params:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './routermg-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/servicebus/route/page',
        createdIsNeed: true,
        getDataListIsPage: true,
        deleteURL: '/ctc/servicebus/route',
        deleteIsBatch: true
      },
      daterange: null,
      dataForm: {
        requestMethod: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  watch: {
    daterange (val) {
      this.dataForm.startTime = val[0]
      this.dataForm.endTime = val[1]
    }
  },
  methods: {
    onReset () {
      this.dataForm.paramCode = ''
      this.daterange = ''
      this.getDataList()
    }
  },
  components: {
    AddOrUpdate
  }
}
</script>
