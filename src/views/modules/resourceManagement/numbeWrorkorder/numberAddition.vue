<template>
    <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
        <el-row>
            <el-divider content-position="left"><span style="color:#26c6da;font-size:15px;">申请信息(带*为必填项)</span></el-divider>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="180px">
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="手机号码：" prop="number">
                        <el-input v-model="dataForm.number" placeholder="请输入手机号码" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="IMSI：" prop="imsi">
                        <el-input v-model="dataForm.imsi" placeholder="请输入IMSI" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="所属平台：" prop="applicationId">
                        <ctc-platform-list v-model="dataForm.applicationId" :name.sync="dataForm.platformDefine" :level="'1'" :placeholder="'请选择所属平台'"></ctc-platform-list>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="服务密码：" prop="serviceNo">
                        <el-input v-model="dataForm.serviceNo" placeholder="请输入服务密码" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="所属省份：" prop="province">
                        <ctc-province-team v-model="dataForm.province" :name.sync="dataForm.provinceDefine" :level="'1'" :placeholder="'请选择所属省份'"></ctc-province-team>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="所属地市：" prop="city">
                        <ctc-province-team v-model="dataForm.city" :level="'2'" :name.sync="dataForm.cityDefine" :childrenId="dataForm.province" :placeholder="'请选择所属地市'"></ctc-province-team>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="办卡人：" prop="handler">
                        <el-input v-model="dataForm.handler" placeholder="请输入办卡人" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="品牌：" prop="brand">
                        <ctc-select v-model="dataForm.brand" dict-type="brand" placeholder="请选择品牌"></ctc-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="月度资费：" prop="monthlyFee">
                        <el-input v-model="dataForm.monthlyFee" placeholder="请输入月度资费" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="余额：" prop="blance">
                        <el-input v-model="dataForm.blance" placeholder="请输入余额" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="积分：" prop="score">
                        <el-input v-model="dataForm.score" placeholder="请输入积分" clearable></el-input>
                    </el-form-item>
                </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item prop="ownerId" label="负责人：">
                  <ctc-user-table v-model="dataForm.ownerId" placeholder="请选择负责人" :userName2.sync="dataForm.owner" :userId.sync="dataForm.ownerId" :type="1"></ctc-user-table>
                  <el-input v-model="dataForm.ownerId" v-show="false"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="号码状态：" prop="state">
                  <ctc-select v-model="dataForm.state" dict-type="numberStatus" placeholder="请选择号码状态"></ctc-select>
                </el-form-item>
              </el-col>
                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                    <el-form-item label="创建人：" prop="creatorName">
                        <el-input disabled v-model="dataForm.creatorName" placeholder="请输入创建人" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="备注：" prop="descript">
                        <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="备注" v-model="dataForm.descript"></el-input>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <div align="center">
          <el-button type="primary" size="small" @click="$emit('close')">取消</el-button>
          <el-button type="primary" size="small" @click="submitResult(dataForm)">{{$t("confirm")}}</el-button>
        </div>
    </el-card>
</template>

<script>
import { isMobile } from '@/utils/validate'

export default {
  name: 'numberAddition',
  data () {
    let validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        return callback(new Error(this.$t('validate.format', { 'attr': '手机号码' })))
      }
      callback()
    }
    return {
      dataForm: {
        cardNumberId: '',
        number: '',
        email: '',
        imsi: '',
        platform: '1', // 暂时加上 后面去掉
        state: '', // 暂时加上 后面去掉
        applicationId: '',
        platformDefine: '',
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
      },
      dataRule: {
        number: [
          { required: true, message: '请输入', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        imsi: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        applicationId: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        brand: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        province: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        ownerId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        contract: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        creatorName: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    selectData: Object
  },
  computed: {},
  mounted () {
    let thisvm = this
    if (this.selectData) {
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

      // thisvm.dataForm.creator = this.$store.state.user.id
      // thisvm.dataForm.creatorName = this.$store.state.user.realName
    }
  },
  methods: {
    chooseModule () {
    },
    submitResult (res) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.submitData()
        } else {
          return false
        }
      })
    },
    submitData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let params = { ...this.dataForm }
      console.log(params)
      thisvm.$http[this.dataForm.cardNumberId ? 'put' : 'post'](
        this.dataForm.cardNumberId
          ? '/ctc/resource/activiti/cardnumber/update'
          : '/ctc/resource/activiti/cardnumber/save',
        params
      )
        .then(({ data: res }) => {
          thisvm.$ctcLoading.close()
          if (res.code !== 0) {
            return thisvm.$message.error(res.msg)
          } else {
            this.$message.success(
              this.dataForm.cardNumberId ? '修改成功' : '创建成功',
              // this.$set(params, 'obj', { alert: 1, index: 0 }),
              this.$emit('close', res.data),
              console.log(res.data)
            )
          }
        })
        .catch(() => {
          thisvm.$ctcLoading.close()
        })
    }
    // submitData () {
    //   let thisvm = this
    //   // 默认先清空目录树缓存数据
    //   thisvm.$ctcLoading.open()
    //   let params = { ...this.dataForm }
    //   console.log(params)
    //   thisvm.$http[this.dataForm.cardNumberId ? 'put' : 'post'](this.dataForm.cardNumberId ? '/ctc/resource/activiti/cardnumber/update' : '/ctc/resource/activiti/cardnumber/save', params).then(({ data: res }) => {
    //     thisvm.$ctcLoading.close()
    //     if (res.code !== 0) {
    //       return thisvm.$message.error(res.msg)
    //     }
    //     this.$message.success(this.dataForm.cardNumberId ? '修改成功' : '创建成功')
    //     this.$emit('close', 'refresh')
    //     console.log(res.data)
    //   }).catch(() => {
    //     thisvm.$ctcLoading.close()
    //   })
    // }
  }
}
</script>

<style scoped lang="scss">
    .accStyle{
        .el-date-editor.el-input, .el-date-editor.el-input__inner{
            width: 100%;
        }
    }
</style>
