<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__user">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-if="$hasPermission('subadmin:applicationAdmin:list')" v-model="dataForm.username" placeholder="用户账号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-if="$hasPermission('subadmin:applicationAdmin:list')" v-model="dataForm.realName" placeholder="用户姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('subadmin:applicationAdmin:list')" @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('subadmin:applicationAdmin:create')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('subadmin:applicationAdmin:delete')" type="danger" @click="deleteToHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="sysUser.username" label="用户账号" sortable="custom" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sysUser.realName" label="用户姓名" sortable="custom" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sysUser.deptName" :label="$t('user.deptName')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="sysUser.email" :label="$t('user.email')" header-align="center" align="center" v-if="audit4ASw==0"></el-table-column>
        <el-table-column prop="sysUser.mobile" :label="$t('user.mobile')" sortable="custom" header-align="center" align="center" v-if="audit4ASw==0"></el-table-column>
        <el-table-column prop="sysUser.gender" :label="$t('user.gender')" sortable="custom" header-align="center" align="center">
          <template slot-scope="scope">
            {{ $getDictLabel("gender", scope.row.sysUser && scope.row.sysUser.gender) }}
          </template>
        </el-table-column>
        <el-table-column prop="sysUser.status" :label="$t('user.status')" sortable="custom" header-align="center" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t('user.status0') }}</el-tag>
            <el-tag v-else size="small" type="success">{{ $t('user.status1') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createDt" :label="$t('user.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('subadmin:applicationAdmin:delete')" type="text" size="small" @click="deleteHandle(scope.row.pid)">{{ $t('delete') }}</el-button>
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
import Cookies from 'js-cookie'
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './user-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false,
        getDataListURL: '/ctc/subadmin/applicationadmin/page',
        getDataListIsPage: true,
        deleteURL: '/ctc/subadmin/applicationadmin',
        deleteIsBatch: true
      },
      dataForm: {
        username: '',
        realName: '',
        deptId: '',
        gender: ''
      },
      audit4ASw: Cookies.get('audit4ASw') // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.dataForm.applicationId = this.$route.params.applicationId || '0'
    this.getDataList()
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.dataForm.dictTypeId = this.dataForm.dictTypeId
        this.$refs.addOrUpdate.init()
      })
    },
    deleteToHandle () {
      for (let index = 0; index < this.dataListSelections.length; index++) {
        this.dataListSelections[index].id = this.dataListSelections[index].pid
      }
      this.deleteHandle()
    }
  }
}
</script>
