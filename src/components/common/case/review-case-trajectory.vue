<template>
  <el-dialog title="评审用例轨迹" :visible.sync="innerVisible" :close-on-click-modal="false" width="60%" class="review-case-trajectory">
    <el-row>
      <el-col :span="24">
        <el-table ref="reviewCaseTrajectoryData" :data="reviewCaseTrajectoryData" border style="width:100%;height:580px;overflow-y:auto;">
          <el-table-column label="评审人" prop="creatorName" header-align="center" align="center"></el-table-column>
          <el-table-column label="评审状态" prop="reviewstatus" header-align="center" align="center">
            <template slot-scope="scope">
              {{ $getDictLabel('reviewStatus', scope.row.reviewstatus) }}
            </template>
          </el-table-column>
          <el-table-column label="评审时间" prop="createDate" header-align="rigth" align="rigth"></el-table-column>
          <el-table-column label="评审意见" prop="operateLog" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="selected">
        <el-button size="small" @click="handleDialogClose">关闭</el-button>
        <el-button type="primary" size="small" @click="handleConfirm">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  name: 'ReviewCaseTrajectory',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      caseId: '',
      taskId: '',
      reviewCaseTrajectoryData: []
    }
  },
  watch: {
  },
  computed: {
    innerVisible: {
      get () {
        return this.visible
      },
      set (value) {
        this.$emit('update:visible', value)
      }
    }
  },
  mounted () {
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.innerVisible = true
        this.reviewCaseTrajectoryData = []
        this.loadCaseTrajectory()
      })
    },
    loadCaseTrajectory () {
      let params = { 'caseId': this.caseId, 'taskId': this.taskId }
      this.$http.get('ctc/case/review/listCaseReviewLocus', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.reviewCaseTrajectoryData = res.data
        }
      }).catch(() => {
      })
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
      this.handleDialogClose()
    }
  }
}
</script>
<style lang="scss" scoped>
.review-case-trajectory {
  .selected {
    margin-top: 10px;
    text-align: right;
  }
  .el-card-case {
    i {
      font-size: 20px;
      color: #4190f7;
    }
  }
}
</style>
