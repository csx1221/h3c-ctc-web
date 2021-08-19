<template>
  <el-dialog width="88%" @close="closeToast" append-to-body :visible.sync="visible" title="省测概况" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="mod-demo__goods">
      <!-- 项目进度 -->
      <el-row>
        <el-col :span="12" class="split-line" style="text-align:left;">省测概况列表</el-col>
        <el-col :span="12">
          <el-button size="small" type="warning" style="margin: 10px 13px;float:right;" @click="provinceExcel(dataFormData.projectId, dataFormData.parentId, page, limit, dataFormData.name)">导出列表</el-button>
        </el-col>
      </el-row>
      <!-- 省测概况表格 -->
      <el-row>
        <el-col :span="24">
          <el-table :header-cell-style="getRowClass" max-height="350" :data="dataList" style="width: 100%;">
            <el-table-column label="序号" width="55" type="index"></el-table-column>
            <el-table-column prop="organizeName" label="参测省份/机构" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="status" label="参测对象状态" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text">{{ $getDictLabel('dealStatus',scope.row.status) }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="caseCount" label="用例数" header-align="center" align="center"></el-table-column>
            <el-table-column prop="caseExecSchedule" label="用例执行进度" header-align="center" align="center"></el-table-column>
            <el-table-column prop="casePassCount" label="通过用例数" header-align="center" align="center"></el-table-column>
            <el-table-column prop="notPassCount" label="不通过用例数" header-align="center" align="center"></el-table-column>
            <el-table-column prop="finalCasepassRate" label="最终通过率" header-align="center" align="center"></el-table-column>
            <el-table-column prop="planPeriod" label="计划周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="actualPeriod" label="实际周期" header-align="center" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="defectCount" label="缺陷数" header-align="center" align="center"></el-table-column>
            <el-table-column prop="toRepairDefectCount" label="待修复缺陷数" header-align="center" align="center"></el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle">
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 项目阶段进度 -->
      <el-row>
        <el-col :span="12" class="split-line" style="text-align:left;">参测对象用例概况</el-col>
      </el-row>
      <!-- 数值和图表 -->
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="18">
          <el-row class="colTitle" type="flex" justify="space-around">
            <el-col :span="2">用例数</el-col>
            <el-col :span="2">执行用例数(包括免测)</el-col>
            <el-col :span="2">执行用例数(不包括免测)</el-col>
            <el-col :span="2">平均用例执行次数</el-col>
            <el-col :span="3">用例执行率</el-col>
            <el-col :span="3">初始通过率</el-col>
            <el-col :span="3">最终通过率</el-col>
          </el-row>
          <el-row class="colNumber" type="flex" justify="space-around">
            <el-col :span="2" style="color: #3991ff;">{{ dataFormData.caseSurvey.caseCount || showNull }}</el-col>
            <el-col :span="2" style="color: #a14eff;">{{ dataFormData.caseSurvey.execCount || showNull }}</el-col>
            <el-col :span="2" style="color: #e3cf29;">{{ dataFormData.caseSurvey.hadExecCount || showNull }}</el-col>
            <el-col :span="2" style="color: #ec643e;">{{ dataFormData.caseSurvey.caseExeAverCount || showNull }}</el-col>
            <el-col :span="3" style="color: #ff10f1;">{{ dataFormData.caseSurvey.execRate || showNull }}%</el-col>
            <el-col :span="3" style="color: #60ffc9;">{{ dataFormData.caseSurvey.firstPassRate || showNull }}%</el-col>
            <el-col :span="3" style="color: #2be705;">{{ dataFormData.caseSurvey.lastPassRate || showNull }}%</el-col>
          </el-row>
        </el-col>
        <el-col :span="7">
          <circleView :circleData="{...dataFormData}"></circleView>
        </el-col>
      </el-row>
      <!-- 参测对象执行结果发布 -->
      <el-row>
        <el-col :span="12" class="split-line" style="text-align:left;">参测对象执行结果分布</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <normalColumnar :normalColumnar="normalColumnar"></normalColumnar>
        </el-col>
      </el-row>
      <!-- 各省份用例执行结果分布 -->
      <el-row>
        <el-col :span="12" class="split-line" style="text-align:left;">各省份用例执行结果分布</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <provinceCaseExecDis :provinceCaseExecDis="provinceCaseExecDis"></provinceCaseExecDis>
        </el-col>
      </el-row>
      <!-- 参测对象缺陷概况 -->
      <el-row>
        <el-col :span="12" class="split-line" style="text-align:left;">参测对象缺陷概况</el-col>
      </el-row>
      <!-- 数值和图表 -->
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="11">
          <el-row class="colTitle" type="flex" justify="space-around">
            <el-col :span="3">总缺陷数</el-col>
            <el-col :span="3">有效缺陷数</el-col>
            <el-col :span="3">未关闭缺陷数</el-col>
            <el-col :span="3">新增缺陷数</el-col>
            <el-col :span="3">缺陷复测次数</el-col>
          </el-row>
          <el-row class="colNumber" type="flex" justify="space-around">
            <el-col :span="3" style="color: #3991ff;">{{ dataFormData.defectSurvey.defectCount || showNull }}</el-col>
            <el-col :span="3" style="color: #a14eff;">{{ dataFormData.defectSurvey.validCount || showNull }}</el-col>
            <el-col :span="3" style="color: #e3cf29;">{{ dataFormData.defectSurvey.notCloseCount || showNull }}</el-col>
            <el-col :span="3" style="color: #ec643e;">{{ dataFormData.defectSurvey.newAddCount || showNull }}</el-col>
            <el-col :span="3" style="color: #ff10f1;">{{ dataFormData.defectSurvey.moreTestCount || showNull }}</el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <defectCircle :defectData="defectDataList"></defectCircle>
        </el-col>
        <el-col :span="7">
          <warnCircle :warnCircle="{...dataFormData}"></warnCircle>
        </el-col>
      </el-row>
      <!--测试类型-->
      <el-row>
        <el-col :span="24" class="split-line" style="text-align:left;">缺陷分布</el-col>
        <el-col :span="24" style="text-align:center;margin-bottom:15px;">
          <el-radio-group v-model="testTypeValue" @change="doTestTypeChoose">
            <el-radio-button label="1" size="small">全量缺陷</el-radio-button>
            <el-radio-button label="2" size="small">剩余缺陷</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <test-type :testTypeData="testTypeData"></test-type>
        </el-col>
      </el-row>
      <!-- 参测对象缺陷分布 -->
      <el-row>
        <el-col :span="12" class="split-line" style="text-align:left;">参测对象缺陷分布</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <normalColumnar :normalColumnar="normalDefect"></normalColumnar>
        </el-col>
      </el-row>
      <!-- 参测对象通过率 -->
      <el-row>
        <el-col :span="12" class="split-line" style="text-align:left;">参测对象通过率</el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="padding-left:24px;">
          <template v-for="(item,index) in organizePassRate">
            <div :key="index" class="defect-province-div">
              {{index+1}}、{{item.typeName}}（{{item.provinceInfo.length}}个）：{{item.provinceInfo.length>0?item.provinceInfo.join('、'):'无'}}
            </div>
          </template>
        </el-col>
      </el-row>
    </div>
    <!-- 头部标题 -->
    <template slot="title">
      <p class="dialog-title">{{ originatName + " " + [dataFormData.parentId != null ? '子项目省测概况' : '项目省测概况'] }}</p>
    </template>
    <!-- 底部操作按钮 -->
    <template slot="footer" class="dialog-footer">
      <el-button @click="visible = false">{{ $t('cancel') }}</el-button>
    </template>
  </el-dialog>
