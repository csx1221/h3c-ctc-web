<template>
  <el-card shadow="never" class="aui-card--fill">
    <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item prop="createDate" label="统计时间">
            <el-date-picker v-model="dataForm.createDate" value-format="yyyy-MM-dd" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align:right;">
          <el-button type="primary" size="small" @click="questionDataStatistics()">查询</el-button>
        </el-col>
      </el-row>
      <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">按问题/任务类型（总计：{{questionTypeTotal}}）</span></el-divider>
      <el-row>
        <el-col :span="6" v-for="(item,index) in questionTypeData" :key="index">
          <el-col :span="24" style="text-align:center;font-size:18px;margin-top:12px;margin-bottom:12px;">{{item.name}}</el-col>
          <el-col :span="24" style="text-align:center;margin-top:12px;font-size:20px;font-weight:bold;color:#4190f7">{{item.count}}</el-col>
        </el-col>
      </el-row>
      <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">按问题/任务级别（总计：{{questionLevelTotal}}）</span></el-divider>
      <el-row>
        <el-col :span="6" v-for="(item,index) in questionLevelData" :key="index">
          <el-col :span="24" style="text-align:center;font-size:18px;margin-top:12px;margin-bottom:12px;">{{item.name}}</el-col>
          <el-col :span="24" style="text-align:center;margin-top:12px;font-size:20px;font-weight:bold;color:#4190f7">{{item.count}}</el-col>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>
<script>
import ctcUtils from '@/utils/ctc-utils.js'
export default {
  components: {
  },
  data () {
    return {
      dataForm: {
        projectId: '',
        createDate: []
      },
      questionTypeData: [],
      questionLevelData: [],
      questionTypeTotal: 0,
      questionLevelTotal: 0
    }
  },
  computed: {
  },
  mounted () {
    this.dataForm.projectId = this.$route.params.projectId || ''
    let startDate = ctcUtils.getDynamicDate('M', 'yyyy-MM', 0) + '-01'
    let endDate = ctcUtils.getDynamicDate('d', 'yyyy-MM-dd', 0)
    this.dataForm.createDate = [startDate, endDate]
    this.questionDataStatistics()
  },
  methods: {
    questionDataStatistics () {
      if (this.dataForm.projectId) {
        let params = {}
        params.projectId = this.dataForm.projectId
        // 特殊处理创建日期修改日期
        let createDate = this.dataForm.createDate || []
        if (createDate.length > 0) {
          params.createDateStart = createDate[0]
          params.createDateEnd = createDate[1]
        }
        this.$http.get('/ctc/project/question/questionDataStatistics', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            let statisticsMap = res.data
            // 问题类型：统计数据
            let questionTypeData = []
            let typeTotal = 0
            let typeData = this.$getDictDataList('question.type')
            typeData.forEach((item, index) => {
              let count = statisticsMap['questionType' + item.dictValue] || 0
              typeTotal = typeTotal + count
              questionTypeData.push({ 'name': item.dictLabel, 'count': count })
            })
            this.questionTypeTotal = typeTotal
            this.questionTypeData = questionTypeData

            // 问题级别：统计数据
            let questionLevelData = []
            let levelTotal = 0
            let levelData = this.$getDictDataList('question.level')
            levelData.forEach((item, index) => {
              let count = statisticsMap['questionLevel' + item.dictValue] || 0
              levelTotal = levelTotal + count
              questionLevelData.push({ 'name': item.dictLabel, 'count': count })
            })
            this.questionLevelTotal = levelTotal
            this.questionLevelData = questionLevelData
          }
        }).catch(() => { })
      }
    }
  }
}
</script>
