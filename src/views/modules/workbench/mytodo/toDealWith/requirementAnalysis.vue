<template>
  <div class="ctc-handle">
    <div class="fiexdTop" v-if="submitList.length>0">
      <el-card shadow="never" class="aui-card--fill fiexdTop-center">
        <template v-for="(item, index) in submitList">
          <el-button :key="index" type="primary" :icon="item.icon" @click="submitWork(item.type)">{{$getDictLabel('orderOperateType',item.type)}}</el-button>
        </template>
      </el-card>
    </div>
    <el-card shadow="never" class="aui-card--fill  marginTop" :class="{marginTopInit:submitList.length===0}">
      <h1>{{title}}</h1>
      <el-collapse v-model="activeNames" @change="handleChange">
        <template v-for="(item, index) in stepsList">
          <el-collapse-item :name="index" :key="index">
            <template slot="title">
              <el-button type="text">{{item.name}}</el-button>
              <p class="line_black"></p>
            </template>
            <div>
              <!--工单信息wo_info 工单处理wo_handle 工单日志wo_log 处理结果wo_result-->
              <work-order-information v-if="item.routeType==='wo_info'" :orderId="orderId" :orderType="orderType" ref="workOrderInformation" @getDemandId="getDemandId" @showResultData="showResultData"></work-order-information>
              <work-order-processing v-if="item.routeType==='wo_handle'" :isDisable="isDisable" :orderData="rows" :orderType="orderType" :inType="inType" ref="workOrderProcessing" @submitData="submitData"></work-order-processing>
              <workOrderLog v-if="item.routeType==='wo_log'" :orderId="orderId" ref="workOrderLog"></workOrderLog>
              <result v-if="item.routeType==='wo_result'" :data="item.data"></result>
            </div>
          </el-collapse-item>
        </template>
      </el-collapse>
      <!-- 转单 -->
      <transfer-order v-if="transferOrderVisible" ref="transferOrder"></transfer-order>
    </el-card>
  </div>
