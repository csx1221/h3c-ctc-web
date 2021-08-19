<template>
  <el-dialog :visible.sync="lookRecordVisible" @close="closeToast" width="width: 100%" title="查看记录" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
      <el-table-column prop="userName" label="姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="opTime" label="时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="opResult" label="是否接收" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.opResult==1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
// import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  // mixins: [projectView],
  data () {
    return {
      lookRecordVisible: false,
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
      this.lookRecordVisible = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getUpdateRecordList(this.dataForm.id)
        }
      })
    },
    closeToast () {
    },
    getUpdateRecordList (id) {
      this.dataListLoading = true
      let params = { 'orderCode': id }
      this.$http.get('/ctc/plan/commodityoplog/getOplogByOrderCode', { 'params': params }).then(({ data: res }) => {
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
