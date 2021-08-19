<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__goods">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-position="right">
      <el-form-item label="应用系统:">
          <el-select v-model="dataForm.applicationId" clearable filterable placeholder="请选择应用">
            <el-option
              v-for="item in selectOptons"
              :key="item.applicationId"
              :label="item.name"
              :value="item.applicationId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型:">
          <el-select v-model="dataForm.type" clearable placeholder="请选择类型">
              <el-option
                v-for="item in optionsBusiness"
                :key="item.pid"
                :label="item.bizName"
                :value="item.pid">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求类型:">
          <el-select v-model="dataForm.requestMethod" clearable placeholder="请选择类型">
              <el-option
                v-for="item in requestOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <!-- 操作按钮 -->
        <el-form-item>
          <el-button v-if="$hasPermission('servicebus:route:list')" @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('servicebus:route:create')" type="primary" @click="addOrUpdateHandle()">{{ $t('add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('servicebus:route:reset')" type="info" @click="resetSelectInfo()">重置</el-button>
        </el-form-item>
        <!-- 表单 -->
      </el-form>
      <el-table v-if="$hasPermission('servicebus:route:list')" v-loading="dataListLoading" :data="dataList" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="applicationName" label="应用名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="bizName" label="业务类型" header-align="center" align="center"></el-table-column>
        <el-table-column prop="requestUrl" label="地址" header-align="center" align="center"></el-table-column>
        <el-table-column prop="requestMethod" label="请求方法" header-align="center" align="center"></el-table-column>
        <el-table-column prop="opertionType" label="操作类型" header-align="center" align="center">
          <template slot-scope="scope">
            <p type="text">{{ ['新增', '修改', '删除', '推送', '其他'][scope.row.opertionType] }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('servicebus:route:list')" type="text" size="small" @click="roledicDetailList(scope.row.pid)">查看详情</el-button>
            <el-button v-if="$hasPermission('servicebus:route:update')" type="text" size="small" @click="routerAddOrUpdateHandle(scope.row.applicationId, scope.row.pid)">修改</el-button>
            <el-button v-if="$hasPermission('servicebus:route:delete')" type="text" size="small" @click="deleteRow(scope.row.pid)">删除</el-button>
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
      <!-- 查看详情 -->
      <routeDetail v-if="showRoledicDetail" ref="roledicDetail"></routeDetail>
      <!-- 弹窗, 新增 / 修改 -->
      <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>
    </div>
  </el-card>
</template>

<script>
import routeDetail from './subrouteDetail'
import mixinViewModule from './routermg/view-router'
import AddOrUpdate from './subroute-add-or-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      selectOptons: [],
      isOpen: false,
      dataListLoading: false, // 数据列表，loading状态
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/servicebus/route/page',
        getDataListIsPage: true,
        deleteURL: '/ctc/servicebus/route'
      },
      dataForm: {
        name: '',
        type: null
      },
      dataList: [],
      requestOptions: [
        {
          value: 'GET',
          label: 'GET'
        },
        {
          value: 'POST',
          label: 'POST'
        },
        {
          value: 'PUT',
          label: 'PUT'
        },
        {
          value: 'DELETE',
          label: 'DELETE'
        },
        {
          value: 'OPTIONS',
          label: 'OPTIONS'
        },
        {
          value: 'CONNECT',
          label: 'CONNECT'
        },
        {
          value: 'TRACE',
          label: 'TRACE'
        },
        {
          value: 'HEAD',
          label: 'HEAD'
        }
      ],
      optionsBusiness: []
    }
  },
  components: {
    AddOrUpdate,
    routeDetail
  },
  created () {
    this.getSelectAppId()

    this.initRouteDic()
  },
  mounted () {

  },
  methods: {
    // 获取applicationId的选择框数据
    getSelectAppId () {
      this.dataListLoading = true
      this.$http.get(`/ctc/servicebus/route/getApplications`, {}).then(({ data: res }) => {
        if (res.code === 0) {
          this.selectOptons = res.data
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    initRouteDic () {
      this.dataListLoading = true
      this.$http.get(`/ctc/servicebus/routedic/getList`, {}).then(({ data: res }) => {
        if (res.code === 0) {
          this.optionsBusiness = res.data
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 重置初始条件状态
    resetSelectInfo () {
      this.startTime = ''
      this.endTime = ''
      this.dataForm.applicationId = ''
      this.dataForm.type = ''
      this.dataForm.requestMethod = ''
      this.getDataList()
    },
    // 缺少确认删除判断
    deleteRow (id) {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        id = id + ''
        this.$http.delete(`/ctc/servicebus/route`, { 'data': [id] }).then(({ data: res }) => {
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
