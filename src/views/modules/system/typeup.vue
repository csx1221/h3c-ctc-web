<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-sys__params">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.bizName" placeholder="类型名称" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('subadmin:permissiondic:create')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('subadmin:permissiondic:delete')" type="danger" @click="deleteToHandle()">{{ $t('deleteBatch') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="bizName" label="类型名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="bizValue" label="类型值" header-align="center" align="center"></el-table-column>
        <el-table-column prop="orderNumber" label="排序" header-align="center" align="center"></el-table-column>
        <el-table-column prop="comments" label="备注" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDt" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('subadmin:permissiondic:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.pid)">{{ $t('update') }}</el-button>
            <el-button v-if="$hasPermission('subadmin:permissiondic:delete')" type="text" size="small" @click="deleteHandle(scope.row.pid)">{{ $t('delete') }}</el-button>
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
    </div>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './typeup-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false,
        getDataListURL: '/ctc/subadmin/permissiondic/authtypes',
        getDataListIsPage: true,
        deleteURL: '/ctc/subadmin/permissiondic/authtypes',
        deleteIsBatch: true
      },
      dataForm: {
        id: '',
        bizName: ''
      }
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
        this.$refs.addOrUpdate.dataForm.applicationId = this.dataForm.applicationId
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
