<template>
  <el-dialog :visible.sync="visible" @close="closeToast" width="70%" title="查看报表模板" :destroy-on-close="true" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form max-height="480" label-position="right" :model="dataForm" ref="dataForm" label-width="220px">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="templateName" label="报表名称：">
            {{dataForm.templateName}}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="reportMode" label="报表模式：">
            {{ dataForm.reportMode === '0' ? '私有模式(仅自己可见)' : '项目组模式(项目组内成员可见)' }}
          </el-form-item>
        </el-col>
        <el-col :span="24" prop="projectTeamName" v-if="dataForm.projectTeamName">
          <el-form-item >
            {{dataForm.projectTeamName}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="firstClassification" label="指标分类：">
            {{ dataForm.twoClassification ? dataForm.firstClassification + '>' + dataForm.twoClassification : dataForm.firstClassification ? dataForm.firstClassification : '无' }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="statisticalDimension" label="统计维度：">
            {{ $getDictLabel('support_dimensions',dataForm.statisticalDimension) }}
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="reportDataColumnDTOList" label="报表数据列：">
            <el-table stripe highlight-current-row border max-height="680" :data="dataForm.reportDataColumnDTOList">
              <el-table-column prop="normName" label="指标名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="calculationFormula" label="计算公式" header-align="center" align="center">
                <template slot-scope="scope">
                  {{ scope.row.isDefault === 0 ? scope.row.defaultCalculationDetail : scope.row.calculationFormula }}
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="reportQueryConditionsDTOList" label="查询条件：">
            <el-tag v-if="item.queryItem === '111111'" v-for="item in dataForm.reportQueryConditionsDTOList" :key="item.queryId" type="" effect="dark">项目经理</el-tag>
            <el-tag v-if="item.queryItem === '222222'" v-for="item in dataForm.reportQueryConditionsDTOList" :key="item.queryId" type="" effect="dark">项目创建人</el-tag>
            <el-tag v-if="item.queryItem === '333333'" v-for="item in dataForm.reportQueryConditionsDTOList" :key="item.queryId" type="" effect="dark">统计时间</el-tag>
            <el-tag v-if="item.queryItem !== '111111' && item.queryItem !== '222222' && item.queryItem !== '333333'" v-for="item in dataForm.reportQueryConditionsDTOList" :key="item.queryId" type="" effect="dark"> {{ item.normName }} </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="reportChartSettingDTOList" label="图表设置：">
            <el-button v-for="item in dataForm.reportChartSettingDTOList" :key="item.chartName" type="text" @click="setChartsHandle(item)">{{ item.chartName }}</el-button>
            <ctc-echart-group-details v-if="showEcharDetails" ref="ctcEcharDetails"></ctc-echart-group-details>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="display: flex;justify-content: center;align-items: center;">
        <el-button size="small" @click="visible = false">返回</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import ctcEchartGroupDetails from '@/views/modules/visualcenter/template/ctc-echart-group-details'
export default {
  mixins: [],
  data () {
    return {
      visible: false,
      dataForm: {
        templateId: '',
        templateName: '',
        reportMode: '',
        projectTeam: '',
        firstClassification: '',
        twoClassification: '',
        statisticalDimension: '',
        reportDataColumnDTOList: [],
        reportQueryConditionsDTOList: [],
        reportChartSettingDTOList: []
      },
      showEcharDetails: false
    }
  },
  watch: {
  },
  components: {
    ctcEchartGroupDetails
  },
  created () {
  },
  computed: {
  },
  methods: {
    setChartsHandle (data) {
      this.showEcharDetails = true
      this.$nextTick(() => {
        this.$refs.ctcEcharDetails.dataForm = { ...data }
        this.$refs.ctcEcharDetails.dataForm.chartType = Number(this.$refs.ctcEcharDetails.dataForm.chartType)
        this.$refs.ctcEcharDetails.dataForm.isShow = !!this.$refs.ctcEcharDetails.dataForm.isShow
        this.$refs.ctcEcharDetails.initDialog()
      })
    },
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getInfo()
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(`/ctc/visualization/templateSetting/${this.dataForm.templateId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.dataForm = { ...this.dataForm, ...res.data }
      }).catch(() => { })
    },
    closeToast () {
      this.$refs['dataForm'].resetFields()
    }
  }
}
</script>
<style lang="scss" >
.el-table td, .el-table th {
  padding: 5px 0;
}
.el-tag {
  margin-left: 8px;
  border-radius: 0px;
  width: 120px;
  text-align: center;
}
.el-tag:first-child {
  margin-left: 0px;
}
.el-select__tags .el-tag{
  width: auto;
}
</style>
