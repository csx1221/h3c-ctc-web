<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-row>
      <el-col :span="20">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" class="demo-form-inline">
          <el-form-item label="字典值">
            <el-input v-model="dataForm.dictValue" placeholder="请输入字典值" clearable></el-input>
          </el-form-item>
          <el-form-item label="字典标签">
            <el-input v-model="dataForm.dictLabel" placeholder="请输入字典标签" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4" style="text-align:right">
        <el-button type="primary" @click="getDataList()">{{ $t('query') }}</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-bottom:20px;">
      <el-col :span="24" style="padding-left:0px;">
        <el-button v-if="validIsShowButton('sys:dict:save',{})" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        <el-button v-if="validIsShowButton('sys:dict:delete',{})" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
      </el-col>
    </el-row>
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="dictValue" :label="$t('dict.dictValue')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dictLabel" :label="$t('dict.dictLabel')" header-align="center" align="center"></el-table-column>
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
import AddOrUpdate from './dict-data-add-or-update'
import { dictValidData } from '@/utils/validate'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false,
        getDataListURL: '/sys/dict/data/page',
        getDataListIsPage: true,
        deleteURL: '/sys/dict/data',
        deleteIsBatch: true
      },
      dataForm: {
        dictTypeId: '0',
        dictLabel: '',
        dictValue: ''
      },
      dictType: ''
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.dataForm.dictTypeId = this.$route.params.dictTypeId || '0'
    this.dictType = this.$route.params.dictType || ''
    this.getDataList()
  },
  methods: {
    validIsShowButton (type, row) {
      let bool = true
      bool = this.$hasPermission(type)
      if (bool) {
        bool = dictValidData(this.dictType)
      }
      return bool
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.dataForm.dictTypeId = this.dataForm.dictTypeId
        this.$refs.addOrUpdate.init()
      })
    },
    onReset () {
      this.dataForm.dictValue = ''
      this.dataForm.dictLabel = ''
      this.getDataList()
    }
  }
}
</script>
