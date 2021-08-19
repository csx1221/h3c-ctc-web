<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__role">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.roleName" :placeholder="$t('role.name')" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-select v-model="dataForm.isPermission" :placeholder="$t('logOperation.status')" clearable>
            <el-option label="未配置" :value="0"></el-option>
            <el-option label="已配置" :value="1"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('subadmin:role:create')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('subadmin:role:delete')" type="danger" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
      v-if="$hasPermission('subadmin:role:list')"
        v-loading="dataListLoading"
        :data="dataList"
        border
        @selection-change="dataListSelectionChangeHandle"
        @sort-change="dataListSortChangeHandle"
        style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="roleName" :label="$t('role.name')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="roleCode" label="角色编码" header-align="center" align="center"></el-table-column>
        <el-table-column prop="isPermission" label="配置状态" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isPermission === 0" size="danger">未配置</el-tag>
            <el-tag v-else size="small">已配置</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comments" :label="$t('role.remark')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDt" :label="$t('role.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('subadmin:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('subadmin:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="limit"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="pageSizeChangeHandle"
        @current-change="pageCurrentChangeHandle">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
      <!-- <add-or-update v-if="addOrUpdateNoRole" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
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
        getDataListURL: '/ctc/subadmin/role/page',
        getDataListIsPage: true,
        deleteURL: '/ctc/subadmin/role',
        deleteIsBatch: true,
        deleteIsBatchKey: 'roleId'
      },
      dataForm: {
        roleName: '',
        isPermission: ''
      }
    }
  },
  created () {
    this.dataForm.applicationId = this.$route.params.applicationId || '0'
    this.getDataList()
  },
  components: {
    AddOrUpdate
  }
}
</script>
