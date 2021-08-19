<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail">
        <el-row>
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">账号信息</span></el-divider>
            <el-form :model="dataForm" ref="dataForm" label-width="180px">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="4A主账号：" prop="loginName">
                        <el-input disabled v-model="dataForm.loginName" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="姓名：" prop="name">
                        <el-input disabled v-model="dataForm.name" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="手机号码：" prop="mobile">
                        <el-input disabled v-model="dataForm.mobile" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="邮箱：" prop="email">
                        <el-input disabled v-model="dataForm.email" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="身份证：" prop="cardValue">
                        <el-input disabled v-model="dataForm.cardValue" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="部门/项目组：" prop="orgId">
                        <ctc-project-team disabled v-model="dataForm.orgId" :orgId="dataForm.orgId"></ctc-project-team>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="图形堡垒权限：" prop="isGfort">
                        <ctc-select disabled v-model="dataForm.isGfort" dict-type="isGfort" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                    <el-form-item label="VPN权限：" prop="canLoginWay">
                        <ctc-select disabled v-model="dataForm.canLoginWay" dict-type="VPNPermission" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="账号类型：" prop="sysAcctType">
                        <ctc-select disabled v-model="dataForm.sysAcctType" dict-type="accTypeNew" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                    <el-form-item label="所属机构/部门/科室：" prop="organization">
                        <ctc-tree-organ disabled ref="ctcTreeOrgan" v-model="dataForm.organization" :pid="dataForm.sysAcctType" type="radio" placeholder="请选择所属机构/部门/科室"></ctc-tree-organ>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="服务机构/部门/科室：" prop="organizationGs">
                        <ctc-tree-organ-serve disabled ref="ctcTreeOrganServe" v-model="dataForm.organizationGs" type="checkbox" :jg="dataForm.organization" :acct-type="dataForm.sysAcctType" placeholder="请选择服务机构/部门/科室"></ctc-tree-organ-serve>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="账号角色：" prop="roleIds">
                        <ctc-select-role disabled v-model="dataForm.roleIds" :pid="dataForm.organization" multiple placeholder="请选择"></ctc-select-role>
                    </el-form-item>
                </el-col>
            </el-form>
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">操作记录</span></el-divider>
            <el-table max-height="450px" stripe :data="dataList" border style="width: 100%;">
                <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
                <template v-for="(item, index) in titleDataList">
                    <template v-if="item.code==='workNo'">
                        <el-table-column :key="index" :label="item.name" align="center" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <el-button @click="toDealWith('2','查看',scope.row)" type="text" size="small">{{getTableColumnData(scope.row,item)}}</el-button>
                            </template>
                        </el-table-column>
                    </template>
                    <template v-else>
                        <el-table-column :key="index" :label="item.name" align="center">
                            <template slot-scope="scope">
                                <span v-html="getTableColumnData(scope.row,item)"></span>
                            </template>
                        </el-table-column>
                    </template>
                </template>
            </el-table>
        </el-row>
    </el-card>
</template>

