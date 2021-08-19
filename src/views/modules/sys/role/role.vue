<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__role">
      <el-row>
        <el-col :span="12">
          <el-form :inline="true" :model="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
            <el-form-item label="角色名称">
              <el-input v-model="dataForm.name" placeholder="请输入角色名称" clearable></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" style="text-align:right">
          <el-button type="primary" size="small" @click="getDataList()">查询</el-button>
          <el-button size="small" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-col :span="24" style="padding-left:0px;text-align:right">
          <el-button v-if="$hasPermission('sys:role:save')" type="primary" size="small" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
          <el-button v-if="$hasPermission('sys:role:delete')" type="danger" size="small" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-col>
      </el-row>
      <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" ref="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="name" label="角色名称" header-align="left" align="left"></el-table-column>
        <el-table-column prop="code" label="角色类型" header-align="left" align="left">
          <template slot-scope="scope">
            {{ $getDictLabel('roleType', scope.row.code) }}
          </template>
        </el-table-column>
         <el-table-column prop="ifOpen" label="是否开放" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel('yesOrNo', scope.row.ifOpen) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" :label="$t('role.remark')" header-align="left" align="left"></el-table-column>
        <el-table-column prop="createDate" :label="$t('role.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="validIsShowButton('sys:role:update',scope.row)" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="validIsShowButton('sys:role:delete',scope.row)" type="text" size="small" @click="deleteHandle(scope.row.id,scope.row)">{{ $t('delete') }}</el-button>
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
import AddOrUpdate from './role-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/sys/role/page',
        getDataListIsPage: true,
        deleteURL: '/sys/role',
        deleteIsBatch: true
      },
      dataForm: {
        name: ''
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
    validIsShowButton (type, row) {
      let bool = true
      bool = this.$hasPermission(type)
      if (bool) {
        // 默认角色不允许删除
        let defaultRoleArr = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16']
        if (defaultRoleArr.includes(row.code)) {
          bool = true
        }
      }
      return bool
    }
  }
}
</script>
