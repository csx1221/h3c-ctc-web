<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__menu">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button v-if="$hasPermission('subadmin:permission:create')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-if="$hasPermission('subadmin:permission:list')" v-loading="dataListLoading" :data="dataList" row-key="id" border style="width: 100%;">
        <el-table-column prop="name" :label="$t('menu.name')" header-align="center" min-width="150"></el-table-column>
        <el-table-column prop="authIcon" :label="$t('menu.icon')" header-align="center" align="center">
          <template slot-scope="scope">
            <svg class="icon-svg" aria-hidden="true"><use :xlink:href="`#${scope.row.authIcon}`"></use></svg>
          </template>
        </el-table-column>
        <el-table-column prop="ptype" :label="$t('menu.type')" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag size="small">{{ scope.row.bizName }}</el-tag>
            <!-- <el-tag v-else size="small" type="info">{{ $t('menu.type1') }}</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="orderNumber" :label="$t('menu.sort')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="permissionValue" :label="$t('menu.url')" header-align="center" align="center" width="150" :show-overflow-tooltip="true" ></el-table-column>
        <el-table-column prop="authMark" :label="$t('menu.permissions')" header-align="center" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column  :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('subadmin:permission:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('subadmin:permission:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './permissions-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: `/ctc/subadmin/permission/auths/${this.$route.params.applicationId}`,
        deleteURL: `/ctc/subadmin/permission/auth`
      }
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.dataForm.applicationId = this.$route.params.applicationId || '0'
    this.getDataList()
  }
}
</script>
