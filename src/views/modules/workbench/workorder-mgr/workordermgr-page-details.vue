<template>
  <el-card shadow="never" class="aui-card--fill  project-mgr-page">
    <el-row style="margin-bottom:20px;">
      <el-col :span="12" class="split-line" style="text-align:left;">
        列表展示
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <el-button type="primary" size="small" @click="submitD">批量提交</el-button>
        <el-button type="primary" size="small">批量催单</el-button>
      </el-col>
    </el-row>
    <el-table stripe highlight-current-row v-loading="dataListLoading" :data="dataList" border lazy @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%;">
      <el-table-column type="selection" width="50" align="center" :selectable="selectable"></el-table-column>
      <template v-for="(item, index) in titleDataList">
        <el-table-column v-if="item.code!='operate'" :key="index" :label="item.name" :width="getTableColumnWidth(item)" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="item.code!='orderStatus'" v-html="getTableColumnData(scope.row,item)"></span>
            <template v-else>
              <el-tag v-if="scope.row.orderStatus == 0" size="small" type="info" v-html="getTableColumnData(scope.row,item)"></el-tag>
              <el-tag v-else-if="scope.row.orderStatus == 1" size="small" type="success" v-html="getTableColumnData(scope.row,item)"></el-tag>
              <el-tag v-else-if="scope.row.orderStatus == 2" size="small" type="success" v-html="getTableColumnData(scope.row,item)"></el-tag>
              <el-tag v-else-if="scope.row.orderStatus == 3" size="small" v-html="getTableColumnData(scope.row,item)"></el-tag>
            </template>
          </template>
        </el-table-column>
      </template>
      <el-table-column fixed="right" width="240" label="操作" header-align="center" align="center">
        <template slot-scope="scope">
          <el-button @click="doTableOperate(item,scope.row)" :disabled="scope.row.orderStatus===2&&item==='1'||scope.row.orderStatus===2&&item==='2'" type="text" size="small" :key="index" v-for="(item, index) in scope.row.operate">
            {{ $getDictLabel('orderManagementType',item) }}
          </el-button>
          <el-button @click="doReminderRecords(scope.row)" type="text" size="small">催单记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 催单 -->
    <reminder v-if="reminderVisible" ref="reminder" @refreshDataList="getProjectInfo"></reminder>
    <!--催单记录-->
    <reminder-records :visible.sync="reminderRecords" ref="reminderRecords"></reminder-records>
    <!-- 工单日志 -->
    <journal v-if="journalVisible" ref="journal"></journal>
  </el-card>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { addDynamicRoute } from '@/router'
import reminder from './reminder'
import reminderRecords from './reminder-records'
import journal from './journal'
export default {
  mixins: [mixinViewModule],
  name: 'workordermgr-page-details',
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      reminderVisible: false,
      reminderRecords: false,
      journalVisible: false,
      projectTreeData: [],
      treeStatus: true,
      dataListLoading: false,
      dataList: [],
      titleDataList: []
    }
  },
  computed: {},
  activated () {
    this.getData()
  },
  mounted () {
    this.getData()
  },
  methods: {
    selectable (data, index) {
      if (data.orderStatus === 2) {
        return false
      } else {
        return true
      }
    },
    getTableColumnWidth (item) {
      let width = 120
      if (['orderTitle', 'parentProject', 'project', 'userName', 'updateDate'].includes(item.code)) {
        width = 180
      } else if (['orderId'].includes(item.code)) {
        width = 210
      }
      return width
    },
    getDataRe () {
      this.page = 1
      this.getData()
    },
    getData () {
      this.dataListLoading = true
      let params = { 'orderId': this.$route.params.rows.orderId, 'orderDealId': this.$route.params.rows.orderDealId }
      this.$http.get('/ctc/task/workOrder/subList', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.dataListLoading = false
          this.titleDataList = this.$route.params.dataTitle
          let list = res.data
          for (let i = 0; i < list.length; i++) {
            if (!list[i].parentProject) {
              list[i].parentProject = list[i].project
              list[i].project = ''
            }
          }
          this.dataList = list
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'orderType') {
        columnValue = this.$getDictLabel('workOrder.type', row[item.code])
      } else if (item.code === 'orderStatus') {
        columnValue = this.$getDictLabel('dealStatus', row[item.code])
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    doTableOperate (type, row) {
      let path = ''
      let title = ''
      let params = {}
      if (type === '2') { // 催单
        this.reminder([row])
      } else if (type === '3') { // 工单日志
        this.journal(row.orderId)
      } else if (type === '4') { // 查看
        path = 'workbench/mytodo/toDealWith/requirementAnalysis'
        title = '我的工单'
        params.type = 'order' // order--去处理子路由判断进来的是什么类型
        params.rows = row
        // 特殊处理缺陷中心待办
        if (row.orderType === 8) {
          path = 'defectcenter/defect-mgr/defect-data-detail'
          params.defectId = row.defectId
        }
      } else if (type === '1') {
        // 提交
        this.$confirm('确认是否提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = {}
          ids.orderIds = []
          ids.orderDealIds = []
          if (row.orderDealId !== null) {
            ids.orderDealIds.push(row.orderDealId)
          } else {
            ids.orderIds.push(row.orderId)
          }
          this.sub(ids)
        }).catch(() => {
        })
      }
      this.customAddDynamicRoute(path, title, params)
    },
    customAddDynamicRoute (path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {}
      }
      addDynamicRoute(routeParams, this.$router)
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.getDataRe()
    },
    submitD () {
      if (this.dataListSelections.length === 0) {
        this.$message.warning('请选择需要提交的工单！！！')
      } else {
        console.log(this.dataListSelections)
        this.$confirm('将进行批量提交, 是否继续?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = {}
          ids.orderIds = []
          ids.orderDealIds = []
          for (let i = 0; i < this.dataListSelections.length; i++) {
            if (this.dataListSelections[i].orderDealId !== null) {
              ids.orderDealIds.push(this.dataListSelections[i].orderDealId)
            } else {
              ids.orderIds.push(this.dataListSelections[i].orderId)
            }
          }
          this.sub(ids)
        }).catch(() => { })
      }
    },
    sub (ids) {
      this.$ctcLoading.open()
      // let params = { 'ids': ids }
      this.$http.post('/ctc/task/orderHandle/submitList', ids).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.$message.success('提交成功')
          this.getDataRe()
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    setStatus (orderDealId, status) {
      let params = { orderDealId: orderDealId, status: status }
      this.$http.post('/ctc/task/workOrder/dealUp', params).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.getData()
        }
      }).catch(() => {
      })
    },
    // 工单催办记录
    doReminderRecords (row) {
      this.$refs.reminderRecords.orderId = row.orderId || ''
      this.$refs.reminderRecords.orderDealId = row.orderDealId || ''
      this.$refs.reminderRecords.init()
    }
  },
  components: {
    reminder,
    reminderRecords,
    journal
  }
}
</script>

<style scoped>
</style>
