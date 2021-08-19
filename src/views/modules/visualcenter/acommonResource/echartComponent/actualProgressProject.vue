<template>
  <el-dialog width="88%" @close="closeToast" append-to-body :visible.sync="visible" title="进度概况" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="mod-demo__goods">
    <!-- 项目进度 -->
      <el-row>
        <el-col :span="12" class="split-line" style="text-align:left;">{{ originatName + " " + [dataForm.parentId != null ? '子项目进度' : '项目进度'] }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <ColumnarView :projectSchedule="{...dataForm}" ></ColumnarView>
        </el-col>
      </el-row>
    <!-- 项目阶段进度 -->
      <el-row>
        <el-col :span="12" class="split-line" style="text-align:left;">{{ originatName + " " + [dataForm.parentId != null ? '子项目阶段进度' : '项目阶段进度'] }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <scheduleColumnar v-if="returnScheduleList" :schedulePro="{...returnScheduleList}"></scheduleColumnar>
        </el-col>
      </el-row>
    <!-- 项目工单处理情况 -->
      <el-row>
        <el-col :span="12" class="split-line" style="text-align:left;">{{ originatName + " " + [dataForm.parentId != null ? '子项目工单处理情况' : '项目工单处理情况'] }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <IntervalColnmnar :intervalProject="{...dataForm}"></IntervalColnmnar>
        </el-col>
      </el-row>
    <!-- 项目工单处理详情 -->
      <el-row>
        <el-col :span="12" class="split-line" style="text-align:left;">{{ originatName + " " + [dataForm.parentId != null ? '子项目工单处理详情' : '项目工单处理详情']}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <scheduleTable :tableData="tableData"></scheduleTable>
        </el-col>
      </el-row>
    </div>
    <!-- 底部操作按钮 -->
    <template slot="footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import scheduleColumnar from '@/views/modules/visualcenter/acommonResource/echartComponent/scheduleColumnar'
import scheduleTable from '@/views/modules/visualcenter/acommonResource/echartComponent/projectTable'
import IntervalColnmnar from '@/views/modules/visualcenter/acommonResource/echartComponent/intervalColumnar'
import ColumnarView from '@/views/modules/visualcenter/acommonResource/echartComponent/columnarView'
export default {
  data () {
    return {
      returnScheduleList: {},
      originatName: '',
      tableData: [],
      projectSchedule: [],
      intervalProject: {},
      visible: false,
      dataForm: {
        id: '',
        pid: ''
      }
    }
  },
  components: {
    ColumnarView,
    IntervalColnmnar,
    scheduleTable,
    scheduleColumnar
  },
  methods: {
    closeToast () {
      this.originatName = ''
      this.dataForm = {}
      this.tableData = []
      this.projectSchedule = {}
      this.intervalProject = {}
      this.returnScheduleList = {}
    },
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.originatName = this.dataForm.name
        if (this.dataForm.projectId) {
          this.getInfo()
          this.tableDataHandle()
        }
      })
    },
    // 获取可视化信息
    getInfo () {
      this.$http.get(this.dataForm.parentId ? `/ctc/visualization/projectSurvey/schedule?projectId=${this.dataForm.projectId}&parentId=${this.dataForm.parentId}` : `/ctc/visualization/projectSurvey/schedule?projectId=${this.dataForm.projectId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        }
        if (res.code === 0) {
          this.getScheduleParams(res.data.stageSchedules, 'dateCount')
          this.getScheduleParams(res.data.stageSchedules, 'stageName')
          this.getScheduleParams(res.data.stageSchedules, 'schedule')
          this.getScheduleParams(res.data.stageSchedules, 'planStartTime')
          this.getScheduleParams(res.data.stageSchedules, 'planEndTime')
          this.getScheduleDateList(res.data)
          this.getScheduleCountList(res.data.stageSchedules)
        }
      }).catch(() => {})
    },
    // 获取表格数据
    tableDataHandle () {
      this.$http.get(`/ctc/visualization/projectSurvey/dealInfo?projectId=${this.dataForm.projectId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.tableData = res.data
      }).catch(() => {})
    },
    // 进度阶段添加日期
    getScheduleDateList (val) {
      this.returnScheduleList.dateList = val.dateList
      this.returnScheduleList.getLength = val.stageSchedules.length
      this.returnScheduleList.projectId = this.dataForm.projectId
      return JSON.parse(JSON.stringify(this.returnScheduleList))
    },
    /*!
     * 计算日期差
     * @param string('2010-10-10', '2010-10-11')
    */
    dateDifference (sDate1, sDate2) {
      var dateSpan
      var iDays
      sDate1 = Date.parse(sDate1)
      sDate2 = Date.parse(sDate2)
      dateSpan = sDate2 - sDate1
      dateSpan = Math.abs(dateSpan)
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
      return iDays
    },
    /*
      获取横轴的坐标差值
      @param object(this.dataForm)
    */
    getScheduleCountList (val) {
      if (val.length > 0) {
        var countList = []
        for (var c = 0; c < val.length; c++) {
          let _count = this.dateDifference(val[c].planStartTime, this.returnScheduleList.dateList[0])
          countList.push(_count)
        }
        this.returnScheduleList.count = countList
        return JSON.parse(JSON.stringify(this.returnScheduleList))
      }
    },
    /*
      复用进度子集的参数引入
      @params(val: Array, varible: sting)
    */
    getScheduleParams (val, varible) {
      if (val.length > 0) {
        var paramList = []
        for (var i = 0; i < val.length; i++) {
          paramList.push(val[i][varible])
        }
        this.returnScheduleList[varible] = paramList
        return JSON.parse(JSON.stringify(this.returnScheduleList))
      }
    }
  }
}
</script>

<style scoped>
</style>
