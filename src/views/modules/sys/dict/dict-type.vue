<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" class="demo-form-inline">
          <el-form-item label="字典名称">
            <el-input v-model="dataForm.dictName" placeholder="请输入字典名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="字典类型">
            <el-input v-model="dataForm.dictType" placeholder="请输入字典类型" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button type="primary" size="small" @click="getDataList()">{{ $t('query') }}</el-button>
        <el-button size="small" @click="onReset">重置</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-bottom:20px;">
      <el-col :span="24" style="padding-left:0px;text-align:right;">
        <el-button v-if="$hasPermission('sys:dict:save')" type="primary" size="small" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        <el-button v-if="$hasPermission('sys:dict:delete')" type="danger" size="small" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
      </el-col>
    </el-row>
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="dictName" :label="$t('dict.dictName')" header-align="left" align="left"></el-table-column>
      <el-table-column prop="dictType" :label="$t('dict.dictType')" header-align="left" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="childHandle(scope.row)">{{ scope.row.dictType }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="sort" :label="$t('dict.sort')" sortable="custom" header-align="center" align="center"></el-table-column>
      <el-table-column prop="remark" :label="$t('dict.remark')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" :label="$t('dict.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button v-if="validIsShowButton('sys:dict:update',scope.row)" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
          <el-button v-if="validIsShowButton('sys:dict:delete',scope.row)" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './dict-type-add-or-update'
import { addDynamicRoute } from '@/router'
import { dictTypeValidData } from '@/utils/validate'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/dict/type/page',
        getDataListIsPage: true,
        deleteURL: '/sys/dict/type',
        deleteIsBatch: true
      },
      dataForm: {
        id: '0',
        dictName: '',
        dictType: ''
      }
    }
  },
  components: {
    AddOrUpdate
  },
  methods: {
    validIsShowButton (type, row) {
      let bool = true
      bool = this.$hasPermission(type)
      if (bool) {
        bool = dictTypeValidData(row.dictType)
      }
      return bool
    },
    // 子级
    childHandle (row) {
      // 路由参数
      const routeParams = {
        routeName: `${this.$route.name}__${row.id}`,
        title: `${this.$route.meta.title} - ${row.dictType}`,
        path: 'sys/dict/dict-data',
        params: {
          dictTypeId: row.id,
          dictType: row.dictType
        }
      }
      // 动态路由
      addDynamicRoute(routeParams, this.$router)
    },
    onReset () {
      this.dataForm.dictName = ''
      this.dataForm.dictType = ''
      this.getDataList()
    }
  }
}
</script>