<script>
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import mixinViewModule from '@/mixins/view-module'
import { addDynamicRoute } from '@/router'
export default {
  name: 'accountLook',
  mixins: [mixinViewModule],
  components: {
    CtcProjectOrganizeTable
  },
  data () {
    return {
      mixinViewModuleOptions: {
        createdIsNeed: false // 此页面是否在创建时，调用查询数据列表接口？
      },
      organId: '',
      dataForm: {
        loginName: '',
        name: '',
        mobile: '',
        email: '',
        cardValue: '',
        orgId: [],
        isGfort: '',
        canLoginWay: '',
        sysAcctType: '',
        organization: [], // 所属机构
        organizationGs: [], // 归属机构
        roleIds: []// 账号角色
      },
      titleDataList: [
        {
          name: '工单编号',
          code: 'workNo'
        },
        {
          name: '工单类型',
          code: 'type'
        },
        {
          name: '处理人',
          code: 'name'
        },
        {
          name: '开始时间',
          code: 'createDate'
        },
        {
          name: '完成时间',
          code: 'updateDate'
        },
        {
          name: '备注',
          code: 'handleExplain'
        }
      ]
    }
  },
  props: {
    selectData: Object
  },
  computed: {},
  mounted () {
    this.fixData(this.selectData)
    this.getRecordData(this.selectData)
  },
  methods: {
    getRecordData (data) {
      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { loginName: data.loginName }
      thisvm.$http.get('/account4a/order/record/operation', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error({ message: res.msg })
        }
        // 信息处理
        thisvm.dataList = res.data.list
      }).catch(() => {
        thisvm.$ctcLoading.close()
      })
    },
    fixData (data) {
      let thisvm = this
      thisvm.dataForm.loginName = data.loginName
      thisvm.dataForm.name = data.name
      thisvm.dataForm.mobile = data.phone
      thisvm.dataForm.cardValue = data.idCard
      thisvm.dataForm.email = data.email
      thisvm.dataForm.orgId = data.orgId
      thisvm.dataForm.isGfort = data.isGfort
      thisvm.dataForm.canLoginWay = data.canLoginWay
      thisvm.dataForm.sysAcctType = data.sysAcctType !== null ? data.sysAcctType + '' : ''

      // true 有从账号信息 就显示账号类型 所属机构 服务机构 角色这些内容
      if (data.hasSubAcct) {
        let organId = ''
        if (data.sectionId) {
          organId = data.sectionId
        } else if (data.deptId) {
          organId = data.deptId
        } else if (data.organId) {
          organId = data.organId
        }
        thisvm.dataForm.organizeFrom = { serviceId: organId }
        thisvm.dataForm.serviceOrg = data.serviceOrg
        // thisvm.dataForm.sysAcctType = data.sysAcctType ? data.sysAcctType + '' : ''

        setTimeout(() => {
          let ssjgId = data.organId ? data.organId : ''
          thisvm.dataForm.organization = [ssjgId, organId]
          setTimeout(() => {
            thisvm.dataForm.roleIds = data.roleIds
            thisvm.$nextTick(() => {
              thisvm.$refs.ctcTreeOrgan.init({ name: data.organName ? data.organName : '' })
              let nameList = []
              let serviceId = data.serviceOrg ? data.serviceOrg : []
              let seviceName = data.serviceOrgName ? data.serviceOrgName.split(',') : ''
              for (let i = 0; i < seviceName.length; i++) {
                let node = {}
                node.name = seviceName[i]
                node.id = serviceId[i].serviceId
                node.ids = [serviceId[i].serviceId]
                if (serviceId[i].serviceId === organId) {
                  node.disabled = true
                }
                nameList.push(node)
              }
              thisvm.$refs.ctcTreeOrganServe.init(nameList)
            })
          }, 100)
        }, 100)
      }
    },
    toDealWith (type, name, rows) {
      // 1去处理 2 查看 3 编辑工单 4 关闭 5验证
      let thisvm = this
      thisvm.$emit('close')
      if (type === '1' || type === '2') {
        // 区分去处理工单的类型 1通用工单
        let path = ''
        let title = type === '1' ? '处理工单' : '查看工单'
        let params = { handlerType: type, ...rows, recordId: rows.id } // handlerType 1去处理 2 查看
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
        if (rows.type.toString() === '8') {
          path = 'accountOperationManagement4A/workOrderType/generalWorkOrder/workOrderHandle'
        } else if (rows.type.toString() === '9') {
          path = 'accountOperationManagement4A/workOrderType/accountUnlockWorkOrder/workOrderHandle'
        } else if (rows.type.toString() === '11') {
          path = 'accountOperationManagement4A/workOrderType/generalWorkOrder/noLoginHandle'
        } else if (rows.type.toString() === '0') {
          path = 'accountOperationManagement4A/workOrderType/accountApplicationWorkOrder/workOrderHandle'
        } else if (rows.type.toString() === '1') {
          path = 'accountOperationManagement4A/workOrderType/accountBatchApplicationWorkOrder/workOrderHandle'
        } else if (rows.type.toString() === '10') {
          path = 'accountOperationManagement4A/workOrderType/accountApplicationWorkOrder/noLoginHandle'
        } else if (rows.type.toString() === '4') {
          path = 'accountOperationManagement4A/workOrderType/accountCancellationWorkOrder/workOrderHandle'
        } else if (rows.type.toString() === '5') {
          path = 'accountOperationManagement4A/workOrderType/accountCancellationSubWorkOrder/workOrderHandle'
        } else if (rows.type.toString() === '2') {
          path = 'accountOperationManagement4A/workOrderType/accountChangeWorkOrder/workOrderHandle'
        } else if (rows.type.toString() === '3') {
          path = 'accountOperationManagement4A/workOrderType/accountBatchChangeWorkOrder/workOrderHandle'
        } else if (rows.type.toString() === '6') {
          path = 'accountOperationManagement4A/workOrderType/projectTeamChangeWorkOrder/workOrderHandle'
        } else if (rows.type.toString() === '12') {
          path = 'accountOperationManagement4A/workOrderType/projectTeamAddWorkOrder/workOrderHandle'
        } else if (rows.type.toString() === '7') {
          path = 'accountOperationManagement4A/workOrderType/organAddWorkOrder/workOrderHandle'
        }
        thisvm.customAddDynamicRoute(path, title, params)
      }
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
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'type') {
        columnValue = this.$getDictLabel('workOrderType', row[item.code])
      } else {
        columnValue = row[item.code]
      }
      return columnValue
    }
  }
}
</script>

<style scoped>
    .el-form{
        display: inline-block;
    }
</style>
