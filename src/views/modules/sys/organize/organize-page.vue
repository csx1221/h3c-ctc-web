<template>
  <el-card shadow="never" class="aui-card--fill  member-group-mgr">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()" :inline="false" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item prop="name" label="机构名称">
            <el-input v-model="dataForm.name" placeholder="请输入机构名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="type" label="机构类型">
            <ctc-select v-model="dataForm.type" dict-type="organizeType" placeholder="请选择机构类型"></ctc-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
          <el-button size="small" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin-bottom:20px;">
      <el-col :span="12" class="split-line" style="text-align:left;">
        机构列表
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <el-button type="blue" size="small" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        <el-button type="danger" size="small" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
      </el-col>
    </el-row>
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" ref="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="机构名称" header-align="left" align="left" width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="abbreviatedName" label="机构简称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="type" label="机构类型" header-align="center" align="center">
        <template slot-scope="scope">
          {{ $getDictLabel('organizeType', scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column prop="regionName" label="所属区域" header-align="center" align="center"></el-table-column>
      <el-table-column prop="adminUserName" label="机构管理员" header-align="center" align="center"></el-table-column>
      <el-table-column prop="userCount" label="用户数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" width="160"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
    </el-pagination>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './organize-add-or-update'
export default {
  mixins: [mixinViewModule],
  name: 'OrganizePage',
  components: {
    AddOrUpdate
  },
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/organize/page',
        getDataListIsPage: true,
        deleteURL: '/sys/organize',
        deleteIsBatch: true
      },
      dataForm: {
        type: '', // 机构类型
        name: '' // 机构名称
      }
    }
  },
  computed: {

  },
  mounted () {
  },
  methods: {
    onReset () {
      this.$refs.dataForm.resetFields()
      this.getDataList()
    },
    onSubmit () {
    }
  }
}
</script>
<style lang="scss" scoped>
.member-group-mgr {
}
</style>
