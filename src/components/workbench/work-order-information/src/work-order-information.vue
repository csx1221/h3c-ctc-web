<template>
  <div>
    <el-row>
      <template v-for="(item,index) in list">
        <el-col v-if="item.type==='text'&&getTableColumnData(dataList,item)!==''&&getTableColumnData(dataList,item)!==null" :key="index" :span="item.span" class="is_flex">
          <div class="flex_left">{{item.name}}:</div>
          <div class="flex_right" v-html="getTableColumnData(dataList,item)"></div>
        </el-col>
        <el-col v-else-if="item.type==='file'" :key="index" :span="item.span" class="is_flex">
          <div class="flex_left">{{item.name}}:</div>
          <div class="flex_right">
            <el-link type="primary">{{getTableColumnData(dataList,item)}}</el-link>
          </div>
        </el-col>
        <el-col v-else-if="item.type==='tableDemandData'" :key="index" :span="item.span" class="is_flex">
          <div class="flex_left">{{item.name}}:</div>
          <div class="flex_right">
            <el-table :data="demandData" stripe border style="width: 100%;">
              <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>
              <template v-for="(item2, index2) in item.titleDataList">
                <el-table-column v-if="item2.code==='attachementId'" :key="index2" :label="item2.name" align="center">
                  <template slot-scope="scope">
                    <ctc-download-table :id="scope.row.attachementId"></ctc-download-table>
                  </template>
                </el-table-column>
                <el-table-column v-else :key="index2" :label="item2.name" align="center">
                  <template slot-scope="scope">
                    <span v-html="getTableColumnData(scope.row,item2)"></span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </div>
        </el-col>
        <el-col v-else-if="item.type==='tableProOrderData'" :key="index" :span="item.span" class="is_flex">
          <div class="flex_left">{{item.name}}:</div>
          <div class="flex_right">
            <el-table :data="proOrderData" stripe border style="width: 100%;">
              <el-table-column type="index" width="55" label="序号" align="center"></el-table-column>
              <template v-for="(item2, index2) in item.titleDataList">
                <el-table-column v-if="item2.code==='attachementId'" :key="index2" :label="item2.name" align="center">
                  <template slot-scope="scope">
                    <ctc-download-table :id="scope.row.attachementId"></ctc-download-table>
                  </template>
                </el-table-column>
                <el-table-column v-else :key="index2" :label="item2.name" align="center">
                  <template slot-scope="scope">
                    <span v-html="getTableColumnData(scope.row,item2)"></span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </div>
        </el-col>
      </template>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'workOrderInformation',
  data () {
    return {
      // orderType1 代表工单类型为1的列表 之后工单以此类推  orderType1内的type 'text'为文本 file为文件下载 table为列表
      listType: {
        orderType1: [
          { name: '工单编号', code: 'orderId', span: 8, type: 'text' },
          { name: '创建人', code: 'creatorName', span: 8, type: 'text' },
          { name: '处理人员', code: 'orderDealInfo', span: 24, type: 'text' },
          { name: '所属项目', code: 'parentProjectName', span: 8, type: 'text' },
          { name: '所属子项目', code: 'projectName', span: 8, type: 'text' },
          { name: '开始日期', code: 'createDate', span: 8, type: 'text' },
          { name: '计划结束日期', code: 'planEndTime', span: 8, type: 'text' },
          { name: '任务内容', code: 'taskContent', span: 24, type: 'text' }
        ],
        orderType2: [
          { name: '工单编号', code: 'orderId', span: 8, type: 'text' },
          { name: '创建人', code: 'creatorName', span: 8, type: 'text' },
          { name: '处理人员', code: 'orderDealInfo', span: 24, type: 'text' },
          { name: '所属项目', code: 'parentProjectName', span: 8, type: 'text' },
          { name: '所属子项目', code: 'projectName', span: 8, type: 'text' },
          { name: '开始日期', code: 'createDate', span: 8, type: 'text' },
          { name: '计划结束日期', code: 'planEndTime', span: 8, type: 'text' },
          { name: '任务内容', code: 'taskContent', span: 24, type: 'text' }
        ],
        orderType3: [
          { name: '工单编号', code: 'orderId', span: 8, type: 'text' },
          { name: '创建人', code: 'creatorName', span: 8, type: 'text' },
          { name: '处理人员', code: 'orderDealInfo', span: 24, type: 'text' },
          { name: '所属项目', code: 'parentProjectName', span: 8, type: 'text' },
          { name: '所属子项目', code: 'projectName', span: 8, type: 'text' },
          { name: '开始日期', code: 'createDate', span: 8, type: 'text' },
          { name: '计划结束日期', code: 'planEndTime', span: 8, type: 'text' },
          { name: '任务内容', code: 'taskContent', span: 24, type: 'text' }
        ],
        orderType4: [
          { name: '工单编号', code: 'orderId', span: 8, type: 'text' },
          { name: '创建人', code: 'creatorName', span: 8, type: 'text' },
          { name: '处理人员', code: 'orderDealInfo', span: 24, type: 'text' },
          { name: '所属项目', code: 'parentProjectName', span: 8, type: 'text' },
          { name: '所属子项目', code: 'projectName', span: 8, type: 'text' },
          { name: '开始日期', code: 'createDate', span: 8, type: 'text' },
          { name: '计划结束日期', code: 'planEndTime', span: 8, type: 'text' },
          { name: '任务内容', code: 'taskContent', span: 24, type: 'text' }
        ],
        orderType5: [
          { name: '工单编号', code: 'orderId', span: 8, type: 'text' },
          { name: '所属项目', code: 'parentProjectName', span: 8, type: 'text' },
          { name: '所属子项目', code: 'projectName', span: 8, type: 'text' },
          { name: '创建人', code: 'creatorName', span: 8, type: 'text' },
          { name: '处理人员', code: 'orderDealInfo', span: 24, type: 'text' },
          { name: '开始日期', code: 'createDate', span: 8, type: 'text' },
          { name: '计划结束日期', code: 'planEndTime', span: 8, type: 'text' },
          { name: '任务内容', code: 'taskContent', span: 24, type: 'text' }
        ],
        orderType6: [
          { name: '工单编号', code: 'orderId', span: 8, type: 'text' },
          { name: '所属项目', code: 'parentProjectName', span: 8, type: 'text' },
          { name: '所属子项目', code: 'projectName', span: 8, type: 'text' },
          { name: '创建人', code: 'creatorName', span: 8, type: 'text' },
          { name: '处理人员', code: 'orderDealInfo', span: 24, type: 'text' },
          { name: '开始日期', code: 'createDate', span: 8, type: 'text' },
          { name: '计划结束日期', code: 'planEndTime', span: 8, type: 'text' },
          { name: '任务内容', code: 'taskContent', span: 24, type: 'text' }
        ],
        orderType7: [
          { name: '工单编号', code: 'orderId', span: 8, type: 'text' },
          { name: '所属项目', code: 'parentProjectName', span: 8, type: 'text' },
          { name: '所属子项目', code: 'projectName', span: 8, type: 'text' },
          { name: '创建人', code: 'creatorName', span: 8, type: 'text' },
          { name: '处理人员', code: 'orderDealInfo', span: 24, type: 'text' },
          { name: '开始日期', code: 'createDate', span: 8, type: 'text' },
          { name: '计划结束日期', code: 'planEndTime', span: 8, type: 'text' },
          { name: '任务内容', code: 'taskContent', span: 24, type: 'text' }
        ],
        orderType8: [
          { name: '工单编号', code: 'orderId', span: 8, type: 'text' },
          { name: '所属项目', code: 'parentProjectName', span: 8, type: 'text' },
          { name: '所属子项目', code: 'projectName', span: 8, type: 'text' },
          { name: '创建人', code: 'creatorName', span: 8, type: 'text' },
          { name: '处理人员', code: 'orderDealInfo', span: 24, type: 'text' },
          { name: '开始日期', code: 'createDate', span: 8, type: 'text' },
          { name: '计划结束日期', code: 'planEndTime', span: 8, type: 'text' },
          { name: '任务内容', code: 'taskContent', span: 24, type: 'text' }
        ]
      },
      list: [],
      demandData: [],
      proOrderData: [],
      // 存放所有Text数据对象
      dataList: {}
    }
  },
  props: {
    orderId: [Number, String],
    orderType: [Number, String]
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'orderDealInfo') {
        let orderDealInfoArr = []
        let orderDealInfo = row[item.code]
        orderDealInfo.forEach((item, index) => {
          let title = this.$getDictLabel('dealStatus', item.status)
          let className = 'el-tag el-tag--light'
          if (item.status === 0) {
            className = 'el-tag el-tag--info el-tag--light'
          } else if (item.status === 1) {
            className = 'el-tag el-tag--light'
          } else if (item.status === 2) {
            className = 'el-tag el-tag--success el-tag--light'
          } else if (item.status === 3) {
            className = 'el-tag el-tag--warning el-tag--light'
          }
          orderDealInfoArr.push('<span class="' + className + '" title="' + title + '" style="margin-right:5px;margin-bottom:5px;">' + item.name + '</span>')
        })
        columnValue = orderDealInfoArr.join('')
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    },
    getData (url) {
      let thisvm = this
      let params = {}
      let orderId = this.orderId
      thisvm.$ctcLoading.open()
      thisvm.$http.get(url + orderId, { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          thisvm.list = thisvm.listType['orderType' + thisvm.orderType]
          thisvm.dataList = Object.assign(res.data.base, res.data.demand)
          thisvm.$emit('getDemandId', res.data.demand.demandId)
          // 判断显示原始需求
          if (res.data.demand !== undefined && res.data.demand.length > 0) {
            thisvm.list.push({ name: '原始需求', titleDataList: [{ name: '需求编码', code: 'demandCode' }, { name: '需求名称', code: 'demandName' }, { name: '需求方', code: 'demandSide' }, { name: '需求联系人', code: 'personLiableName' }, { name: '联系人号码', code: 'contactPhone' }, { name: '附件', code: 'attachementId' }], span: 24, type: 'tableDemandData' })
            thisvm.demandData = res.data.demand
          }
          // 判断显示需求分析
          if (res.data.proOrder !== undefined && res.data.proOrder.length > 0) {
            thisvm.list.push({ name: '需求分析', titleDataList: [{ name: '需求分析人', code: 'userName' }, { name: '联系电话', code: 'phone' }, { name: '分析结果', code: 'result' }, { name: '附件', code: 'attachementId' }], span: 24, type: 'tableProOrderData' })
            thisvm.proOrderData = res.data.proOrder
          }
          if (res.data.nowDealInfo.length > 0) {
            let nowDealInfo = res.data.nowDealInfo
            try {
              nowDealInfo[0].result.platformId = res.data.base.platformId
            } catch (e) {

            }
            thisvm.$emit('showResultData', nowDealInfo)
          }
        }
      }).catch(() => {
        thisvm.$ctcLoading.close()
      }).finally(() => {
        thisvm.$ctcLoading.close()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.is_flex {
  display: flex;
  min-height: 40px;
  margin-bottom: 10px;
  .flex_left {
    width: 120px;
    text-align: right;
    padding-right: 10px;
    color: darkgray;
  }
  .flex_right {
    flex: 1;
  }
}
</style>
