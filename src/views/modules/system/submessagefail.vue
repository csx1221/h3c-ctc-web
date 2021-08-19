<template>
  <el-card shadow="never" class="aui-card--fill">
    <div class="mod-demo__goods">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-position="right">
        <el-form-item prop="applicationId" label="应用系统:">
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
          <el-select v-model="dataForm.businessType" clearable placeholder="请选择类型">
              <el-option
                v-for="item in optionsBusiness"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态:">
          <el-select v-model="dataForm.processingStatus" clearable placeholder="请选择状态">
              <el-option
                v-for="item in OptionsStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠检索条件':'展开检索条件'"></el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('servicebus:messagefail:list')" @click="getDataList()">{{ $t('query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPermission('servicebus:messagefail:reset')" type="info" @click="resetSelectInfo()">重置</el-button>
        </el-form-item>
        <el-form-item v-if="isOpen" label="日期选择:">
          <el-date-picker
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="onDateTime"
            v-model="dateTimeArr"
            :picker-options="pickerOptions"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="isOpen" label="操作类型:">
          <el-select v-model="dataForm.operationType" clearable placeholder="请选择操作类型">
              <el-option
                v-for="item in optionsOperation"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table v-if="$hasPermission('servicebus:messagefail:list')" v-loading="dataListLoading" :data="dataList" @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="dataSource" label="数据来源" header-align="center" align="center">
          <template slot-scope="scope">
            <p>{{ ['集中化平台', '集成平台'][scope.row.dataSource] }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="applicationName" label="应用名称" width="190" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" >{{ scope.row.applicationName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="businessType" label="业务类型" header-align="center" align="center">
          <template slot-scope="scope">
            <p>{{ ['项目', '任务', '工单', '用例主本', '用例副本', '参测对象', '参测对象成员', '项目成员', '工单执行人', '机构'][scope.row.businessType] }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="operationType" label="业务操作" header-align="center" align="center">
          <template slot-scope="scope">
            <p>{{ ['新增', '修改', '删除', '其他'][scope.row.operationType] }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="consumerFailTime" label="消费失效时间" width="160" header-align="center" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.consumerFailTime !== null ? scope.row.consumerFailTime : '暂无' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="retrySendTime" label="重复消费时间" width="160" header-align="center" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.retrySendTime !== null ? scope.row.retrySendTime : '暂无' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="processingStatus" label="处理状态" header-align="center" align="center">
          <template slot-scope="scope">
            <p>{{['未处理', '消费成功', '消费失败', '已处理', '人工处理失败'][scope.row.processingStatus]}}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button v-if="$hasPermission('servicebus:messagefail:list')" type="text" size="small" @click="showMessageDetailHandle(scope.row.msgCompernsationId)">查看详情</el-button>
            <el-button v-if="$hasPermission('servicebus:messagefail:delete')" type="text" size="small" @click="deleteRow(scope.row.msgCompernsationId)">删除</el-button>
            <el-button v-if="$hasPermission('servicebus:messagefail:manipulation') && scope.row.processingStatus === 2 || $hasPermission('servicebus:messagefail:manipulation') && scope.row.processingStatus === 4" type="text" size="small" @click="manipulation(scope.row.msgCompernsationId)">手动推送</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
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
      <messageDetail v-if="showMessageDetail" ref="messageDetail"></messageDetail>
      <!-- 弹窗, 新增 / 修改 -->
      <AddOrUpdate v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></AddOrUpdate>
    </div>
  </el-card>
</template>

<script>
import messageDetail from './submessageDetail'
import mixinViewModule from './routermg/view-message'
import AddOrUpdate from './submessagefail-add-update'
export default {
  mixins: [mixinViewModule],
  data () {
    return {
      selectOptons: [],
      isOpen: false,
      dataListLoading: false, // 数据列表，loading状态
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/servicebus/messagefail/page',
        getDataListIsPage: true,
        deleteURL: '/ctc/servicebus/messagefail'
      },
      dataForm: {
        name: '',
        type: null
      },
      dataList: []
    }
  },
  components: {
    AddOrUpdate,
    messageDetail
  },
  created () {
    this.getSelectAppId()
  },
  mounted () {
  },
  watch: {
    dateTimeArr: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (this.dateTimeArr === '' || this.dateTimeArr === null) {
          this.startTime = ''
          this.endTime = ''
        }
      }
    }
  },
  methods: {
    // 手动推送任务
    manipulation (id) {
      this.$confirm(this.$t('prompt.info', { 'handle': '推送' }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        id = id + ''
        this.$http.post(`/ctc/servicebus/messagefail/manualPush`, { 'ids': [id] }).then(({ data: res }) => {
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
    },
    // 重置初始条件状态
    resetSelectInfo () {
      this.dateTimeArr = ''
      this.startTime = ''
      this.endTime = ''
      this.dataForm.applicationId = ''
      this.dataForm.businessType = ''
      this.dataForm.operationType = ''
      this.dataForm.processingStatus = ''
      this.getDataList()
    },
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
    // 缺少确认删除判断
    deleteRow (id) {
      this.$confirm(this.$t('prompt.info', { 'handle': this.$t('delete') }), this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        id = id + ''
        this.$http.delete(`/ctc/servicebus/messagefail`, { 'data': [id] }).then(({ data: res }) => {
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
