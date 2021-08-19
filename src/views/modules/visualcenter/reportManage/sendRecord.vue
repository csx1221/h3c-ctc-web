<template>
  <el-dialog :visible.sync="sendRecordVisible" @close="closeToast" width="width: 100%" title="发送记录" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border style="width: 100%;">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="dailyName" label="日报名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="contactGroupName" label="联系组名称" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sendDate" label="发布时间" header-align="center" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sendStatus" label="发送状态" header-align="center" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ $getDictLabel('sendStatus', scope.row.sendStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="failureReason" label="失败原因" header-align="center" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
    </el-pagination>
  </el-dialog>
</template>

<script>
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
export default {
  mixins: [projectView],
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/getDailyRecord',
        getDataListIsPage: true,
        deleteURL: '/ctc/servicebus/routedic'
      },
      sendRecordVisible: false,
      dataListLoading: false, // 数据列表，loading状态
      dataList: [], // 获取分页列表的数据
      dataForm: {
        index: '',
        dailyName: '',
        contactGroupName: '',
        sendDate: '',
        sendStatus: 0
      }
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    init () {
      this.sendRecordVisible = true
      this.$nextTick(() => {
        if (this.dataForm.projectId) {
          this.getDataList()
        }
      })
    },
    closeToast () {
    }
  }
}
</script>
