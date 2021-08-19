<template>
    <el-row class="project-mgr-page account-4a">
        <el-col :span="24">
            <el-card shadow="never" class="aui-card--fill">
                <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="120px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="工单编号：" prop="workNo">
                                <el-input v-model="dataForm.workNo" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="type" label="工单类型：">
                                <ctc-select v-model="dataForm.type" dict-type="workOrderType" placeholder="请选择"></ctc-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="state" label="工单状态：">
                                <ctc-select v-model="dataForm.state" dict-type="workOrderStatus" placeholder="请选择"></ctc-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" align="right">
                            <el-button type="text" size="small" @click="isOpen = !isOpen" v-html="isOpen?'折叠':'展开'"></el-button>
                            <el-button type="primary" size="small" @click="getProjectInfo()">查询</el-button>
                            <el-button size="small" @click="resetForm()">重置</el-button>
                        </el-col>
                    </el-row>
                    <el-row v-if="isOpen">
                        <el-col :span="6">
                            <el-form-item prop="time" label="创建时间：">
                                <el-date-picker v-model="dataForm.time" type="daterange" range-separator="至" start-placeholder="开始日期" value-format="yyyy-MM-dd" end-placeholder="结束日期" clearable></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
        </el-col>
        <el-col :span="24" style="margin-top:24px;">
            <el-card shadow="never" class="aui-card--fill">
                <el-row style="margin-bottom:20px;">
                    <el-col :span="6" class="split-line" style="text-align:left;">
                        列表展示
                    </el-col>
                    <el-col :span="18" align="right">
                        <el-dropdown @command="handleCommand" >
                            <el-button type="primary">
                                新增工单<i class="el-icon-circle-plus el-icon--right"></i>
                            </el-button>
<!--                            上线入口-->
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountApplicationWorkOrder/workOrderApplication',name:'4A主从账号'}">4A主从账号申请</el-dropdown-item>
                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountBatchApplicationWorkOrder/workOrderApplication',name:'4A主从账号批量'}">4A主从账号批量申请</el-dropdown-item>
                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountChangeWorkOrder/workOrderApplication',name:'4A主从账号变更'}">4A主从账号变更</el-dropdown-item>
                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountBatchChangeWorkOrder/workOrderApplication',name:'4A主从账号批量变更'}">4A主从账号批量变更</el-dropdown-item>
                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountUnlockWorkOrder/workOrderApplication',name:'4A主账号解锁'}">4A主账号解锁</el-dropdown-item>
                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountCancellationWorkOrder/workOrderApplication',name:'4A主从账号注销'}">4A主从账号注销</el-dropdown-item>
                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountCancellationSubWorkOrder/workOrderApplication',name:'集测从账号注销'}">集测从账号注销</el-dropdown-item>
<!--                                <el-dropdown-item disabled :command="{path:'accountOperationManagement4A/workOrderType/projectTeamChangeWorkOrder/workOrderApplication',name:'4A项目组变更'}">4A项目组变更</el-dropdown-item>-->
                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/projectTeamAddWorkOrder/workOrderApplication',name:'4A项目组新增'}">4A项目组新增</el-dropdown-item>
                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/organAddWorkOrder/workOrderApplication',name:'集测机构新增'}">集测机构新增</el-dropdown-item>
                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/generalWorkOrder/workOrderApplication',name:'通用工单'}" divided>通用工单</el-dropdown-item>
                            </el-dropdown-menu>
