<template>
  <el-row class="project-mgr-page">
    <el-card shadow="never" class="aui-card--fill">
      <el-col :span="24">
        <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="120px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="工单编号" prop="orderId">
                <el-input v-model="dataForm.orderId" placeholder="请输入工单编号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="Number(activeName)<8">
              <el-form-item label="工单状态" prop="dealStatus">
                <ctc-select v-model="dataForm.dealStatus" dict-type="dealStatus" placeholder="请选择工单状态"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="Number(activeName)==8">
              <el-form-item label="缺陷状态" prop="defectStatus">
                <ctc-select v-model="dataForm.defectStatus" dict-type="defectStatus" placeholder="请选择缺陷状态"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-show="Number(activeName)==9">
              <el-form-item prop="questionStatus" label="问题/任务状态">
                <ctc-select v-model="dataForm.questionStatus" dict-type="question.questionStatus" placeholder="请选择评审状态"></ctc-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" align="right">
              <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
              <el-button type="primary" size="small" @click="loadTableData()">查询</el-button>
              <el-button size="small" @click="resetForm()">重置</el-button>
              <br />
              <el-checkbox v-model="batchCheckAll" @change="batchCheckAllChange" style="margin-top:6px;">全选</el-checkbox>
            </el-col>
          </el-row>
          <el-row v-if="isOpen">
            <el-col :span="6">
              <el-form-item label="项目名称" prop="parentProjectId">
                <el-select v-model="dataForm.parentProjectId" filterable placeholder="请选择项目" @change="chooseParentProject" style="width:100%;">
                  <el-option v-for="data in dataParentProjectData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="子项目名" prop="projectId">
                <el-select v-model="dataForm.projectId" filterable placeholder="请选择子项目" style="width:100%;">
                  <el-option v-for="data in dataProjectData" :key="data.id" :label="data.nodeName" :value="data.id">{{data.nodeName}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="创建时间" prop="createDate">
                <el-date-picker v-model="dataForm.createDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-card>
    <el-col :span="24" style="margin-top:24px;">
      <el-card shadow="never" class="aui-card--fill">
        <el-row>
          <el-col :span="18" class="split-line" style="text-align:left;">
            待办列表<span style="color:#4190f7;padding-left:24px;">
              <!-- 说明：由于【缺陷待办、问题/任务待办】和其他类型待办工单字段不同，故单独展示 -->
              </span>
          </el-col>
          <el-col :span="6" style="padding-left:0px;text-align:right;">
            <el-button type="blue" size="small" @click="doTransferOrder()" v-if="activeName>0 && activeName<8">转单</el-button>
            <el-button type="blue" size="small" @click="doBatchPublish()" v-if="activeName==8">发布</el-button>
          </el-col>
        </el-row>
        <el-container>
          <el-main style="padding-top:5px;">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <template v-for="(item, index) in list">
                <el-tab-pane :label="item.label" :name="item.name" :key="index" v-if="item.isShow">
                  <span slot="label">
                    <span>{{item.label}}</span>
                    <el-badge v-if="item.num>'0'" :value="item.num" size="mini" class="item"></el-badge>
                  </span>
                  <el-table stripe highlight-current-row :data="item.dataList" :ref="'dataList'+item.name" border @selection-change="dataListSelectionChangeHandle" max-height="600" style="width: 100%;">
                    <el-table-column type="selection" width="50" align="center"></el-table-column>
                    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                    <template v-for="(item2, index2) in tableTitleData">
                      <el-table-column v-if="item2.code!='operate'" :key="index2" :label="item2.name" align="center" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <span v-if="item2.code!='dealStatus'" v-html="getTableColumnData(scope.row,item2)"></span>
                          <template v-else>
                            <el-tag v-if="scope.row.dealStatus ==0" size="small" type="info" v-html="getTableColumnData(scope.row,item2)"></el-tag>
                            <el-tag v-else-if="scope.row.dealStatus ==1" size="small" type="success" v-html="getTableColumnData(scope.row,item2)"></el-tag>
                            <el-tag v-else-if="scope.row.dealStatus ==2" size="small" type="success" v-html="getTableColumnData(scope.row,item2)"></el-tag>
                            <el-tag v-else-if="scope.row.dealStatus ==3" size="small" v-html="getTableColumnData(scope.row,item2)"></el-tag>
                          </template>
                        </template>
                      </el-table-column>
                    </template>
                    <el-table-column fixed="right" label="操作" header-align="center" align="center" width="120">
                      <template slot-scope="scope">
                        <el-button @click="doTableOperate(2,scope.row)" type="text" size="small" v-if="setInterfaceUser">设置接口人</el-button>
                        <el-button @click="doTableOperate(0,scope.row)" type="text" size="small" v-else-if="!setInterfaceUser">去处理</el-button>
                        <el-button @click="doTableOperate(1,scope.row)" type="text" size="small" v-else-if="!setInterfaceUser && item.orderType<8">转单</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-pagination :current-page="item.page" :page-sizes="[10, 20, 50,50000]" :page-size="item.limit" :total="item.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
                  </el-pagination>
                </el-tab-pane>
              </template>
            </el-tabs>
          </el-main>
        </el-container>
        <!-- 转单 -->
        <transfer-order v-if="transferOrderVisible" ref="transferOrder" @refreshDataList="getProjectInfo"></transfer-order>
        <!--添加成员-->
        <add-member :visible.sync="addMember" ref="addMember" @watchChildMethod="triggerParentMethod"></add-member>
        <!--添加成员-->
        <choose-order-mode :visible.sync="chooseOrderMode" ref="chooseOrderMode" @watchChildMethod="triggerParentMethod"></choose-order-mode>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Cookies from 'js-cookie'
import mixinViewModule from '@/mixins/view-module'
import TransferOrder from './transferOrder'
import AddMember from './toDealWith/add-member'
import ChooseOrderMode from './toDealWith/choose_order_mode'
import { addDynamicRoute } from '@/router'
import { replaceUrlIp } from '@/utils/validate'
export default {
  mixins: [mixinViewModule],
  name: 'MytodoPage',
  components: {
    TransferOrder, AddMember, ChooseOrderMode
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      isOpen: false,
      dataForm: {
        organizeId: '',
        deptId: '',
        managerId: '',
        requireContacts: '1284097428998340610',
        orderId: '', // 工单编号
        dealStatus: '', // 工单状态
        defectStatus: '', // 缺陷状态
        questionStatus: '', // 问题状态
        // orderType: '', // 工单类型
        parentProjectId: '', // 所属项目
        projectId: '', // 子项目
        createDate: ''
      },
      activeName: '0',
      loginSw: Cookies.get('loginSw'), // 判断登录方式(0:云测试平台门户登录;1:4A登录)
      audit4ASw: Cookies.get('audit4ASw'), // 判断审核方式(0:显示邮箱、号码;1:不显示邮箱、号码)
      addMember: false,
      relaPlatformDataMap: {},
      userRoleFlag: true,
      setInterfaceUser: false,
      chooseOrderMode: false,
      batchCheckAll: false,
      dataParentProjectData: [],
      dataProjectData: [],
      tableTitleData: [],
      titleList: [
        { 'code': 'orderId', 'name': '工单编号' }, { 'code': 'orderTitle', 'name': '工单标题' }, { 'code': 'orderType', 'name': '工单类型' },
        { 'code': 'handlerType', 'name': '工单处理人类型' }, { 'code': 'dealStatus', 'name': '工单状态' }, { 'code': 'parentProject', 'name': '项目' },
        { 'code': 'project', 'name': '子项目' }, { 'code': 'creatorName', 'name': '派发人' }, { 'code': 'createDate', 'name': '创建时间' },
        { 'code': 'planEndTime', 'name': '计划完成' }
      ],
      defectTitleList: [
        { 'code': 'parentProjectName', 'name': '项目' }, { 'code': 'projectName', 'name': '子项目' }, { 'code': 'taskName', 'name': '任务' },
        { 'code': 'defectCode', 'name': '缺陷编号' }, { 'code': 'name', 'name': '缺陷标题' }, { 'code': 'defectEnv', 'name': '缺陷环境' },
        { 'code': 'defectCategory', 'name': '缺陷原因分类' }, { 'code': 'defectSource', 'name': '缺陷来源' }, { 'code': 'defectStatus', 'name': '缺陷状态' },
        { 'code': 'expectRepairDate', 'name': '要求修复时间' }, { 'code': 'creatorName', 'name': '提出人' }, { 'code': 'createDate', 'name': '创建时间' },
        { 'code': 'handlerName', 'name': '当前处理人' }
      ],
      questionTitleList: [
        { 'code': 'questionCode', 'name': '问题/任务编码' }, { 'code': 'title', 'name': '问题/任务标题' }, { 'code': 'questionStatus', 'name': '问题/任务状态' },
        { 'code': 'type', 'name': '问题/任务类型' }, { 'code': 'level', 'name': '问题/任务级别' }, { 'code': 'handlerName', 'name': '处理人' },
        { 'code': 'operationDesc', 'name': '处理意见' }, { 'code': 'nextHandlerName', 'name': '下一步处理人' }, { 'code': 'creatorName', 'name': '创建人' },
        { 'code': 'createDate', 'name': '创建时间' }, { 'code': 'updateDate', 'name': '修改时间' }
      ],
      projectApplyTitleList: [
        { 'code': 'orderId', 'name': '工单编号' }, { 'code': 'orderTitle', 'name': '工单标题' }, { 'code': 'creatorName', 'name': '创建人' }, { 'code': 'handlerName', 'name': '审核人' },
        { 'code': 'projectApply.dealStatus', 'name': '工单状态' }, { 'code': 'applyReason', 'name': '申请原因' },
        { 'code': 'operationDesc', 'name': '备注说明' }, { 'code': 'createDate', 'name': '创建时间' }, { 'code': 'updateDate', 'name': '修改时间' }
      ],
      list: [
        { 'label': '全部待办', 'orderType': '', 'name': '0', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'titleDataList': this.titleList, 'dataList': [], 'isShow': true },
        { 'label': '需求分析', 'orderType': '1', 'name': '1', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'titleDataList': [], 'dataList': [], 'isShow': true },
        { 'label': '需求评审', 'orderType': '2', 'name': '2', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'titleDataList': [], 'dataList': [], 'isShow': true },
        { 'label': '方案设计', 'orderType': '3', 'name': '3', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'titleDataList': [], 'dataList': [], 'isShow': true },
        { 'label': '方案评审', 'orderType': '4', 'name': '4', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'titleDataList': [], 'dataList': [], 'isShow': true },
        { 'label': '用例设计', 'orderType': '5', 'name': '5', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'titleDataList': [], 'dataList': [], 'isShow': true },
        { 'label': '用例评审', 'orderType': '6', 'name': '6', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'titleDataList': [], 'dataList': [], 'isShow': true },
        { 'label': '用例执行', 'orderType': '7', 'name': '7', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'titleDataList': [], 'dataList': [], 'isShow': true },
        { 'label': '缺陷待办', 'orderType': '8', 'name': '8', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'titleDataList': [], 'dataList': [], 'isShow': true },
        { 'label': '问题/任务待办', 'orderType': '9', 'name': '9', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'titleDataList': [], 'dataList': [], 'isShow': false },
        { 'label': '入项申请待办', 'orderType': '10', 'name': '10', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'titleDataList': [], 'dataList': [], 'isShow': false }
      ]
    }
  },
  computed: {},
  activated () {
    this.getCurrentUserRole()
  },
  created () {
    this.getRelevanceData()
  },
  mounted () {
    this.loadProjectTaskData(1, {}, false)
  },
  methods: {
    triggerParentMethod (message) {
      if (message.type === 'chooseOrderMode') {
        // 操作类型operateType(1:去派单;2:去处理)
        if (message.data.operateType === '1') {
          let row = message.data.row
          this.$refs.addMember.projectId = row.projectId || row.parentProjectId
          this.$refs.addMember.orderDealId = row.orderDealId
          this.$refs.addMember.orderId = row.orderId
          this.$refs.addMember.init()
        } else {
          this.doGotoDeal(message.data.row, message.data.res)
        }
      }
    },
    handleSizeChange (val) {
      let num = Number(this.activeName)
      this.list[num].limit = val
      this.loadTableData()
    },
    handleCurrentChange (val) {
      let num = Number(this.activeName)
      this.list[num].page = val
      this.loadTableData()
    },
    handleClick (tab, event) {
      // 选中那个tabs
      let num = Number(tab.name)
      this.list[num].page = 1
      this.dataListSelections = []
      this.loadTableData()
    },
    loadTableData () {
      let num = Number(this.activeName)
      let orderType = Number(this.list[num].orderType)
      if (this.batchCheckAll) {
        this.list[num].limit = 50000
      }
      if (orderType < 8) {
        this.tableTitleData = this.titleList
        this.getProjectInfo(num)
      } else if (orderType === 8) {
        this.tableTitleData = this.defectTitleList
        this.getProjectDefectInfo(num)
      } else if (orderType === 9) {
        this.tableTitleData = this.questionTitleList
        this.getProjectQuestion(num)
      } else if (orderType === 10) {
        this.tableTitleData = this.projectApplyTitleList
        this.getProjectApply(num)
      }
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      this.loadTableData()
    },
    batchCheckAllChange (item) {
      let num = Number(this.activeName)
      if (item) {
        this.list[num].limit = 50000
      } else {
        this.list[num].limit = 10
      }
      this.list[num].page = 1
      this.loadTableData()
    },
    // 父项目联动
    chooseParentProject (id) {
      let item = this.dataParentProjectData.filter(function (item) {
        return id === item.id
      })[0]
      this.dataForm.name = item.nodeName
      this.dataForm.projectId = ''
      this.chooseProjectTask(item)
    },
    chooseProjectTask (item) {
      if (item.id) {
        // nodeType 1:项目2:子项目;4:任务
        let childNodeType = item.childNodeType
        this.loadProjectTaskData(childNodeType, item, true)
      }
    },
    loadProjectTaskData (type, node, isClear) {
      let thisvm = this
      let params = { 'id': node.id, 'nodeType': node.nodeType }
      let url = '/ctc/project/projectDetail/listTreeRoot'
      if (type === 1) {
        url = '/ctc/project/projectDetail/listTreeRoot'
      } else if (type === 2) {
        url = '/ctc/project/projectDetail/listTree'
      }
      thisvm.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          if (type === 1) {
            thisvm.dataParentProjectData = res.data
            if (isClear) {
              thisvm.dataProjectData = []
              thisvm.dataForm.parentProjectId = ''
              thisvm.dataForm.projectId = ''
            }
          } else if (type === 2) {
            thisvm.dataProjectData = res.data
            if (isClear) {
              thisvm.dataForm.projectId = ''
            }
          }
        }
      }).catch(() => { })
    },
    getRelevanceData () {
      this.$http.get('/ctc/project/relaPlatform/list', { params: {} }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let defaultData = [{ 'applicationId': '-1', 'name': '执行中心', 'code': 'ZXZX' }]
          let data = defaultData.concat(res.data)
          this.relaPlatformDataMap = {}
          data.forEach((item, index) => {
            this.relaPlatformDataMap[item.applicationId] = item.name
          })
        }
      }).catch(() => { })
    },
    getCurrentUserRole () {
      if (this.userRoleFlag) {
        this.$http.get('/sys/role/getCurrentUserRole', { params: {} }).then(({ data: res }) => {
          // 设置已加载用户角色
          this.userRoleFlag = false
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            let otherCode = []
            let matchCode = []
            let codeData = res.data
            codeData.forEach((item, index) => {
              if (['04', '05', '06', '07', '13', '14', '15'].includes(item)) {
                // 04:专业公司管理员;05:省管理员;06:地市管理员;07:厂商管理员;====显示执行工单
                if (['04', '05', '06', '07'].includes(item)) {
                  matchCode.push('7')
                }
                // 13:开发经理;14:开发人员;15:配置人员;=====显示缺陷工单
                if (['13', '14', '15'].includes(item)) {
                  matchCode.push('8')
                }
              } else {
                otherCode.push('other')
              }
            })
            // 默认全部展示【问题工单、入项工单】
            matchCode.push('9')
            matchCode.push('10')
            // 特殊处理，判断是否显示设置接口人
            if (matchCode.length === 1 && matchCode.includes('7')) {
              this.setInterfaceUser = true
            }
            // 特殊处理，控制tag切是否可点
            if (otherCode.length === 0 && matchCode.length > 0) {
              let num = Number(matchCode[0])
              this.activeName = this.list[num].name
              this.loadTableData()
              this.list.map((item, index) => {
                if (!matchCode.includes(item.name)) {
                  item.isShow = false
                }
              })
            } else {
              this.loadTableData()
            }
          }
        }).catch(() => { })
      } else {
        this.loadTableData()
      }
    },
    getProjectInfo (num) {
      let thisvm = this
      if (num === undefined) {
        num = Number(thisvm.activeName)
      }
      thisvm.dataListLoading = true
      let params = { page: thisvm.list[num].page, orderType: thisvm.list[num].orderType, limit: thisvm.list[num].limit, ...thisvm.dataForm }
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createStartDate = params.createDate[0]
        params.createEndDate = params.createDate[1]
        delete params['createDate']
      }
      thisvm.$http.get('ctc/task/todo/pageTodoList', { 'params': params }).then(({ data: res }) => {
        thisvm.dataListLoading = false
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          // thisvm.list[num].titleDataList = res.data.head
          let list = res.data.data.list
          for (let i = 0; i < list.length; i++) {
            if (!list[i].parentProject) {
              list[i].parentProject = list[i].project
              list[i].project = ''
            }
          }
          thisvm.list[num].dataList = list
          thisvm.list[num].total = res.data.data.total
          for (let i = 0; i < res.data.orderTypeCount.length; i++) {
            let orderType = res.data.orderTypeCount[i].orderType
            let count = res.data.orderTypeCount[i].count
            for (let j = 0; j < thisvm.list.length; j++) {
              if (Number(thisvm.list[j].name) === orderType) {
                thisvm.list[j].num = count
              }
            }
          }
          // 判断是否批量全选
          if (thisvm.batchCheckAll) {
            let tableKey = 'dataList' + thisvm.activeName
            thisvm.$refs[tableKey][0].toggleAllSelection()
          }
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    getProjectDefectInfo (num) {
      let thisvm = this
      thisvm.dataListLoading = true
      if (num === undefined) {
        num = Number(thisvm.activeName)
      }
      // 缺陷状态映射
      let params = { page: thisvm.list[num].page, limit: thisvm.list[num].limit, ...thisvm.dataForm }
      params.defectCode = thisvm.dataForm.orderId
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createStartDate = params.createDate[0]
        params.createEndDate = params.createDate[1]
        delete params['createDate']
      }
      thisvm.$http.get('/ctc/defect/base/todo', { 'params': params }).then(({ data: res }) => {
        thisvm.dataListLoading = false
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          let list = res.data.data.list
          for (let i = 0; i < list.length; i++) {
            if (!list[i].parentProjectName) {
              list[i].parentProjectName = list[i].projectName
              list[i].projectName = ''
            }
          }
          thisvm.list[num].dataList = list
          thisvm.list[num].total = res.data.data.total
          thisvm.list[num].num = res.data.data.total
          // 判断是否批量全选
          if (thisvm.batchCheckAll) {
            let tableKey = 'dataList' + thisvm.activeName
            thisvm.$refs[tableKey][0].toggleAllSelection()
          }
        }
      }).catch(() => {
        thisvm.dataListLoading = false
      })
    },
    getProjectQuestion (num) {
      let thisvm = this
      thisvm.dataListLoading = true
      if (num === undefined) {
        num = Number(thisvm.activeName)
      }
      // 问题映射
      let params = { page: thisvm.list[num].page, limit: thisvm.list[num].limit, ...thisvm.dataForm }
      params.questionCode = thisvm.dataForm.orderId
      // 只取问题任务待办
      params.filterQuestionStatus = '0'
      // 轨迹类型(1:和登录人相关;2:展示最近一条)
      params.trackType = 1
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createStartDate = params.createDate[0]
        params.createEndDate = params.createDate[1]
        delete params['createDate']
      }
      thisvm.$http.get('/ctc/project/question/page', { 'params': params }).then(({ data: res }) => {
        thisvm.dataListLoading = false
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          let list = res.data.list
          thisvm.list[num].dataList = list
          thisvm.list[num].total = res.data.total
          thisvm.list[num].num = res.data.total
          // 判断是否批量全选
          if (thisvm.batchCheckAll) {
            let tableKey = 'dataList' + thisvm.activeName
            thisvm.$refs[tableKey][0].toggleAllSelection()
          }
        }
      }).catch(() => {
        thisvm.dataListLoading = false
      })
    },
    getProjectApply (num) {
      let thisvm = this
      thisvm.dataListLoading = true
      if (num === undefined) {
        num = Number(thisvm.activeName)
      }
      // 入项申请
      let params = { page: thisvm.list[num].page, limit: thisvm.list[num].limit, ...thisvm.dataForm }
      // 待办
      params.type = 1
      // 特殊处理创建日期、修改日期
      if (params.createDate.length > 0) {
        params.createStartDate = params.createDate[0]
        params.createEndDate = params.createDate[1]
        delete params['createDate']
      }
      thisvm.$http.get('/ctc/project/projectApply/page', { 'params': params }).then(({ data: res }) => {
        thisvm.dataListLoading = false
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          let list = res.data.list
          thisvm.list[num].dataList = list
          thisvm.list[num].total = res.data.total
          thisvm.list[num].num = res.data.total
        }
      }).catch(() => {
        thisvm.dataListLoading = false
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'orderType') {
        columnValue = this.$getDictLabel('workOrder.type', row[item.code])
      } else if (item.code === 'handlerType') {
        columnValue = this.$getDictLabel('workOrder.handlerType', row[item.code])
      } else if (item.code === 'dealStatus') {
        columnValue = this.$getDictLabel('dealStatus', row[item.code])
      } else if (item.code === 'projectApply.dealStatus') {
        columnValue = this.$getDictLabel('projectApply.dealStatus', row['dealStatus'])
      } else if (['defectEnv', 'defectStatus', 'defectCategory'].includes(item.code)) {
        columnValue = this.$getDictLabel(item.code, row[item.code])
      } else if (['defectSource'].includes(item.code)) {
        columnValue = this.relaPlatformDataMap[row[item.code]] || '执行中心'
      } else if (['questionStatus', 'type', 'level', 'flow'].includes(item.code)) {
        columnValue = this.$getDictLabel('question.' + item.code, row[item.code])
      } else if (['handlerName', 'operationDesc', 'nextHandlerName'].includes(item.code)) {
        columnValue = this.doHandTableColumnData(item.code, row)
      } else {
        columnValue = row[item.code]
      }

      return columnValue
    },
    doHandTableColumnData (type, row) {
      let columnValue = ''
      if (type === 'handlerName') {
        columnValue = row.handlerNameList ? row.handlerNameList.join('<br/>') : row.handlerName
      } else if (type === 'nextHandlerName') {
        columnValue = row.nextHandlerNameList ? row.nextHandlerNameList.join('<br/>') : row.nextHandlerName
      } else if (type === 'operationDesc') {
        columnValue = row.operationDescList ? row.operationDescList.join('<br/>') : row.operationDesc
      }
      return columnValue
    },
    getOrderDealJumpAddress (row, callback) {
      if (row.orderType === 8) {
        // 特殊处理缺陷中心工单
        let res = { 'code': 0, 'data': { 'pageRoute': 2, 'pageUrl': null } }
        row.orderId = row.defectId
        row.orderTitle = row.name
        callback && callback(res)
      } else if (row.orderType === 9) {
        // 特殊处理问题工单
        let res = { 'code': 0, 'data': { 'pageRoute': 2, 'pageUrl': null } }
        row.orderId = row.questionId
        row.orderTitle = row.title
        callback && callback(res)
      } else if (row.orderType === 10) {
        // 特殊处理入项申请工单
        let res = { 'code': 0, 'data': { 'pageRoute': 2, 'pageUrl': null } }
        row.orderId = row.orderId
        row.orderTitle = row.orderTitle
        callback && callback(res)
      } else {
        let params = { 'orderId': row.orderId, 'handlerType': row.handlerType, 'orderType': row.orderType || row.activeName }
        this.$http.get('/ctc/task/workOrder/getOrderDealHandler', { 'params': params }).then(({ data: res }) => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            callback && callback(res)
          }
        }).catch(() => {
        })
      }
    },
    // 判断选择【派单、去处理】
    doOrdersorDealChoose (row, res) {
      this.$refs.chooseOrderMode.row = row
      this.$refs.chooseOrderMode.res = res
      this.$refs.chooseOrderMode.init()
    },
    // 去处理
    doGotoDeal (row, res) {
      let thisvm = this
      // 去处理页
      let path = ''
      let title = ''
      let params = { 'projectId': row.projectId || '', 'projectName': row.name, 'parentProjectId': row.parentProjectId || '', 'parentProjectName': row.parentProject }
      let pageUrl = res.data.pageUrl
      let authFlag = res.data.authFlag
      // 判断是否是自动化平台
      if (pageUrl) {
        // 判断是否有权限
        if (authFlag) {
          let networkFlag = window.SITE_CONFIG['networkFlag'] || 'default'
          let url = (networkFlag === 'default') ? pageUrl.defaultUrl : pageUrl.outerUrl
          // url = thisvm.addParamsToUrl(url, 'token', Cookies.get('token'))
          url = thisvm.addParamsToUrl(url, 'applicationToken', pageUrl.applicationToken)
          url = thisvm.addParamsToUrl(url, 'projectId', params.projectId)
          url = thisvm.addParamsToUrl(url, 'parentProjectId', params.parentProjectId)
          // 特殊处理，生产环境需替换host信息
          if (window.SITE_CONFIG['nodeEnv'] === 'prod') {
            let host = window.location.host
            url = replaceUrlIp(url, host)
          }
          window.open(url, '_blank')
        } else {
          this.$message.error(res.msg)
        }
      } else {
        path = 'workbench/mytodo/toDealWith/requirementAnalysis'
        title = '我的工单'
        params.type = 'pending' // handle--去处理  子路由判断进来的是什么类型
        params.rows = row
        // 特殊处理缺陷中心待办
        if (row.orderType === 8) {
          path = 'defectcenter/defect-mgr/defect-data-detail'
          params.defectId = row.defectId
          params.defectInfo = row
        } else if (row.orderType === 9) {
          path = 'documentsAndQuestions/questionsMgr/question-view.vue'
          if (row.version === 2) {
            path = 'documentsAndQuestions/questionsMgr/question-view-v2.vue'
          }
          params.questionId = row.questionId
        } else if (row.orderType === 10) {
          path = 'projects/whole-network-project/children/member-apply-view.vue'
          params.rowData = row
          params.orderId = row.orderId || ''
        }
        thisvm.customAddDynamicRoute(path, title, params)
      }
    },
    doTableOperate (type, row) {
      let thisvm = this
      // 转单
      if (type === 0) {
        // 去处理
        row.orderType = Number(row.orderType || this.activeName)
        if (row.orderType < 8 && row.dealStatus === 0) {
          thisvm.setStatus(row.orderDealId, 1)
        }
        thisvm.getOrderDealJumpAddress(row, function (res) {
          if (res.code !== 0) {
            thisvm.$message.error(res.msg)
          } else {
            if (res.data.pageRoute === 1) {
              // 判断选择【派单、去处理】
              thisvm.doOrdersorDealChoose(row, res)
            } else {
              thisvm.doGotoDeal(row, res)
            }
          }
        })
      } else if (type === 1) { // 转单
        let projectId = row.projectId || row.parentProjectId
        let orderDealId = row.orderDealId || row.defectId
        let orderType = row.orderType || 8
        let handlerType = row.handlerType || 8
        thisvm.transferOrder(projectId, [orderDealId], orderType, handlerType)
      } else if (type === 2) { // 设置接口人
        // 设置接口人(和项目列表公用)
        let path = 'projects/project-new-mgr/set-interface-user'
        let title = '设置接口人'
        let params = {}
        params.parentProjectId = row.parentProjectId || ''
        params.projectId = row.projectId || row.parentProjectId
        params.orderDealId = row.orderDealId || row.defectId
        thisvm.customAddDynamicRoute(path, title, params)
      }
    },
    // 动态追加url参数
    addParamsToUrl (url, key, val) {
      let turl = ''
      if (!val) {
        turl = url
      }
      var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i')
      var separator = url.indexOf('?') !== -1 ? '&' : '?'
      if (url.match(re)) {
        turl = url.replace(re, '$1' + key + '=' + val + '$2')
      } else {
        turl = url + separator + key + '=' + val
      }
      turl = turl.replace('?&', '?')
      return turl
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
    // 转单
    doTransferOrder () {
      if (this.dataListSelections.length === 0) {
        this.$message.warning('请选择需要转单的工单！')
      } else {
        let _ = require('lodash')
        let arr = _.uniqBy(this.dataListSelections, 'projectId')
        if (arr.length === 1) {
          let orderDealIdArr = []
          let orderTypeMap = {}
          let handleTypeMap = {}
          let orderType = ''
          let handlerType = ''
          for (let i = 0; i < this.dataListSelections.length; i++) {
            // 特殊处理，兼容缺陷中心转单
            let orderDealId = this.dataListSelections[i].orderDealId || this.dataListSelections[i].defectId
            orderType = this.dataListSelections[i].orderType || 8
            handlerType = this.dataListSelections[i].handlerType || 8
            orderTypeMap[orderType] = orderType
            handleTypeMap[handlerType] = handlerType
            orderDealIdArr.push(orderDealId)
          }
          // 判断工单类型，工单处理类型是否一致
          if (Object.keys(orderTypeMap).length > 1) {
            this.$message.warning('批量转单，工单类型必须保持一致！')
          } else if (Object.keys(handleTypeMap).length > 1) {
            this.$message.warning('批量转单，工单处理人类型必须保持一致！')
          } else {
            let projectId = arr[0].projectId || arr[0].parentProjectId
            this.transferOrder(projectId, orderDealIdArr, orderType, handlerType)
          }
        } else {
          this.$message.warning('请选择同一项目或者同一子项目的工单！')
        }
      }
    },
    doBatchPublish () {
      let selectionData = this.dataListSelections
      if (selectionData.length > 0) {
        let defectIds = []
        let defectNoPublishs = []
        selectionData.forEach((item, index) => {
          if (item.defectStatus !== 7) {
            defectNoPublishs.push(item.defectCode)
          }
          defectIds.push(item.defectId)
        })
        if (defectNoPublishs.length > 0) {
          let msg = '以下缺陷校验不通过，只有【待发布】状态才能进行批量发布处理<br/>' + defectNoPublishs.join('<br/>')
          this.$message({
            dangerouslyUseHTMLString: true,
            message: msg,
            showClose: true,
            duration: 10000,
            type: 'warning'
          })
        } else {
          this.$confirm('确定批量发布[缺陷]操作?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = {}
            params.defectId = defectIds
            params.operation = 10
            params.operationDesc = '批量发布'
            this.$http.post('/ctc/defect/base/deal', params).then(({ data: res }) => {
              if (res.code !== 0) {
                this.$message.error(res.msg)
              } else {
                this.$message.success('发布成功')
                this.handleCurrentChange(1)
              }
            }).catch(() => { })
          }).catch(() => { })
        }
      } else {
        this.$message.warning('请选择需要发布的工单！')
      }
    },
    setStatus (orderDealId, status) {
      let params = { orderDealId: orderDealId, status: status }
      this.$http.post('/ctc/task/workOrder/dealUp', params).then(({ data: res }) => {
        if (res.code !== 0) {
          this.$message.error(res.msg)
        } else {
          this.getProjectInfo()
        }
      }).catch(() => {
      })
    },
    // 数组对象去重
    putReduce (list, title) {
    }
  }
}
</script>
<style lang="scss">
.project-mgr-page {
}
</style>
