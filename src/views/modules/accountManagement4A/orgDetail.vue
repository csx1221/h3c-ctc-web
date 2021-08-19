<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail">
        <el-row>
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">账号信息</span></el-divider>
            <el-form :model="dataForm" ref="dataForm" label-width="180px">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="姓名：" prop="name">
                        <el-input disabled v-model="dataForm.name" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="姓名全拼：" prop="fullPinyinName">
                        <el-input disabled v-model="dataForm.fullPinyinName" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="手机号码：" prop="mobile">
                        <el-input disabled v-model="dataForm.mobile" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="邮箱：" prop="email">
                        <el-input disabled v-model="dataForm.email" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="身份证：" prop="cardValue">
                        <el-input disabled v-model="dataForm.cardValue" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="部门/项目组：" prop="orgId">
                        <ctc-project-team disabled v-model="dataForm.orgId" :orgId="dataForm.orgId"></ctc-project-team>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="地域：" prop="areaId">
                        <ctc-select disabled v-model="dataForm.areaId" dict-type="regionId" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="账号类型：" prop="acctType">
                        <ctc-select disabled v-model="dataForm.acctType" dict-type="accType" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="所属机构：" prop="organId">
                        <ctc-project-organize-table disabled v-model="dataForm.organId" :organizeId.sync="organId" placeholder="请选择所属机构"></ctc-project-organize-table>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="VPN权限：" prop="canLoginWay">
                        <ctc-select disabled v-model="dataForm.canLoginWay" dict-type="VPNPermission" placeholder="请选择"></ctc-select>
                    </el-form-item>
                </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="图形堡垒权限：" prop="isGfort">
                  <ctc-select disabled v-model="dataForm.isGfort" dict-type="isGfort" placeholder="请选择"></ctc-select>
                </el-form-item>
              </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="VPN生效时间：" prop="vpnEffectTime">
                        <el-date-picker disabled v-model="dataForm.vpnEffectTime" value-format="yyyyMMdd" type="date" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="VPN失效时间：" prop="vpnExpireTime">
                        <el-date-picker disabled v-model="dataForm.vpnExpireTime" value-format="yyyyMMdd" type="date" placeholder="选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-form>
<!--            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">账号轨迹</span></el-divider>-->
<!--            <el-table stripe :data="dataList" border style="width: 100%;">-->
<!--                <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>-->
<!--                <template v-for="(item, index) in titleDataList">-->
<!--                    <template>-->
<!--                        <el-table-column :key="index" :label="item.name" align="center">-->
<!--                            <template slot-scope="scope">-->
<!--                                <span v-html="getTableColumnData(scope.row,item)"></span>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
<!--                    </template>-->
<!--                </template>-->
<!--            </el-table>-->
        </el-row>
    </el-card>
</template>

<script>
import CtcProjectOrganizeTable from '@/components/project/ctc-project-organize-table'
import mixinViewModule from '@/mixins/view-module'
export default {
  name: 'accountApplication',
  mixins: [mixinViewModule],
  components: {
    CtcProjectOrganizeTable
  },
  data () {
    return {
      mixinViewModuleOptions: {
        getDataListURL: '/ctc/visualization/report/participant/pass',
        getDataListIsPage: true
      },
      organId: '',
      dataForm: {
        loginName: '',
        fullPinyinName: '',
        name: '',
        mobile: '',
        email: '',
        cardValue: '',
        orgId: '',
        areaId: '',
        acctType: '',
        organId: '',
        canLoginWay: '',
        isGfort: '',
        vpnEffectTime: '',
        vpnExpireTime: '',
        fileId: ''
      },
      titleDataList: [
        {
          name: '工单类型',
          code: 'loginName'
        },
        {
          name: '申请人',
          code: 'name'
        },
        {
          name: '操作时间',
          code: 'name'
        }
      ]
    }
  },
  props: {
    selectData: Object
  },
  computed: {},
  mounted () {
    let thisvm = this
    Object.keys(thisvm.selectData).forEach(function (key) {
      Object.keys(thisvm.dataForm).forEach(function (key1) {
        if (key === key1) {
          if (thisvm.selectData[key] === null) {
            thisvm.dataForm[key1] = ''
          } else {
            thisvm.dataForm[key1] = thisvm.selectData[key]
          }
        }
      })
    })
    setTimeout(function () {
      thisvm.organId = thisvm.dataForm.organId
    }, 500)
    console.log(thisvm.dataForm)
  },
  methods: {
    // 验证是否要关联字典表
    getTableColumnData (row, item) {
      let columnValue = ''
      if (item.code === 'status') {
        columnValue = this.$getDictLabel('accState', row[item.code])
      } else if (item.code === 'approvalStatus') {
        columnValue = this.$getDictLabel('approvalResult', row[item.code])
      } else if (item.code === 'canLoginWay') {
        columnValue = this.$getDictLabel('VPNPermission', row[item.code])
      } else if (item.code === 'isGfort') {
        columnValue = this.$getDictLabel('isGfort', row[item.code])
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
