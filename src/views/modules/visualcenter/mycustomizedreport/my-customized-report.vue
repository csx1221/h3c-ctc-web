<template>
  <el-card shadow="never" class="aui-card--fill">
    <div>
      <el-container>
        <el-row style="width: 100%">
          <el-col :span="24">
            <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="getDataLists()" :inline="false" label-position="right" label-width="80px">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="项目名称">
                    <el-input v-model="dataForm.projectName" placeholder="请输入内容" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="标签名称">
                    <el-select v-model="labelId" multiple collapse-tags clearable placeholder="请选择标签名称">
                      <el-option v-for="item in labelList" :key="item.labelId" :label="item.labelName" :value="item.labelId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="时间范围">
                    <el-date-picker clearable value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="请选择开始日期" end-placeholder="请选择结束日期" @change="onDateTime" v-model="dateTimeArr" align="right">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6" style="text-align:right">
                  <el-button type="primary" size="small" @click="getDataLists()">查询</el-button>
                  <el-button size="small" @click="resetSelectInfo()">重置</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
          <el-col :span="24">
            <el-container style="border: 1px solid #eee">
              <el-aside width="200px" style="text-align:center;">
                <el-menu default-active="1" style="height: 100%;">
                  <div style="background:rgba(38, 198, 218, 0.85);margin:0;height:47px;text-align:center;color:#ffffff;line-height:47px;font-size:18px;">报告列表</div>
                  <template v-for="(item ,index) in menuList">
                    <el-menu-item-group :key="index">
                      <el-menu-item @click="getTableData(item.type)" :index="item.type">{{item.name}}</el-menu-item>
                    </el-menu-item-group>
                  </template>
                </el-menu>
              </el-aside>
              <el-container>
                <el-main style="padding:0">
                  <template v-if="activeIndex==='1'">
                    <div style="margin: 20px">
                      <project-pass-rate ref="list11" :data-forms="dataForm" @doSomeThing="doAction"></project-pass-rate>
                    </div>
                    <div style="margin: 20px">
                      <object-passing-rate ref="list12"></object-passing-rate>
                    </div>
                  </template>
                  <template v-if="activeIndex==='2'">
                    <div style="margin: 20px">
                      <project-schedule ref="list21" :data-forms="dataForm" @doSomeThing="doAction"></project-schedule>
                    </div>
                    <div style="margin: 20px">
                      <object-schedule ref="list22"></object-schedule>
                    </div>
                  </template>
                  <template v-if="activeIndex==='3'">
                    <div style="margin: 20px">
                      <project-quality ref="list31" :data-forms="dataForm" @doSomeThing="doAction"></project-quality>
                    </div>
                    <div style="margin: 20px">
                      <object-quality ref="list32"></object-quality>
                    </div>
                  </template>
                  <template v-if="activeIndex==='4'">
                    <div style="margin: 20px">
                      <workload ref="list41" :data-forms="dataForm"></workload>
                    </div>
                  </template>
                  <template v-if="activeIndex==='5'">
                    <div style="margin: 20px">
                      <project-number ref="list51" :data-forms="dataForm"></project-number>
                    </div>
                  </template>
                  <template v-if="activeIndex==='6'">
                    <div style="margin: 20px">
                      <stage-project-number ref="list61" :data-forms="dataForm"></stage-project-number>
                    </div>
                  </template>
                </el-main>
              </el-container>
            </el-container>
          </el-col>
        </el-row>
      </el-container>
    </div>
  </el-card>
</template>

<script>
import projectView from '@/views/modules/visualcenter/acommonResource/project-view-module'
import projectPassRate from './passRate/projectPassRate' // 项目通过率
import objectPassingRate from './passRate/objectPassingRate' // 参测对象通过率
import projectSchedule from './schedule/projectSchedule' // 项目进度
import objectSchedule from './schedule/objectSchedule' // 参测对象进度
import projectQuality from './quality/projectQuality' // 项目质量
import objectQuality from './quality/objectQuality' // 参测对象质量
import workload from './workload/workload' // 工作量
import projectNumber from './projectNumber/projectNumber' // 在测项目数
import stageProjectNumber from './stageProjectNumber/stageProjectNumber' // 阶段项目数
export default {
  mixins: [projectView],
  data () {
    return {
      underline: false,
      mixinViewModuleOptions: {
        createdIsNeed: false
        // getDataListURL: '/ctc/visualization/projectSurvey/parentList',
        // getDataListIsPage: true,
        // deleteURL: '/ctc/servicebus/routedic'
      },
      dataForm: {
        startDate: '',
        endDate: '',
        labelId: '',
        projectName: ''
      },
      labelId: [],
      activeIndex: '1',
      menuList: [
        {
          name: '通过率',
          type: '1'
        },
        {
          name: '进度',
          type: '2'
        },
        {
          name: '质量',
          type: '3'
        },
        {
          name: '工作量',
          type: '4'
        },
        {
          name: '在测项目数',
          type: '5'
        },
        {
          name: '阶段项目数',
          type: '6'
        }
      ],
      dataListLoading: false, // 数据列表，loading状态
      dataList: [], // 获取分页列表的数据
      labelList: []
    }
  },
  components: {
    projectPassRate,
    objectPassingRate,
    projectSchedule,
    objectSchedule,
    projectQuality,
    objectQuality,
    workload,
    projectNumber,
    stageProjectNumber
  },
  computed: {},
  mounted () {
    this.getLabelData()
  },
  watch: {
    labelId: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (newVal === '' || newVal === null) {
          this.dataForm.labelId = ''
        } else {
          this.dataForm.labelId = newVal.join(',')
        }
      }
    },
    dateTimeArr: {
      deep: true,
      handler: function (newVal, oldVal) {
        if (this.dateTimeArr === '' || this.dateTimeArr === null) {
          this.dataForm.startDate = ''
          this.dataForm.endDate = ''
        } else {
          this.dataForm.startDate = newVal[0]
          this.dataForm.endDate = newVal[1]
        }
      }
    }
  },
  methods: {
    getLabelData () {
      this.$http.get('/ctc/project/projectLabel/getProjectLabelList').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.labelList = res.data.data.list
      }).catch(() => {

      })
    },
    // 重置初始条件状态
    resetSelectInfo () {
      this.dateTimeArr = ''
      this.dataForm.labelId = ''
      this.labelId = ''
      this.dataForm.projectName = ''
      this.$nextTick(() => {
        this.getDataLists()
      })
    },
    getTableData (type) {
      this.activeIndex = type
    },
    getDataLists () {
      if (this.activeIndex === '5' || this.activeIndex === '6') {
        this.$refs['list' + this.activeIndex + '1'].getProjectNumberData()
      } else {
        this.$refs['list' + this.activeIndex + '1'].getDataList()
      }
    },
    doAction (row) {
      if (this.activeIndex === '1' || this.activeIndex === '2' || this.activeIndex === '3') {
        this.$refs['list' + this.activeIndex + '2'].dataForm.projectId = row.projectId
        this.$refs['list' + this.activeIndex + '2'].dataForm.startDate = this.dataForm.startDate
        this.$refs['list' + this.activeIndex + '2'].dataForm.endDate = this.dataForm.endDate
        this.$refs['list' + this.activeIndex + '2'].dataForm.labelId = this.dataForm.labelId
        this.$refs['list' + this.activeIndex + '2'].getDataList()
      } else {
        this.$refs['list' + this.activeIndex + '2'].dataForm.projectId = row.projectId
        this.$refs['list' + this.activeIndex + '2'].getDataList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}
</style>
