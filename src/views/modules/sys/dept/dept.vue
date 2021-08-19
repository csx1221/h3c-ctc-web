<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-row>
      <el-col :span="10">
        <el-form :inline="true" :model="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
          <el-form-item label="部门名称">
            <el-input v-model="dataForm.name" placeholder="请输入部门名称"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="14" style="text-align:right">
        <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
        <el-button size="small" @click="onReset">重置</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-bottom:20px;">
      <el-col :span="12" class="split-line" style="text-align:left;">
        部门/地市列表
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <el-button type="primary" size="small" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        <el-button type="danger" size="small" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
      </el-col>
    </el-row>
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" ref="dataList" row-key="id" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="部门名称" header-align="left" align="left"></el-table-column>
      <el-table-column prop="organizeName" label="所属机构" header-align="left" align="left"></el-table-column>
      <el-table-column prop="userCount" label="用户数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button v-if="$hasPermission('sys:dept:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
          <el-button v-if="$hasPermission('sys:dept:delete')" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './dept-add-or-update-new'
export default {
  mixins: [mixinViewModule],
  name: 'DeptPage',
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/deptnew/page',
        getDataListIsPage: true,
        deleteURL: '/sys/deptnew',
        deleteIsBatch: true
      },
      dataForm: {
        name: '' // 部门名称
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    onReset () {
      this.dataForm.name = ''
      this.getDataList()
    },
    onSubmit () {
    }
  }
}
</script>