<!--                            测试入口-->
<!--                            <el-dropdown-menu slot="dropdown">-->
<!--                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountApplicationWorkOrder/workOrderApplication',name:'4A主从账号'}">4A主从账号申请</el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountBatchApplicationWorkOrder/workOrderApplication',name:'4A主从账号批量'}">4A主从账号批量申请</el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountChangeWorkOrder/workOrderApplication',name:'4A主从账号变更'}">4A主从账号变更</el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountBatchChangeWorkOrder/workOrderApplication',name:'4A主从账号批量变更'}">4A主从账号批量变更</el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountUnlockWorkOrder/workOrderApplication',name:'4A主账号解锁'}"><span style="color: green">4A主账号解锁</span></el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountCancellationWorkOrder/workOrderApplication',name:'4A主从账号注销'}">4A主从账号注销</el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/accountCancellationSubWorkOrder/workOrderApplication',name:'集测从账号注销'}">集测从账号注销</el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/projectTeamChangeWorkOrder/workOrderApplication',name:'4A项目组变更'}">4A项目组变更</el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/projectTeamAddWorkOrder/workOrderApplication',name:'4A项目组新增'}">4A项目组新增</el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/organAddWorkOrder/workOrderApplication',name:'集测机构新增'}">集测机构新增</el-dropdown-item>-->
<!--                                <el-dropdown-item :command="{path:'accountOperationManagement4A/workOrderType/generalWorkOrder/workOrderApplication',name:'通用工单'}" divided><span style="color: green">通用工单</span></el-dropdown-item>-->
<!--                            </el-dropdown-menu>-->
                        </el-dropdown>
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
                                    <el-table stripe highlight-current-row  :data="item.dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%;">
<!--                                        <el-table-column type="selection" width="50" align="center"></el-table-column>-->
                                        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                                        <template v-for="(item2, index2) in titleList">
                                            <template v-if="item2.code==='workNo'">
                                                <el-table-column :key="index2" :label="item2.name" align="center" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        <el-button @click="toDealWith('2','查看',scope.row)" type="text" size="small">{{getTableColumnData(scope.row,item2)}}</el-button>
                                                    </template>
                                                </el-table-column>
                                            </template>
                                            <template v-else>
                                                <el-table-column :key="index2" :label="item2.name" align="center" show-overflow-tooltip>
                                                    <template slot-scope="scope">
                                                        <span v-html="getTableColumnData(scope.row,item2)"></span>
                                                    </template>
                                                </el-table-column>
                                            </template>
                                        </template>
                                        <el-table-column fixed="right" label="操作" header-align="center" align="center" width="140">
                                            <template slot-scope="scope">
                                                <template v-if="item.name==='0'">
<!--                                                    待办 待处理0 进行中1 可以去处理-->
<!--                                                    待办 驳回4 可以编辑-->
<!--                                                    待办 驳回4 可以关闭-->
<!--                                                    待办 通用工单同时状态待验证 可以验证-->
                                                    <el-button :disabled="scope.row.state!=='0'&&scope.row.state!=='1'" @click="toDealWith('1','去处理',scope.row)" type="text" size="small">去处理</el-button>
                                                    <el-button :disabled="scope.row.state!=='4'" @click="toDealWith('3','编辑工单',scope.row)" type="text" size="small">编辑工单</el-button>

                                                    <el-button :disabled="scope.row.state!=='4'" @click="toDealWith('4','关闭',scope.row)" type="text" size="small">关闭</el-button>
                                                    <el-button :disabled="scope.row.type!=='8'||scope.row.state!=='2'" @click="toDealWith('5','验证',scope.row)" type="text" size="small">验证</el-button>
                                                </template>
                                                <template v-else-if="item.name==='1'">
<!--                                                    已办 永久不能去处理-->
<!--                                                    已办 待处理0 驳回4 可以编辑-->
<!--                                                    已办 待处理0 驳回4 可以关闭-->
<!--                                                    <el-button disabled @click="toDealWith('1','去处理',scope.row)" type="text" size="small">去处理</el-button>-->
                                                    <el-button :disabled="!scope.row.edit" @click="toDealWith('3','编辑工单',scope.row)" type="text" size="small">编辑工单</el-button>

                                                    <el-button :disabled="!scope.row.edit" @click="toDealWith('4','关闭',scope.row)" type="text" size="small">关闭</el-button>
                                                </template>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-pagination :current-page="item.page" :page-sizes="[10, 20, 50, 100]" :page-size="item.limit" :total="item.total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
                                    </el-pagination>
                                </el-tab-pane>
                            </template>
                        </el-tabs>
                    </el-main>
                </el-container>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import mixinViewModule from '@/mixins/view-module'
