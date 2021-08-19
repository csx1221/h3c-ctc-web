<template>
  <el-dialog title="执行用例轨迹" :visible.sync="innerVisible" :close-on-click-modal="false" width="60%" class="review-case-trajectory">
    <el-row>
      <el-col :span="24">
        <el-table ref="caseTrajectoryData" :data="caseTrajectoryData" border style="width:100%;height:580px;overflow-y:auto;">
          <el-table-column label="工单号" prop="orderId" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="执行人" prop="creatorName" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="参测对象" prop="organizeName" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="联系电话" prop="phone" header-align="center" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="结果断定" prop="resultCode" header-align="center" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ $getDictLabel('resultDetermination', scope.row.resultCode) }}
            </template>
          </el-table-column>
          <el-table-column label="执行时间" prop="createDate" header-align="center" align="center" show-overflow-tooltip></el-table-column>
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
  name: 'ExecuteCaseTrajectory',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      caseId: '',
      caseTrajectoryData: []
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
        this.caseTrajectoryData = []
        this.loadCaseTrajectory()
      })
    },
    loadCaseTrajectory () {
      let params = {}
      this.$http.get('/ctc/exec/result/locus/' + this.caseId, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.caseTrajectoryData = res.data
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
