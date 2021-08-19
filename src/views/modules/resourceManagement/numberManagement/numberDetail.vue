<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail">
        <el-row>
            <el-form :model="dataForm" ref="dataForm" label-width="180px">
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="手机号码：" prop="number">
                  <el-input disabled v-model="dataForm.number" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="IMSI：" prop="imsi">
                  <el-input disabled v-model="dataForm.imsi" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="所属平台：" prop="applicationId">
                  <!--                        <ctc-select v-model="dataForm.platform" dict-type="platform" placeholder="请选择"></ctc-select>-->
                  <ctc-platform-list disabled v-model="dataForm.applicationId" :level="'1'" :placeholder="'请选择'"></ctc-platform-list>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="服务密码：" prop="serviceNo">
                  <el-input disabled v-model="dataForm.serviceNo" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="所属省份：" prop="province">
                  <ctc-province-team disabled v-model="dataForm.province" :name.sync="dataForm.provinceDefine" :level="'1'" :placeholder="'请选择'"></ctc-province-team>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="所属地市：" prop="city">
                  <ctc-province-team disabled v-model="dataForm.city" :level="'2'" :name.sync="dataForm.cityDefine" :childrenId="dataForm.province" :placeholder="'请选择'"></ctc-province-team>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="办卡人：" prop="handler">
                  <el-input disabled v-model="dataForm.handler" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="品牌：" prop="brand">
                  <ctc-select disabled v-model="dataForm.brand" dict-type="brand" placeholder="请选择"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="月度资费：" prop="monthlyFee">
                  <el-input disabled v-model="dataForm.monthlyFee" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="余额：" prop="blance">
                  <el-input disabled v-model="dataForm.blance" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="积分：" prop="score">
                  <el-input disabled v-model="dataForm.score" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="负责人：" prop="ownerId">
                  <ctc-user-table v-model="dataForm.ownerId" placeholder="请选择负责人" disabled :userId.sync="dataForm.ownerId" :type="1"></ctc-user-table>
                  <el-input v-model="dataForm.ownerId" v-show="false"></el-input>
<!--                  <el-input disabled v-model="dataForm.owner" placeholder="请输入" clearable></el-input>-->
                </el-form-item>
              </el-col>
<!--              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">-->
<!--                <el-form-item label="负责人联系方式：" prop="contract">-->
<!--                  <el-input disabled v-model="dataForm.contract" placeholder="请输入" clearable></el-input>-->
<!--                </el-form-item>-->
<!--              </el-col>-->
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="号码状态：" prop="state">
                  <ctc-select disabled v-model="dataForm.state" dict-type="numberStatus" placeholder="请选择"></ctc-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="创建人：" prop="creatorName">
                  <el-input disabled v-model="dataForm.creatorName" placeholder="请输入" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="备注：" prop="descript">
                  <el-input disabled type="textarea" :autosize="{ minRows: 4}" placeholder="请输入" v-model="dataForm.descript"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
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
        cardNumberId: '',
        number: '',
        imsi: '',
        platform: '1', // 暂时加上 后面去掉
        state: '', // 暂时加上 后面去掉
        applicationId: '',
        serviceNo: '',
        province: '',
        provinceDefine: '',
        city: '',
        cityDefine: '',
        handler: '',
        brand: '',
        monthlyFee: '',
        blance: '',
        score: '',
        owner: '',
        ownerId: '',
        contract: '',
        descript: '',
        creator: this.$store.state.user.id,
        creatorName: this.$store.state.user.realName
      }
    }
  },
  props: {
    selectData: Object
  },
  computed: {},
  mounted () {
    this.alist()
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
    console.log(thisvm.dataForm)
  },
  methods: {
    alist () {
      console.log(this.dataForm)
    }
  }
}
</script>

<style scoped>
    .el-form{
        display: inline-block;
    }
</style>
