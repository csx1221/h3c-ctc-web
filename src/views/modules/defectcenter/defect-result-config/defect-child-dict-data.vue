<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-row style="margin-bottom:20px;">
      <el-col :span="24" style="padding-left:0px;text-align:right;">
        <el-button type="primary" size="small" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        <el-button type="danger" size="small" @click="deleteHandle()">{{ $t('deleteBatch') }}</el-button>
      </el-col>
    </el-row>
    <el-table stripe highlight-current-row :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="dictType" label="字典类型" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dictValue" label="问题类型编码" header-align="center" align="center"></el-table-column>
      <el-table-column prop="dictLabel" label="问题类型名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="sort" :label="$t('dict.sort')" sortable="custom" header-align="center" align="center"></el-table-column>
      <el-table-column prop="remark" :label="$t('dict.remark')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" :label="$t('dict.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t('update') }}</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t('delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import AddOrUpdate from './defect-child-dict-data-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false,
        getDataListURL: '/ctc/defect/defectConfInfo/getDefectConfInfo',
        getDataListIsPage: false,
        deleteURL: '/ctc/defect/defectConfInfo/deleteDefectConfInfo',
        deleteIsBatch: true
      },
      dataForm: {
        isAutoFill: false,
        projectId: '',
        dictType: '',
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
    this.dataForm.projectId = this.$route.params.projectId || ''
    this.dataForm.dictType = this.$route.params.dictType || ''
    this.dictType = this.$route.params.dictType || ''
    this.getDataList()
  },
  methods: {
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id || ''
        this.$refs.addOrUpdate.dataForm.projectId = this.dataForm.projectId
        this.$refs.addOrUpdate.dataForm.dictType = this.dataForm.dictType
        this.$refs.addOrUpdate.dataList = this.dataList
        this.$refs.addOrUpdate.init()
      })
    }
  }
}
</script>
