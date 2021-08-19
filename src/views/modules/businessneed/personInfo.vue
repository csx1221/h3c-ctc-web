<template>
  <el-dialog :visible.sync="visibleDemandDownload" @close="closeToast" width="width: 100%" title="需求提出人" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="demandDownloadDataList" row-key="getRowKey" border style="width: 100%;">
      <el-table-column prop="contactName" label="姓名" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="contactPhone" label="电话" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="contactEmail" label="邮箱" header-align="center" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
// import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'

export default {
  // mixins: [projectView],
  data () {
    return {
      visibleDemandDownload: false,
      dataListLoading: false, // 数据列表，loading状态
      demandDownloadDataList: [], // 获取分页列表的数据
      demandDownloadPage: 1,
      demandDownloadLimit: 10,
      demandDownloadTotal: 0,
      dataForm: {
        id: ''
      }
    }
  },
  components: {
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    init () {
      this.visibleDemandDownload = true
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.getDemandDataList(this.dataForm.id)
        }
      })
    },
    closeToast () {
      this.demandDownloadDataList = []
    },
    getDemandDataList (id) {
      this.dataListLoading = true
      this.$http.get('/ctc/plan/commoditycontactinfo/getCommodityContactInfo/' + id).then(({ data: res }) => {
        this.dataListLoading = false
        if (res.code === 0 && res.data.length > 0) {
          this.demandDownloadDataList = res.data
        } else {
          this.demandDownloadDataList = []
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    getRowKey (row) {
      return row.id
    },
    batchDownload () {
    },
    Download () {

    }
  }
}
</script>