</template>
<script>
import mixinViewModule from '@/mixins/view-module'
import TransferOrder from '../transferOrder'
import workOrderInformation from '@/components/workbench/work-order-information'
import workOrderProcessing from '@/components/workbench/work-order-processing'
import workOrderLog from '@/components/workbench/work-order-log'
import result from '@/components/workbench/result'
import { removeCurrentTabsHandle } from '@/router'
export default {
  mixins: [mixinViewModule],
  name: 'MytodoPage',
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      inType: '',
      rows: '',
      orderId: '',
      orderType: '',
      title: '',
      transferOrderVisible: false,
      activeNames: [0, 1, 2, 4, 5],
      id: '',
      type: 2,
      submitList: [], // 动态按钮
      stepsList: [], // 动态选择组件
      isDisable: false,
      demandId: '' // 需求id
    }
  },
  computed: {},
  mounted () {
    this.setType()
  },
  methods: {
    setType () {
      this.inType = this.$route.params.type
      this.rows = this.$route.params.rows
      this.orderId = this.rows.orderId
      this.orderType = this.rows.orderType
      this.title = this.rows.orderTitle
      if (this.inType === 'pending') { // 入口 待办去处理
        if (this.rows.orderType === 1) { // 需求分析
          this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }, { name: '保存', icon: '', type: '3' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单处理', routeType: 'wo_handle' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 2) { // 需求评审
          this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }, { name: '保存', icon: '', type: '3' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '我的意见', routeType: 'wo_handle' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 3) { // 方案设计
          this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }, { name: '保存', icon: '', type: '3' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单处理', routeType: 'wo_handle' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 4) { // 方案评审
          this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }, { name: '保存', icon: '', type: '3' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '我的意见', routeType: 'wo_handle' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 5) { // 用例设计
          this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '用例信息', routeType: 'wo_handle' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 6) { // 用例评审
          this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '用例信息', routeType: 'wo_handle' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 7) { // 用例执行
          this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '执行信息', routeType: 'wo_handle' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 8) { // 用例缺陷
          this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }]
          this.stepsList = [{ name: '缺陷信息', routeType: 'wo_handle' }]
        }
        this.$nextTick(() => {
          // 特殊处理缺陷中心
          if (this.orderType !== 8) {
            this.$refs.workOrderInformation[0].getData('/ctc/task/orderHandle/base/')
          }
        })
      } else if (this.inType === 'processed') { // 入口 已办去处理
        this.isDisable = true
        if (this.rows.orderType === 1) { // 需求分析
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 2) { // 需求评审
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 3) { // 方案设计
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 4) { // 方案评审
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 5) { // 用例设计
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '用例设计', routeType: 'wo_handle' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 6) { // 用例评审
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '用例评审', routeType: 'wo_handle' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 7) { // 用例执行
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '用例执行', routeType: 'wo_handle' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 8) { // 用例缺陷
          this.stepsList = [{ name: '缺陷信息', routeType: 'wo_handle' }]
        }
        this.$nextTick(() => {
          // 特殊处理缺陷中心
          if (this.orderType !== 8) {
            this.$refs.workOrderInformation[0].getData('/ctc/task/orderHandle/base/')
          }
        })
      } else if (this.inType === 'order') { // 入口 工单去处理
        if (this.rows.orderType === 1) { // 需求分析
          // this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }, { name: '保存', icon: '', type: '3' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 2) { // 需求评审
          // this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }, { name: '保存', icon: '', type: '3' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 3) { // 方案设计
          // this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }, { name: '保存', icon: '', type: '3' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 4) { // 方案评审
          // this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }, { name: '保存', icon: '', type: '3' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 5) { // 用例设计
          // this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 6) { // 用例评审
          // this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 7) { // 用例执行
          // this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }]
          this.stepsList = [{ name: '工单信息', routeType: 'wo_info' }, { name: '工单日志', routeType: 'wo_log' }]
        } else if (this.rows.orderType === 8) { // 用例缺陷
          // this.submitList = [{ name: '提交', icon: 'el-icon-upload2', type: '1' }, { name: '转单', icon: '', type: '2' }]
          this.stepsList = [{ name: '缺陷信息', routeType: 'wo_handle' }]
        }
        this.$nextTick(() => {
          // 特殊处理缺陷中心
          if (this.orderType !== 8) {
            this.$refs.workOrderInformation[0].getData('/ctc/task/orderHandle/baseList/')
          }
        })
      }
    },
    handleChange (val) {
      console.log(val)
    },
    // 按钮
    submitWork (type) {
      //  1 提交 2转单 3 保存
      if (type === '1') {
        this.$refs.workOrderProcessing[0].submitForm(type)
      } else if (type === '3') {
        this.$refs.workOrderProcessing[0].submitForm(type)
      } else if (type === '2') {
        // 转单 ,特殊处理，兼容缺陷中心转单
        let projectId = this.rows.projectId || this.rows.parentProjectId
        let orderDealId = this.rows.orderDealId || this.rows.defectId
        let orderType = this.rows.orderType || 8
        let handlerType = this.rows.handlerType || 8
        this.transferOrder(projectId, [orderDealId], orderType, handlerType)
      }
    },
    submitData (type) {
      if (type === '1') {
        this.$confirm('确认是否提交?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.successSubmit('/ctc/task/orderHandle/submit', type)
        }).catch(() => {
        })
      } else {
        this.successSubmit('/ctc/task/orderHandle/keep', type)
      }
    },
    successSubmit (url, type) {
      let thisvm = this
      this.$ctcLoading.open()
      // 特殊处理缺陷中心提交
      let params = { orderId: this.rows.orderId, orderDealId: this.rows.orderDealId, orderType: this.rows.orderType, demandId: this.demandId, id: this.id, ...this.$refs.workOrderProcessing[0].getDataForm() }
      if (params.orderType === 8) {
        url = '/ctc/defect/base/deal'
        params.defectId = [params.defectId]
      }
      this.$http.post(url, params).then(({ data: res }) => {
        this.$ctcLoading.close()
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.$message({
            message: type === '1' ? '提交成功' : '保存成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              if (type === '1') {
                removeCurrentTabsHandle(thisvm)
              } else {
                this.id = res.data
              }
            }
          })
        }
      }).catch(() => {
        this.$ctcLoading.close()
      })
    },
    // 当有处理结果时 则展示
    showResultData (data) {
      console.log(data)
      if (![5, 6].includes(this.orderType)) {
        this.stepsList.splice(1, 0, { name: '处理结果', routeType: 'wo_result', data: data })
        this.id = data[0].id
      }
      this.$nextTick(() => {
        this.$refs.workOrderProcessing[0].resultData(data[0].result, data[0].attachementId)
      })
      this.activeNames = []
      for (var i = 0; i < this.stepsList.length; i++) {
        this.activeNames.push(i)
      }
    },
    // 接收demandId
    getDemandId (id) {
      this.demandId = id
    }
  },
  components: {
    TransferOrder,
    workOrderInformation,
    workOrderProcessing,
    workOrderLog,
    result
  }
}
</script>
<style lang="scss">
.ctc-handle {
  .el-collapse,
  .el-collapse-item__header,
  .el-collapse-item__wrap {
    border: none;
  }
}
.stepsAuto {
  .el-step__icon {
    width: 60px !important;
    height: 60px !important;
  }
  .el-step.is-vertical .el-step__head {
    width: 80px !important;
  }
  .el-step.is-vertical .el-step__line {
    left: 30px !important;
  }
}
</style>
<style>
.aui-sidebar--fold .fiexdTop {
  left: 79px !important;
}
</style>
<style lang="scss" scoped>
.fiexdTop {
  position: fixed;
  left: 245px;
  right: 15px;
  top: 85px;
  z-index: 10;
  transition: left 0.3s;
  padding-top: 15px;
  background-color: #f1f4f5;
}
.marginTop {
  position: relative;
  top: 90px;
  margin-bottom: 90px;
}
.marginTopInit {
  top: 0;
}
.line_black {
  background-color: #ebeef5;
  height: 1px;
  width: 100%;
  margin: 0 5px;
}
</style>
