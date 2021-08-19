<template>
  <el-card shadow="never" class="aui-card--fill  indicators-library">
    <el-form :model="dataForm" ref="dataForm" :inline="false" label-position="right" label-width="80px">
      <el-row>
        <el-col :span="6">
          <el-form-item prop="indicatorType" label="指标类型">
            <el-select v-model="dataForm.indicatorType" filterable placeholder="请选择指标类型">
              <el-option label="项目数概况" value="1"></el-option>
              <el-option label="用例数概况" value="2"></el-option>
              <el-option label="缺陷数概况" value="3"></el-option>
              <el-option label="周期" value="4"></el-option>
              <el-option label="质量" value="5"></el-option>
              <el-option label="进度" value="6"></el-option>
              <el-option label="效率" value="7"></el-option>
              <el-option label="工作量" value="8"></el-option>
              <el-option label="排名" value="9"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="indicatorName" label="指标名称">
            <el-input v-model="dataForm.indicatorName" placeholder="请输入指标名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="text-align:right;">
          <el-button type="primary" size="small" @click="getData()">查询</el-button>
          <el-button size="small" @click="doResetData()">重置</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px;">
        <el-col :span="14" class="split-line" style="text-align:left;">
          指标列表
        </el-col>
      </el-row>
      <el-table stripe highlight-current-row :data="dataList" ref="dataList" border style="width: 100%;">
        <el-table-column prop="index" label="序号" header-align="center" align="center" width="80" p>
          <template slot-scope="scope">
            <span>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="indicatorType" label="指标类型" header-align="center" align="center" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{indicatorTypeMap[scope.row.indicatorType]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="indicatorName" label="指标名称" header-align="left" align="left" width="200" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="calceMethod" label="计算方法" header-align="left" align="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-html="getCalceMethodHtml(scope.row)"></span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </el-card>
</template>
<script>
export default {
  name: 'IndicatorsLibrary',
  components: {
  },
  data () {
    return {
      dataForm: {
        indicatorType: '',
        indicatorName: ''
      },
      indicatorTypeMap: { '1': '项目数概况', '2': '用例数概况', '3': '缺陷数概况', '4': '周期', '5': '质量', '6': '进度', '7': '效率', '8': '工作量', '9': '排名' },
      data: [],
      dataList: []
    }
  },
  computed: {},
  created () {
    this.init()
  },
  mounted () {
    this.getData()
  },
  methods: {
    getCalceMethodHtml (row) {
      let data = row.calceMethod
      return data.join('<br/>')
    },
    doResetData () {
      this.$refs.dataForm.resetFields()
      this.getData()
    },
    getData () {
      let data = []
      let indicatorType = this.dataForm.indicatorType
      let indicatorName = this.dataForm.indicatorName.toUpperCase()
      this.data.forEach((item, index) => {
        if (indicatorType) {
          if (indicatorType === item.indicatorType) {
            if (indicatorName) {
              if (item.indicatorName.toUpperCase().includes(indicatorName)) {
                data.push(item)
              }
            } else {
              data.push(item)
            }
          }
        } else if (indicatorName) {
          if (item.indicatorName.toUpperCase().includes(indicatorName)) {
            data.push(item)
          }
        } else {
          data.push(item)
        }
      })
      this.dataList = data
    },
    init () {
      let data = []
      // 项目数概况(项目/子项目)
      data.push({ 'indicatorType': '1', 'indicatorName': '总项目数', 'calceMethod': ['统计平台上所有项目数'] })
      data.push({ 'indicatorType': '1', 'indicatorName': '在测项目数', 'calceMethod': ['项目状态为正常在测和延期在测的项目数'] })
      data.push({ 'indicatorType': '1', 'indicatorName': '计划完成项目数', 'calceMethod': ['统计平台上计划完成所有项目数'] })
      data.push({ 'indicatorType': '1', 'indicatorName': '实际完成项目数', 'calceMethod': ['统计平台上实际完成所有项目数'] })
      data.push({ 'indicatorType': '1', 'indicatorName': '项目延期率', 'calceMethod': ['（延期在测项目数+延期完成项目数）/总项目'] })
      data.push({ 'indicatorType': '1', 'indicatorName': '归档项目数', 'calceMethod': ['项目状态为归档的项目数'] })
      data.push({ 'indicatorType': '1', 'indicatorName': '项目状态分布', 'calceMethod': ['正常在测：项目下有未关闭任务，且均未超出项目计划周期', '延期在测：项目下有未关闭任务，且有超出项目计划周期的未关闭任务', '正常完成：项目下所有任务均在计划周期内关闭', '延期完成：项目下存在任务是在项目计划周期外关闭的', '归档是手动触发，归档的项目不允许有任何信息改动'] })
      // 用例数概况
      data.push({ 'indicatorType': '2', 'indicatorName': '执行用例数（包括免测）', 'calceMethod': ['以执行中心为准'] })
      data.push({ 'indicatorType': '2', 'indicatorName': '执行用例数（不包括免测）', 'calceMethod': ['以执行中心为准'] })
      data.push({ 'indicatorType': '2', 'indicatorName': '用例数', 'calceMethod': ['用例中心用例数'] })
      data.push({ 'indicatorType': '2', 'indicatorName': '用列执行情况分布', 'calceMethod': ['已执行用例数（去重）', '未执行用例数', '用例执行次数（执行次数涵盖了手工用例和自动化用例）'] })
      data.push({ 'indicatorType': '2', 'indicatorName': '平均用例执行次数', 'calceMethod': ['用例执行次数/执行用例数（不包括免测）'] })
      data.push({ 'indicatorType': '2', 'indicatorName': '执行结果分布', 'calceMethod': ['通过用例数', '省份执行情况分布（已完成省份数、未开始省份数、进行中省份数）', '通过省份数', '不通过用例数', '免测用例数', '测试受阻用例数', '无法测试用例数', '参测对象执行结果分布（通过省份数、不通过省份数、免测省份数、测试受阻省份数、无法测试省份数）'] })
      // 缺陷数概况
      data.push({ 'indicatorType': '3', 'indicatorName': '总缺陷数', 'calceMethod': ['包括所有状态的缺陷'] })
      data.push({ 'indicatorType': '3', 'indicatorName': '有效缺陷数', 'calceMethod': ['总缺陷数-已否决缺陷数'] })
      data.push({ 'indicatorType': '3', 'indicatorName': '缺陷分布', 'calceMethod': ['已否决缺陷数', '待修复缺陷数', '已关闭缺陷数', '挂起缺陷数', '否决待确认缺陷数', '待验证缺陷数', '待发布缺陷数'] })
      data.push({ 'indicatorType': '3', 'indicatorName': '未关闭缺陷数', 'calceMethod': ['总缺陷数-已否决缺陷数-已关闭缺陷数'] })
      data.push({ 'indicatorType': '3', 'indicatorName': '缺陷级别分布', 'calceMethod': ['以缺陷中心缺陷级别为准（致命，严重 ，一般，建议，轻微）'] })
      data.push({ 'indicatorType': '3', 'indicatorName': '缺陷级别占比', 'calceMethod': ['(某一缺陷级别的缺陷数-某一缺陷级别已否决缺陷数)/有效缺陷数'] })
      data.push({ 'indicatorType': '3', 'indicatorName': '参测对象缺陷分布', 'calceMethod': ['致命缺陷省份数', '严重缺陷省份数', '一般缺陷省份数', '建议缺陷省份数', '轻微缺陷省份数'] })
      data.push({ 'indicatorType': '3', 'indicatorName': '新增缺陷数', 'calceMethod': ['根据缺陷创建时间统计'] })
      // 周期
      data.push({ 'indicatorType': '4', 'indicatorName': '计划周期', 'calceMethod': ['如果是单个统计对象，直接取计划周期数据；', '如果是多个统计对象，取最早计划开始日期，最晚计划结束日期。'] })
      data.push({ 'indicatorType': '4', 'indicatorName': '平均周期', 'calceMethod': ['实际周期平均值'] })
      data.push({ 'indicatorType': '4', 'indicatorName': '实际周期', 'calceMethod': ['最早启动任务的日期为实际开始日期，最晚提交工单日期为实际结束日期。（一个任务一条工单）'] })
      // 质量
      data.push({ 'indicatorType': '5', 'indicatorName': '初始通过率', 'calceMethod': ['所有用例第一次被执行的结果（即当测试执行进度首次为100%时，才有该指标）'] })
      data.push({ 'indicatorType': '5', 'indicatorName': '最终通过率', 'calceMethod': ['通过率计算方式：当前用例分值/用例满分值', '（比如：共5条用例，通过3条，免测1条，未执行1条。则最终通过率为：（3*1/4=75%））', '系统默认分值如下：通过（1分）、不通过（0分）、部分通过（0.5分）、测试受阻（0分）、无法测试（0分）、未执行（0分）、免测（不计入统计内容）', '备注：仅支持用户对“通过”结果的分值 进行设定，设定区间为(0,2]】'] })
      data.push({ 'indicatorType': '5', 'indicatorName': '通过率变化', 'calceMethod': ['自定义减数和被减数'] })
      data.push({ 'indicatorType': '5', 'indicatorName': '平均通过率', 'calceMethod': ['被统计对象的通过率平均值'] })
      data.push({ 'indicatorType': '5', 'indicatorName': 'XX日期通过率', 'calceMethod': ['起始日期通过率：截止到起始日期的用例通过率', '截止日期通过率：略', '其它（输入日期）：截止到所选日期的用例通过率'] })
      data.push({ 'indicatorType': '5', 'indicatorName': '月通过率', 'calceMethod': ['截止到每月最后一天23:59:59时的用例通过率'] })
      data.push({ 'indicatorType': '5', 'indicatorName': '用例执行通过率', 'calceMethod': ['执行通过用例分值（去重）/已执行用例分值（去重）。', '（均以最新一次的执行结果为准）', '比如：', '总共10条用例，执行了5条用例，通过3条，失败2条', '1-用户A针对不通过的用例执行了10次，针对通过用例执行了90次。按照不去重的算法是：（90）/(10+90)=90%;', '2-用户B 针对不通过的用例执行了90次，针对通过用例执行了10次。按照不去重的算法是：（10）/(10+90)=10%;', '以上指标不具备客观性，无法衡量现阶段开发质量。但是去重是有客观性的，最后结果通过就是通过了，不通过就是不通过。用例执行通过率就是3/5=60%.。所以分子分母要去重'] })
      data.push({ 'indicatorType': '5', 'indicatorName': '缺陷复测次数', 'calceMethod': ['缺陷提出人验证后不通过，打回给开发人员，计一次缺陷复测'] })
      data.push({ 'indicatorType': '5', 'indicatorName': '缺陷率', 'calceMethod': ['有效缺陷数/执行用例数（不包括免测）'] })
      data.push({ 'indicatorType': '5', 'indicatorName': '缺陷有效率', 'calceMethod': ['有效缺陷数/总缺陷数'] })
      data.push({ 'indicatorType': '5', 'indicatorName': '执行用例复测次数（手工用例）', 'calceMethod': ['执行用例状态 由 “不通过”变为“通过”，算一次复测', '比如：', '用例A：未执行--不通过 --通过。其复测次数是1次。', '用例B：未执行-不通过-无法测试-通过。其复测次数是1次', '用例C：未执行-不通过-测试受阻-不通过-通过。其复测次数为2次。'] })
      data.push({ 'indicatorType': '5', 'indicatorName': '执行用例整改时长（手工用例）', 'calceMethod': ['用例从不通过变为通过的周期，单位为天，如果不足一天，需向上取整。如果归档，用例在归档期的时长，不计入整改时长。'] })
      // 进度
      data.push({ 'indicatorType': '6', 'indicatorName': '用例执行率', 'calceMethod': ['已执行用例数（去重）/执行用例数（不包括免测）'] })
      data.push({ 'indicatorType': '6', 'indicatorName': '未执行用例占比', 'calceMethod': ['未执行用例数/执行用例数（不包括免测）'] })
      data.push({ 'indicatorType': '6', 'indicatorName': '项目计划进度', 'calceMethod': ['项目下阶段计划进度平均值'] })
      data.push({ 'indicatorType': '6', 'indicatorName': '项目实际进度', 'calceMethod': ['项目下阶段实际进度平均值'] })
      data.push({ 'indicatorType': '6', 'indicatorName': '子项目计划进度', 'calceMethod': ['子项目下阶段计划进度平均值'] })
      data.push({ 'indicatorType': '6', 'indicatorName': '子项目实际进度', 'calceMethod': ['子项目下阶段实际进度平均值'] })
      data.push({ 'indicatorType': '6', 'indicatorName': '阶段计划进度', 'calceMethod': ['按阶段计划周期计算。比如：单阶段的计划周期为100天，则已过25天时，该阶段计划进度是25%'] })
      data.push({ 'indicatorType': '6', 'indicatorName': '阶段实际进度', 'calceMethod': ['需求评审、需求分析、测试方案评审、测试方案分析、用例设计：以任务状态为标准，任务状态为已关闭，则计进度，任务状态为未关闭，则不计进度', '用例执行：用例通过率当做该阶段的进度', '比如：（项目-任务架构）：有 需求评审，用例评审，用例执行 三个阶段。', '1-需求评审阶段下有1个任务，且未关闭 ，则用例设计阶段实际进度为0%', '2-用例设计阶段下有2个任务，其中1个任务已关闭，1个任务未关闭，则用例设计阶段实际进度为50%', '3-用例执行阶段下有1个任务，共100条用例，执行通过70条，则用例执行阶段进度为70%。（此阶段无需关注任务是否关闭，以实际执行为准）', '4-综上，项目的实际进度为：（0+50%+70%）/3=40%'] })
      // 效率
      data.push({ 'indicatorType': '7', 'indicatorName': '项目完成及时率', 'calceMethod': ['计划内正常完成项目数/计划完成项目数'] })
      data.push({ 'indicatorType': '7', 'indicatorName': '缺陷修复及时率', 'calceMethod': ['截止日期内修复缺陷总数/总缺陷数。（分子分母均包含否决缺陷）'] })
      data.push({ 'indicatorType': '7', 'indicatorName': '缺陷修复时长', 'calceMethod': ['（缺陷关闭日期-缺陷提出日期+1）。（不计否决缺陷）'] })
      data.push({ 'indicatorType': '7', 'indicatorName': '项目延期率', 'calceMethod': ['（延期在测项目数+延期完成项目数）/总项目数'] })
      data.push({ 'indicatorType': '7', 'indicatorName': '子项目延期率', 'calceMethod': ['（延期在测子项目数+延期完成子项目数）/总子项目数。'] })
      // 工作量
      data.push({ 'indicatorType': '8', 'indicatorName': '计划工作量', 'calceMethod': ['计划周期*计划处理人数=XXX人天'] })
      data.push({ 'indicatorType': '8', 'indicatorName': '实际工作量', 'calceMethod': ['实际周期*实际处理人数。（实际处理人数是对所属工单有活动轨迹的人数）'] })
      data.push({ 'indicatorType': '8', 'indicatorName': '工作量偏差度', 'calceMethod': ['（实际工作量-计划工作量）/计划工作量'] })
      data.push({ 'indicatorType': '8', 'indicatorName': '平均周期', 'calceMethod': ['实际周期平均值'] })
      // 排名
      data.push({ 'indicatorType': '9', 'indicatorName': '排名', 'calceMethod': ['按照被选指标进行升序和降序排列'] })
      this.data = data
    }
  }
}
</script>
<style  lang="scss">
.indicators-library {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .el-form-item__content .el-input-group--append {
    width: 200px;
  }
  .el-form-item__content .el-date-editor--date {
    width: 200px;
  }
}
</style>