import { addDynamicRoute } from '@/router'
export default {
  mixins: [mixinViewModule],
  name: 'accountOperationManagement',
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      dataForm: {
        workNo: '', // 工单编号
        type: '', // 工单类型
        state: '', // 工单状态
        time: []
      },
      isOpen: false,
      activeName: '0',
      dataList: [],
      titleList: [
        {
          'code': 'workNo',
          'name': '工单编号'
        },
        {
          'code': 'title',
          'name': '工单标题'
        },
        {
          'code': 'type',
          'name': '工单类型'
        },
        {
          'code': 'state',
          'name': '工单状态'
        },
        {
          'code': 'userName',
          'name': '提出人'
        },
        {
          'code': 'createDate',
          'name': '创建时间'
        }
      ],
      list: [
        { 'label': '待办工单',
          'orderType': '',
          'name': '0',
          'num': 0,
          'total': 0,
          'page': 1,
          'limit': 10,
          'url': '/account4a/todo/list',
          'dataList': [],
          'isShow': true },
        { 'label': '已办工单', 'orderType': '1', 'name': '1', 'num': 0, 'total': 0, 'page': 1, 'limit': 10, 'url': '/account4a/done/list', 'dataList': [], 'isShow': true }
      ],
      hasManager: true,
      hasManagerMsg: ''
      // isJurisdiction: false
    }
  },
  activated () {
    this.list[Number(this.activeName)].page = 1
    this.getProjectInfo(Number(this.activeName))
  },
  mounted () {
    // let roleName = this.$store.state.user.userRoleNames.split('，')
    // if (roleName.includes('项目验收经理')) {
    //   this.isJurisdiction = true
    // }
    // console.log(roleName)

    this.getProjectInfo(Number(this.activeName))
    this.getManagerMsg()
  },
  methods: {
    handleCommand (command) {
      console.log(command)
      let thisvm = this
      // 去处理页
      if (command.name !== '通用工单' && command.name !== '4A主从账号' &&
          command.name !== '4A主从账号批量' && command.name !== '4A主从账号注销' &&
          command.name !== '集测从账号注销' && command.name !== '4A项目组新增' &&
          command.name !== '集测机构新增' && command.name !== '4A主账号解锁' && !thisvm.hasManager) {
        this.$message.warning(thisvm.hasManagerMsg)
      } else {
        let path = ''
        let title = ''
        let params = { type: '1' }// 1为新增 2为编辑
        path = command.path
        title = command.name + '申请'
        thisvm.customAddDynamicRoute(path, title, params)
      }
    },
    toDealWith (type, name, rows) {
      // 1去处理 2 查看 3 编辑工单 4 关闭 5验证
      let thisvm = this
      if (type === '1' || type === '2') {
        // 区分去处理工单的类型 1通用工单
        let path = ''
        let title = type === '1' ? '处理工单' : '查看工单'
        let params = { handlerType: type, ...rows } // handlerType 1去处理 2 查看
        // 0主从账号申请
        // 1主从账号批量申请
        // 2主从账号变更
        // 3主从账号批量变更
        // 4主从账号注销
        // 5集测从账号注销
        // 6 4A项目组变更
        // 7集测机构新增
        // 8通用工单
        // 9主账号解锁
        // 10 免登录主从账号申请
        // 11 免登录通用工单
        // 12 4A项目组新增
        console.log(rows.type)
        if (rows.type === '8') {
          path = 'accountOperationManagement4A/workOrderType/generalWorkOrder/workOrderHandle'
          // path = 'accountOperationManagement4A/workOrderType/accountApplicationWorkOrder/workOrderHandle' // 账号申请
          // path = 'accountOperationManagement4A/workOrderType/accountApplicationWorkOrder/noLoginHandle' // 免登录账号申请
          // path = 'accountOperationManagement4A/workOrderType/accountBatchApplicationWorkOrder/workOrderHandle' // 账号批量申请
          // path = 'accountOperationManagement4A/workOrderType/accountCancellationWorkOrder/workOrderHandle' // 4A主从账号注销
          // path = 'accountOperationManagement4A/workOrderType/accountCancellationSubWorkOrder/workOrderHandle' // 集测从账号注销
          // path = 'accountOperationManagement4A/workOrderType/accountChangeWorkOrder/workOrderHandle' // 4A主从账号变更
          // path = 'accountOperationManagement4A/workOrderType/projectTeamChangeWorkOrder/workOrderHandle' // 4A项目组变更
          // path = 'accountOperationManagement4A/workOrderType/projectTeamAddWorkOrder/workOrderHandle' // 4A项目组新增
          // path = 'accountOperationManagement4A/workOrderType/organAddWorkOrder/workOrderHandle' // 集测机构新增
        } else if (rows.type === '9') {
          path = 'accountOperationManagement4A/workOrderType/accountUnlockWorkOrder/workOrderHandle'
        } else if (rows.type === '11') {
          path = 'accountOperationManagement4A/workOrderType/generalWorkOrder/noLoginHandle'
        } else if (rows.type === '0') {
          path = 'accountOperationManagement4A/workOrderType/accountApplicationWorkOrder/workOrderHandle'
        } else if (rows.type === '1') {
          path = 'accountOperationManagement4A/workOrderType/accountBatchApplicationWorkOrder/workOrderHandle'
        } else if (rows.type === '10') {
          path = 'accountOperationManagement4A/workOrderType/accountApplicationWorkOrder/noLoginHandle'
        } else if (rows.type === '4') {
          path = 'accountOperationManagement4A/workOrderType/accountCancellationWorkOrder/workOrderHandle'
        } else if (rows.type === '5') {
          path = 'accountOperationManagement4A/workOrderType/accountCancellationSubWorkOrder/workOrderHandle'
        } else if (rows.type === '2') {
          path = 'accountOperationManagement4A/workOrderType/accountChangeWorkOrder/workOrderHandle'
        } else if (rows.type === '3') {
          path = 'accountOperationManagement4A/workOrderType/accountBatchChangeWorkOrder/workOrderHandle'
        } else if (rows.type === '6') {
          path = 'accountOperationManagement4A/workOrderType/projectTeamChangeWorkOrder/workOrderHandle'
        } else if (rows.type === '12') {
          path = 'accountOperationManagement4A/workOrderType/projectTeamAddWorkOrder/workOrderHandle'
        } else if (rows.type === '7') {
          path = 'accountOperationManagement4A/workOrderType/organAddWorkOrder/workOrderHandle'
        }
        thisvm.customAddDynamicRoute(path, title, params)
      } else if (type === '3') {
        let path = ''
        let params = { type: '2', recordId: rows.recordId }// 1为新增 2为编辑
        let title = ''
        if (rows.type === '8') {
          path = 'accountOperationManagement4A/workOrderType/generalWorkOrder/workOrderApplication'
          title = '通用工单' + '编辑'
        } else if (rows.type === '9') {
          path = 'accountOperationManagement4A/workOrderType/accountUnlockWorkOrder/workOrderApplication'
          title = '主账号解锁' + '编辑'
        } else if (rows.type === '0') {
          path = 'accountOperationManagement4A/workOrderType/accountApplicationWorkOrder/workOrderApplication'
          title = '4A主从账号申请' + '编辑'
        } else if (rows.type === '1') {
          path = 'accountOperationManagement4A/workOrderType/accountBatchApplicationWorkOrder/workOrderApplication'
          title = '4A主从账号批量申请' + '编辑'
        } else if (rows.type === '4') {
          path = 'accountOperationManagement4A/workOrderType/accountCancellationWorkOrder/workOrderApplication'
          title = '4A主从账号注销' + '编辑'
        } else if (rows.type === '5') {
          path = 'accountOperationManagement4A/workOrderType/accountCancellationSubWorkOrder/workOrderApplication'
          title = '集测从账号注销' + '编辑'
        } else if (rows.type === '2') {
          path = 'accountOperationManagement4A/workOrderType/accountChangeWorkOrder/workOrderApplication'
          title = '4A主从账号变更' + '编辑'
        } else if (rows.type === '3') {
          path = 'accountOperationManagement4A/workOrderType/accountBatchChangeWorkOrder/workOrderApplication'
          title = '4A主从账号批量变更' + '编辑'
        } else if (rows.type === '6') {
          path = 'accountOperationManagement4A/workOrderType/projectTeamChangeWorkOrder/workOrderApplication'
          title = '4A项目组变更' + '编辑'
        } else if (rows.type === '12') {
          path = 'accountOperationManagement4A/workOrderType/projectTeamAddWorkOrder/workOrderApplication'
          title = '4A项目组新增' + '编辑'
        } else if (rows.type === '7') {
          path = 'accountOperationManagement4A/workOrderType/organAddWorkOrder/workOrderApplication'
          title = '集测机构新增' + '编辑'
        }
        thisvm.customAddDynamicRoute(path, title, params)
      } else if (type === '4') {
        // 关闭工单
        thisvm.$confirm('确定是否关闭该工单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          thisvm.closeWorkOrder(rows.recordId)
        }).catch(() => {

        })
      } else if (type === '5') {
        // 待验证 只有通用工单才可以验证
        let path = ''
        let params = { handlerType: type, ...rows } // handlerType 1去处理 2 查看 5验证
        let title = ''
        if (rows.type === '8') {
          path = 'accountOperationManagement4A/workOrderType/generalWorkOrder/workOrderHandle'
          title = '通用工单' + '验证'
        }
        thisvm.customAddDynamicRoute(path, title, params)
      }
    },
    closeWorkOrder (recordId) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { recordId: recordId, opinion: '7', handlerExplain: '关闭' }
      thisvm.$http.post('/account4a/handler/approval', params).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg, duration: 4000 })
        }
        this.getProjectInfo()
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
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
    handleSizeChange (val) {
      let num = Number(this.activeName)
      this.list[num].limit = val
      this.list[num].page = 1
      this.getProjectInfo(num)
    },
    handleCurrentChange (val) {
      let num = Number(this.activeName)
      this.list[num].page = val
      this.getProjectInfo(num)
    },
    resetForm () {
      this.$refs.dataForm.resetFields()
      let num = Number(this.activeName)
      this.getProjectInfo(num)
    },
    handleClick (tab, event) {
      // 选中那个tabs
      let num = Number(tab.name)
      this.list[num].page = 1
      this.dataListSelections = []
      this.getProjectInfo(num)
    },
    getManagerMsg () {
      let thisvm = this
      thisvm.$http.get('/account4a/organize/manager/hasManager').then(({ data: res }) => {
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          thisvm.hasManager = res.data.hasManager
          thisvm.hasManagerMsg = res.data.msg
        }
      }).catch(() => {
        // this.dataListLoading = false
      })
    },
    getProjectInfo (num) {
      let thisvm = this
      if (num === undefined) {
        num = Number(thisvm.activeName)
      }
      thisvm.dataListLoading = true
      let { time, ...data } = thisvm.dataForm
      data.startTime = thisvm.dataForm.time[0] || ''
      data.endTime = thisvm.dataForm.time[1] || ''
      let params = { page: thisvm.list[num].page, limit: thisvm.list[num].limit, ...data }
      thisvm.list[num].dataList = []
      // thisvm.list[num].total = 0
      thisvm.$http.get(thisvm.list[num].url, { 'params': params }).then(({ data: res }) => {
        thisvm.dataListLoading = false
        if (res.code !== 0) {
          thisvm.$message.error(res.msg)
        } else {
          let list = res.data.list
          for (let i = 0; i < list.length; i++) {
            list[i].state = list[i].state + ''
            list[i].type = list[i].type + ''
            // list[i].type = '11'
          }
          thisvm.list[num].dataList = list
          thisvm.list[num].total = res.data.total
          thisvm.list[num].num = res.data.total
        }
      }).catch(() => {
        this.dataListLoading = false
      })
    },
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'type') {
        columnValue = this.$getDictLabel('workOrderType', row[item.code])
      } else if (item.code === 'state') {
        columnValue = this.$getDictLabel('workOrderStatus', row[item.code])
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    }
  }
}
</script>

<style scoped>

</style>
