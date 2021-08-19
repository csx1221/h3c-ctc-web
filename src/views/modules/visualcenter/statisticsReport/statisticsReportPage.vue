<template>
  <el-container style="height: 100%;" class="report-list-show">
    <split-bar :max="50" :min="1" :visual="true" @watchEcharts="echartsResize">
      <div slot='split_left' style="background-color: white;height: 100%;">
        <el-row>
          <el-col :span="22" class="split-line">
            我的报表
          </el-col>
          <el-col :span="2" class="toolbars">
            <div @click="getTemplateData"><img src="../../../../assets/img/reload2.png" /></div>
          </el-col>
        </el-row>
        <el-tree highlight-current :data="templateListData" :load="loadTemplateData" lazy :props="defaultProps" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" style="overflow-y:auto;overflow-x:hidden;">
          <span class="custom-tree-node" :title="data.templateName" slot-scope="{ node, data }" style="display:block;">
            <span>{{data.templateName}}</span>
          </span>
        </el-tree>
      </div>
      <el-container slot='split_right'>
        <div v-if="visible" style="width: 100%;text-align: center;line-height: 50;font-size: 18px;-webkit-box-flex: 1;box-sizing: border-box;flex: 1 1 auto;overflow: auto;">
          <span>请点击左侧报表菜单进行数据查询</span>
        </div>
        <div v-if="!visible" style="-webkit-box-flex: 1;box-sizing: border-box;flex: 1 1 auto;overflow: auto;">
          <report-list v-if="!visible" ref="reportList" @chartList="searchChartList"></report-list>
          <chart-list v-if="!visible" ref="chartList"></chart-list>
        </div>
      </el-container>
    </split-bar>
  </el-container>
</template>
<script>
import ReportList from './report-list'
import ChartList from './chart-list'
export default {
  name: 'ReportPage',
  components: { ReportList, ChartList },
  data () {
    return {
      templateData: {
        templateId: '',
        templateName: '',
        statisticalDimension: ''
      },
      temporaryManagerData: [],
      templateListData: [],
      defaultProps: {
        id: 'templateId',
        isLeaf: 'leaf'
      },
      visible: true
    }
  },
  watch: {
  },
  computed: {},
  mounted () {},
  created () {
    this.getDictList()
    this.getManagerData()
  },
  methods: {
    echartsResize () {
      this.$nextTick(() => {
        if (this.$refs['chartList']) {
          let chartObjs = this.$refs['chartList'].chartObjs
          for (let i = 0; i < chartObjs.length; i++) {
            chartObjs[i].resize()
          }
        }
      })
    },
    getTemplateData () {
      this.$http.get('/ctc/visualization/templateSetting/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        let data = res.data
        data.map((item, index) => {
          item.leaf = true
        })
        this.templateListData = data
      }).catch(() => {
        this.templateListData = []
      })
      this.visible = true
    },
    loadTemplateData (node, resolve) {
      this.$http.get('/ctc/visualization/templateSetting/list').then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        let data = res.data
        data.map((item, index) => {
          item.leaf = true
        })
        resolve(data)
      }).catch(() => {})
    },
    handleNodeClick (data) {
      if (this.visible) {
        this.visible = false
      }
      this.$nextTick(() => {
        this.templateData.templateId = data.templateId
        this.templateData.templateName = data.templateName
        this.templateData.statisticalDimension = data.statisticalDimension
        this.$refs['reportList'].isOpen = false
        this.$refs['reportList'].templateData = { ...this.templateData }
        this.$refs['chartList'].templateData = { ...this.templateData }
        this.getTemplateManagerIds()
      })
    },
    searchChartList (dataForm) {
      let params = dataForm
      for (var val in params) {
        params[val] = params[val].toString()
      }
      this.$refs['chartList'].getChartDataList(params)
    },
    getDictList () {
      this.$http.get('/sys/dict/type/all').then(({ data: res }) => {
        if (res.code !== 0) {
          return
        }
        window.SITE_CONFIG['dictList'] = res.data
      }).catch(() => {})
    },
    getManagerData () {
      let params = { 'page': 1, 'limit': 999999999 }
      this.$http.get('/sys/project/select/manager', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.temporaryManagerData = res.data.list
        }
      }).catch(() => {
      })
    },
    getTemplateManagerIds () {
      this.$http.get('/ctc/visualization/reportForm/getTemplateManagerIds?templateId=' + this.templateData.templateId).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          let resData = res.data
          this.$refs['reportList'].managerData = []
          for (let i = 0; i < resData.length; i++) {
            for (let j = 0; i < this.temporaryManagerData.length; j++) {
              if (resData[i] === this.temporaryManagerData[j].id) {
                this.$refs['reportList'].managerData.push({ id: this.temporaryManagerData[j].id, realName: this.temporaryManagerData[j].realName, username: this.temporaryManagerData[j].username })
                break
              }
            }
          }
        }
      }).catch(() => {
      })
    }
  }
}
</script>
<style  lang="scss" >
.toolbars {
  margin-top: 5px;
  text-align: right;
  div {
    float: right;
    margin: 5px 5px;
    cursor: pointer !important;
  };
}
.report-list-show .resize-wrap .resize-left {
  overflow: auto;
}
.report-list-show .resize-wrap .resize-left .el-row {
  overflow: hidden;
}
</style>
