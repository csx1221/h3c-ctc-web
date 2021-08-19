<template>
  <el-card shadow="never" class="aui-card--fill" >
    <div class="mod-demo__goods">
      <!-- 这是表单 -->
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-position="right">
        <el-form-item label="">
          <el-input v-model="dataForm.bizName" placeholder="名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="dataForm.bizValue" placeholder="值" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('servicebus:roledic:list')" @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('servicebus:roledic:create')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
      </el-form>
      <!-- 这是数据列表 -->
      <el-table v-if="$hasPermission('servicebus:roledic:list')" v-loading="dataListLoading" :data="dataList" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="bizName" label="名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="bizValue" label="值" header-align="center" align="center"></el-table-column>
        <el-table-column prop="createDt" label="创建时间" header-align="center" align="center"></el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('servicebus:roledic:list')" type="text" size="small" @click="roledicDetailList(scope.row.pid)">查看详情</el-button>
            <el-button v-if="$hasPermission('servicebus:roledic:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.pid)">修改</el-button>
            <el-button v-if="$hasPermission('servicebus:roledic:delete')" type="text" size="small" @click="deleteRow(scope.row.pid)">删除</el-button>
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
      <!-- 查看详情字典的弹窗 -->
      <ShowDetail v-if="showRoledicDetail" ref="roledicDetail" @refreshDataList="getDataList"></ShowDetail>
      <!-- 这是新增、修改的弹窗 -->
      <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>
    </div>
  </el-card>
</template>
<script>
import ShowDetail from './subroledicDetail'
import mixinViewModule from './routermg/view-router'
import AddOrUpdate from './subroledic-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      underline: false,
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/servicebus/routedic/page',
        getDataListIsPage: true,
        deleteURL: '/ctc/servicebus/routedic'
      },
      dataForm: {
        name: '',
        type: null
      },
      dataListLoading: false, // 数据列表，loading状态
      dataList: [] // 获取分页列表的数据
    }
  },
  computed: {
  },
  components: {
    AddOrUpdate,
    ShowDetail
  },
  created () {
  },
  mounted () {
  },
  methods: {
    deleteRow (id) {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        id = id + ''
        this.$http.delete(`/ctc/servicebus/routedic`, { 'data': [id] }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          this.$message({
            message: this.$t('prompt.success'),
            type: 'success',
            duration: 500,
            onClose: () => {
              this.query()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    }
  }
}
</script>
<style scoped lang="scss">

</style>
