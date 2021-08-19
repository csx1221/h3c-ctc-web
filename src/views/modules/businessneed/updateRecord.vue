<template>
  <el-dialog :visible.sync="updateRecordVisible" @close="closeToast" width="width: 500px" title="更新记录" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
      <el-table-column prop="orderRecordId" label="配置工单编号" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="inTime" label="对接时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="contactName" label="需求提交人" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="operationType" label="操作类型" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.operationType==11">新增</span>
          <span v-else-if="scope.row.operationType==12">修改</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateContent" label="更新内容" header-align="center" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
// import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  // mixins: [projectView],
  data () {
    return {
      updateRecordVisible: false,
      dataListLoading: false, // 数据列表，loading状态
      dataList: [], // 获取分页列表的数据
      dataForm: {
        index: '',
        dailyName: '',
        contactGroupName: '',
        sendDate: '',
        sendStatus: 0,
        id: ''
      }
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    init () {
      this.updateRecordVisible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getUpdateRecordList(this.dataForm.id)
        }
      })
      this.getUpdateRecordList()
    },
    closeToast () {
    },
    getUpdateRecordList (id) {
      this.dataListLoading = true
      this.$http.get('/ctc/plan/commodityorderrecord/getCommodityOrderRecordInfoByOrderCode/' + id).then(({ data: res }) => {
        // console.log(res)
        this.dataListLoading = false
        if (res.code === 0 && res.data.length > 0) {
          this.dataList = res.data
        } else {
          this.dataList = []
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    }
  }
}
</script>
