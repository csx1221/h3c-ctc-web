<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail">
    <el-row>
      <el-table
        stripe
        highlight-current-row
        v-loading="dataListLoading"
        :data="dataList"
        ref="dataList"
        border
        style="width: 100%"
      >
        <el-table-column prop="handler" label="处理人" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="taskName" label="处理节点" header-align="left" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          header-align="center"
          align="center"
          show-overflow-tooltip
        >
          <!-- -2：撤回；-1：驳回；0：初始；1：已提交；2：审批中；3：审批完成；4：已关闭 -->
            <template slot-scope="scope">
              {{ getStateData(scope.row.status) }}
            </template>
        </el-table-column>
        <el-table-column
          prop="handlerTime"
          label="操作时间"
          header-align="center"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
            prop="descipt"
            label="审批意见"
            header-align="center"
            align="center"
            show-overflow-tooltip
            ></el-table-column>
        </el-table>
    </el-row>
  </el-card>
</template>

<script>
/* eslint-disable */
export default {
  name: "deptList",
  data() {
    return {
      dataListLoading: false,
      dataList: [],
    };
  },
  props: {
    recordData: Object,
  },
  watch: {

  },
  computed: {},
  mounted() {
    this.init()
  },
  methods: {
    init () {
      this.$nextTick(() => {
        this.getRecordListData()
      })
    },
    getRecordListData () {
      const code = this.recordData.code
      this.$http.get(`/ctc/resource/activiti/approval/getHistory/${code}`).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.dataList = res.data
        }
        this.$ctcLoading.close()
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    getStateData (state) {
      // -2：撤回；-1：驳回；0：初始；1：已提交；2：审批中；3：审批完成；4：已关闭
      let columnValue = "";
      if (state == "-2") {
        columnValue = '已撤回';
      } else if (state == "-1") {
        columnValue = '已驳回';
      } else if (state == "0") {
        columnValue = '初始';
      } else if (state == "1") {
        columnValue = '已提交';
      } else if (state == "2") {
        columnValue = '审批中';
      } else if (state == "3") {
        columnValue = '审批完成';
      } else if (state == "4") {
        columnValue = '已关闭';
      }
      return columnValue;
    },
  },
};
</script>

<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
}
.spanList {
  margin: 0 10px;
}
.success {
  color: #409eff;
}
.error {
  color: #f56c6c;
}
</style>