</template>
<script>
import warnCircle from '@/views/modules/visualcenter/acommonResource/echartComponent/warnCircle'
import defectCircle from '@/views/modules/visualcenter/acommonResource/echartComponent/defectCircle'
import normalColumnar from '@/views/modules/visualcenter/acommonResource/echartComponent/normalColumnar'
import circleView from '@/views/modules/visualcenter/acommonResource/echartComponent/circleEchart'
import TestType from '@/views/modules/visualcenter/acommonResource/echartComponent/testType'
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
import provinceCaseExecDis from '@/views/modules/visualcenter/acommonResource/echartComponent/provinceCaseExecDis'
export default {
  mixins: [projectView],
  data () {
    return {
      showNull: 0,
      originatName: '',
      circleData: {},
      normalColumnar: [],
      normalDefect: [],
      defectDataList: [],
      testTypeData: {}, // 测试类型
      organizePassRate: [], // 参测对象通过率
      provinceCaseExecDis: {}, // 各省份用例执行结果分布
      visible: false,
      testTypeValue: '1', // 1:全量;2:剩余
      dataForm: {
      },
      dataFormData: {
        caseSurvey: {
          caseCount: '',
          execCount: '',
          needExecCount: '',
          caseExeAverCount: '',
          execRate: '',
          firstPassRate: '',
          lastPassRate: ''
        },
        defectSurvey: {
          defectCount: '',
          validCount: '',
          notCloseCount: '',
          newAddCount: '',
          moreTestCount: '',
          defectTypeDisMap: {}
        }
      },
      dataListLoading: false, // 数据列表，loading状态
      dataList: [], // 表单的数据接受容器
      mixinViewModuleOptions: {
        createdIsNeed: false,
        activatedIsNeed: false,
        getDataListURL: '/ctc/visualization/projectSurvey/provinceList',
        getDataListIsPage: true
      }
    }
  },
  mounted () {
  },
  components: {
    circleView,
    normalColumnar,
    defectCircle,
    warnCircle,
    TestType,
    provinceCaseExecDis
  },
  methods: {
    // 关闭事件
    closeToast () {
      this.originatName = ''
      this.circleData = {}
      this.normalColumnar = []
      this.normalDefect = []
      this.defectDataList = []
      this.testTypeData = {}
      this.provinceCaseExecDis = {}
      this.dataFormData.caseSurvey = {}
      this.dataFormData.defectSurvey = {}
      this.dataList = []
    },
    // 初始化
    init () {
      this.dataFormData.uuid = ''
      this.visible = true
      this.$nextTick(() => {
        this.dataFormData = { ...this.dataFormData, ...this.dataForm }
        this.originatName = this.dataFormData.name
        if (this.dataFormData.projectId) {
          this.getInfo()
          this.getDataList()
          // 默认加载全量
          this.testTypeValue = '1'
          this.doTestTypeChoose()
          this.getOrganizePassRate()
        }
      })
    },
    // 获取信息
    getInfo () {
      this.$http.get(this.dataFormData.parentId ? `/ctc/visualization/projectSurvey/provinceOther?projectId=${this.dataFormData.projectId}&parentId=${this.dataFormData.parentId}` : `/ctc/visualization/projectSurvey/provinceOther?projectId=${this.dataFormData.projectId}`).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        res.data.status = res.data.status + ''
        this.dataFormData = {
          ...this.dataFormData,
          ...res.data
        }
        if (res.data.caseSurvey) {
          this.dealNormalData(res.data.caseSurvey)
        }
        if (res.data.defectSurvey) {
          this.dealNormalDefect(res.data.defectSurvey)
          this.dealDefectList(res.data.defectSurvey)
        }
        // 各省份用例执行结果分布
        this.provinceCaseExecDis = res.data.provinceCaseExecDis || {}
      }).catch(() => { })
    },
    getOrganizePassRate () {
      let params = {}
      params.projectId = this.dataFormData.projectId
      params.name = this.dataFormData.name
      params.page = 1
      params.limit = 9999999
      this.$http.get('/ctc/visualization/projectSurvey/provinceList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let provinceInfoAll = []
          let provinceInfo0 = []
          let provinceInfo100 = []
          let provinceNeedExecCount = []
          let provinceExecBlockCount = []
          let data = res.data.list
          data.forEach((item, index) => {
            // 判断通过率省份
            let finalCasepassRate = parseFloat(item.finalCasepassRate)
            provinceInfoAll.push(item.organizeName)
            if (finalCasepassRate <= 0) {
              provinceInfo0.push(item.organizeName)
            } else if (finalCasepassRate >= 100) {
              provinceInfo100.push(item.organizeName)
            }
            // 判断待测省份
            if (item.needExecCount > 0) {
              provinceNeedExecCount.push(item.organizeName)
            }
            // 判断受阻省份
            if (item.execBlockCount > 0) {
              provinceExecBlockCount.push(item.organizeName)
            }
          })
          // 参测对象通过率
          let organizePassRate = [
            { 'typeName': '参测省', 'provinceInfo': provinceInfoAll },
            { 'typeName': '通过率0%省份', 'provinceInfo': provinceInfo0 },
            { 'typeName': '通过率100%省份', 'provinceInfo': provinceInfo100 },
            { 'typeName': '含未执行用例省份', 'provinceInfo': provinceNeedExecCount },
            { 'typeName': '含测试受阻用例省份', 'provinceInfo': provinceExecBlockCount }]
          this.organizePassRate = organizePassRate
        }
      }).catch(() => { })
    },
    // 处理用例数据
    dealNormalData (val) {
      this.normalColumnar.push(val.noExecuteCountResult)
      this.normalColumnar.push(val.passCountResult)
      this.normalColumnar.push(val.notPassCountResult)
      this.normalColumnar.push(val.notTestCountResult)
      this.normalColumnar.push(val.testBalkCountResult)
      this.normalColumnar.push(val.notCanTestCountResult)
      return JSON.parse(JSON.stringify(this.normalColumnar))
    },
    // 处理缺陷数据
    dealNormalDefect (val) {
      this.normalDefect.push(val.rejected)
      this.normalDefect.push(val.toRepair)
      this.normalDefect.push(val.repaired)
      this.normalDefect.push(val.hangUp)
      this.normalDefect.push(val.vetoConfirmation)
      this.normalDefect.push(val.toBeVerified)
      this.normalDefect.push(val.toBeReleased)
      return JSON.parse(JSON.stringify(this.normalDefect))
    },
    // 缺陷率与及时率
    dealDefectList (val) {
      var nameList = ['缺陷率', '及时率']
      var valueList = [val.defectRate, val.inTimeRate]
      for (var b = 0; b < nameList.length; b++) {
        var obj = {}
        obj.name = nameList[b]
        obj.value = valueList[b]
        this.defectDataList.push(obj)
      }
      return JSON.parse(JSON.stringify(this.defectDataList))
    },
    // 测试类型切换
    doTestTypeChoose () {
      this.getTestTypeData()
    },
    getTestTypeData () {
      let params = {}
      params.projectId = this.dataFormData.projectId
      params.testType = this.testTypeValue
      this.$http.get('/ctc/visualization/projectSurvey/statDefectType', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let data = res.data
          data.projectId = data.projectId ? data.projectId : this.dataFormData.projectId
          this.testTypeData = data
        }
      }).catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-title {
  font-size: 20px;
  text-align: center;
}
.colTitle {
  font-size: 14px;
  text-align: center;
  padding: 10px;
}
.colNumber {
  font-size: 30px;
  text-align: center;
  padding: 10px;
}
.defect-province-div {
  padding: 0px 24px;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 700;
  line-height: 25px;
  letter-spacing: 2px;
}
</style>
